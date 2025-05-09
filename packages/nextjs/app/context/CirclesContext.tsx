"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sdk } from "@circles-sdk/sdk";
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers";
import { circlesConfig } from "../config/circles";
import { useAccount } from "wagmi";

interface CirclesContextType {
  sdk: Sdk | null;
  isLoading: boolean;
  error: Error | null;
}

const CirclesContext = createContext<CirclesContextType>({
  sdk: null,
  isLoading: true,
  error: null,
});

export const useCircles = () => useContext(CirclesContext);

export const CirclesProvider = ({ children }: { children: React.ReactNode }) => {
  const [sdk, setSdk] = useState<Sdk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const initializeCircles = async () => {
      try {
        setIsLoading(true);
        const adapter = new BrowserProviderContractRunner();
        await adapter.init();
        const circlesSdk = new Sdk(adapter, circlesConfig);
        setSdk(circlesSdk);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Circles SDK'));
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      initializeCircles();
    }
  }, [address]);

  return (
    <CirclesContext.Provider value={{ sdk, isLoading, error }}>
      {children}
    </CirclesContext.Provider>
  );
};