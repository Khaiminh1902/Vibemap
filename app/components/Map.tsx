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
import { Lightbulb, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SearchBar from "./SearchBar";
import Image from "next/image";
import ZoomModal from "./ZoomModal";
import dynamic from "next/dynamic";
import DraggableWrapper from "./DraggableWrapper";
import { Id } from "../../convex/_generated/dataModel";
import CommentList from "./CommentList";
import NewCommentForm from "./NewCommentForm";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

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

function getDeviceId() {
  const key = "vibe-device-id";
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function Map() {
  const [pinningMode, setPinningMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pinPosition, setPinPosition] = useState<L.LatLng | null>(null);
  const [vibeName, setVibeName] = useState("");
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [highlightedPinId, setHighlightedPinId] = useState<string | null>(null);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const [emojiDropdownForVibe, setEmojiDropdownForVibe] = useState<
    string | null
  >(null);
  const [customEmojisByVibe, setCustomEmojisByVibe] = useState<
    Record<string, string[]>
  >({});

  const addVibe = useMutation(api.vibes.addVibe);
  const toggleReaction = useMutation(api.reactions.toggleReaction);
  const addCustomEmoji = useMutation(api.vibes.addCustomEmoji);
  const addComment = useMutation(api.comments.addComment);

  const vibes = useQuery(api.vibes.getVibes);
  const allReactions = useQuery(api.reactions.getAllReactions) || [];
  const mapRef = useRef<L.Map>(null);
  const popupRefs = useRef<Record<string, L.Popup>>({});

  const handleMapClick = (latlng: L.LatLng) => {
    setPinPosition(latlng);
    setShowModal(true);
    setPinningMode(false);
  };

  const [mapTheme, setMapTheme] = useState<"voyager" | "light">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("map-theme") as "voyager" | "light") || "voyager"
      );
    }
    return "voyager";
  });

  const handleModalSubmit = async () => {
    if (pinPosition) {
      await addVibe({
        lat: pinPosition.lat,
        lng: pinPosition.lng,
        name: vibeName,
        message: message,
        mediaUrl: mediaUrl || undefined,
      });
    }

    setVibeName("");
    setMessage("");
    setMediaUrl("");
    setShowModal(false);
    setPinPosition(null);
  };

  const deviceId = getDeviceId();
  const staticEmojis = ["❤️", "👍", "😭", "😂", "😮"];

  const handleAddCustomEmoji = async (
    emoji: { native: string },
    vibeId: Id<"vibes">
  ) => {
    const selectedEmoji = emoji?.native;
    if (!selectedEmoji) return;

    const currentCustomEmojis = customEmojisByVibe[vibeId] || [];
    if (currentCustomEmojis.includes(selectedEmoji)) return;

    setCustomEmojisByVibe((prev) => ({
      ...prev,
      [vibeId]: [...currentCustomEmojis, selectedEmoji],
    }));

    await addCustomEmoji({
      vibeId,
      emoji: selectedEmoji,
    });

    setShowEmojiDropdown(false);
  };

  const switchMapTheme = () => {
    const nextTheme = mapTheme === "voyager" ? "light" : "voyager";
    setMapTheme(nextTheme);
    localStorage.setItem("map-theme", nextTheme);
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
        style={{ height: "100vh", width: "100vw" }}
        className="cursor-default"
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
          url={
            mapTheme === "light"
              ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          noWrap={true}
        />

        <ZoomControl position="topleft" />
        <MapClickHandler
          pinningMode={pinningMode}
          onMapClick={handleMapClick}
        />

        {vibes &&
          vibes.map((vibe) => {
            const vibeReactions = allReactions.filter(
              (r) => r.vibeId === vibe._id
            );
            const emojiOptions = [
              ...staticEmojis,
              ...(vibe.customEmojis ?? []),
            ];
            const reactionCounts = emojiOptions.reduce(
              (acc, emoji) => {
                acc[emoji] = vibeReactions.filter(
                  (r) => r.emoji === emoji
                ).length;
                return acc;
              },
              {} as Record<string, number>
            );

            const currentReaction = vibeReactions.find(
              (r) => r.deviceId === deviceId
            )?.emoji;

            return (
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
                  <div className="w-[321px] pt-3 rounded-md ">
                    <div className="max-h-[400px] overflow-y-auto pr-2 pl-1 space-y-2 text-sm">
                      <div>
                        <strong>{vibe.name}</strong>
                        <p>{vibe.message}</p>
                        {vibe.mediaUrl && (
                          <div className="mt-2">
                            {vibe.mediaUrl.includes("video") ? (
                              <video
                                src={vibe.mediaUrl}
                                controls
                                className="w-full rounded-md"
                              />
                            ) : (
                              <Image
                                src={vibe.mediaUrl}
                                alt="Uploaded"
                                width={400}
                                height={300}
                                className="w-full h-auto rounded-md cursor-zoom-in"
                                onClick={() =>
                                  vibe.mediaUrl &&
                                  setZoomImageUrl(vibe.mediaUrl)
                                }
                              />
                            )}
                          </div>
                        )}
                        <p className="text-gray-500">
                          {new Date(Number(vibe.createdAt)).toLocaleString()}
                        </p>
                      </div>

                      <div className="relative pt-2 flex flex-wrap gap-2">
                        {emojiOptions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() =>
                              toggleReaction({
                                vibeId: vibe._id,
                                emoji,
                                deviceId,
                              })
                            }
                            className={`relative flex items-center justify-center w-11 h-11 rounded-full text-2xl font-bold border-2 transition cursor-pointer
  ${
    currentReaction === emoji
      ? "border-blue-500 bg-blue-100 shadow-lg"
      : "border-gray-300 bg-white hover:bg-gray-100"
  }`}
                          >
                            <span>{emoji}</span>
                            {reactionCounts[emoji] > 0 && (
                              <span className="cursor-pointer absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">
                                {reactionCounts[emoji]}
                              </span>
                            )}
                          </button>
                        ))}

                        <div className="relative">
                          <button
                            onClick={() => {
                              setShowEmojiDropdown((prev) => !prev);
                              setEmojiDropdownForVibe(vibe._id);
                            }}
                            className="w-11 h-11 rounded-full border-2 border-dashed
                              border-gray-400 bg-white hover:bg-gray-100 text-gray-600
                             flex items-center justify-center text-xl cursor-pointer"
                            title="Add custom emoji"
                          >
                            <Plus />
                          </button>

                          {showEmojiDropdown &&
                            emojiDropdownForVibe === vibe._id && (
                              <DraggableWrapper>
                                <Picker
                                  onEmojiSelect={(emoji: { native: string }) =>
                                    handleAddCustomEmoji(emoji, vibe._id)
                                  }
                                  theme="light"
                                  previewPosition="none"
                                  skinTonePosition="none"
                                />
                              </DraggableWrapper>
                            )}
                        </div>
                      </div>

                      <CommentList vibeId={vibe._id} />
                      <NewCommentForm vibeId={vibe._id} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
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
      <button
        onClick={switchMapTheme}
        className="cursor-pointer fixed bottom-[90px] right-6 z-[1200] bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg transition"
      >
        Theme: {mapTheme.charAt(0).toUpperCase() + mapTheme.slice(1)}
      </button>

      <VibeModal
        show={showModal}
        name={vibeName}
        message={message}
        mediaUrl={mediaUrl}
        onNameChange={setVibeName}
        onMessageChange={setMessage}
        onMediaUrlChange={setMediaUrl}
        onSubmit={handleModalSubmit}
        onCancel={() => {
          setShowModal(false);
          setPinPosition(null);
          setMediaUrl("");
        }}
      />

      {zoomImageUrl && (
        <ZoomModal
          src={zoomImageUrl}
          alt="Zoomed"
          onClose={() => setZoomImageUrl(null)}
        />
      )}
    </div>
  );
}
