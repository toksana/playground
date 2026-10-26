# Models — pumpkin.glb & candle.glb

Procedurally generated (no AI, no textures, no UVs).

## pumpkin.glb (~740 KB raw, ~400 KB gzipped by Vercel, ~25k tris)

| Node           | What                                                                 | Material                                                                       |
| -------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `PumpkinShell` | Closed ribbed shell, 10 ribs, **a lobe faces +Z** (the carving side) | `PumpkinSkin`: vertex colors (darker grooves, yellowish poles), roughness 0.55 |
| `Stem`         | Curved, twisted stem sitting in the top dimple                       | `Stem`: dark brown, roughness 0.85                                             |

- Y up, front = **+Z**, centered at origin.
- Bounding box ≈ x −0.97…0.99, y −0.75…0.75, z −1.0…1.0.
- Inner floor (on the axis) ≈ y −0.64; with the inner shell at scale 0.93 ≈ −0.60.

## candle.glb (~32 KB, ~1.6k tris)

| Node          | What                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| `CandleBody`  | Wax cylinder with melted rim and drips, base at y = 0, height ≈ 0.37, radius ≈ 0.11 |
| `Wick`        | Slightly bent black wick                                                            |
| `FlameAnchor` | Empty node — position for the flame mesh / pointLight                               |

Wax has a faint emissive tint so it reads in the dark; boost it with `uGlow` when lit.

## Values for the code

```ts
// lib/carve/projection.ts
export const CARVE_EXTENT = 0.85; // covers the front lobe area; tweak 0.75–0.95 to taste
export const FRONT_THRESHOLD = 0.25;
```

Candle placement inside the pumpkin: `position={[0, -0.6, 0]}`.

## Loading

No Draco/Meshopt compression → `useGLTF` needs no decoders.

```tsx
const { nodes, materials } = useGLTF('/models/pumpkin.glb') as unknown as {
  nodes: { PumpkinShell: THREE.Mesh; Stem: THREE.Mesh };
  materials: { PumpkinSkin: THREE.MeshStandardMaterial; Stem: THREE.MeshStandardMaterial };
};

// outer shell: CSM over MeshStandardMaterial — keep vertexColors!
<mesh geometry={nodes.PumpkinShell.geometry}>
  <CustomShaderMaterial baseMaterial={THREE.MeshStandardMaterial} vertexColors roughness={0.55} ... />
</mesh>

// inner glowing shell: same geometry, scaled, back faces
<mesh geometry={nodes.PumpkinShell.geometry} scale={0.93}>
  <meshStandardMaterial side={THREE.BackSide} color="#3a1500" emissive="#ff8a1f" emissiveIntensity={0} />
</mesh>

<mesh geometry={nodes.Stem.geometry} material={materials.Stem} />

useGLTF.preload('/models/pumpkin.glb');
```

`npx gltfjsx public/models/pumpkin.glb --types` also works if you prefer a generated component (skip `--transform`, the files are already small).

## Regenerating / tweaking

`scripts/generate-models.mjs` builds both files. Knobs at the top: `RIBS`, `SQUASH`, groove depth (`0.075`), pole dimple (`0.16`), colors in `pumpkinColors()`.

```bash
npm i -D @gltf-transform/core
node scripts/generate-models.mjs public/models
```
