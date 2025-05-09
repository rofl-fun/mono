import { FC, useState } from "react";
import { AvatarInterface } from "@circles-sdk/sdk";

interface SendCirclesProps {
  avatarInfo: AvatarInterface | null;
  recipient: string;
  updateBalance: () => Promise<void>;
}

const validateRecipient = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const SendCircles: FC<SendCirclesProps> = ({ avatarInfo, recipient, updateBalance }) => {
  const [valueString, setValueString] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const send = async () => {
    try {
      if (!avatarInfo) {
        throw new Error("Avatar not found");
      }

      const value = parseFloat(valueString);
      if (isNaN(value) || value <= 0) {
        throw new Error("Invalid value");
      }

      if (!validateRecipient(recipient)) {
        throw new Error("Invalid recipient address");
      }

      setIsLoading(true);
      setError("");

      // Convert value to BigInt (assuming the value is in wei)
      const valueBigInt = BigInt(Math.floor(value * 1e18));
      await avatarInfo.transfer(recipient as `0x${string}`, valueBigInt);
      console.log(`Successfully sent ${value} CRC tokens to ${recipient}`);
      setValueString("");
      await updateBalance();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error sending CRC tokens");
      console.error("Error sending CRC tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount to Send
        </label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount to send"
          value={valueString}
          onChange={(e) => setValueString(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        onClick={send}
        disabled={isLoading || parseFloat(valueString) <= 0}
        className="btn btn-primary w-full"
      >
        {isLoading ? "Sending..." : "Send CRC"}
      </button>
    </div>
  );
};

export default SendCircles;