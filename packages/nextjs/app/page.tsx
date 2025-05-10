"use client";

import { useState } from "react";
import groupsData from "./data/items.json";
import { formatDistanceToNow } from "date-fns";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

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
  const { address: connectedAddress } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"members" | "pnl" | "price">("members");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const filteredGroups = groupsData.groups
    .filter(
      (group: GroupInfo) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a: GroupInfo, b: GroupInfo) => {
      switch (sortBy) {
        case "members":
          return b.members - a.members;
        case "pnl":
          return b.avgPnl - a.avgPnl;
        case "price":
          return a.joinPrice - b.joinPrice;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* Hero Section */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ROFL.FUN Groups
            </h1>
            <p className="text-xl opacity-80 mb-8">
              Join exclusive trading groups and share strategies with like-minded traders
            </p>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <span className="text-sm opacity-70">Connected:</span>
              <Address address={connectedAddress} />
            </div>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full px-4 py-3 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Sort Controls */}
        <div className="flex justify-end mb-8">
          <div className="flex space-x-2 bg-base-100 p-1 rounded-lg">
            <button
              onClick={() => setSortBy("members")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                sortBy === "members" ? "bg-primary text-primary-content" : "hover:bg-base-200"
              }`}
            >
              Most Members
            </button>
            <button
              onClick={() => setSortBy("pnl")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                sortBy === "pnl" ? "bg-primary text-primary-content" : "hover:bg-base-200"
              }`}
            >
              Best P&L
            </button>
            <button
              onClick={() => setSortBy("price")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                sortBy === "price" ? "bg-primary text-primary-content" : "hover:bg-base-200"
              }`}
            >
              Lowest Price
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGroups.map((group: GroupInfo) => (
            <div
              key={group.id}
              className="group bg-base-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{group.name}</h2>
                    <span
                      className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                        group.type === "alpha" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {group.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {formatNumber(group.joinPrice)} {group.currency}
                    </div>
                    <div className="text-sm opacity-70">to join</div>
                  </div>
                </div>

                <p className="text-base opacity-80 mb-6 line-clamp-2">{group.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-base-200 rounded-lg p-3">
                    <div className="text-sm opacity-70 mb-1">Members</div>
                    <div className="font-bold text-lg">{group.members}</div>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3">
                    <div className="text-sm opacity-70 mb-1">Avg P&L</div>
                    <div className={`font-bold text-lg ${group.avgPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {group.avgPnl >= 0 ? "+" : ""}
                      {formatNumber(group.avgPnl)}%
                    </div>
                  </div>
                </div>

                <div className="text-sm opacity-70 mb-6">
                  Last active: {formatDistanceToNow(new Date(group.lastActive), { addSuffix: true })}
                </div>

                <button className="w-full btn btn-primary btn-lg hover:scale-[1.02] transition-transform">
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
