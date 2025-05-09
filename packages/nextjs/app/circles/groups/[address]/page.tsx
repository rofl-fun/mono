"use client";

import { useAccount } from "wagmi";
import { useCircles } from "../../../context/CirclesContext";
import { GroupInfo } from "~~/components/circles/GroupInfo";
import { useParams } from "next/navigation";

export default function GroupPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const params = useParams();
  const groupAddress = params.address as string;

  if (sdkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!connectedAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          <div className="alert alert-warning">
            <span>Please connect your wallet to view group details</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full">
        <GroupInfo
          sdk={sdk}
          groupAddress={groupAddress}
        />
      </div>
    </div>
  );
}