"use client";

import { useAccount } from "wagmi";
import { useCircles } from "~~/app/context/CirclesContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AvatarInterfaceV2 } from "@circles-sdk/sdk";

interface GroupInfo {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
}

export default function GroupsPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroups = async () => {
      if (!sdk || !connectedAddress) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get user's avatar
        const avatar = await sdk.getAvatar(connectedAddress as `0x${string}`);
        if (!avatar) {
          setError("No avatar found. Please complete onboarding first.");
          return;
        }

        // Get all groups the user is a member of using the correct method
        const membershipsQuery = sdk.data.getGroupMemberships(connectedAddress as `0x${string}`, 10);
        await membershipsQuery.queryNextPage();
        const userGroups = membershipsQuery.currentPage?.results || [];

        console.log("Group memberships:", userGroups);

        const groupDetails = await Promise.all(
          userGroups.map(async (membership) => {
            console.log("Processing membership:", membership);
            const groupAvatar = await sdk.getAvatar(membership.group as `0x${string}`);
            const totalSupply = await groupAvatar?.getTotalSupply() || BigInt(0);
            return {
              address: membership.group,
              name: groupAvatar?.avatarInfo?.name || "Unnamed Group",
              symbol: groupAvatar?.avatarInfo?.symbol || "GRP",
              totalSupply: totalSupply.toString()
            };
          })
        );
        setGroups(groupDetails);
      } catch (err) {
        console.error("Error loading groups:", err);
        setError("Failed to load groups. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, [sdk, connectedAddress]);

  if (sdkLoading || isLoading) {
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
            <span>Please connect your wallet to view groups</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Groups</h1>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/circles/groups/create")}
          >
            Create New Group
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You haven't joined any groups yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/circles/groups/create")}
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.address}
                className="card bg-base-200 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => router.push(`/circles/groups/${group.address}`)}
              >
                <div className="card-body">
                  <h2 className="card-title">{group.name}</h2>
                  <p className="text-sm opacity-70">{group.address}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="badge badge-primary">{group.symbol}</span>
                    <span className="text-sm">
                      {group.totalSupply ? `${group.totalSupply} tokens` : "No tokens minted"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}