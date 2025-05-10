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
  isMember: boolean;
}

export default function DiscoverGroupsPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState<string | null>(null);

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

        // Get all available groups
        const groupsQuery = sdk.data.findGroups(20);
        await groupsQuery.queryNextPage();
        const availableGroups = groupsQuery.currentPage?.results || [];

        // Get user's memberships to check which groups they're already part of
        const membershipsQuery = sdk.data.getGroupMemberships(connectedAddress as `0x${string}`, 20);
        await membershipsQuery.queryNextPage();
        const userMemberships = new Set((membershipsQuery.currentPage?.results || []).map(m => m.group));

        const groupDetails = await Promise.all(
          availableGroups.map(async (group) => {
            const groupAvatar = await sdk.getAvatar(group.address as `0x${string}`);
            const totalSupply = await groupAvatar?.getTotalSupply() || BigInt(0);
            return {
              address: group.address,
              name: group.name || "Unnamed Group",
              symbol: groupAvatar?.avatarInfo?.symbol || "GRP",
              totalSupply: totalSupply.toString(),
              isMember: userMemberships.has(group.address)
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

  const handleJoinGroup = async (groupAddress: string) => {
    if (!sdk || !connectedAddress) return;

    try {
      setJoinLoading(groupAddress);
      const avatar = await sdk.getAvatar(connectedAddress as `0x${string}`);
      if (!avatar) throw new Error("No avatar found");

      // Trust the group (this is how we join)
      await avatar.trust(groupAddress as `0x${string}`);

      // Refresh the groups list
      setGroups(groups.map(g =>
        g.address === groupAddress ? { ...g, isMember: true } : g
      ));
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join group. Please try again.");
    } finally {
      setJoinLoading(null);
    }
  };

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
          <h1 className="text-4xl font-bold">Discover Groups</h1>
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

        {groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">No groups available.</p>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/circles/groups/create")}
            >
              Create a New Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.address}
                className="card bg-base-200 shadow-xl"
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
                  <div className="card-actions justify-end mt-4">
                    {group.isMember ? (
                      <button className="btn btn-disabled">Already Joined</button>
                    ) : (
                      <button
                        className={`btn btn-primary ${joinLoading === group.address ? 'loading' : ''}`}
                        onClick={() => handleJoinGroup(group.address)}
                        disabled={joinLoading !== null}
                      >
                        Join Group
                      </button>
                    )}
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