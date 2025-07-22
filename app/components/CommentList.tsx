"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function CommentList({ vibeId }: { vibeId: Id<"vibes"> }) {
  const comments = useQuery(api.comments.getComments, { vibeId });

  if (!comments)
    return (
      <p className="text-sm text-gray-500 text-center mt-8 animate-pulse">
        Loading comments...
      </p>
    );
  if (comments.length === 0)
    return (
      <p className="text-sm text-gray-500 text-center mt-8">No comments yet.</p>
    );

  return (
    <ul className="space-y-4 mt-8 max-w-2xl mx-auto">
      {comments.map((c) => (
        <li
          key={c._id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
        >
          <div className="flex justify-between items-baseline">
            <div className="font-semibold text-gray-800 text-base">
              {c.name}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="mt-2 text-gray-600 text-sm leading-relaxed">
            {c.text}
          </div>
        </li>
      ))}
    </ul>
  );
}
