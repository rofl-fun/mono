"use client";

import { useAccount } from "wagmi";
import { useCircles } from "~~/app/context/CirclesContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AvatarInterfaceV2 } from "@circles-sdk/sdk";
import { AddressInput } from "~~/components/scaffold-eth";

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
  const [inviteAddress, setInviteAddress] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);

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

  const handleInviteMember = async () => {
    if (!sdk || !connectedAddress || !selectedGroup || !inviteAddress) return;

    try {
      setInviteLoading(true);
      const groupAvatar = await sdk.getAvatar(selectedGroup as `0x${string}`);
      if (!groupAvatar) throw new Error("Group not found");

      // Trust the member (send invitation)
      await groupAvatar.trust(inviteAddress as `0x${string}`);

      // Clear the form
      setInviteAddress("");
      setSelectedGroup(null);
    } catch (err) {
      console.error("Error inviting member:", err);
      setError("Failed to invite member. Please try again.");
    } finally {
      setInviteLoading(false);
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
          <h1 className="text-4xl font-bold">Your Groups</h1>
          <div className="space-x-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/circles/groups/discover")}
            >
              Discover Groups
            </button>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/circles/groups/create")}
            >
              Create New Group
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You haven't joined any groups yet.</p>
            <div className="space-x-4">
              <button
                className="btn btn-secondary"
                onClick={() => router.push("/circles/groups/discover")}
              >
                Discover Groups
              </button>
              <button
                className="btn btn-primary"
                onClick={() => router.push("/circles/groups/create")}
              >
                Create Your First Group
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

            {/* Invite Members Form */}
            <div className="card bg-base-200 shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Invite Members</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Select Group</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedGroup || ""}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                      <option key={group.address} value={group.address}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Member Address</span>
                  </label>
                  <AddressInput
                    value={inviteAddress}
                    onChange={setInviteAddress}
                  />
                </div>
                <button
                  className={`btn btn-primary w-full ${inviteLoading ? 'loading' : ''}`}
                  onClick={handleInviteMember}
                  disabled={!selectedGroup || !inviteAddress || inviteLoading}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}