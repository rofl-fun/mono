"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Nodig voor lastActive

interface Chat {
  id: string;
  name: string;
  isPlaceholder?: boolean;
  description?: string;
  type?: string;
  members?: number; // NIEUW
  avgPnl?: number; // NIEUW
  lastActive?: string; // NIEUW (datum als string, bijv. ISO)
}

const MyChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const formatNumber = (num: number | undefined) => {
    // Aangepast voor undefined
    if (num === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  let chats: Chat[] = [
    // Voeg hier eventueel echte chats toe met de nieuwe velden
  ];

  if (chats.length === 0) {
    chats = [
      {
        id: "lonely-bum-chat",
        name: "Only for entrepreneurs in Web3.",
        description: "This is a placeholder chat. It doesn\'t have real members or P&L.",
        type: "placeholder",
        isPlaceholder: true,
        members: 0, // Placeholder
        avgPnl: 0, // Placeholder
        lastActive: new Date().toISOString(), // Placeholder (nu)
      },
      // Voorbeeld van een tweede kaart voor testdoeleinden van de layout
      {
        id: "another-chat",
        name: "Women Finance",
        description: "Chat focused on finance for women.",
        type: "group",
        members: 123,
        avgPnl: 25.5,
        lastActive: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dagen geleden
      },
    ];
  }

  const handleChatSelect = (chat: Chat) => {
    if (selectedChat && selectedChat.id === chat.id) {
      setSelectedChat(null);
    } else {
      setSelectedChat(chat);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-4">
      <div className="w-full max-w-7xl mx-auto bg-base-100 p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">My Chats</h1>
          <Link href="/" passHref>
            <button className="btn btn-outline btn-sm hover:bg-primary hover:text-primary-content">
              &larr; Back to Home
            </button>
          </Link>
        </div>

        <p className="text-lg text-center text-white opacity-80 mb-12">
          Here are your active chat groups. Join the conversation and stay updated with the latest insights.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel: Chat List */}
          <div className="md:w-1/3 lg:w-1/4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`group bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex flex-col ${selectedChat?.id === chat.id ? "ring-2 ring-white border-2 border-white" : ""}`}
              >
                <div className="p-4 flex flex-col flex-grow">
                  {/* Bovenste deel kaart: Naam en Type */}
                  <div className="mb-2">
                    <h2
                      className={`text-lg font-semibold mb-1 text-white ${selectedChat?.id === chat.id ? "text-primary" : ""} transition-colors line-clamp-2`}
                    >
                      {chat.name}
                    </h2>
                    {chat.type && (
                      <span
                        className={`inline-block self-start px-2 py-0.5 text-xs rounded-full font-semibold ${
                          chat.isPlaceholder
                            ? "bg-neutral/20 text-neutral-content"
                            : chat.type === "group"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-accent/20 text-accent"
                        }`}
                      >
                        {chat.type.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Beschrijving (indien aanwezig) */}
                  {chat.description && (
                    <p className="text-xs text-white opacity-70 line-clamp-2 flex-grow mb-2">{chat.description}</p>
                  )}

                  {/* Stats (Members & P&L) */}
                  {!chat.isPlaceholder && (chat.members !== undefined || chat.avgPnl !== undefined) && (
                    <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                      <div className="bg-base-100 rounded p-1.5 text-center">
                        <div className="opacity-70 mb-0.5">Members</div>
                        <div className="font-bold">{chat.members ?? "N/A"}</div>
                      </div>
                      <div className="bg-base-100 rounded p-1.5 text-center">
                        <div className="opacity-70 mb-0.5">Avg P&L</div>
                        <div
                          className={`font-bold ${chat.avgPnl !== undefined && chat.avgPnl >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {chat.avgPnl !== undefined
                            ? `${chat.avgPnl >= 0 ? "+" : ""}${formatNumber(chat.avgPnl)}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Active */}
                  {chat.lastActive && (
                    <div className="text-2xs opacity-60 mt-auto pt-1 text-center">
                      Last active: {formatDistanceToNow(new Date(chat.lastActive), { addSuffix: true })}
                    </div>
                  )}
                  {/* Placeholder specific text - if needed and not covered by description */}
                  {/* {chat.isPlaceholder && (
                    <span className="mt-1 text-2xs text-primary opacity-60">(Placeholder Chat)</span>
                  )} */}
                </div>
              </div>
            ))}
            {chats.length === 0 && !chats.some(c => c.isPlaceholder) && (
              <p className="text-center opacity-60 py-10">No chats yet. Start a new conversation!</p>
            )}
          </div>

          {/* Right Panel: Selected Chat View */}
          <div className="md:w-2/3 lg:w-3/4 bg-base-200 rounded-xl shadow-inner p-6 h-[calc(100vh-200px)] flex flex-col">
            {selectedChat ? (
              <div className="flex flex-col h-full">
                <div className="mb-4 pb-4 border-b border-base-300">
                  <h2 className="text-2xl font-bold text-primary">{selectedChat.name}</h2>
                  {selectedChat.type && (
                    <span className="text-xs opacity-60">Type: {selectedChat.type.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-grow overflow-y-auto mb-4">
                  <p className="italic opacity-70">This is where messages for {selectedChat.name} would appear.</p>
                  {selectedChat.isPlaceholder && (
                    <p className="mt-4 text-sm">
                      Since this is a placeholder, there are no real messages. But imagine a lively conversation
                      here!
                    </p>
                  )}
                  <div className="mt-5 space-y-3">
                    <div className="p-3 bg-base-100 rounded-lg shadow-sm max-w-md self-start">
                      Hello there! (Dummy message)
                    </div>
                    <div className="p-3 bg-primary text-primary-content rounded-lg shadow-sm max-w-md ml-auto self-end">
                      Hi! How are you? (Dummy message from you)
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-base-300">
                  <input
                    type="text"
                    placeholder={`Message ${selectedChat.name}...`}
                    className="w-full p-3 rounded-lg bg-base-100 border border-base-300 focus:border-primary outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-base-content opacity-20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-xl opacity-50">Select a chat to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChatsPage;
