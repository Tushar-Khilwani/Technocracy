# Technocracy — NIT Raipur Tech Portal

Official web portal for Technocracy, the technical committee of NIT Raipur, featuring a custom Doomsday Era design theme.

## 🏛️ Overview

This web app serves as the central hub for NIT Raipur's flagship technical events, built with a custom cyberpunk aesthetic, interactive physics, dynamic audio UI, and an embedded terminal CLI.

## ⚡ Flagship Events

* **Vigyaan**: National science and hardware model exhibition.
* **Ignite**: Intra-college techfest focused on logic, coding, and structural engineering.
* **Aavartan**: Central India's premier technical festival featuring Robo Wars, AI events, and reverse coding.

## 🚀 Highlights

* **3D Parallax & Card Physics**: Smooth, cursor-following 3D perspective animations running at 60fps.
* **Interactive HUD Cursor**: Custom reticle with interactive hover dynamic states.
* **Event Schedule**: Filterable timeline by day and category.
* **Doom Terminal**: Interactive CLI running custom commands directly in the browser.
* **Audio Synthesizer**: Web Audio API implementation generating sound effects without external audio files.

## 🛠️ Tech Stack

* **Core**: HTML5, CSS3, JavaScript (ES6+)
* **APIs Used**: Web Audio API, Canvas 2D, `requestAnimationFrame`
* **Fonts**: Orbitron, Cinzel, Space Grotesk, JetBrains Mono
* **Dependencies**: None (Zero external libraries)

## 📂 Project Structure

```text
├── assets/             # Image assets
├── index.html          # Main application file
├── styles.css          # Core design system and animations
├── app.js              # Physics, state logic, audio, and CLI engine
└── README.md           # Documentation