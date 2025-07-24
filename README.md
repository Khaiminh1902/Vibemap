# 🌍 VibeMap  
**Summer of Making 2025 Project**  
VibeMap is a real-time, global mood-sharing platform built on an interactive world map.

---

## 🧭 Overview

VibeMap lets users drop custom pins anywhere on the map to express their current **mood**, **message**, and **location**. It’s a way to visualize how people around the world are feeling and connect through shared experiences.

---

## 🚀 Features

- Interactive world map using Leaflet.js  
- Click to drop pins  
- Each pin includes:
  - Custom name  
  - Optional message  
  - Exact coordinates (latitude/longitude)  
- Pins are stored in a Convex backend and retrieved dynamically  
- Precise pin placement (tip aligns with clicked location)  
- Responsive and mobile-friendly UI  

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React, Next.js, Tailwind CSS        |
| Map Library | Leaflet.js (via react-leaflet)      |
| Backend     | Convex (serverless functions + DB)  |
| Language    | TypeScript                          |

---

## 🔍 How It Works

1. Click anywhere on the map to drop a pin  
2. A prompt appears to enter your name and an optional message  
3. The pin and its location are saved in the Convex backend  
4. Pins are retrieved and displayed to all users in real time  
5. The interface updates live as new pins are added  

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.
