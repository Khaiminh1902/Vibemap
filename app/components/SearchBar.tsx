"use client";

import React, { useState } from "react";
import SearchModal from "./SearchModal";
import L from "leaflet";

interface Vibe {
  _id: string;
  name: string;
  message: string;
  lat: number;
  lng: number;
}

interface SearchBarProps {
  vibes: Vibe[] | undefined;
  mapRef: React.RefObject<L.Map | null>;
  popupRefs: React.MutableRefObject<Record<string, L.Popup>>;
  onHighlight: (id: string | null) => void;
}

export default function SearchBar({
  vibes,
  mapRef,
  popupRefs,
  onHighlight,
}: SearchBarProps) {
  const [showModal, setShowModal] = useState(false);
  const [matchedVibes, setMatchedVibes] = useState<Vibe[]>([]);
  const [isFinding, setIsFinding] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (
      e.currentTarget.elements.namedItem("location") as HTMLInputElement
    ).value.trim();
    if (!query || !vibes) return;

    setIsFinding(true);
    setTimeout(async () => {
      setIsFinding(false);

      const matched = vibes.filter((vibe) =>
        vibe.name.toLowerCase().includes(query.toLowerCase())
      );

      if (matched.length === 1) {
        focusVibe(matched[0]._id);
      } else if (matched.length > 1) {
        setMatchedVibes(matched);
        setShowModal(true);
      } else {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              query
            )}&format=json&limit=1`
          );
          const data = await res.json();
          if (data.length > 0 && mapRef.current) {
            const bounds = data[0].boundingbox;
            const latLngBounds = L.latLngBounds(
              [parseFloat(bounds[0]), parseFloat(bounds[2])],
              [parseFloat(bounds[1]), parseFloat(bounds[3])]
            );
            mapRef.current.flyToBounds(latLngBounds, {
              padding: [100, 100],
              duration: 2,
            });
          } else {
            alert("No location found.");
          }
        } catch (err) {
          console.error(err);
          alert("Geocoding failed.");
        }
      }
    }, 1500);
  };

  const focusVibe = (id: string) => {
    const vibe = vibes?.find((v) => v._id === id);
    if (!vibe || !mapRef.current) return;

    mapRef.current.flyTo([vibe.lat, vibe.lng], 13, { duration: 2 });
    setTimeout(() => {
      const popup = popupRefs.current[id];
      if (popup) popup.openOn(mapRef.current!);
    }, 800);

    onHighlight(id);
    setTimeout(() => onHighlight(null), 2000);
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          name="location"
          placeholder="Search place or vibe name..."
          className="px-3 py-2 rounded-xl bg-white text-sm shadow border border-gray-300 w-40 sm:w-56"
          disabled={isFinding}
        />
        <button
          type="submit"
          className={`px-3 py-2 text-white rounded-xl shadow cursor-pointer ${
            isFinding ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isFinding}
        >
          {isFinding ? "Finding..." : "Go"}
        </button>
      </form>

      {showModal && (
        <SearchModal
          matches={matchedVibes}
          onSelect={focusVibe}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
