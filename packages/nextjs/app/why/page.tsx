"use client";

import Head from "next/head";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  CheckBadgeIcon,
  EyeIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const whyPoints = [
  {
    title: "Community First",
    desc: "We believe in the power of community-driven trading. Our platform brings together like-minded traders to share strategies, insights, and success stories.",
    icon: UserGroupIcon,
  },
  {
    title: "Transparency",
    desc: "Every trade, every strategy, and every group's performance is transparent. We believe in building trust through complete openness.",
    icon: EyeIcon,
  },
  {
    title: "Decentralized",
    desc: "Our platform is built on decentralized technology, ensuring no single point of failure and true ownership for users.",
    icon: GlobeAltIcon,
  },
  {
    title: "Authenticated",
    desc: "All users and actions are authenticated on-chain, providing security and trust for every interaction.",
    icon: CheckBadgeIcon,
  },
  {
    title: "Messaging",
    desc: "Enjoy seamless, real-time messaging with end-to-end encryption for all your trading discussions.",
    icon: ChatBubbleOvalLeftEllipsisIcon,
  },
];

const WhyPage = () => {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <div className="container mx-auto px-4 py-16">
          <h1
            className="text-5xl font-bold mb-8 text-white text-center"
            style={{ fontFamily: "Roboto", letterSpacing: "1px" }}
          >
            Why?
          </h1>
          <div className="w-full flex justify-center mb-12">
            <img
              src="/pages/richy.png"
              alt="Why Richy"
              width={500}
              height={256}
              className="w-full max-w-2xl rounded-lg shadow"
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl mb-6 text-center">
              Discover why our platform is the best place for collaborative, transparent, and fun trading.
            </p>
            <div className="space-y-8 mt-12">
              {whyPoints.map((point, idx) => {
                const Icon = point.icon;
                return (
                  <div
                    key={idx}
                    className="bg-base-100 p-6 rounded-xl shadow-lg flex flex-col border-2 border-white transition-all duration-200 hover:scale-[1.025] hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center mb-2 w-full">
                      <h2 className="text-2xl font-bold text-white flex-1" style={{ letterSpacing: "1px" }}>
                        {point.title}
                      </h2>
                      <Icon className="w-8 h-8 text-white ml-auto" />
                    </div>
                    <p className="opacity-80 text-white text-lg">{point.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyPage;
