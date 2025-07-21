import Image from "next/image";
import React, { useState } from "react";

interface VibeModalProps {
  show: boolean;
  name: string;
  message: string;
  mediaUrl: string;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onMediaUrlChange: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const VibeModal: React.FC<VibeModalProps> = ({
  show,
  name,
  message,
  mediaUrl,
  onNameChange,
  onMessageChange,
  onMediaUrlChange,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!show) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      onMediaUrlChange(response.secure_url);
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.onerror = () => {
      alert("Upload failed.");
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

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
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg resize-none"
            rows={3}
            placeholder="Share something..."
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Image/Video (optional)
          </label>

          <label
            className={`inline-block px-4 py-2 rounded-lg border bg-white text-sm font-medium cursor-pointer
      ${
        isUploading || isSubmitting
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 border-gray-300"
      }
    `}
          >
            {isUploading ? "Uploading..." : "Choose File"}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isSubmitting || isUploading}
              className="hidden"
            />
          </label>

          {isUploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-200 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {mediaUrl && !isUploading && (
            <div className="mt-2 rounded-lg overflow-hidden">
              {mediaUrl.includes("video") ? (
                <video src={mediaUrl} controls className="w-full rounded-md" />
              ) : (
                <Image
                  src={mediaUrl}
                  alt="Uploaded"
                  width={400}
                  height={300}
                  className="w-full rounded-md"
                  unoptimized
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeModal;
