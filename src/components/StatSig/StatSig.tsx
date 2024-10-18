"use client";

import React, { useEffect, useState, createContext, useContext, useRef } from "react";
import {
  LogLevel,
  StatsigProvider,
  useClientAsyncInit,
} from "@statsig/react-bindings";

const PricingContext = createContext<{ priceTier: string | null }>({ priceTier: null });

export const usePricing = () => useContext(PricingContext);

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    { userID: "random_user_" + Math.random().toString(36).substr(2, 9) },
    { logLevel: LogLevel.Debug }
  );

  const [priceTier, setPriceTier] = useState<string | null>(null);
  const isMounted = useRef(false); 

  useEffect(() => {
    isMounted.current = true;

    const fetchPricingConfig = async () => {
      try {
        
        const isTier10 = client.checkGate("tutorial_statsig_tier_10");
        const isTier15 = client.checkGate("tutorial_statsig_tier_15");
        const isTier20 = client.checkGate("tutorial_statsig_tier_20");

        if (isMounted.current) {
          if (isTier10) {
            setPriceTier("tier_10");
          } else if (isTier15) {
            setPriceTier("tier_15");
          } else if (isTier20) {
            setPriceTier("tier_20");
          } else {
            setPriceTier("default");
          }
        }
      } catch (error) {
        console.error("Error fetching the pricing config:", error);
        if (isMounted.current) {
          setPriceTier("default");
        }
      }
    };

    fetchPricingConfig();

    return () => {
      isMounted.current = false;
    };
  }, [client]);

  return (
    <StatsigProvider client={client}>
      <PricingContext.Provider value={{ priceTier }}>
        {children}
      </PricingContext.Provider>
    </StatsigProvider>
  );
}
