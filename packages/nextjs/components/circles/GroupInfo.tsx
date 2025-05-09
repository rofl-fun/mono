import { FC, useEffect, useState } from "react";
import { AvatarInterfaceV2 } from "@circles-sdk/sdk";

interface GroupInfoProps {
  groupAddress: string;
  sdk: any;
}

export const GroupInfo: FC<GroupInfoProps> = ({ groupAddress, sdk }) => {
  const [groupAvatar, setGroupAvatar] = useState<AvatarInterfaceV2 | null>(null);
  const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const avatar = await sdk.getAvatar(groupAddress);
        if (avatar) {
          setGroupAvatar(avatar);
          const supply = await avatar.getTotalSupply();
          setTotalSupply(supply);
        }
      } catch (error) {
        console.error("Error loading group info:", error);
        setError("Failed to load group information");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupInfo();
  }, [groupAddress, sdk]);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-base-200 rounded-lg p-6">
        <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-base-300 rounded w-1/2"></div>
          <div className="h-4 bg-base-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!groupAvatar) {
    return (
      <div className="alert alert-warning">
        <span>Group not found</span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center">
          <span className="text-3xl">👥</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">{groupAvatar.avatarInfo?.name || "Unknown Group"}</h3>
          <p className="text-sm opacity-70">{groupAddress}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-base-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Group Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-70">Total Supply</p>
              <p className="font-medium">{totalSupply.toString()} tokens</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Token Symbol</p>
              <p className="font-medium">{groupAvatar.avatarInfo?.symbol || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-base-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Group Profile</h4>
          <p className="text-sm">{groupAvatar.avatarInfo?.description || "No description available"}</p>
        </div>
      </div>
    </div>
  );
};