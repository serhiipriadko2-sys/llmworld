---
name: r3f-mobile-perf
description: Performance patterns for React Three Fiber in this project (GameMap3D.tsx). Use whenever touching the 3D map, particle systems (Rain, Snow, ash Sparkles), terrain geometry, lighting, shadows, BeaconNode, or Canvas settings. Also trigger when the user reports frame drops, sluggish map rendering, battery drain, or wants to add new 3D effects. This project targets mobile browsers — always apply mobile-first rendering budget.
---

# R3F Mobile Performance — Project Patterns

## Target Platform Reality

`metadata.json` declares this as "A mobile open-world adventure". Mobile budget:
- Target: 30-60fps on mid-range Android (Snapdragon 6xx)
- GPU: Adreno 6xx / Mali-G6x — significant shadow and particle limitations
- JS: single-threaded, ~2ms budget per frame for game logic + particle updates

Every 3D decision must be evaluated against this constraint.

## Terrain Geometry — Module-Level Cache

`AtmosphericTerrain` runs 22,801 vertex calculations on every component mount. Moving between tabs remounts the canvas, regenerating the terrain each time.

```ts
// Outside component, at module level — generated once per page load
const TERRAIN_GEOMETRY = (() => {
  const geo = new THREE.PlaneGeometry(140, 140, 150, 150);
  // ... all vertex/color calculations ...
  geo.computeVertexNormals();
  return geo;
})();

// In component — reuse, don't recreate
const AtmosphericTerrain = () => (
  <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh geometry={TERRAIN_GEOMETRY} receiveShadow castShadow>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} flatShading />
    </mesh>
    ...
  </group>
);
```

Note: module-level geometry means terrain is deterministic across remounts (no `Math.random()` variation). That's the correct behavior for a persistent world.

## Particle Systems — GPU over CPU

The current `Rain` and `Snow` components mutate a `Float32Array` every frame in JS:
```ts
// CURRENT — 1000 JS operations per frame, ~3000 float writes, GPU upload every frame
useFrame((_, delta) => {
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] -= 20 * delta;
    ...
  }
  mesh.current.geometry.attributes.position.needsUpdate = true;
});
```

**Preferred**: Replace with `<Sparkles>` from `@react-three/drei` (already in deps, already used for ash):

```tsx
// Rain replacement — GPU-driven, zero JS per frame
{weather === 'rain' && (
  <Sparkles
    count={300}
    scale={50}
    size={1.5}
    speed={3}
    opacity={0.5}
    color="#a5b4fc"
    position={[0, 10, 0]}
  />
)}

// Snow replacement
{weather === 'snow' && (
  <Sparkles
    count={400}
    scale={50}
    size={2}
    speed={0.6}
    opacity={0.7}
    color="#ffffff"
    position={[0, 10, 0]}
  />
)}
```

**Quick fallback** (if Sparkles look wrong): Keep JS particles but reduce count based on device:

```ts
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
const PARTICLE_COUNT = isMobile ? 300 : 1000;
```

## Lighting Budget

5 `pointLight` components + 1 `directionalLight` with shadows = heavy.

**Rule**: pointLights in `BeaconNode` are redundant — the `emissiveIntensity` on the octahedron mesh already provides glow. Remove all 5 `pointLight` instances from `BeaconNode`.

```tsx
// REMOVE this from BeaconNode:
<pointLight position={[0, -1, 0]} color={color} intensity={...} distance={10} decay={2} />

// The emissive material already handles the glow effect:
<meshStandardMaterial
  color={color}
  emissive={color}
  emissiveIntensity={isCurrent ? 3 : 1.5}
  toneMapped={false}
/>
```

**Shadow map**: Reduce from 2048 to 1024 on mobile — imperceptible quality difference at map zoom level:

```tsx
<directionalLight
  castShadow
  shadow-mapSize={[1024, 1024]}  // was [2048, 2048]
  ...
/>
```

## Canvas Settings — Mobile Caps

```tsx
<Canvas
  shadows
  camera={{ position: [0, 12, 24], fov: 35 }}
  dpr={[1, 1.5]}      // was [1, 2] — cap at 1.5x on retina
  performance={{ min: 0.5 }}  // allow R3F to reduce DPR under load
  gl={{
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.2,
    powerPreference: 'high-performance',  // request discrete GPU if available
  }}
>
```

`dpr={[1, 1.5]}` instead of `[1, 2]` reduces pixel fill by ~44% on retina screens with negligible visual difference at mobile viewing distance.

## useMemo Dependencies for 3D Objects

When using `useMemo` for geometry/particle arrays, empty deps `[]` is usually correct — these don't need to recalculate on state changes. But ensure the geometry disposal on unmount:

```tsx
useEffect(() => {
  return () => {
    // Only needed for useMemo geometries created inside component
    // Module-level geometries should NOT be disposed (they're shared)
  };
}, []);
```

## Tab Switching — Preserve Canvas

The `AnimatePresence` in `App.tsx` unmounts/remounts the entire 3D canvas on tab switch. This is expensive. Consider keeping `GameMap3D` mounted but hidden:

```tsx
// Instead of conditional rendering inside AnimatePresence:
<div style={{ display: activeTab === 'map' ? 'flex' : 'none' }} className="flex-1 overflow-hidden flex flex-col h-full">
  <MapView gameState={gameState} onAction={performAction} isTyping={isTyping} />
</div>
```

This preserves the Three.js context, avoids terrain regeneration, and makes map tab instant after first load. Trade-off: MapView stays mounted and uses ~5MB memory while on other tabs.

## Adding New Visual Effects — Checklist

Before adding any new 3D effect:
1. Does it need per-frame JS? If yes, can `<Sparkles>` or a shader handle it instead?
2. Does it add a new light source? If yes, remove one elsewhere.
3. Does it add geometry? Put it in `useMemo([])` or module-level.
4. Test on Chrome DevTools mobile throttling (4x CPU slowdown) before committing.
