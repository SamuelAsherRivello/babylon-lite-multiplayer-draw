# Design

## Context
See proposal.md. New frontend created via GitHub template generation; backend is a separate repo. Vercel Hobby and Colyseus are required. The application root is explicitly overridden to multiplayer-draw/.

## Goals / Non-Goals
Minimum reusable lifecycle and drawing demo. No accounts, durable artwork, identity restoration, roster, paid services or provider substitution.

## Decisions
- First deploy a minimal Colyseus room using the serverless HTTP entry point from endel/colyseus-vercel. Probe matchmaking, shared state, cold starts and reconnects before drawing UI. Preserve evidence and stop on failure.
- One logical deployment registers separate game rooms. Initial state is in memory: one deployment is not a guarantee of one running process. Redis is omitted because it alone does not solve room-owner routing.
- A custom drawing room validates ownership, finite normalized coordinates and bounded messages. Immediate local strokes, batched updates and remote cursor interpolation avoid unnecessary physics prediction.
- Maintain shared client package inside backend repo; distribute pinned GitHub Release tarballs. Expose connection lifecycle, identity, occupancy, retry and game messages.
- Lowest free seats 1-12; fresh server seed determines consistent name/color. Release seats upon disconnect detection. Reconnect with exponential delays and fresh identity/artwork.
- Explicit release workflows test, package, deploy and smoke-check tagged revisions, with rollback. Bot releases call deployment directly. Keep secrets in GitHub Actions and CLI auth storage.
- Preserve template corner roles with touch-accessible pencil/eraser and compact connection panel.

## Risks / Trade-offs
- Vercel routes connections across instances and terminates sockets at duration limits. Test shared room identity across hosts and recovery; stop on failure.
- Artwork disappears after disconnect/restart by design.
- Live 12-player target is aspirational; two remote players are mandatory.

## Migration Plan
No existing users. Pin client package and backend releases together. Maintain dependent demo versions and upgrade affected demos on protocol changes. Roll back failed backend releases to the previous verified deployment.


## Implementation discovery
The installed Colyseus SDK enables session-preserving reconnection by default. The shared client must set room.reconnection.enabled = false and perform a fresh join itself, matching the user's identity requirement.

