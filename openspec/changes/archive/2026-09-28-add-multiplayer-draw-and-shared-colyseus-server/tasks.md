# Tasks

## 1. Setup and hosting gate
- [x] 1.1 Create the requested GitHub repositories and link the Vercel project; verify origins and project access.
- [x] 1.2 Import shared skills without overwriting newer template workflows; record source revisions and verify OpenSpec doctor.
- [x] 1.3 Configure release secrets and verify a GitHub Actions deployment.
- [x] 1.4 Deploy a minimal Colyseus probe and verify shared state across independent hosts, cold starts, and two timeout/rejoin cycles. Stop if two-client feasibility fails.

## 2. Shared multiplayer foundation
- [x] 2.1 Implement fresh identities, lowest free seats, capacity and retry; test 12 clients and rejection of client 13 without overflow rooms.
- [x] 2.2 Implement authoritative stroke ownership, snapshots and departure cleanup; verify forged messages and late-join tests.
- [x] 2.3 Publish the shared client tarball and document Custom Shared Features including deferred persistent-user-rejoins; verify a clean pinned package installation.

## 3. Game and release
- [x] 3.1 Adapt the template to multiplayer-draw and implement Babylon Lite drawing, controls, cursors and connection UI; verify desktop and mobile browser behavior.
- [x] 3.2 Implement tagged release/deployment/rollback workflows and verify a backend release plus frontend Pages deployment.
- [x] 3.3 Verify the public game across independent hosts, attempt 12 live clients, capture a real screenshot, and publish exact acceptance evidence in README.
- [x] 3.4 Complete the applicable template checklist, validate OpenSpec, and synchronize local and remote release revisions; verify clean Git status and version agreement.
