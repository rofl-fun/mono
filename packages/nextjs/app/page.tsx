"use client";

import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { formatDistanceToNow } from "date-fns";
import groupsData from "./data/items.json";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { parseEther } from "viem";

interface GroupInfo {
  id: number;
  name: string;
  type: string;
  members: number;
  avgPnl: number;
  joinPrice: number;
  currency: string;
  description: string;
  trend: string;
  lastActive: string;
  chatId: string;
}

type CollectionInfo = [bigint, string, bigint]; // [collectionId, creator, price]

const Home = () => {
  const { address: connectedAddress } = useAccount();

  const { data: hasAccess } = useScaffoldReadContract({
    contractName: "ChatAccessNFT",
    functionName: "hasAccess",
    args: [connectedAddress, "bomdia"],
  });

  const { writeContractAsync: mintNFT } = useScaffoldWriteContract({
    contractName: "ChatAccessNFT",
  });

  const { data: collectionInfo } = useScaffoldReadContract({
    contractName: "ChatAccessNFT",
    functionName: "getCollectionByChatId",
    args: [""],
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleJoinGroup = async (group: GroupInfo) => {
    if (!connectedAddress) return;

    try {
      const { data: groupCollection } = await useScaffoldReadContract({
        contractName: "ChatAccessNFT",
        functionName: "getCollectionByChatId",
        args: [group.chatId],
      });

      if (!groupCollection) {
        console.error("Collection not found for group:", group.name);
        return;
      }

      const [collectionId, , price] = groupCollection as CollectionInfo;

      await mintNFT({
        functionName: "mint",
        args: [connectedAddress, collectionId],
        value: price,
      });
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const groupsWithChatId: GroupInfo[] = groupsData.groups.map(group => ({
    ...group,
    chatId: `group-${group.id}`,
  }));

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ROFL.FUN Groups</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Connected:</span>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsWithChatId.map((group: GroupInfo) => (
            <div
              key={group.id}
              className="bg-base-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{group.name}</h2>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      group.type === 'alpha' ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'
                    }`}>
                      {group.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatNumber(group.joinPrice)} {group.currency}
                    </div>
                    <div className="text-sm opacity-70">to join</div>
                  </div>
                </div>

                <p className="text-sm opacity-80 mb-4">{group.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm opacity-70">Members</div>
                    <div className="font-bold">{group.members}</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-70">Avg P&L</div>
                    <div className={`font-bold ${
                      group.avgPnl >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {group.avgPnl >= 0 ? '+' : ''}{formatNumber(group.avgPnl)}%
                    </div>
                  </div>
                </div>

                <div className="text-sm opacity-70">
                  Last active: {formatDistanceToNow(new Date(group.lastActive), { addSuffix: true })}
                </div>

                {!connectedAddress ? (
                  <button className="w-full mt-4 btn btn-primary" disabled>
                    Connect Wallet
                  </button>
                ) : hasAccess ? (
                  <button className="w-full mt-4 btn btn-primary">
                    View Group
                  </button>
                ) : (
                  <button
                    className="w-full mt-4 btn btn-primary"
                    onClick={() => handleJoinGroup(group)}
                  >
                    Buy Access ({formatNumber(group.joinPrice)} {group.currency})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
