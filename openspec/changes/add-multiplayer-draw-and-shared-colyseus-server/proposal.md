# Proposal

## Why
Build a collaborative drawing demo and reusable multiplayer services for future portfolio games. Two remote players must share one canvas reliably before release.

## What Changes
- Create Multiplayer Draw in `multiplayer-draw/`, using the required template, skills library, and Babylon Lite, published on GitHub Pages.
- Create a reusable Colyseus backend on Vercel Hobby with hot join/drop, identity, ownership validation, and separate game rooms.
- Provide immediate drawing, remote cursors, own-stroke erasing, late-join history, and departure cleanup.
- Publish a shared client tarball and deploy the backend on GitHub Releases.
- Gate implementation on live two-client feasibility; configure 12 seats and report verified capacity.

## Capabilities
### New Capabilities
- `collaborative-drawing`: portrait drawing and ownership-aware erasing.
- `shared-multiplayer`: anonymous presence, fresh identities, reconnecting, package reuse.
- `multiplayer-delivery`: hosting feasibility, automated releases, and public verification.
### Modified Capabilities
None.

## Impact
Two GitHub repositories, one Vercel project, GitHub Pages, Colyseus dependencies, and CI credentials. No changes to global single-player skills. Vercel room routing and timeout recovery require validation; failure to support two remote clients blocks delivery.
