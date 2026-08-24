import Capacitor
import StoreKit

@objc(StoreKitPlugin)
public class StoreKitPlugin: CAPPlugin, SKPaymentTransactionObserver {
    private var purchaseCompletion: ((Bool, String) -> Void)?
    private var restoreCompletion: (([String]) -> Void)?

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

        let request = SKProductsRequest(productIdentifiers: [productId])
        request.delegate = self
        request.start()

        purchaseCompletion = { success, message in
            if success {
                call.resolve(["success": true])
            } else {
                call.reject(message)
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        restoreCompletion = { activeProducts in
            call.resolve(["activeProducts": activeProducts])
        }
        SKPaymentQueue.default().restoreCompletedTransactions()
    }

    public func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                SKPaymentQueue.default().finishTransaction(transaction)
                purchaseCompletion?(true, "Purchase successful")
            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
                purchaseCompletion?(false, "Purchase failed")
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
        restoreCompletion?(productIds)
    }

    public func paymentQueue(_ queue: SKPaymentQueue, restoreCompletedTransactionsFailedWithError error: Error) {
        restoreCompletion?([])
    }
}

extension StoreKitPlugin: SKProductsRequestDelegate {
    public func productsRequest(_ request: SKProductsRequest, didReceive response: SKProductsResponse) {
        guard let product = response.products.first else {
            purchaseCompletion?(false, "Product not found")
            return
        }

        let payment = SKPayment(product: product)
        SKPaymentQueue.default().add(payment)
    }

    public func request(_ request: SKRequest, didFailWithError error: Error) {
        purchaseCompletion?(false, error.localizedDescription)
    }
}
