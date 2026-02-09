import { ReactNode, useCallback, useEffect, useState } from 'react';

import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { RevenueCatContext } from './RevenueCatContext';

const API_KEY = 'test_mGPCVeDWhXGHZMmAeJxDhdWuVfA';
const ENTITLEMENT_ID = 'Habitly Pro';

export function RevenueCatProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const onCustomerInfoUpdate = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };

    async function init() {
      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        Purchases.configure({ apiKey: API_KEY });

        Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);

        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (e) {
        console.error('RevenueCat init failed:', e);
      }
    }

    init();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
    };
  }, []);

  const isProUser =
    customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined;

  const showPaywall = useCallback(async () => {
    try {
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: ENTITLEMENT_ID,
      });
    } catch (e) {
      console.error('Failed to show paywall:', e);
    }
  }, []);

  const showCustomerCenter = useCallback(async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      console.error('Failed to show customer center:', e);
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
    } catch (e) {
      console.error('Failed to restore purchases:', e);
    }
  }, []);

  return (
    <RevenueCatContext.Provider
      value={{
        isProUser,
        customerInfo,
        showPaywall,
        showCustomerCenter,
        restorePurchases,
      }}>
      {children}
    </RevenueCatContext.Provider>
  );
}
