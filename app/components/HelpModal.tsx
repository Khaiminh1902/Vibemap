/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

interface SuggestionModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit?: (name: string, suggestion: string) => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!;

  if (!show) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !suggestion.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          suggestion: suggestion.trim(),
        }),
      });

      if (response.ok) {
        alert("Thanks for your suggestion!");
        setName("");
        setSuggestion("");
        onSubmit?.(name.trim(), suggestion.trim());
        onClose();
      } else {
        alert("Failed to send. Please try again.");
      }
    } catch (err) {
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-[90%]">
        <h2 className="text-xl font-bold mb-4">Suggest an Improvement</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Your Suggestion</label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={4}
            placeholder="What would you like to see improved?"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg resize-none"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
