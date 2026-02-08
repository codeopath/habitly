import { ReactNode, useCallback, useEffect, useState } from 'react';

import Purchases, { CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { RevenueCatContext } from './RevenueCatContext';

const API_KEY = 'test_mGPCVeDWhXGHZMmAeJxDhdWuVfA';
const ENTITLEMENT_ID = 'Habitly Pro';

export function RevenueCatProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    async function init() {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      Purchases.configure({ apiKey: API_KEY });

      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    }

    init();

    const listener = Purchases.addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const isProUser =
    customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined;

  const showPaywall = useCallback(async () => {
    await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
    });
  }, []);

  const showCustomerCenter = useCallback(async () => {
    await RevenueCatUI.presentCustomerCenter();
  }, []);

  const restorePurchases = useCallback(async () => {
    const info = await Purchases.restorePurchases();
    setCustomerInfo(info);
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
