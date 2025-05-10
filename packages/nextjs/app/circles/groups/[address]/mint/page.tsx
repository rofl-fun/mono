"use client";

import { useAccount } from "wagmi";
import { useCircles } from "~~/app/context/CirclesContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { EtherInput } from "~~/components/scaffold-eth";
import { group } from "console";

interface GroupInfo {
  name: string;
  symbol: string;
  totalSupply: string;
}

export default function MintGroupTokensPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();
  const router = useRouter();
  const params = useParams();
  const groupAddress = params.address as `0x${string}`;

  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mintAmount, setMintAmount] = useState<string>("");
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    const loadGroupInfo = async () => {
      if (!sdk || !groupAddress) return;

      try {
        setIsLoading(true);
        setError(null);

        const groupAvatar = await sdk.getAvatar(groupAddress);
        if (!groupAvatar) {
          setError("Group not found");
          return;
        }

        const totalSupply = await groupAvatar.getTotalSupply() || BigInt(0);
        groupAvatar.getMembershipConditions

        setGroupInfo({
          name: groupAvatar.avatarInfo?.name || "Unnamed Group",
          symbol: groupAvatar.avatarInfo?.symbol || "GRP",
          totalSupply: totalSupply.toString()
        });
      } catch (err) {
        console.error("Error loading group info:", err);
        setError("Failed to load group information");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupInfo();
  }, [sdk, groupAddress]);

  const handleMint = async () => {
    if (!sdk || !connectedAddress || !groupAddress || !mintAmount) return;

    try {
      setIsMinting(true);
      setError(null);

      const avatar = await sdk.getAvatar(connectedAddress as `0x${string}`);
      if (!avatar) {
        setError("No avatar found. Please complete onboarding first.");
        return;
      }

      // Get the group avatar
      const groupAvatar = await sdk.getAvatar(groupAddress);
      if (!groupAvatar) {
        setError("Group not found");
        return;
      }

      // Mint group tokens using personal tokens as collateral
      // The collateral amount is the same as the mint amount
      const collateralTokens: `0x${string}`[] = [connectedAddress as `0x${string}`];
      const collateralAmounts = [parseEther(mintAmount)];

      await groupAvatar.groupMint(
        groupAddress,
        collateralTokens,
        collateralAmounts,
        new Uint8Array()
      );

      // Refresh group info
      const newTotalSupply = await groupAvatar.getTotalSupply() || BigInt(0);
      setGroupInfo(prev => prev ? {
        ...prev,
        totalSupply: newTotalSupply.toString()
      } : null);

      // Clear input
      setMintAmount("");
    } catch (err) {
      console.error("Error minting tokens:", err);
      setError("Failed to mint tokens. Please try again.");
    } finally {
      setIsMinting(false);
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
            <span>Please connect your wallet to mint tokens</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mint Group Tokens</h1>
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/circles/groups/${groupAddress}`)}
          >
            Back to Group
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {groupInfo && (
          <div className="card bg-base-200 shadow-xl p-6">
            <div className="space-y-4">
              <div className="p-4 bg-base-300 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">Group Information</h3>
                <p>Name: {groupInfo.name}</p>
                <p>Symbol: {groupInfo.symbol}</p>
                <p>Total Supply: {groupInfo.totalSupply}</p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Amount to Mint</span>
                </label>
                <div className="flex gap-2">
                  <EtherInput
                    value={mintAmount}
                    onChange={setMintAmount}
                    placeholder="Amount of tokens to mint"
                  />
                  <button
                    className={`btn btn-primary ${isMinting ? 'loading' : ''}`}
                    onClick={handleMint}
                    disabled={!mintAmount || isMinting}
                  >
                    Mint
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt">This will use your personal tokens as collateral</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}