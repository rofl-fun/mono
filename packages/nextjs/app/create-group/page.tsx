"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from 'wagmi';
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreateGroupPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const { writeContractAsync: createChatCollection } = useScaffoldWriteContract({
    contractName: "ChatAccessNFT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    // setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: address,
          name: title,
          description: description,
          image_url: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const result = await response.json();
      console.log('Group created:', result);

      // Create NFT collection for the chat
      try {
        const priceInWei = BigInt(parseFloat(price) * 1e18); // Convert ROSE to wei
        const tx = await createChatCollection({
          functionName: "createChatCollection",
          args: [priceInWei, result.uuid],
        });

        console.log('NFT collection created:', tx);
      } catch (nftError) {
        console.error('Error creating NFT collection:', nftError);
        setError('Group created but failed to create NFT collection. Please try again.');
        return;
      }

      // Clear form
      setTitle('');
      setDescription('');
      setPrice('');

      // Redirect to groups page or show success message
      window.location.href = '/';
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-base-100 p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-start mb-8">
          <Link href="/" passHref>
            <button className="btn btn-sm hover:bg-primary hover:text-primary-content">&larr; Back to Home</button>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Create a New Group</h1>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-base-content mb-1">
              Group Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Give your group a catchy title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-base-content mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Describe the purpose and rules of your group"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-base-content mb-1">
              Price in ROSE
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Enter the price in ROSE"
            />
          </div>

          <div>
            <button type="submit" className="w-full btn btn-primary btn-lg hover:scale-[1.02] transition-transform">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;
