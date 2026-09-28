# Verification — 2026-09-28

## Passed

- Babylon Lite 1.32.0 / WebGPU initialization and production build.
- Geometry test: sparse-segment and point-stroke erasing.
- Two isolated Chromium contexts: drawing, remote state, own-stroke erasing, rejection of erasing peer artwork, fresh identity after refresh, departure cleanup and cursors.
- Emulated touch viewport 390×844: touch drawing and no page overflow. Desktop 1440×1000.
- Unsupported WebGPU presents a useful error. Browser suite reports no runtime errors.
- Backend typecheck and real-client integration: ownership, malformed point rejection, active-stroke late join, cleanup, stable seat numbering, 12 players, rejection of client 13, retry into a freed seat, direct-matchmaking restriction and fresh automatic reconnect.
- The final committed Vercel deployment passed the full drawing/12-player integration test, including fresh automatic reconnect (27.5 seconds of test execution).
- Two independent hosts passed an 11-minute hosting probe across two timeout/rejoin cycles: [run 36427675103](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36427675103).
- Final drawing messages passed between local Windows and a GitHub Ubuntu runner in room A8WYHUWlL: local 145 observations / 90 seconds; runner 148 / 75 seconds. [Run 36431402375](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36431402375).
- OpenSpec strict validation and doctor.

## Evidence

Screenshots are actual pointer-drawn browser captures: screenshot01.png and mobile.png. No image mockups or physical touch-device claims.

## Pending release gates

- Save a project-scoped Vercel automation token as backend GitHub secret VERCEL_TOKEN. Local Vercel CLI authorization is working; it cannot create this token.
- Run and verify backend Release/Deploy workflows; verify rollback capability.
- Install the published client tarball URL and verify a clean installation. The current development dependency uses .setup/rmc-multiplayer-client-0.1.0.tgz, which exists in this working directory and is ignored by Git.
- Release frontend through its checked-in workflow and verify the actual GitHub Pages URL, asset paths, displayed version and browser gameplay.
- Finalize specs and repository synchronization only after mandatory gates pass.

## Hosting limits

The in-memory approach is experimental. Passing bounded tests does not guarantee that Vercel always routes future connections to one process. Connections end around five minutes and reconnect with a fresh identity; old artwork is intentionally removed. There is no durable storage or authentication.


