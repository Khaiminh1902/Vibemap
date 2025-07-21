"use client";

import React from "react";

interface SearchModalProps {
  matches: {
    _id: string;
    name: string;
    message: string;
    lat: number;
    lng: number;
  }[];
  onSelect: (vibeId: string) => void;
  onClose: () => void;
}

export default function SearchModal({
  matches,
  onSelect,
  onClose,
}: SearchModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[1300] flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
        <h2 className="text-lg font-bold">Multiple Vibes Found</h2>
        <p className="text-sm text-gray-600">Select one to focus on the map:</p>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {matches.map((vibe) => (
            <li
              key={vibe._id}
              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => onSelect(vibe._id)}
            >
              <strong>{vibe.name}</strong>
              <p className="text-sm text-gray-500">{vibe.message}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
