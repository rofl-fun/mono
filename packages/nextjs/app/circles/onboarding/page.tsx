"use client";

import { useAccount } from "wagmi";
import { useCircles } from "../../context/CirclesContext";
import CirclesOnboarding from "../../../components/circles/circlesonboarding";

export default function OnboardingPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();

  if (sdkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <CirclesOnboarding
      sdk={sdk}
      circlesAddress={connectedAddress || ""}
    />
  );
}