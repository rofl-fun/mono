"use client";

import { useState } from "react";
import Link from "next/link";
import groupsData from "./data/items.json";
// Assuming this path is correct relative to page.tsx
import { formatDistanceToNow } from "date-fns";

// import { useAccount } from "wagmi"; // Only if you need connectedAddress for something specific here
// import { Address } from "~~/components/scaffold-eth"; // Only if displaying address

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
}

const Home = () => {
  // const { address: connectedAddress } = useAccount(); // Restore if needed
  const [sortBy, setSortBy] = useState<"members" | "pnl" | "price">("members");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const filteredAndSortedGroups = groupsData.groups.sort((a: GroupInfo, b: GroupInfo) => {
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
        <h1 className="text-5xl font-bold mb-4 text-white">Welcome to ROFL.DAM</h1>
        <p className="text-xl opacity-80">Manage your trading groups, start a new one, or check your chats.</p>
      </div>

      {/* Create Group and My Chats Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 px-4 w-full max-w-3xl mx-auto">
        <Link href="/create-group" passHref className="w-full sm:w-auto">
          <button className="btn btn-primary btn-lg w-full sm:w-auto">+ Create a New Group</button>
        </Link>
        <Link href="/my-chats" passHref className="w-full sm:w-auto">
          <button className="btn btn-secondary btn-lg w-full sm:w-auto">View My Chats</button>
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

        {/* Groups Grid */}
        {filteredAndSortedGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedGroups
              .filter((group: GroupInfo) => group.name.toLowerCase() !== "cabal")
              .map((group: GroupInfo, idx: number) => (
                <div
                  key={group.id}
                  className="group bg-base-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-2 hover:border-white flex flex-col"
                >
                  <img
                    src={
                      idx === 1
                        ? "/pages/cat.png.png"
                        : idx === 2
                          ? "/pages/sloth.png.png"
                          : idx === filteredAndSortedGroups.length - 1
                            ? "/pages/dog.png"
                            : "/pages/dino.png.png"
                    }
                    alt={
                      idx === 1
                        ? "Cat"
                        : idx === 2
                          ? "Sloth"
                          : idx === filteredAndSortedGroups.length - 1
                            ? "Dog"
                            : "Dino"
                    }
                    className="w-full h-auto rounded-lg shadow object-contain mb-2"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold mb-0 transition-colors">
                      {idx === 0 ? "the 1 percent" : group.name}
                    </h2>
                    <div className="flex items-end gap-2 mb-2 mt-2">
                      <span className="text-xl font-bold" style={{ color: "#CA8C37" }}>
                        {formatNumber(group.joinPrice)} {group.currency}
                      </span>
                      <span className="text-sm text-white opacity-70 transform -translate-y-0.5">cost</span>
                    </div>
                    <p className="text-base opacity-80 mt-1 mb-4 line-clamp-2">
                      {idx === 0
                        ? `the 1 percent is for the experts that already know their way in trading, but want to have the best advice currently on the market. We give a high chance of good returns. Current average P&L: ${group.avgPnl}%.`
                        : idx === 1
                          ? "NFT traders is the go-to group for NFT enthusiasts looking to maximize their returns and stay ahead in the NFT market."
                          : idx === 2
                            ? "Sloth traders is a relaxed group for those who prefer slow and steady gains, focusing on long-term strategies and community support."
                            : idx === filteredAndSortedGroups.length - 1
                              ? "Dog traders is a fun and energetic group for those who love meme coins and high-risk, high-reward trading."
                              : group.description}
                    </p>

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

                    <div className="text-sm opacity-70 mb-6">
                      Last active: {["5 minutes ago", "3 seconds ago", "1 hour ago", "2 days ago"][idx % 4]}
                    </div>

                    <button
                      className="w-full btn btn-lg font-bold mt-4 transition-transform"
                      style={{ backgroundColor: "#C30000", color: "white", border: "none" }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = "#a80000")}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = "#C30000")}
                    >
                      Join chat
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl opacity-70">
              No groups found matching your criteria. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
