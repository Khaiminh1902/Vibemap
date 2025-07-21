// components/DraggableWrapper.tsx
"use client";

import React, { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function DraggableWrapper({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  });

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
      }}
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
}
