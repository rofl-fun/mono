import { FC, useState } from "react";

interface AvatarRegistrationProps {
  onRegisterV2: (inviterAddress: string, name: string) => Promise<void>;
}

export const AvatarRegistration: FC<AvatarRegistrationProps> = ({ onRegisterV2 }) => {
  const [inviterAddress, setInviterAddress] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!inviterAddress || !avatarName) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await onRegisterV2(inviterAddress, avatarName);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Register V2 Avatar</h2>
        <p className="text-base-content/70">Enter your inviter's address and choose a name for your avatar</p>
      </div>
      {error && <p className="text-error mb-4">{error}</p>}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="inviterAddress" className="block text-sm font-medium">
            Inviter Address
          </label>
          <input
            id="inviterAddress"
            type="text"
            placeholder="0x..."
            value={inviterAddress}
            onChange={(e) => setInviterAddress(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="avatarName" className="block text-sm font-medium">
            Avatar Name
          </label>
          <input
            id="avatarName"
            type="text"
            placeholder="Enter your avatar name"
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <button onClick={handleRegister} className="btn btn-primary w-full">
        Register Avatar
      </button>
    </div>
  );
};