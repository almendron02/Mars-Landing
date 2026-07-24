<div align="center">

# 🚀 Mars Landing

### Build civilization from four elements—and reach Mars.

A cozy, mobile-first alchemy game where every discovery moves humanity from nature and early life to science, industry, space travel, and a successful landing on Mars.

[**Play the Game**](https://marslandin.netlify.app)

![React](https://img.shields.io/badge/React-19-20232A?logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss\&logoColor=white)

</div>

## About the Game

**Mars Landing** turns the familiar element-combination mechanic into a focused game with a clear beginning, progression system, and ending.

Players begin with **Air, Earth, Fire, and Water**. By combining discovered elements, they create life, build communities, develop science and technology, launch a space mission, and ultimately land on Mars.

The game is designed for a short, satisfying play session rather than an endless sandbox. A guided progression path keeps the objective understandable, while optional discoveries and achievements reward experimentation.

## How to Play

1. Choose two elements from your discovered collection.
2. Combine them to test a possible recipe.
3. Use successful discoveries to unlock increasingly advanced elements.
4. Progress through six eras: **Nature, Life, Human, Civilization, Industry, and Space**.
5. Create a **Mars Landing** to complete the main objective.

The interface also provides contextual hints and a record of discovered recipes without removing the challenge of experimentation.

## Game Features

* **Purposeful progression** from basic natural elements to interplanetary exploration
* **Dozens of discoverable elements** organized across six historical eras
* **Achievement system** with milestone, completionist, and speedrun challenges
* **Persistent browser saves** for discoveries, achievements, settings, and elapsed time
* **Resume and restart flows** for managing an existing match
* **Game timer** that automatically pauses while the menu is open
* **Search and era filters** for navigating the growing element collection
* **Hints, recipes, inventory, and awards** available through compact in-game drawers
* **Procedurally generated music and sound effects** with independent controls
* **Responsive, mobile-first interface** designed for touch and desktop input
* **Animated feedback** for combinations, discoveries, achievements, and victory

## Technical Highlights

### Data-driven recipe system

Elements, recipes, and achievements are defined separately from the interface, making the progression tree easier to expand, rebalance, and maintain.

### Persistent game state

A custom local-storage workflow automatically saves the active match, discovered elements, achievements, timer, audio preferences, and win state directly in the browser.

### Browser-native procedural audio

The soundtrack and interaction sounds are synthesized at runtime with the **Web Audio API**. The game does not depend on downloaded music or sound-effect files.

### Focused state architecture

Custom React hooks coordinate game progression, audio, timing, and persistence, while reusable components handle the workshop, element cards, menus, notifications, and win experience.

### Designed around a complete play session

The project explores how an open-ended alchemy mechanic can become a concise, finishable experience. The primary recipe path is structured around a clear narrative arc, and the **Speedrunner** achievement challenges players to reach Mars in under ten minutes.

## Tech Stack

| Area          | Technology            |
| ------------- | --------------------- |
| Interface     | React 19, TypeScript  |
| Build tooling | Vite 6                |
| Styling       | Tailwind CSS 4        |
| Animation     | Motion for React      |
| Icons         | Lucide React          |
| Audio         | Web Audio API         |
| Persistence   | Browser Local Storage |

## Run Locally

### Prerequisites

* Node.js 18 or newer
* npm

### Installation

```bash
git clone https://github.com/almendron02/Mars-Landing.git
cd Mars-Landing
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

No API key, database, or external service is required to play the game locally.

### Available Commands

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run TypeScript validation
```

## Project Structure

```text
src/
├── components/   # Game interface, modals, cards, drawers, and feedback
├── data/         # Elements, combination recipes, and achievements
├── hooks/        # Game state, persistence, timer, and procedural audio
├── types/        # Shared TypeScript models
└── App.tsx       # Application entry and match start/resume flow
```

## Project Goals

This project was created to combine my interests in **software engineering, interaction design, game systems, and visual storytelling**. My focus was not only to make the mechanic work, but to build a polished experience with a clear objective, understandable progression, persistent state, responsive feedback, and a cohesive identity.

## Creator

Designed and developed by **[Angel Gonzalez](https://github.com/almendron02)**.

Portfolio and design work: **[Forma](https://formawebsite.com)**
