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

## Release verification

- Vercel authorization, automated production deployment and two-client live probe passed: [run 36445269245](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36445269245).
- Backend/client v0.1.0 release and tagged deployment passed, including the full live 12/13-client drawing suite: [run 36445588819](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36445588819).
- Rollback to the previous deployment and promotion of the released deployment both succeeded. Released deployment: dpl_BjHj2FL88CD6aT5aji7VZkPvDn1u.
- The frontend consumes the public v0.1.0 client tarball. Clean npm ci, unit tests and production build passed; npm audit reported no vulnerabilities.
- Frontend v0.0.3 release and Pages deployment passed: [run 36446331211](https://github.com/SamuelAsherRivello/babylon-lite-multiplayer-draw/actions/runs/36446331211). Tag commit: 503fdcdceeea7c73f97cb4a03c5af1d3f2858b3c.
- Public Pages browser test passed in room OvoEMQOEZ: two separate browser contexts plus a protocol observer; remote canvas pixel changes, owner-only erase, refresh and close cleanup, mobile layout, successful asset responses, and displayed v0.0.3 matching public version.txt. This test uses the production build without development state hooks.
- Public screenshots replaced the development screenshots after visual inspection. Desktop 1440x1000; mobile 390x844. Local browser interaction suite also passed against an isolated development server after an earlier shared-session run encountered extra participants.

## Hosting limits

The in-memory approach is experimental. Passing bounded tests does not guarantee that Vercel always routes future connections to one process. Connections end around five minutes and reconnect with a fresh identity; old artwork is intentionally removed. There is no durable storage or authentication.

## OpenSpec completion

All 11 implementation tasks and all 9 requirements were verified. The accepted specs cover collaborative drawing, shared multiplayer lifecycle, and delivery. Drawing behavior maps to renderer.js/main.js and backend drawing-room.ts; lifecycle and capacity map to the released shared client and server admission logic; delivery maps to the recorded Actions runs and public-browser check. No mandatory checks remain open. The known in-memory hosting and emulated-touch limitations remain documented above.

Strict validation passed for the change and all three synchronized main specs. The change is archived under openspec/changes/archive/2026-09-28-add-multiplayer-draw-and-shared-colyseus-server/.
