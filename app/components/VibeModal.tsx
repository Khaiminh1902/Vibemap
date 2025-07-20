import React from "react";

interface VibeModalProps {
  show: boolean;
  name: string;
  message: string;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const VibeModal: React.FC<VibeModalProps> = ({
  show,
  name,
  message,
  onNameChange,
  onMessageChange,
  onSubmit,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create a Vibe</h2>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            placeholder="Who are you..."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg resize-none"
            rows={3}
            placeholder="Share something..."
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeModal;
