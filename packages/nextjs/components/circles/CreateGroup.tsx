import { FC, useState } from "react";
import { GroupProfile } from "@circles-sdk/profiles";
import { useCircles } from "~~/app/context/CirclesContext";

interface CreateGroupProps {
  sdk: any;
  onGroupCreated?: (groupAddress: string) => void;
}

export const CreateGroup: FC<CreateGroupProps> = ({ sdk, onGroupCreated }) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { sdk: circlesSdk, circlesConfig } = useCircles();

  if (!circlesConfig) {
    return (
      <div className="alert alert-error">
        Circles config not loaded. Please try again later.
      </div>
    );
  }

  const handleCreateGroup = async () => {
    if (!name || !symbol) {
      setError("Name and symbol are required");
      return;
    }

    if (!circlesConfig.baseGroupMintPolicy) {
      setError("Circles config is missing required addresses.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const groupProfile: GroupProfile = {
        name,
        symbol,
        description,
        previewImageUrl: "",
        imageUrl: "",
      };

      const standardMintPolicy = circlesConfig.baseGroupMintPolicy;
      console.log("[CreateGroup] About to call registerGroupV2 with:", {
        standardMintPolicy,
        groupProfile
      });

      const groupAvatar = await sdk.registerGroupV2(standardMintPolicy, groupProfile);
      console.log("[CreateGroup] registerGroupV2 result:", groupAvatar);

      if (onGroupCreated && groupAvatar?.address) {
        onGroupCreated(groupAvatar.address);
      }
    } catch (error) {
      console.error("[CreateGroup] Error creating group:", error);
      setError("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Group</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Group Name</span>
            <span className="label-text-alt">Max 36 characters</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={36}
            placeholder="Enter group name"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Token Symbol</span>
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter token symbol"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
            <span className="label-text-alt">Max 500 characters</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            placeholder="Enter group description"
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        <button
          onClick={handleCreateGroup}
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
};