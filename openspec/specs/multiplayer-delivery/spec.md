# multiplayer-delivery Specification

## Purpose
Release verifiably playable multiplayer demos with automated deployment and honest hosting limits.

## Requirements
### Requirement: Hosting feasibility gate
Two remote clients MUST share state on the chosen free hosting before implementing the full drawing UI. Failure to support two players MUST block release. The system SHALL target 12 and report measured capacity.
#### Scenario: Hosting cannot route peers
- **WHEN** live feasibility cannot maintain two clients in one shared session
- **THEN** delivery stops with evidence without silently changing providers or using paid services

### Requirement: Automated release
Backend GitHub Releases SHALL deploy their tagged revision, publish the client package, and run live checks. Rollback SHALL restore a previous working deployment. Sessions can drop. Published games MUST be upgraded as needed to remain usable.
#### Scenario: Bot-generated release
- **WHEN** a workflow publishes a release
- **THEN** deployment is explicitly invoked without relying on another event from its repository token

### Requirement: Public playable delivery
The frontend SHALL be served on Pages with a README screenshot and Play link, without exposing credentials. Validation MUST cover independent hosts, late join/drop/rejoin, two hosting timeout cycles, a backend release, clean package installation and browser interactions.
#### Scenario: Completion report
- **WHEN** delivery is reported complete
- **THEN** public game and release links work and mandatory checks have evidence
