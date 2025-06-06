"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import groupsData from "./data/items.json";

// import { Address } from "~~/components/scaffold-eth"; // Alleen als je het adres hier wilt tonen

interface Chat {
  chat_id: string;
  name: string;
  description: string;
  last_msg_at: number;
  amount_of_members: number;
  sender?: string;
  message?: string;
}

interface PlaceholderChat {
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
  const { isConnected, address } = useAccount(); // address hier ophalen
  const [sortBy, setSortBy] = useState<"members" | "pnl" | "price">("members");
  const [chatIds, setChatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gebruik de data uit items.json als basis voor de placeholder items
  const [placeholderItems, setPlaceholderItems] = useState<PlaceholderChat[]>(groupsData.groups);

  useEffect(() => {
    const fetchChatIds = async () => {
      setLoading(true); // Zet loading true aan het begin van de fetch
      try {
        const response = await fetch('/api/v1/chats'); // Zorg dat dit endpoint bestaat en de juiste data teruggeeft
        // if (!response.ok) throw new Error('Failed to fetch chat IDs');

        const data = await response.json();
        // Aanname: data.chats is een array van chat IDs of volledige chat objecten
        // Voor nu zetten we chatIds, maar dit wordt niet direct gebruikt om placeholderItems te vullen
        if (data.chats) { // Aangepast naar data.chats gebaseerd op main.py endpoint
          setChatIds(data.chats || []);
        } else {
          // Fallback als de structuur anders is, of als je de placeholderItems direct wilt zetten
          // setError(data.message || 'Failed to process chat data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chat IDs');
        console.error('Error fetching chat IDs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatIds();
  }, []);

  const handleJoinChat = async (chatId: string) => {
    if (!address) { // Gebruik address
      setError('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/v1/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: address, // Gebruik address
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to join chat');
      }

      const data = await response.json();
      if (data.status === "success" || response.ok) { // Controleer ook op response.ok
        window.location.href = '/my-chats';
      } else {
        setError(data.message || data.detail || 'Failed to join chat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join chat');
      console.error('Error joining chat:', err);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleProtectedLinkClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isConnected) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Hernoemd van filteredAndSortedGroups en gebruikt placeholderItems state
  const filteredAndSortedChats = useMemo(() => {
    return [...placeholderItems].sort((a: PlaceholderChat, b: PlaceholderChat) => {
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
  }, [placeholderItems, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4">
      {/* Page Title */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold mb-4 text-white">Welcome to ROFL.DAM</h1>
        <p className="text-xl opacity-80">Manage your trading groups, start a new one, or check your chats.</p>
      </div>

      {/* Create Group and My Chats Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 px-4 w-full max-w-3xl mx-auto">
        <div
          className={`tooltip tooltip-bottom w-full sm:w-auto ${!isConnected ? "tooltip-error" : ""}`}
          data-tip={!isConnected ? "Please connect your wallet first!" : undefined}
          onClick={handleProtectedLinkClick}
        >
          <Link
            href={isConnected ? "/create-group" : "#"}
            passHref
            className={`w-full sm:w-auto ${!isConnected ? "cursor-not-allowed pointer-events-none" : ""}`}
            aria-disabled={!isConnected}
            tabIndex={!isConnected ? -1 : undefined}
          >
            <button
              className={`btn btn-primary btn-lg w-full sm:w-auto ${!isConnected ? "btn-disabled" : ""}`}
              disabled={!isConnected}
            >
              + Create a New Group
            </button>
          </Link>
        </div>
        <div
          className={`tooltip tooltip-bottom w-full sm:w-auto ${!isConnected ? "tooltip-error" : ""}`}
          data-tip={!isConnected ? "Please connect your wallet first!" : undefined}
          onClick={handleProtectedLinkClick}
        >
          <Link
            href={isConnected ? "/my-chats" : "#"}
            passHref
            className={`w-full sm:w-auto ${!isConnected ? "cursor-not-allowed pointer-events-none" : ""}`}
            aria-disabled={!isConnected}
            tabIndex={!isConnected ? -1 : undefined}
          >
            <button
              className={`btn btn-secondary btn-lg w-full sm:w-auto ${!isConnected ? "btn-disabled" : ""}`}
              disabled={!isConnected}
            >
              View My Chats
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4 max-w-3xl mx-auto">
          <span>{error}</span>
        </div>
      )}

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

        {/* Chats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl opacity-70">Loading chats...</p>
          </div>
        ) : filteredAndSortedChats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedChats.map((item: PlaceholderChat, idx: number) => (
              <div
                key={item.id.toString()}
                className="group bg-base-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-2 hover:border-white flex flex-col"
              >
                <img
                  src={
                    idx === 1
                      ? "/pages/cat.png.png"
                      : idx === 2
                        ? "/pages/sloth.png.png"
                        : idx === filteredAndSortedChats.length - 1
                          ? "/pages/dog.png"
                          : "/pages/dino.png.png"
                  }
                  alt={
                    idx === 1
                      ? "Cat"
                      : idx === 2
                        ? "Sloth"
                        : idx === filteredAndSortedChats.length - 1
                          ? "Dog"
                          : "Dino"
                  }
                  className="w-full h-auto rounded-lg shadow object-contain mb-2"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-0 transition-colors">{item.name}</h2>
                  <div className="flex items-end gap-2 mb-2 mt-2">
                    <span className="text-xl font-bold" style={{ color: "#CA8C37" }}>
                      {formatNumber(item.joinPrice)} {item.currency}
                    </span>
                    <span className="text-sm text-white opacity-70 transform -translate-y-0.5">cost</span>
                  </div>
                  <p className="text-base opacity-80 mt-1 mb-4 line-clamp-2">{item.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-base-200 rounded-lg p-3 text-center">
                      <div className="text-xs opacity-70 mb-1">Members</div>
                      <div className="font-bold text-md">{item.members}</div>
                    </div>
                    <div className="bg-base-200 rounded-lg p-3 text-center">
                      <div className="text-xs opacity-70 mb-1">Avg P&L</div>
                      <div className={`font-bold text-md ${item.avgPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.avgPnl >= 0 ? "+" : ""}
                        {formatNumber(item.avgPnl)}%
                      </div>
                    </div>
                  </div>

                  <div className="text-sm opacity-70 mb-6">
                    Last active: {item.lastActive}
                  </div>

                  <button
                    onClick={() => handleJoinChat(item.id.toString())}
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
              No chats found. Create a new group or join an existing one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;