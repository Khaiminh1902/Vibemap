"use client";

import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const center: [number, number] = [20, 0];

export default function Map() {
  return (
    <MapContainer
      center={center}
      zoom={3}
      minZoom={3}
      maxZoom={11}
      style={{ height: "100vh", width: "100vw" }}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution=""
        noWrap={true}
      />
    </MapContainer>
  );
}
