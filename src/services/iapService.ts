import { Capacitor, registerPlugin } from '@capacitor/core';
import type { PaymentResult } from '../types';

export interface StoreKitPluginInterface {
  purchase(options: { productId: string }): Promise<{ success: boolean; transactionId: string; productId: string }>;
  restorePurchases(): Promise<{ restored: boolean; activeProducts: string[] }>;
}

const StoreKit = registerPlugin<StoreKitPluginInterface>('StoreKitPlugin');

export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
  type: 'consumable' | 'subscription';
  period?: string;
}

export const APPLE_IAP_PRODUCTS: Record<string, IAPProduct> = {
  // Consumable Sachet Unlock
  'vip.mannat.sachet49': {
    id: 'vip.mannat.sachet49',
    title: 'Single Profile Unlock',
    description: 'Instant Unlock of 1 Candidate Biodata & Salary Reveal',
    price: '₹49',
    priceAmount: 49,
    type: 'consumable'
  },
  // Subscriptions
  'vip.mannat.sub.silver1m': {
    id: 'vip.mannat.sub.silver1m',
    title: 'Silver (Base Only)',
    description: '15 Contacts • Direct text chatting • Mobile app access',
    price: '₹1,499',
    priceAmount: 1499,
    period: '/ 1 Month',
    type: 'subscription'
  },
  'vip.mannat.sub.gold3m': {
    id: 'vip.mannat.sub.gold3m',
    title: 'Gold (Standard)',
    description: '50 Contacts • Verified details • In-app Audio/Video calling',
    price: '₹4,499',
    priceAmount: 4499,
    period: '/ 3 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.goldplus3m': {
    id: 'vip.mannat.sub.goldplus3m',
    title: 'Gold Plus (Premium Tier)',
    description: '50 Contacts • Profile Spotlight • 20-30% boost in views',
    price: '₹5,499',
    priceAmount: 5499,
    period: '/ 3 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.diamond6m': {
    id: 'vip.mannat.sub.diamond6m',
    title: 'Diamond (Standard)',
    description: '60 Contacts • Search-index priority • In-app calling',
    price: '₹6,499',
    priceAmount: 6499,
    period: '/ 6 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.diamondplus6m': {
    id: 'vip.mannat.sub.diamondplus6m',
    title: 'Diamond Plus (Premium Tier)',
    description: '100+ Contacts • Free Mode Response • Bold Profile layout',
    price: '₹7,499',
    priceAmount: 7499,
    period: '/ 6 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.platinum12m': {
    id: 'vip.mannat.sub.platinum12m',
    title: 'Platinum (Standard)',
    description: '300+ Contacts • Continuous priority indexing • Lowest monthly rate',
    price: '₹10,999',
    priceAmount: 10999,
    period: '/ 12 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.platinumplus12m': {
    id: 'vip.mannat.sub.platinumplus12m',
    title: 'Platinum Plus (Premium Tier)',
    description: '600 Contacts • Full-year Spotlight & Free Mode • Priority Escalation',
    price: '₹12,999',
    priceAmount: 12999,
    period: '/ 12 Months',
    type: 'subscription'
  },
  // Legacy aliases for backward compatibility
  'vip.mannat.sub.gold': {
    id: 'vip.mannat.sub.gold3m',
    title: 'Gold (Standard)',
    description: '50 Contacts • Verified details • In-app Audio/Video calling',
    price: '₹4,499',
    priceAmount: 4499,
    period: '/ 3 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.diamond': {
    id: 'vip.mannat.sub.diamond6m',
    title: 'Diamond (Standard)',
    description: '60 Contacts • Search-index priority • In-app calling',
    price: '₹6,500',
    priceAmount: 6500,
    period: '/ 6 Months',
    type: 'subscription'
  },
  'vip.mannat.sub.platinum': {
    id: 'vip.mannat.sub.platinum12m',
    title: 'Platinum (Standard)',
    description: '300+ Contacts • Continuous priority indexing',
    price: '₹11,000',
    priceAmount: 11000,
    period: '/ 12 Months',
    type: 'subscription'
  }
};

/**
 * Checks if running on iOS (Native Capacitor app or Safari on iOS device)
 */
export const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isCapacitorIOS = Capacitor.getPlatform() === 'ios';
  const isWebIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isCapacitorIOS || isWebIOS;
};

export const iapService = {
  /**
   * Returns available products for the App Store
   */
  getProducts: (): IAPProduct[] => {
    return Object.values(APPLE_IAP_PRODUCTS);
  },

  /**
   * Purchases a product through Apple StoreKit
   */
  purchase: async (productId: string): Promise<PaymentResult> => {
    const product = APPLE_IAP_PRODUCTS[productId];
    if (!product) {
      return { success: false, error: 'Product not found in Apple StoreKit catalog' };
    }

    // On native iOS Capacitor app, trigger native StoreKit payment sheet
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      try {
        const timeoutPromise = new Promise<{ success: false; error: string }>((resolve) => {
          setTimeout(() => {
            resolve({
              success: false,
              error: 'StoreKit transaction timed out. Please verify your App Store connection.'
            });
          }, 22000);
        });

        const purchasePromise = StoreKit.purchase({ productId }).then((result) => {
          if (result && result.transactionId) {
            localStorage.setItem(`apple_receipt_${productId}`, JSON.stringify({
              productId,
              transactionId: result.transactionId,
              purchaseDate: new Date().toISOString(),
              status: 'active'
            }));

            return {
              success: true,
              paymentId: result.transactionId,
              orderId: `apple_order_${productId}`
            };
          } else {
            return { success: false, error: 'StoreKit transaction was not completed.' };
          }
        });

        return await Promise.race([purchasePromise, timeoutPromise]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err || 'StoreKit transaction failed');
        return { success: false, error: message };
      }
    }

    // Web / Development Fallback Simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactionId = `apple_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem(`apple_receipt_${productId}`, JSON.stringify({
          productId,
          transactionId,
          purchaseDate: new Date().toISOString(),
          status: 'active'
        }));

        resolve({
          success: true,
          paymentId: transactionId,
          orderId: `apple_order_${productId}`
        });
      }, 1000);
    });
  },

  /**
   * Restores active Apple In-App Purchases (Mandatory for App Store Review Guideline 3.1.1)
   */
  restorePurchases: async (): Promise<{ restored: boolean; activeProducts: string[] }> => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      try {
        const result = await StoreKit.restorePurchases();
        const activeProducts = result.activeProducts || [];
        activeProducts.forEach((pid) => {
          localStorage.setItem(`apple_receipt_${pid}`, JSON.stringify({
            productId: pid,
            transactionId: `restored_${Date.now()}`,
            purchaseDate: new Date().toISOString(),
            status: 'active'
          }));
        });
        return { restored: true, activeProducts };
      } catch (err: unknown) {
        console.error('StoreKit restore error:', err);
        return { restored: false, activeProducts: [] };
      }
    }

    // Web preview fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        const active: string[] = [];
        Object.keys(APPLE_IAP_PRODUCTS).forEach((key) => {
          const receipt = localStorage.getItem(`apple_receipt_${key}`);
          if (receipt) {
            active.push(key);
          }
        });

        resolve({
          restored: true,
          activeProducts: active
        });
      }, 1000);
    });
  }
};

