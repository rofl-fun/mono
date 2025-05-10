"use client";

import { useAccount } from "wagmi";
import { useCircles } from "~~/app/context/CirclesContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddressInput } from "~~/components/scaffold-eth";

interface GroupInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  isMember: boolean;
}

export default function GroupDetailPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();
  const params = useParams();
  const groupAddress = params.address as string;

  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteAddress, setInviteAddress] = useState<string>("");
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    const loadGroupInfo = async () => {
      if (!sdk || !groupAddress || !connectedAddress) return;

      try {
        setIsLoading(true);
        setError(null);

        const groupAvatar = await sdk.getAvatar(groupAddress as `0x${string}`);
        if (!groupAvatar) {
          setError("Group not found");
          return;
        }

        const totalSupply = await groupAvatar.getTotalSupply() || BigInt(0);

        // Check if user is a member
        const membershipsQuery = sdk.data.getGroupMemberships(connectedAddress as `0x${string}`, 10);
        await membershipsQuery.queryNextPage();
        const userMemberships = new Set((membershipsQuery.currentPage?.results || []).map(m => m.group));

        setGroupInfo({
          name: groupAvatar.avatarInfo?.name || "Unnamed Group",
          symbol: groupAvatar.avatarInfo?.symbol || "GRP",
          totalSupply: totalSupply.toString(),
          isMember: userMemberships.has(groupAddress)
        });
      } catch (err) {
        console.error("Error loading group info:", err);
        setError("Failed to load group information");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupInfo();
  }, [sdk, groupAddress, connectedAddress]);

  const handleInviteMember = async () => {
    if (!sdk || !connectedAddress || !groupAddress || !inviteAddress) return;

    try {
      setInviteLoading(true);
      setError(null);

      const groupAvatar = await sdk.getAvatar(groupAddress as `0x${string}`);
      if (!groupAvatar) {
        setError("Group not found");
        return;
      }

      // Trust the member (send invitation)
      await groupAvatar.trust(inviteAddress as `0x${string}`);

      // Clear input
      setInviteAddress("");
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
            <span>Please connect your wallet to view group details</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Group Details</h1>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/circles/groups")}
          >
            Back to Groups
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {groupInfo && (
          <>
            <div className="card bg-base-200 shadow-xl p-6 mb-6">
              <div className="space-y-4">
                <div className="p-4 bg-base-300 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Group Information</h3>
                  <p>Name: {groupInfo.name}</p>
                  <p>Symbol: {groupInfo.symbol}</p>
                  <p>Total Supply: {groupInfo.totalSupply}</p>
                  <p>Status: {groupInfo.isMember ? "Member" : "Not a Member"}</p>
                </div>

                {groupInfo.isMember && (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={() => router.push(`/circles/groups/${groupAddress}/mint`)}
                    >
                      Mint Tokens
                    </button>
                  </div>
                )}
              </div>
            </div>

            {groupInfo.isMember && (
              <div className="card bg-base-200 shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-4">Invite Members</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Member Address</span>
                    </label>
                    <div className="flex gap-2">
                      <AddressInput
                        value={inviteAddress}
                        onChange={setInviteAddress}
                      />
                      <button
                        className={`btn btn-primary ${inviteLoading ? 'loading' : ''}`}
                        onClick={handleInviteMember}
                        disabled={!inviteAddress || inviteLoading}
                      >
                        Invite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}