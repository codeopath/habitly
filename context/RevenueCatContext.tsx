import { createContext, useContext } from 'react';
import { CustomerInfo } from 'react-native-purchases';

type RevenueCatContextType = {
  isProUser: boolean;
  customerInfo: CustomerInfo | null;
  showPaywall: () => Promise<void>;
  showCustomerCenter: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

export const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

export const useRevenueCat = () => {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) {
    throw new Error('useRevenueCat must be used inside RevenueCatProvider');
  }
  return ctx;
};
