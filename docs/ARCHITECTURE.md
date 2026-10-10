# Architecture proposal

## 1. Experience contract

Every compatible repository contains an `experience.json` at its root:

```json
{
  "schema": "openworld.experience/v1",
  "id": "com.example.my-world",
  "name": "My World",
  "entry": "src/main.js",
  "kind": "world",
  "renderer": "three",
  "capabilities": [
    "render:3d",
    "network:room",
    "identity:optional"
  ],
  "assets": {
    "baseUrl": "."
  }
}
```

`kind` is either `world` or `site`. A site may use the same shell, routing, identity, and share links but does not need a 3D renderer. The manifest should later support declared memory, network, storage, and input budgets.

## 2. Host API

The host injects a narrow API into the sandbox. The initial surface should be small and versioned:

```ts
interface OpenWorldHost {
  experience: { id: string; version: string };
  identity: {
    getSession(): Promise<GuestSession | WalletSession>;
    requestWalletCredential(): Promise<WalletSession>;
  };
  room: {
    join(roomId: string): Promise<RoomHandle>;
    publish(message: Uint8Array): Promise<void>;
    subscribe(handler: (message: Uint8Array) => void): () => void;
  };
  storage: {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
  };
}
```

The actual transport, signaling provider, token storage, and wallet provider remain host-owned.

## 3. Loading and trust model

The loader should accept:

- a repository URL plus a commit SHA;
- a release artifact with a digest;
- a local development bundle.

It should fetch metadata through a proxy or controlled browser worker, verify the requested revision, inspect the manifest, and launch the bundle in a sandboxed iframe. Do not make “any GitHub repo” mean arbitrary code gets privileged access: repositories become playable when they implement the manifest and host API.

## 4. Multiplayer and federation

WebRTC is the peer transport, not the discovery protocol. The initial system needs:

1. A signaling endpoint for room membership and ICE exchange.
2. A room authorization token minted by the host.
3. A versioned data-channel protocol with message size/rate limits.
4. A provider interface so multiple independent signaling/federation servers can be used.

Recommended room model:

- server-authoritative membership and permissions;
- peer-to-peer experience state where practical;
- host/server authority for anti-cheat-sensitive state;
- deterministic snapshots or CRDTs only where the experience needs them.

Federation should exchange signed room advertisements and provider metadata. It should not expose wallet credentials or private room keys across providers.

## 5. Identity

Guests get an ephemeral keypair and a display handle. A wallet-backed user proves control by signing a domain-bound challenge (SIWE-style flow). The service stores a public identifier and session credential, never a private key.

Polygon can be the first chain integration for optional credentials, badges, or ownership checks. Chain ownership must remain optional so a guest can enter instantly and so the engine does not equate a wallet address with a safe or human identity.

## 6. Recommended package boundaries

```text
packages/
  manifest/        schema + validator
  protocol/        host API and room message types
  loader/          GitHub/release/local bundle loading
  identity/        guest sessions + wallet challenge verification
  transport/       WebRTC, signaling, provider interface
  runtime/         iframe bridge + capability enforcement
  renderer-three/  Three.js adapter
  shell/           browser UI, router, share links
services/
  signal/          room signaling and token issuance
```

## 7. First milestone acceptance criteria

- `experience.json` validates with useful error messages.
- A sample repository can render a rotating 3D scene inside the sandbox.
- A sample static site can render without access to host internals.
- Two browser tabs join one room and exchange a bounded position update.
- A guest can share a room URL and reconnect.
- A wallet signature can upgrade the session without exposing private key material.
