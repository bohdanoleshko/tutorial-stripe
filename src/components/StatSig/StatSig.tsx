"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { LogLevel, StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings";

const PricingContext = createContext<{ priceTier: string | null }>({ priceTier: null });

export const usePricing = () => useContext(PricingContext);

export default function MyStatsig({ children }: { children: React.ReactNode }) {
  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
    { userID: "random_user_" + Math.random().toString(36).substr(2, 9) },
    { logLevel: LogLevel.Debug }
  );

  const [priceTier, setPriceTier] = useState<string | null>(null);

  useEffect(() => {
    const setRandomPriceTier = () => {
      const priceTiers = ['tier_10', 'tier_15', 'tier_20'];
      const randomIndex = Math.floor(Math.random() * priceTiers.length);
      
      setPriceTier(priceTiers[randomIndex]);
    };

    setRandomPriceTier();
  }, []);

  return (
    <StatsigProvider client={client}>
      <PricingContext.Provider value={{ priceTier }}>
        {children}
      </PricingContext.Provider>
    </StatsigProvider>
  );
}
