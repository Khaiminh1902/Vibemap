"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

export default function NewCommentForm({ vibeId }: { vibeId: Id<"vibes"> }) {
  const addComment = useMutation(api.comments.addComment);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setIsPosting(true);
    await addComment({ vibeId, name, text });
    setTimeout(() => {
      setIsPosting(false);
      setName("");
      setText("");
    }, 1000);
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPosting}
        />
        <textarea
          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 resize-y min-h-[120px]"
          placeholder="Your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          disabled={isPosting}
        />
        <button
          type="submit"
          className={`cursor-pointer px-6 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm ${
            isPosting
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isPosting}
        >
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
