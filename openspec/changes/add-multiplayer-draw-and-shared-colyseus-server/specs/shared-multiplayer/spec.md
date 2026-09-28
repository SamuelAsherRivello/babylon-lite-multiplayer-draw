## Purpose
Provide reusable anonymous multiplayer lifecycle and consistent identity for future games.

## ADDED Requirements
### Requirement: Automatic presence and identity
Clients SHALL hot join one session per game with the lowest free player number and a randomized deterministic name and color consistent across peers. Every join SHALL receive a fresh identity. Remaining players MUST NOT be renumbered.
#### Scenario: Vacated seat
- **WHEN** player 2 leaves while players 1 and 3 remain and another joins
- **THEN** the new visitor gets seat 2 and a fresh identity without changing other seats

### Requirement: Capacity and recovery
Default capacity SHALL be 12, with smaller gameplay-specific limits allowed. Full sessions SHALL show full status and retry without creating overflow rooms. Unexpected disconnects SHALL retry with increasing delays. The compact UI SHALL show identity, status and occupancy.
#### Scenario: Thirteenth visitor
- **WHEN** twelve players occupy the drawing session and another arrives
- **THEN** the visitor sees full status and can retry after a seat becomes available

### Requirement: Versioned reuse
The backend repository SHALL distribute a versioned client tarball through GitHub Releases and document Custom Shared Features. Persistent-user-rejoins SHALL be documented as deferred.
#### Scenario: New game integration
- **WHEN** a game installs a pinned tarball and selects its game type
- **THEN** it can use shared lifecycle, identity, occupancy, retry and game messages without copying implementation code

