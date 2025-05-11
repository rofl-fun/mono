"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Nodig voor lastActive

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface Chat {
  id: string;
  name: string;
  description?: string;
  type?: string;
  members?: number;
  avgPnl?: number;
  lastActive?: string;
}

const MyChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedChat) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: `Welcome to ${selectedChat.name}! This is the beginning of your conversation.`,
          sender: "other",
          timestamp: new Date(Date.now() - 100000),
        },
        {
          id: crypto.randomUUID(),
          text: "Hey there! Glad to be here.",
          sender: "user",
          timestamp: new Date(Date.now() - 50000),
        },
      ]);
      setNewMessage("");
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedChat) return;

    const messageToSend: Message = {
      id: crypto.randomUUID(),
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, messageToSend]);
    setNewMessage("");
  };

  const formatNumber = (num: number | undefined) => {
    // Aangepast voor undefined
    if (num === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  let chats: Chat[] = [
    {
      id: "lonely-bum-chat",
      name: "Web3 pumping fun.",
      description: "Chat focused on Web3 entrepreneurs.",
      type: "group",
      members: 10,
      avgPnl: 12.5,
      lastActive: new Date().toISOString(),
    },
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

  if (chats.length === 0) {
    chats = [
      {
        id: "default-chat-1",
        name: "Default Group A",
        description: "A default group description.",
        type: "group",
        members: 50,
        avgPnl: 5.0,
        lastActive: new Date().toISOString(),
      },
      {
        id: "default-chat-2",
        name: "Default Group B",
        description: "Another default group.",
        type: "private", // Voorbeeld van ander type
        members: 5,
        avgPnl: -2.3,
        lastActive: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 dag geleden
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
            {chats.map((chat, idx) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`group bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex flex-col ${selectedChat?.id === chat.id ? "ring-2 ring-white border-2 border-white" : ""} ${idx === 0 ? "mt-1" : ""}`}
              >
                <div className="p-4 flex flex-col flex-grow">
                  {/* Bovenste deel kaart: Naam en Type */}
                  <div className="mb-2">
                    <h2
                      className={`text-lg font-semibold mb-1 text-white ${selectedChat?.id === chat.id ? "text-primary" : ""} transition-colors line-clamp-2`}
                    >
                      {chat.name}
                    </h2>
                  </div>

                  {/* Beschrijving (indien aanwezig) */}
                  {chat.description && (
                    <p className="text-xs text-white opacity-70 line-clamp-2 flex-grow mb-2">{chat.description}</p>
                  )}

                  {/* Stats (Members & P&L) */}
                  {(chat.members !== undefined || chat.avgPnl !== undefined) && (
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
                </div>
              </div>
            ))}
            {chats.length === 0 && (
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
                <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-2">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg shadow-sm max-w-[80%] break-words ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-content ml-auto"
                          : "bg-base-100 mr-auto"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-2xs opacity-60 mt-1 text-right">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                     <p className="italic opacity-70 text-center mt-10">No messages yet. Send one to start the conversation!</p>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t border-base-300 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Message ${selectedChat.name}...`}
                    className="flex-grow p-3 rounded-lg bg-base-100 border border-base-300 focus:border-primary outline-none text-sm"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn btn-primary btn-md"
                    disabled={!newMessage.trim() || !selectedChat}
                  >
                    Send
                  </button>
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
