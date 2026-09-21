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

    override public func load() {
        SKPaymentQueue.default().add(self)
    }

    deinit {
        SKPaymentQueue.default().remove(self)
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("Product ID is required")
            return
        }

        self.activeCall = call

        let request = SKProductsRequest(productIdentifiers: [productId])
        request.delegate = self
        request.start()
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        self.restoreCall = call
        SKPaymentQueue.default().restoreCompletedTransactions()
    }

    public func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        guard let product = response.products.first else {
            activeCall?.reject("Product '\(request)' not found in Apple StoreKit catalog.")
            activeCall = nil
            return
        }

        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }

    public func request(_ request: SKRequest, didFailWithError error: Error) {
        activeCall?.reject(error.localizedDescription)
        activeCall = nil
    }

    public func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                SKPaymentQueue.default().finishTransaction(transaction)
                let txId = transaction.transactionIdentifier ?? "tx_\(UUID().uuidString)"
                activeCall?.resolve([
                    "success": true,
                    "transactionId": txId,
                    "productId": transaction.payment.productIdentifier
                ])
                activeCall = nil

            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                let errorMsg = transaction.error?.localizedDescription ?? "Purchase cancelled"
                activeCall?.reject(errorMsg)
                activeCall = nil

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
        restoreCall?.resolve([
            "restored": true,
            "activeProducts": productIds
        ])
        restoreCall = nil
    }

    public func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        restoreCall?.reject(error.localizedDescription)
        restoreCall = nil
    }
}
