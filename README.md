# Multiplayer Draw

A planned collaborative drawing sandbox using Babylon Lite and Colyseus.

**Status: implementation in progress. No playable game release yet.**

The frontend will be hosted on GitHub Pages. Its shared backend is [rmc-colyseus-multiplayer-server](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server), deployed on Vercel Hobby.

## Delivery gate

Before building the drawing interface, verify that two clients on independent computers can share a Colyseus room and recover across hosting timeouts. Capacity is configured for 12; two reliable remote players are mandatory. No paid services or hosting substitutions are authorized.

## Planned interaction

Draw with a pencil, erase only your own whole strokes, see other cursors, and join without accounts or a lobby. Every join receives a fresh identity; departed players' artwork disappears. Portrait 9:16 layout with keyboard-accessible and touch-friendly controls.

## Project layout

The npm project is at the repository root. The application directory is `multiplayer-draw/`. Planning and acceptance criteria are tracked in `openspec/changes/add-multiplayer-draw-and-shared-colyseus-server/`.

## Sources

Created from [SamuelAsherRivello/github-repository-template](https://github.com/SamuelAsherRivello/github-repository-template), with skills imported from [ai-skills-library](https://github.com/SamuelAsherRivello/ai-skills-library). Exact source revisions and conflict handling are recorded in `SOURCE_REVISIONS.md`.
