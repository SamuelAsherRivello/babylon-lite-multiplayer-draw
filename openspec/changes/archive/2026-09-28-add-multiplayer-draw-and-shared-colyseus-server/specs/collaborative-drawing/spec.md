## Purpose
Let visitors draw together on a temporary canvas without accounts or lobby setup.

## ADDED Requirements
### Requirement: Shared portrait canvas
The app SHALL present a responsive 9:16 canvas with pencil and eraser, immediate local strokes, remote strokes and cursors, and useful initialization errors.
#### Scenario: Concurrent drawing
- **WHEN** two remote visitors draw with pointer or touch input
- **THEN** each sees both drawings and the other cursor without a local round-trip delay

### Requirement: Own whole-stroke erase
The server MUST allow a player to erase only whole strokes owned by that connection.
#### Scenario: Forged erase
- **WHEN** a client requests deletion of another player's stroke
- **THEN** that stroke remains visible to all clients

### Requirement: Late join and departure
Late joiners SHALL see all current strokes including unfinished strokes. Departed players' artwork and cursors SHALL be removed after server disconnect detection.
#### Scenario: Refresh
- **WHEN** a player refreshes
- **THEN** their previous artwork disappears and the page joins with a fresh identity

