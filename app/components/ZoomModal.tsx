// components/ZoomModal.tsx
import React from "react";
import Image from "next/image";

export default function ZoomModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full w-full">
        <Image
          src={src}
          alt={alt}
          layout="responsive"
          width={1000}
          height={800}
          className="rounded-lg"
        />
        <button
          className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
