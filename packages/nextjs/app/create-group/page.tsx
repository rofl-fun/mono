"use client";

import { useState } from 'react';
import Link from 'next/link';

const CreateGroupPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New group created:', { title, description });
    alert(`Group '${title}' created (see console for details)!`);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-base-100 p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Create a New Group</h1>
          <Link href="/" passHref>
            <button className="btn btn-outline btn-sm hover:bg-primary hover:text-primary-content">
              &larr; Back to Home
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-base-content mb-1">
              Group Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Describe the purpose and rules of your group"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn btn-primary btn-lg hover:scale-[1.02] transition-transform"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;
