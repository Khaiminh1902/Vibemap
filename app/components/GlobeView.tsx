import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";

interface Vibe {
  lat: number;
  lng: number;
  // add other properties if needed
}

interface GlobeViewProps {
  vibes: Vibe[];
}

export default function GlobeView({ vibes }: GlobeViewProps) {
  const globeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!globeRef.current) return;

    // Create the globe instance
    const globeInstance = new Globe(globeRef.current);

    // Set globe texture
    globeInstance
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )

      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png");

    // Add markers from vibes
    globeInstance.pointsData(
      vibes.map((vibe) => ({
        lat: vibe.lat,
        lng: vibe.lng,
        size: 0.5,
        color: "red",
      }))
    );
  }, [vibes]);

  return (
    <div
      ref={globeRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)} // just in case mouse leaves
      style={{
        width: "100%",
        height: "100vh",
        background: "black",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    />
  );
}
