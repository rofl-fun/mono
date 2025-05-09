import { FC, useState } from "react";

interface InvitePeoplePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (address: string) => Promise<void>;
}

export const InvitePeoplePopup: FC<InvitePeoplePopupProps> = ({ isOpen, onClose, onInvite }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!address) {
      setError("Please enter an address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await onInvite(address);
      onClose();
    } catch (err) {
      console.error("Error inviting user:", err);
      setError("Failed to invite user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="mb-6">
          <h3 className="text-xl font-bold">Invite People to Circles</h3>
          <p className="text-base-content/70">
            Enter the address of the person you want to invite to the Circles network.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="input input-bordered w-full"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleInvite} disabled={isLoading} className="btn btn-primary">
            {isLoading ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};