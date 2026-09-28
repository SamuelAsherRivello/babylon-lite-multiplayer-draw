![Samuel Asher Rivello](multiplayer-draw/documentation/samuel-asher-rivello-banner.png)

# Multiplayer Draw

A shared portrait drawing canvas built with Babylon Lite and Colyseus. Pick a pencil, make a mark, and watch other players draw alongside you. Erase your own whole strokes; your artwork disappears when you leave. Up to 12 players can join from different computers with no accounts or lobby setup.

**[▶ Play Multiplayer Draw](https://samuelasherrivello.github.io/babylon-lite-multiplayer-draw/)**

## Images

### Screenshots

<a href="https://samuelasherrivello.github.io/babylon-lite-multiplayer-draw/"><img src="multiplayer-draw/documentation/screenshot01.png" width="600" alt="Play Multiplayer Draw — shared canvas with two players drawing a planet" /></a>

<a href="multiplayer-draw/documentation/mobile.png"><img src="multiplayer-draw/documentation/mobile.png" width="220" alt="Multiplayer Draw on a narrow mobile screen" /></a>

Captured from the released game in a real browser. Click the desktop screenshot to play.

## Live Demo

- **[Play Multiplayer Draw](https://samuelasherrivello.github.io/babylon-lite-multiplayer-draw/)** — open the same link on another computer or browser tab to draw together.
- [Frontend release v0.0.3](https://github.com/SamuelAsherRivello/babylon-lite-multiplayer-draw/releases/tag/v0.0.3)
- [Shared Colyseus server and client v0.1.0](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/releases/tag/v0.1.0)

Use a recent WebGPU-capable browser. The frontend runs on GitHub Pages and connects automatically to the shared backend on Vercel Hobby.

## Table of Contents

1. [Images](#images)
2. [Live Demo](#live-demo)
3. [Getting Started](#getting-started)
4. [Project Details](#project-details)
5. [Credits](#credits)

## Getting Started

### 🎮 Play

- **Pencil** button or **P**: draw with a mouse, pen or touch.
- **Eraser** button or **E**: erase your own whole strokes. Other players' artwork is protected by the server.
- **Fullscreen**: expand the page.
- **Full room**: retry when a seat opens. Unexpected disconnects retry automatically.

Each connection receives a player number, name and color. Late joiners see the current artwork and live cursors. Refreshing or reconnecting creates a fresh player; previous artwork disappears after disconnect detection.

### 🛠 Build Project

Use Node 24 and npm. Run commands from the repository root:

```sh
npm ci
npm test
npm run build
```

The shared client is pinned to a public GitHub Release tarball in package.json and package-lock.json. No npm account, private registry or developer credentials are needed.

### 🛠 Run Project

```sh
npm run dev
```

Open the localhost URL Vite prints. The default backend is the live shared server. Optionally set `VITE_SERVER_URL` to a local Colyseus server URL. Never put deployment credentials in frontend configuration.

For browser checks, install Chromium with `npx playwright install chromium`. Run `npm run test:browser` against a running development frontend and an otherwise empty drawing session; use an isolated local backend for repeatable occupancy checks. `TEST_URL` overrides the frontend URL.

Run `node multiplayer-draw/test/public-browser.mjs` to check the released Pages build. This uses two browser clients and a protocol observer, with a fourth seat during the mobile check.

### 🛠 Release Version

1. Run `npm test`, `npm run build`, and the relevant browser checks.
2. Push to `main` to deploy through the GitHub Pages workflow.
3. Run the **[Release workflow](https://github.com/SamuelAsherRivello/babylon-lite-multiplayer-draw/actions/workflows/release.yml)** to increment the patch version in version.txt, publish a tag and GitHub Release, and explicitly deploy Pages.
4. Verify the public demo and displayed version. Backend releases use the separate [server repository](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server).

## Project Details

Babylon Lite renders the 9:16 drawing surface through WebGPU. HTML provides pencil/eraser controls, identity, connection status and occupancy. Drawing appears locally immediately; batched messages relay strokes and smoothed remote cursors through Colyseus.

### 📝 Structure

- `multiplayer-draw/index.html` provides the page and accessible controls.
- `multiplayer-draw/src/` contains rendering, pointer input and multiplayer integration.
- `multiplayer-draw/test/` contains geometry, development-browser and public-browser checks.
- `multiplayer-draw/documentation/` contains screenshots and [verification evidence](multiplayer-draw/documentation/verification.md).
- Repository-root package files, Vite configuration and `.github/workflows/` control builds and releases.

### 📦 AI

- [AGENTS.md](AGENTS.md) contains repository-specific agent guidance.
- [AGENTS_TEMPLATE_USAGE_CHECKLIST.md](AGENTS_TEMPLATE_USAGE_CHECKLIST.md) records the template delivery audit.
- [OpenSpec](openspec/) records the accepted requirements and implementation work.
- Created using [github-repository-template](https://github.com/SamuelAsherRivello/github-repository-template) and [ai-skills-library](https://github.com/SamuelAsherRivello/ai-skills-library), with exact revisions in [SOURCE_REVISIONS.md](SOURCE_REVISIONS.md).
- Requested brief: “Multiplayer Draw,” repository `babylon-lite-multiplayer-draw`, application folder `multiplayer-draw/`; simple pencil/eraser drawing with hot join/drop and own-artwork cleanup. Multiplayer is this project's explicit override; the global single-player creator skill was preserved.

### 📦 Packages

- [Babylon Lite](https://github.com/BabylonJS/Babylon-Lite) — WebGPU rendering.
- [Colyseus](https://colyseus.io/) — multiplayer rooms and messaging.
- [RMC shared multiplayer client](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/tree/main/packages/client) — admission, identity, occupancy and reconnection.
- [Vite](https://vite.dev/) — development server and production builds.
- [Playwright](https://playwright.dev/) — real-browser verification.

### ✅ Verification

Public two-browser drawing, remote rendering, erase ownership, refresh/departure cleanup, mobile layout, asset loading and version agreement passed. The backend passed 12-client capacity and thirteenth-client rejection tests. Two independent hosts exchanged drawing messages; an 11-minute hosting probe crossed two timeout/rejoin cycles. Automated releases, clean package installation, rollback and restoration were verified. See [exact test evidence and workflow runs](multiplayer-draw/documentation/verification.md).

### ⚠️ Hosting Limits

This is an experimental portfolio service with in-memory state. Vercel can end sessions around five minutes; clients then rejoin as fresh players and old artwork is removed. One deployment does not guarantee that future connections always reach the same running process. There is no durable storage or account system.

Drawing is limited to 100 strokes and 10,000 points per player, with 2,048 points per stroke. Erase strokes to reclaim space. Mobile testing used emulated touch; physical-device testing is not claimed.

## Credits

### 💡 Contributors

- Samuel Asher Rivello — Over 25 years of game development XP (2026)
- Original interface, procedural paper texture, icon and pointer-drawn screenshot artwork created for this project. Fonts: DM Sans and Space Grotesk from Google Fonts.

### 💡 Contact

- [LinkedIn.com/in/SamuelAsherRivello](https://Linkedin.com/in/SamuelAsherRivello) ⭐
- [GitHub.com/SamuelAsherRivello](https://github.com/SamuelAsherRivello/)
- [Twitter.com/srivello](https://twitter.com/srivello/)
- Resume / Portfolio: [SamuelAsherRivello.com](http://www.SamuelAsherRivello.com)

### 💡 License

- Provided as-is under the [MIT License](LICENSE).
- Copyright © 2026 Rivello Multimedia Consulting, LLC.
