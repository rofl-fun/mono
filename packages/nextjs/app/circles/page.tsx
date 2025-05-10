"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { useCircles } from "../context/CirclesContext";
import Link from "next/link";

export default function CirclesPage() {
  const { address: connectedAddress } = useAccount();
  const { sdk, isLoading: sdkLoading } = useCircles();

  if (sdkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log("sdk:", sdk);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full space-y-4">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Circles</h1>

        <div className="grid gap-4">
          <Link
            href="/circles/onboarding"
            className="btn btn-primary w-full text-lg"
          >
            Go to Onboarding
          </Link>

          <div className="divider">Groups</div>

          <Link
            href="/circles/groups"
            className="btn btn-secondary w-full text-lg"
          >
            My Groups
          </Link>

          <Link
            href="/circles/groups/discover"
            className="btn btn-secondary w-full text-lg"
          >
            Discover Groups
          </Link>

          <Link
            href="/circles/groups/join"
            className="btn btn-secondary w-full text-lg"
          >
            Join Group by Address
          </Link>

          <Link
            href="/circles/groups/create"
            className="btn btn-secondary w-full text-lg"
          >
            Create New Group
          </Link>
        </div>

        {connectedAddress && (
          <div className="text-center mt-4">
            <p>Connected Address:</p>
            <code className="text-sm bg-base-300 px-2 py-1 rounded">{connectedAddress}</code>
          </div>
        )}
      </div>
    </div>
  );
}