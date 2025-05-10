"use client";

import Head from "next/head";

const team = [
  {
    name: "0xjsi",
    role: "Hacker",
    img: "/team/member1.png",
  },
  {
    name: "Arjan",
    role: "Hacker",
    img: "/team/member2.png",
  },
  {
    name: "Pittycake",
    role: "Hacker",
    img: "/team/member3.png",
  },
  {
    name: "Madajo",
    role: "Hacker",
    img: "/team/member4.png",
  },
];

const AboutPage = () => {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">About Us</h1>
        <h2 className="text-2xl font-semibold mb-10 text-center text-white">Community-driven. Transparent. Fun.</h2>
        <p className="max-w-2xl text-lg text-center text-white opacity-80 mb-12">
          ROFL.FUN is a collective of hackers, builders, and dreamers. We believe in the power of open collaboration,
          transparency, and a little bit of fun. Our mission is to make trading and building on Web3 accessible, social,
          and rewarding for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-10 items-center justify-center w-full">
          {team.map(member => (
            <div key={member.name} className="flex flex-col items-center">
              <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-3" />
              <span
                className="text-2xl mb-1"
                style={{ color: "white", fontFamily: "League Gothic, Arial, sans-serif", letterSpacing: "1px" }}
              >
                {member.name}
              </span>
              <span className="text-base text-white opacity-80">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
