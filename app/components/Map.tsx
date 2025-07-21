/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvent,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VibeModal from "./VibeModal";
import HelpModal from "./HelpModal";
import { Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SearchBar from "./SearchBar";

const center: [number, number] = [20, 0];

function MapClickHandler({
  pinningMode,
  onMapClick,
}: {
  pinningMode: boolean;
  onMapClick: (latlng: L.LatLng) => void;
}) {
  useMapEvent("click", (e) => {
    if (pinningMode) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function Map() {
  const [pinningMode, setPinningMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pinPosition, setPinPosition] = useState<L.LatLng | null>(null);
  const [vibeName, setVibeName] = useState("");
  const [message, setMessage] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [highlightedPinId, setHighlightedPinId] = useState<string | null>(null);

  const addVibe = useMutation(api.vibes.addVibe);
  const vibes = useQuery(api.vibes.getVibes);

  const mapRef = useRef<L.Map>(null);
  const popupRefs = useRef<Record<string, L.Popup>>({});

  const handleMapClick = (latlng: L.LatLng) => {
    setPinPosition(latlng);
    setShowModal(true);
    setPinningMode(false);
  };

  const handleModalSubmit = async () => {
    if (pinPosition) {
      await addVibe({
        lat: pinPosition.lat,
        lng: pinPosition.lng,
        name: vibeName,
        message: message,
      });
    }

    setVibeName("");
    setMessage("");
    setShowModal(false);
    setPinPosition(null);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {pinningMode && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] bg-black/60 px-6 py-2 rounded-xl shadow-lg max-w-[90%] w-fit overflow-hidden"
          >
            <div className="w-[300px] sm:w-[400px] overflow-hidden">
              <p className="marquee-text text-white whitespace-nowrap font-semibold text-sm sm:text-base">
                🎯 You are in &apos;Create a Vibe&apos; mode. Click on the map
                to drop your vibe pin!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer
        center={center}
        zoom={3}
        minZoom={3}
        maxZoom={12}
        style={{
          height: "100vh",
          width: "100vw",
          cursor: pinningMode ? "url('/pin-cursor.png'), pointer" : "auto",
        }}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        zoomControl={false}
        ref={mapRef}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution=""
          noWrap={true}
        />
        <ZoomControl position="topleft" />
        <MapClickHandler
          pinningMode={pinningMode}
          onMapClick={handleMapClick}
        />

        {vibes &&
          vibes.map((vibe) => (
            <Marker
              key={vibe._id}
              position={[vibe.lat, vibe.lng]}
              icon={L.icon({
                iconUrl: "/pin-cursor.png",
                iconSize: [20, 20],
                iconAnchor: [10, 20],
              })}
            >
              <Popup
                ref={(ref) => {
                  if (ref) popupRefs.current[vibe._id] = ref;
                }}
              >
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>{vibe.name}</strong>
                    <p>{vibe.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(vibe.createdAt)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <SearchBar
          vibes={vibes}
          mapRef={mapRef}
          popupRefs={popupRefs}
          onHighlight={setHighlightedPinId}
        />

        <button
          onClick={() => setPinningMode(!pinningMode)}
          className={`px-4 py-2 rounded-xl text-white font-semibold shadow-lg transition cursor-pointer ${
            pinningMode
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {pinningMode ? "Cancel" : "Create a Vibe"}
        </button>
      </div>

      <button
        onClick={() => setShowHelpModal(true)}
        className="cursor-pointer fixed bottom-6 right-6 z-[1200] bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition flex items-center space-x-2"
      >
        <Lightbulb size={20} />
        <span className="hidden sm:inline">Suggest</span>
      </button>

      <HelpModal show={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <VibeModal
        show={showModal}
        name={vibeName}
        message={message}
        onNameChange={setVibeName}
        onMessageChange={setMessage}
        onSubmit={handleModalSubmit}
        onCancel={() => {
          setShowModal(false);
          setPinPosition(null);
        }}
      />
    </div>
  );
}
