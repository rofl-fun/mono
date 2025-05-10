"use client";

import { useState } from "react";
import Link from "next/link";
import groupsData from "./data/items.json"; // Assuming this path is correct relative to page.tsx
import { formatDistanceToNow } from "date-fns";
import groupsData from "./data/items.json";

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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
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

  const filteredAndSortedGroups = groupsData.groups
    .sort((a: GroupInfo, b: GroupInfo) => {
      switch (sortBy) {
        case "members":
          return b.members - a.members;
        case "pnl":
          return b.avgPnl - a.avgPnl;
        case "price":
          return a.joinPrice - b.joinPrice; // Assuming lower price is better for sorting 'lowest price'
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4">
      {/* Page Title */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to ROFL.FUN Groups
        </h1>
        <p className="text-xl opacity-80">
          Manage your trading groups, start a new one, or check your chats.
        </p>
      </div>

      {/* Create Group and My Chats Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 px-4 w-full max-w-3xl mx-auto">
        <Link href="/create-group" passHref className="w-full sm:w-auto">
          <button className="btn btn-primary btn-lg w-full sm:w-auto">
            Create a New Group
          </button>
        </Link>
        <Link href="/my-chats" passHref className="w-full sm:w-auto">
          <button className="btn btn-secondary btn-lg w-full sm:w-auto">
            View My Chats
          </button>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {/* Search and Sort Controls */}
        <div className="mb-8 p-4 bg-base-100 rounded-xl shadow">
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <button
              onClick={() => setSortBy("members")}
              className={`btn btn-sm ${sortBy === "members" ? "btn-primary" : "btn-outline"}`}
            >
              Most Members
            </button>
            <button
              onClick={() => setSortBy("pnl")}
              className={`btn btn-sm ${sortBy === "pnl" ? "btn-primary" : "btn-outline"}`}
            >
              Best P&L
            </button>
            <button
              onClick={() => setSortBy("price")}
              className={`btn btn-sm ${sortBy === "price" ? "btn-primary" : "btn-outline"}`}
            >
              Lowest Price
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupsData.groups.map((group: GroupInfo) => (
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

                  <p className="text-sm opacity-80 mb-4 line-clamp-3 flex-grow">{group.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-base-200 rounded-lg p-3 text-center">
                      <div className="text-xs opacity-70 mb-1">Members</div>
                      <div className="font-bold text-md">{group.members}</div>
                    </div>
                    <div className="bg-base-200 rounded-lg p-3 text-center">
                      <div className="text-xs opacity-70 mb-1">Avg P&L</div>
                      <div className={`font-bold text-md ${group.avgPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {group.avgPnl >= 0 ? "+" : ""}
                        {formatNumber(group.avgPnl)}%
                      </div>
                    </div>
                  </div>

                  <div className="text-xs opacity-70 mb-5 text-center">
                    Last active: {formatDistanceToNow(new Date(group.lastActive), { addSuffix: true })}
                  </div>

                <button className="w-full mt-4 btn btn-primary">
                  Join Group
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
