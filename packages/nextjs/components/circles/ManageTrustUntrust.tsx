import { FC, useState } from "react";
import { AvatarInterface } from "@circles-sdk/sdk";

interface ManageTrustAndUntrustProps {
  avatarInfo: AvatarInterface | null;
  logTrustRelations: () => Promise<void>;
  trustedCircles: string[];
  setTrustedCircles: (circles: string[]) => void;
  untrustedCircles: string[];
  setUntrustedCircles: (circles: string[]) => void;
}

const ManageTrustAndUntrust: FC<ManageTrustAndUntrustProps> = ({
  avatarInfo,
  logTrustRelations,
  trustedCircles,
  setTrustedCircles,
  untrustedCircles,
  setUntrustedCircles,
}) => {
  const [newCircle, setNewCircle] = useState("");

  const trustNewCircle = async () => {
    try {
      if (!avatarInfo || !newCircle.startsWith("0x")) {
        throw new Error("Avatar not found or invalid address");
      }

      await avatarInfo.trust(newCircle as `0x${string}`);
      setTrustedCircles([...trustedCircles, newCircle]);
      setUntrustedCircles(untrustedCircles.filter((c) => c !== newCircle));
      setNewCircle("");
    } catch (error) {
      console.error("Error trusting new circle:", error);
    }
  };

  const untrustCircle = async (circle: string) => {
    try {
      if (!avatarInfo || !circle.startsWith("0x")) {
        throw new Error("Avatar not found or invalid address");
      }

      await avatarInfo.untrust(circle as `0x${string}`);
      setUntrustedCircles([...untrustedCircles, circle]);
      setTrustedCircles(trustedCircles.filter((c) => c !== circle));
      logTrustRelations();
    } catch (error) {
      console.error("Error untrusting circle:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter new circle address (0x...)"
          value={newCircle}
          onChange={(e) => setNewCircle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              trustNewCircle();
            }
          }}
          className="input input-bordered flex-1"
        />
        <button onClick={trustNewCircle} className="btn btn-primary">
          Trust
        </button>
      </div>
      <div className="max-h-[150px] overflow-y-auto mt-2">
        <div className="space-y-2">
          {[...trustedCircles, ...untrustedCircles].map((circle, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-base-300 p-2 rounded-lg"
            >
              <div className="text-sm font-mono">{circle}</div>
              {trustedCircles.includes(circle) ? (
                <button onClick={() => untrustCircle(circle)} className="btn btn-sm btn-ghost">
                  Untrust
                </button>
              ) : (
                <button onClick={() => trustNewCircle()} className="btn btn-sm btn-ghost">
                  Trust
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTrustAndUntrust;