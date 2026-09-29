@preconcurrency import Capacitor
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

        print("[StoreKitPlugin] purchase initiated for productId: \(productId)")
        purchaseTimeoutWorkItem?.cancel()
        self.activeCall = call

        // Setup a 45-second safety timeout for Apple ID / Sandbox auth dialogs
        let timeoutWorkItem = DispatchWorkItem { [weak self] in
            guard let self = self, let activeCall = self.activeCall else { return }
            print("[StoreKitPlugin] purchase timed out after 45s for: \(productId)")
            self.currentProductsRequest?.cancel()
            self.currentProductsRequest = nil
            self.activeCall = nil
            activeCall.reject("StoreKit transaction timed out. Please check your App Store connection and try again.")
        }
        self.purchaseTimeoutWorkItem = timeoutWorkItem
        DispatchQueue.main.asyncAfter(deadline: .now() + 45.0, execute: timeoutWorkItem)

        if #available(iOS 15.0, *) {
            Task { @MainActor [weak self] in
                guard let self = self else { return }
                do {
                    print("[StoreKitPlugin] Querying Product.products for: \(productId)")
                    let products = try await Product.products(for: [productId])
                    print("[StoreKitPlugin] Found \(products.count) products matching \(productId)")
                    
                    if let product = products.first {
                        print("[StoreKitPlugin] Launching purchase flow for: \(product.id) (\(product.displayName))")
                        let result = try await product.purchase()
                        self.purchaseTimeoutWorkItem?.cancel()
                        self.purchaseTimeoutWorkItem = nil
                        
                        switch result {
                        case .success(let verification):
                            switch verification {
                            case .verified(let transaction):
                                await transaction.finish()
                                print("[StoreKitPlugin] Transaction verified successfully: \(transaction.id)")
                                self.resolveActiveCall([
                                    "success": true,
                                    "transactionId": "\(transaction.id)",
                                    "productId": transaction.productID
                                ])
                            case .unverified(let transaction, let error):
                                await transaction.finish()
                                print("[StoreKitPlugin] Transaction unverified: \(transaction.id), error: \(error.localizedDescription)")
                                self.resolveActiveCall([
                                    "success": true,
                                    "transactionId": "\(transaction.id)",
                                    "productId": transaction.productID
                                ])
                            }
                        case .userCancelled:
                            print("[StoreKitPlugin] User cancelled purchase")
                            self.rejectActiveCall("Payment cancelled by user")
                        case .pending:
                            print("[StoreKitPlugin] Transaction is pending approval")
                            self.resolveActiveCall([
                                "success": true,
                                "transactionId": "pending_\(Date().timeIntervalSince1970)",
                                "productId": productId
                            ])
                        @unknown default:
                            print("[StoreKitPlugin] Unknown transaction state")
                            self.rejectActiveCall("Unknown purchase state")
                        }
                    } else {
                        print("[StoreKitPlugin] Product \(productId) not returned by StoreKit 2, attempting legacy StoreKit 1 fallback...")
                        self.fallbackLegacyPurchase(productId: productId)
                    }
                } catch {
                    print("[StoreKitPlugin] StoreKit 2 purchase error: \(error.localizedDescription), attempting legacy fallback...")
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
        print("[StoreKitPlugin] SKProductsRequest received \(response.products.count) products, invalid: \(response.invalidProductIdentifiers)")
        if let product = response.products.first {
            print("[StoreKitPlugin] SKProductsRequest adding payment for \(product.productIdentifier)")
            let payment = SKPayment(product: product)
            SKPaymentQueue.default().add(payment)
        } else {
            // Product not yet propagated or sandbox unavailable
            print("[StoreKitPlugin] No products found in SKProductsResponse. Invalid IDs: \(response.invalidProductIdentifiers)")
            rejectActiveCall("Product not available in App Store. Please ensure In-App Purchases and Paid Apps Agreement are active.")
        }
    }

    public func request(_ request: SKRequest, didFailWithError error: Error) {
        print("[StoreKitPlugin] SKRequest failed with error: \(error.localizedDescription)")
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
