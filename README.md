# OpenWorld JS Engine

An extensible JavaScript runtime for turning compatible GitHub repositories into shareable, playable experiences:

- 3D worlds and games
- ordinary static websites
- instant, link-addressable apps
- guest or wallet-backed identity
- federated multiplayer over WebRTC

## Product direction

The engine is a host shell, not a code-execution service. A repository declares an experience manifest, then runs inside a constrained browser runtime with explicit capabilities. This lets the host provide rendering, identity, networking, persistence, and sharing without trusting arbitrary repository code with the whole page or user's credentials.

## Proposed runtime layers

```text
Host shell
├─ Router / URL sharing
├─ Experience loader (GitHub release, commit, or immutable bundle)
├─ Capability sandbox
├─ Identity (guest → wallet credential)
├─ Federation + WebRTC transport
├─ 2D/3D renderer adapter
└─ Static-site adapter

Experience
├─ experience.json
├─ client entry point
├─ optional server/federation adapter
└─ assets
```

## MVP

1. Load an immutable GitHub repository bundle from an allowlisted source.
2. Validate `experience.json` and reject incompatible or unsafe manifests.
3. Run a JavaScript experience in a sandboxed iframe with a versioned host API.
4. Provide a basic Three.js world adapter and a static HTML adapter.
5. Create guest identities and share a room URL.
6. Connect peers through a signaling service and exchange state over WebRTC data channels.
7. Support wallet login through a signed challenge; Polygon is an optional credential provider, not a requirement for play.

## Security principles

- Never execute arbitrary GitHub code in the privileged host context.
- Pin loaded repositories to a commit SHA or signed release artifact.
- Keep wallet private keys in the user's wallet; the engine only verifies signatures.
- Use short-lived, audience-bound identity tokens and rotate room keys.
- Treat WebRTC data as hostile input: validate messages, cap rates, and isolate room state.
- Give each experience an explicit capability list (for example `render:3d`, `network:room`, `storage:local`).

## Suggested next implementation slice

Build the local shell and manifest validator first. Once an experience can run locally in a sandbox, add a single signaling server and a minimal data-channel protocol. Federation can then be introduced as interchangeable signaling providers rather than baked into the game runtime.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the proposed contracts and decisions.

## Compatibility web client

The root `index.html` is a buildless prototype of the player shell. It provides:

- a top navigation bar for discovering worlds and sites;
- a curated catalog with capability badges;
- a sandboxed iframe player for legacy HTML5 experiences;
- an “Open a URL” flow for hosted GitHub Pages or other HTML5 entry points;
- shareable player URLs and an explicit legacy mode that disables multiplayer and saves.

Open `index.html` in a browser or serve the repository with any static file server. A raw GitHub repository is not itself an executable web page, so compatibility mode expects a hosted HTML entry point (for example GitHub Pages); a future loader can resolve repository URLs to pinned releases or Pages deployments.

## GitHub Pages

This repository is a buildless static site and is ready for GitHub Pages. The included `.nojekyll` marker prevents unnecessary Jekyll processing, and `.github/workflows/pages.yml` deploys the repository automatically whenever `main` changes.

For a user site, the repository should be named `jaravus.github.io`. In GitHub, open **Settings → Pages**, choose **GitHub Actions** as the source, and wait for the first workflow run to finish. The site will be available at `https://jaravus.github.io/`.
