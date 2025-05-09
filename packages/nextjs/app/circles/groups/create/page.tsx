"use client";

import { useAccount } from "wagmi";
import { useCircles } from "../../../context/CirclesContext";
import { CreateGroup } from "~~/components/circles/CreateGroup";
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();

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
            <span>Please connect your wallet to create a group</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Create New Group</h1>
        <CreateGroup
          sdk={sdk}
          onGroupCreated={(groupAddress) => {
            router.push(`/circles/groups/${groupAddress}`);
          }}
        />
      </div>
    </div>
  );
}