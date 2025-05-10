"use client";

import { useAccount } from "wagmi";
import { useCircles } from "~~/app/context/CirclesContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressInput } from "~~/components/scaffold-eth";

export default function JoinGroupPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();
  const [groupAddress, setGroupAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupInfo, setGroupInfo] = useState<{ name: string; symbol: string; } | null>(null);

  const handleCheckGroup = async () => {
    if (!sdk || !groupAddress) return;

    try {
      setIsLoading(true);
      setError(null);
      setGroupInfo(null);

      const groupAvatar = await sdk.getAvatar(groupAddress as `0x${string}`);
      if (!groupAvatar) {
        setError("Group not found");
        return;
      }

      setGroupInfo({
        name: groupAvatar.avatarInfo?.name || "Unnamed Group",
        symbol: groupAvatar.avatarInfo?.symbol || "GRP"
      });
    } catch (err) {
      console.error("Error checking group:", err);
      setError("Failed to find group. Please check the address and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!sdk || !connectedAddress || !groupAddress) return;

    try {
      setIsLoading(true);
      setError(null);

      const avatar = await sdk.getAvatar(connectedAddress as `0x${string}`);
      if (!avatar) {
        setError("No avatar found. Please complete onboarding first.");
        return;
      }

      // Trust the group (this is how we join)
      await avatar.trust(groupAddress as `0x${string}`);

      // Redirect to the groups page
      router.push("/circles/groups");
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <span>Please connect your wallet to join groups</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Join Group</h1>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/circles/groups")}
          >
            My Groups
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-200 shadow-xl p-6">
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Group Address</span>
              </label>
              <div className="flex gap-2">
                <AddressInput
                  value={groupAddress}
                  onChange={setGroupAddress}
                />
                <button
                  className={`btn btn-secondary ${isLoading ? 'loading' : ''}`}
                  onClick={handleCheckGroup}
                  disabled={!groupAddress || isLoading}
                >
                  Check
                </button>
              </div>
            </div>

            {groupInfo && (
              <div className="p-4 bg-base-300 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Group Information</h3>
                <p>Name: {groupInfo.name}</p>
                <p>Symbol: {groupInfo.symbol}</p>
                <button
                  className={`btn btn-primary w-full mt-4 ${isLoading ? 'loading' : ''}`}
                  onClick={handleJoinGroup}
                  disabled={isLoading}
                >
                  Join Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}