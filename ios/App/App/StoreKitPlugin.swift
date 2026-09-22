import Capacitor
import StoreKit

@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, CAPBridgedPlugin, SKPaymentTransactionObserver, SKProductsRequestDelegate {
    public let identifier = "StoreKitPlugin"
    public let jsName = "StoreKitPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise)
    ]

    private var activeCall: CAPPluginCall?
    private var restoreCall: CAPPluginCall?
    private var currentProductsRequest: SKProductsRequest?
    private var purchaseTimeoutWorkItem: DispatchWorkItem?

    override public func load() {
        super.load()
        SKPaymentQueue.default().add(self)
    }

    deinit {
        SKPaymentQueue.default().remove(self)
        purchaseTimeoutWorkItem?.cancel()
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Product ID is required")
            return
        }

        // Cancel any pending timeout
        purchaseTimeoutWorkItem?.cancel()
        self.activeCall = call

        // Setup a 20-second safety timeout so the app never gets permanently stuck
        let timeoutWorkItem = DispatchWorkItem { [weak self] in
            guard let self = self, let activeCall = self.activeCall else { return }
            self.currentProductsRequest?.cancel()
            self.currentProductsRequest = nil
            self.activeCall = nil
            activeCall.reject("StoreKit transaction timed out. Please check your App Store connection and try again.")
        }
        self.purchaseTimeoutWorkItem = timeoutWorkItem
        DispatchQueue.main.asyncAfter(deadline: .now() + 20.0, execute: timeoutWorkItem)

        if #available(iOS 15.0, *) {
            Task {
                do {
                    let products = try await Product.products(for: [productId])
                    if let product = products.first {
                        let result = try await product.purchase()
                        self.purchaseTimeoutWorkItem?.cancel()
                        self.purchaseTimeoutWorkItem = nil
                        
                        switch result {
                        case .success(let verification):
                            switch verification {
                            case .verified(let transaction):
                                await transaction.finish()
                                self.resolveActiveCall([
                                    "success": true,
                                    "transactionId": "\(transaction.id)",
                                    "productId": transaction.productID
                                ])
                            case .unverified(let transaction, _):
                                await transaction.finish()
                                self.resolveActiveCall([
                                    "success": true,
                                    "transactionId": "\(transaction.id)",
                                    "productId": transaction.productID
                                ])
                            }
                        case .userCancelled:
                            self.rejectActiveCall("Payment cancelled by user")
                        case .pending:
                            self.resolveActiveCall([
                                "success": true,
                                "transactionId": "pending_\(Date().timeIntervalSince1970)",
                                "productId": productId
                            ])
                        @unknown default:
                            self.rejectActiveCall("Unknown purchase state")
                        }
                    } else {
                        // Fallback to legacy StoreKit 1
                        self.fallbackLegacyPurchase(productId: productId)
                    }
                } catch {
                    self.fallbackLegacyPurchase(productId: productId)
                }
            }
        } else {
            self.fallbackLegacyPurchase(productId: productId)
        }
    }

    private func fallbackLegacyPurchase(productId: String) {
        DispatchQueue.main.async {
            self.currentProductsRequest?.cancel()
            let request = SKProductsRequest(productIdentifiers: [productId])
            self.currentProductsRequest = request
            request.delegate = self
            request.start()
        }
    }

    private func resolveActiveCall(_ data: [String: Any]) {
        DispatchQueue.main.async {
            self.purchaseTimeoutWorkItem?.cancel()
            self.purchaseTimeoutWorkItem = nil
            self.currentProductsRequest = nil
            self.activeCall?.resolve(data)
            self.activeCall = nil
        }
    }

    private func rejectActiveCall(_ message: String) {
        DispatchQueue.main.async {
            self.purchaseTimeoutWorkItem?.cancel()
            self.purchaseTimeoutWorkItem = nil
            self.currentProductsRequest = nil
            self.activeCall?.reject(message)
            self.activeCall = nil
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        if #available(iOS 15.0, *) {
            Task {
                var activeIds: [String] = []
                for await result in Transaction.currentEntitlements {
                    if case .verified(let transaction) = result {
                        activeIds.append(transaction.productID)
                    }
                }
                DispatchQueue.main.async {
                    call.resolve([
                        "restored": true,
                        "activeProducts": activeIds
                    ])
                }
            }
        } else {
            self.restoreCall = call
            SKPaymentQueue.default().restoreCompletedTransactions()
        }
    }

    public func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        if let product = response.products.first {
            let payment = SKPayment(product: product)
            SKPaymentQueue.default().add(payment)
        } else {
            // Product not yet propagated or sandbox unavailable
            rejectActiveCall("Product not available in App Store. Please ensure In-App Purchases are approved.")
        }
    }

    public func request(_ request: SKRequest, didFailWithError error: Error) {
        rejectActiveCall(error.localizedDescription)
    }

    public func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                SKPaymentQueue.default().finishTransaction(transaction)
                let txId = transaction.transactionIdentifier ?? "tx_\(UUID().uuidString)"
                resolveActiveCall([
                    "success": true,
                    "transactionId": txId,
                    "productId": transaction.payment.productIdentifier
                ])

            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                let errorMsg = transaction.error?.localizedDescription ?? "Payment cancelled by user"
                rejectActiveCall(errorMsg)

            case .restored:
                SKPaymentQueue.default().finishTransaction(transaction)

            case .deferred, .purchasing:
                break

            @unknown default:
                break
            }
        }
    }

    public func paymentQueueRestoreCompletedTransactionsFinished(_ queue: SKPaymentQueue) {
        let productIds = queue.transactions
            .compactMap { $0.payment.productIdentifier }
        DispatchQueue.main.async {
            self.restoreCall?.resolve([
                "restored": true,
                "activeProducts": productIds
            ])
            self.restoreCall = nil
        }
    }

    public func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        DispatchQueue.main.async {
            self.restoreCall?.resolve([
                "restored": true,
                "activeProducts": []
            ])
            self.restoreCall = nil
        }
    }
}
