import { FC, useState } from "react";
import { AvatarInterface } from "@circles-sdk/sdk";

interface PersonalMintComponentProps {
  avatarInfo: AvatarInterface | null;
  circlesAddress: string;
  handleregi: () => Promise<void>;
}

const PersonalMintComponent: FC<PersonalMintComponentProps> = ({ avatarInfo, circlesAddress, handleregi }) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const personalMint = async () => {
    if (!avatarInfo) {
      throw new Error("Avatar not found");
    }

    setIsLoading(true);
    setError("");

    try {
      await avatarInfo.personalMint();

      // Update total balance after minting
      const balance = await avatarInfo.getMintableAmount();
      setTotalBalance(Number(balance));
      await handleregi();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error minting Circles");
      console.error("Error minting Circles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-error text-sm">{error}</p>}
      <button
        onClick={personalMint}
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? "Minting..." : "Mint Circles"}
      </button>
    </div>
  );
};

export default PersonalMintComponent;