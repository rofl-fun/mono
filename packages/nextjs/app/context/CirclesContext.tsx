"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Sdk } from "@circles-sdk/sdk";
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers";
import { circlesConfig } from "../config/circles";
import { useAccount, usePublicClient } from "wagmi";

interface CirclesContextType {
  sdk: Sdk | null;
  isLoading: boolean;
  error: Error | null;
  circlesConfig: typeof circlesConfig;
}

const CirclesContext = createContext<CirclesContextType>({
  sdk: null,
  isLoading: true,
  error: null,
  circlesConfig,
});

export const useCircles = () => useContext(CirclesContext);

export const CirclesProvider = ({ children }: { children: React.ReactNode }) => {
  const [sdk, setSdk] = useState<Sdk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { address } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    const initializeCircles = async () => {
      if (!publicClient) {
        console.log("Waiting for public client...");
        return;
      }

      try {
        setIsLoading(true);
        console.log("Initializing Circles SDK...");
        console.log("Using address:", address);
        console.log("Using environment:", process.env.NEXT_PUBLIC_CIRCLES_ENV || 'sandbox');

        const adapter = new BrowserProviderContractRunner();
        console.log("Created adapter, initializing...");

        // Ensure we have a provider before initializing
        if (!window.ethereum) {
          throw new Error("No Ethereum provider found. Please install MetaMask or another Web3 wallet.");
        }

        await adapter.init();
        console.log("Adapter initialized successfully");

        console.log("Creating SDK with config:", circlesConfig);
        const circlesSdk = new Sdk(adapter, circlesConfig);
        console.log("SDK created successfully:", circlesSdk);

        setSdk(circlesSdk);
      } catch (err) {
        console.error("Detailed SDK initialization error:", err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Circles SDK'));
      } finally {
        setIsLoading(false);
      }
    };

    if (address && publicClient) {
      console.log("Address and public client detected, starting SDK initialization");
      initializeCircles();
    } else {
      console.log("Waiting for address and public client...");
      setIsLoading(false);
    }
  }, [address, publicClient]);

  return (
    <CirclesContext.Provider value={{ sdk, isLoading, error, circlesConfig }}>
      {children}
    </CirclesContext.Provider>
  );
};