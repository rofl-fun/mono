import { FC, useState, useEffect } from "react";
import { ethers } from "ethers";
import { AvatarInterface, AvatarInterfaceV2 } from "@circles-sdk/sdk";
import { AvatarRegistration } from "./avatarRegisteration";
import { InvitePeoplePopup } from "./inviteHumanV2";
import ManageTrustAndUntrust from "./ManageTrustUntrust";
import SendCircles from "./transferCircles";
import PersonalMintComponent from "./personalMint";
import RecipientValidator from "./recipientValidator";
import TrustRelations from "./trustRelations";

interface TrustRelation {
  timestamp: number;
  objectAvatar: string;
  relation: string;
}

interface CirclesOnboardingProps {
  sdk: any; // Replace with proper SDK type
  circlesAddress: string;
}

const CirclesOnboarding: FC<CirclesOnboardingProps> = ({
  sdk,
  circlesAddress,
}) => {
  const [avatarInfo, setAvatar] = useState<AvatarInterfaceV2 | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [mintableAmount, setMintableAmount] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>("");
  const [recipientIsValid, setRecipientIsValid] = useState<boolean>(false);
  const [trustedCircles, setTrustedCircles] = useState<string[]>([]);
  const [untrustedCircles, setUntrustedCircles] = useState<string[]>([]);
  const [mappedRelations, setTrustRelations] = useState<TrustRelation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInvitePopupOpen, setIsInvitePopupOpen] = useState<boolean>(false);

  const handleInitialization = async () => {
    if (sdk && circlesAddress) {
      try {
        await fetchUserBalance();
        await handleAvatarCheck();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    }
  };

  useEffect(() => {
    if (circlesAddress) {
      handleInitialization();
    }
  }, [sdk, circlesAddress]);

  const fetchUserBalance = async () => {
    if (circlesAddress && sdk) {
      try {
        const avatar = await sdk.getAvatar(circlesAddress);
        if (avatar) {
          const balance = await avatar.getTotalBalance();
          setUserBalance(Number(balance));
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    }
  };

  const handleAvatarCheck = async () => {
    try {
      if (!sdk || !circlesAddress) return;

      const avatar = await sdk.getAvatar(circlesAddress);
      if (avatar) {
        setAvatar(avatar);
        await updateBalance(avatar);
      } else {
        setAvatar(null);
      }
    } catch (error) {
      console.error("Error checking avatar:", error);
    }
  };

  const updateBalance = async (avatar: AvatarInterfaceV2 = avatarInfo!) => {
    if (!avatar || !circlesAddress) return;

    try {
      const total = await avatar.getTotalBalance();
      const mintable = await avatar.getMintableAmount();

      setTotalBalance(Number(total));
      setMintableAmount(Number(mintable));
      await fetchUserBalance();
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const handleRegisterAvatar = async (inviterAddress: string, name: string) => {
    setIsLoading(true);
    try {
      const newAvatar = await sdk.acceptInvitation(inviterAddress as `0x${string}`, { name });
      setAvatar(newAvatar);
      await updateBalance(newAvatar);
    } catch (error) {
      console.error("Error registering avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitePeople = async (inviteeAddress: string) => {
    try {
      if (avatarInfo) {
        await avatarInfo.inviteHuman(inviteeAddress as `0x${string}`);
        console.log(`Invitation sent to ${inviteeAddress}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  if (!circlesAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="w-full max-w-4xl p-6">
          <div className="bg-base-200 rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Welcome to Circles Dev Playground</h1>
              <p className="text-base-content/70">Please connect your wallet to get started</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
            <h1 className="text-3xl font-bold">Welcome to Circles Dev Playground</h1>

      <div className="w-full max-w-4xl p-6">

        <div className="bg-base-200 rounded-lg p-6">

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium"></p>
              <div className="space-x-2">
                <button
                  onClick={() => setIsInvitePopupOpen(true)}
                  className="btn btn-ghost"
                >
                  Invite People
                </button>
              </div>
            </div>

            {avatarInfo ? (
              <>
                <div className="bg-base-300 p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Circles Avatar Info</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <p className="font-medium">Address: {avatarInfo.address}</p>
                      <p className="text-sm opacity-70">Total Balance: {Number(totalBalance).toFixed(4)}</p>
                      <p className="text-sm opacity-70">Mintable: {Number(mintableAmount).toFixed(4)} CRC</p>
                    </div>
                  </div>
                  <PersonalMintComponent
                    avatarInfo={avatarInfo}
                    circlesAddress={circlesAddress}
                    handleregi={updateBalance}
                  />
                </div>

                <div className="bg-base-300 p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Send Circles CRC Token</h2>
                  <div className="space-y-4">
                    <RecipientValidator
                      recipient={recipient}
                      setRecipient={setRecipient}
                      recipientIsValid={recipientIsValid}
                      setRecipientIsValid={setRecipientIsValid}
                    />
                    <SendCircles
                      avatarInfo={avatarInfo}
                      recipient={recipient}
                      updateBalance={updateBalance}
                    />
                  </div>
                </div>

                <div className="bg-base-300 p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Trust Management</h2>
                  <ManageTrustAndUntrust
                    avatarInfo={avatarInfo}
                    logTrustRelations={updateBalance}
                    trustedCircles={trustedCircles}
                    setTrustedCircles={setTrustedCircles}
                    untrustedCircles={untrustedCircles}
                    setUntrustedCircles={setUntrustedCircles}
                  />
                  <TrustRelations
                    avatarInfo={avatarInfo}
                    setTrustedCircles={setTrustedCircles}
                    setTrustRelations={setTrustRelations}
                  />
                </div>
              </>
            ) : (
              <AvatarRegistration onRegisterV2={handleRegisterAvatar} />
            )}
          </div>
        </div>
      </div>

      <InvitePeoplePopup
        isOpen={isInvitePopupOpen}
        onClose={() => setIsInvitePopupOpen(false)}
        onInvite={handleInvitePeople}
      />
    </div>
  );
};

export default CirclesOnboarding;