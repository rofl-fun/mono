"use client";

import Head from "next/head";
import Image from "next/image";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  UserGroupIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    number: 1,
    title: "Browse Chat",
    desc: "Explore all available chats and find the one that fits your interests.",
    icon: MagnifyingGlassIcon,
  },
  {
    number: 2,
    title: "Connect Wallet",
    desc: "Connect your Web3 wallet to unlock all features and join the community.",
    icon: WalletIcon,
  },
  {
    number: 3,
    title: "Join Chat",
    desc: "Buy in or join a chat to access exclusive discussions and strategies.",
    icon: UserGroupIcon,
  },
  {
    number: 4,
    title: "Start Chatting",
    desc: "Engage with other traders, share insights, and learn together in real time.",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    number: 5,
    title: "Get Rich",
    desc: "Leverage the power of community and smart trading to maximize your gains!",
    icon: TrophyIcon,
  },
];

const HowPage = () => {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <div className="container mx-auto px-4 py-16">
          <h1
            className="text-5xl font-bold mb-8 text-white text-center"
            style={{ fontFamily: "League Gothic, Arial, sans-serif", letterSpacing: "1px" }}
          >
            How It Works
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl mb-6">
              Getting started with ROFL.FUN is simple. Here's how you can join the community and start trading.
            </p>
            <div className="space-y-8 mt-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="bg-base-100 p-6 rounded-xl shadow-lg flex flex-col border-2 border-white transition-all duration-200 hover:scale-[1.025] hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 w-full">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4 sm:mb-0">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2 text-white" style={{ letterSpacing: "1px" }}>
                          {step.title}
                        </h2>
                        <p className="opacity-80 text-white text-lg">{step.desc}</p>
                      </div>
                      <Icon className="w-12 h-12 text-white ml-0 sm:ml-8 mt-4 sm:mt-0 flex-shrink-0" />
                    </div>
                    {idx === 0 && (
                      <div className="w-full flex justify-center mt-6">
                        <Image
                          src="/pages/browsechats.png"
                          alt="Smart Investing Web3 Example"
                          width={500}
                          height={256}
                          className="w-full max-w-2xl rounded-lg shadow"
                        />
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="w-full flex justify-center mt-6">
                        <Image
                          src="/pages/wallet.png"
                          alt="Connect Wallet Example"
                          width={250}
                          height={128}
                          className="w-full max-w-xs rounded-lg shadow"
                        />
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="w-full flex justify-center mt-6">
                        <Image
                          src="/pages/join.png"
                          alt="Join Chat Example"
                          width={500}
                          height={256}
                          className="w-full max-w-2xl rounded-lg shadow"
                        />
                      </div>
                    )}
                    {idx === 3 && (
                      <div className="w-full flex justify-center mt-6">
                        <Image
                          src="/pages/chat.png"
                          alt="Start Chatting Example"
                          width={500}
                          height={256}
                          className="w-full max-w-2xl rounded-lg shadow"
                        />
                      </div>
                    )}
                    {idx === 4 && (
                      <div className="w-full flex justify-center mt-6">
                        <Image
                          src="/pages/richy.png"
                          alt="Get Rich Logo"
                          width={500}
                          height={256}
                          className="w-full max-w-2xl rounded-lg shadow"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <h2
              className="text-3xl font-bold mb-4 text-white text-center"
              style={{ fontFamily: "League Gothic, Arial, sans-serif", letterSpacing: "1px" }}
            >
              Ready to start your own group?
            </h2>
            <p className="text-lg text-center opacity-80 mb-6 max-w-xl">
              Bring your friends, share your strategy, and build your own trading community. Creating a group is easy
              and only takes a few clicks!
            </p>
            <div className="relative flex justify-center items-center h-20 mt-2 select-none" style={{ height: "64px" }}>
              <div
                id="group-btn-shadow"
                className="absolute left-1/2 top-2 -translate-x-1/2 w-full max-w-xs h-14 rounded-full bg-[#1a1a1a] z-0 transition-all duration-150"
                style={{ opacity: 1 }}
              ></div>
              <button
                className="btn px-16 py-2 text-lg font-bold rounded-full w-full max-w-xs z-10 transition-all duration-150 whitespace-nowrap text-center min-w-[180px]"
                style={{
                  backgroundColor: "#C30000",
                  color: "white",
                  border: "none",
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: "translateX(-50%)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onMouseDown={e => {
                  e.currentTarget.style.top = "16px";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "0";
                }}
                onMouseUp={e => {
                  e.currentTarget.style.top = "0";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "1";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.top = "0";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "1";
                }}
                onTouchStart={e => {
                  e.currentTarget.style.top = "16px";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "0";
                }}
                onTouchEnd={e => {
                  e.currentTarget.style.top = "0";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "1";
                }}
                onFocus={e => {
                  e.currentTarget.style.top = "0";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "1";
                }}
                onBlur={e => {
                  e.currentTarget.style.top = "0";
                  const shadow = document.getElementById("group-btn-shadow");
                  if (shadow) shadow.style.opacity = "1";
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#a80000")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#C30000")}
              >
                + Create a Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowPage;
