// Procedural pumpkin + candle → GLB (no UV dependency, front faces +Z, Y up, meters-ish units)
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Document, NodeIO } from '@gltf-transform/core';
import fs from 'node:fs';

const OUT = process.argv[2] ?? './out';
fs.mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
function finalize(geo) {
  geo.deleteAttribute('uv');
  const g = mergeVertices(geo, 1e-5);
  g.computeVertexNormals();
  return g;
}

function addMesh(
  doc,
  buffer,
  scene,
  name,
  geo,
  mat,
  { colors = null, translation = [0, 0, 0] } = {},
) {
  const pos = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(geo.attributes.position.array))
    .setBuffer(buffer);
  const nor = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(geo.attributes.normal.array))
    .setBuffer(buffer);
  const idxArr = geo.index.array;
  const idx = doc
    .createAccessor()
    .setType('SCALAR')
    .setArray(
      idxArr.length > 65535 || geo.attributes.position.count > 65535
        ? new Uint32Array(idxArr)
        : new Uint16Array(idxArr),
    )
    .setBuffer(buffer);
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', pos)
    .setAttribute('NORMAL', nor)
    .setIndices(idx)
    .setMaterial(mat);
  if (colors) {
    prim.setAttribute(
      'COLOR_0',
      doc.createAccessor().setType('VEC3').setArray(colors).setBuffer(buffer),
    );
  }
  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh).setTranslation(translation);
  scene.addChild(node);
  return node;
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// ---------- PUMPKIN ----------
const RIBS = 10;
const R = 1.0; // base radius
const SQUASH = 0.8; // vertical squash
function pumpkinGeometry(radius = R) {
  const geo = new THREE.SphereGeometry(radius, 128, 96);
  const p = geo.attributes.position;
  const ribValues = new Float32Array(p.count);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const phi = Math.atan2(v.z, v.x);
    const lat = v.y / radius; // -1..1
    const ring = Math.sqrt(Math.max(0, 1 - lat * lat));
    // rib: 1 at lobe center, 0 in groove; sharp grooves, round lobes
    const rib = Math.pow(
      Math.abs(Math.cos((RIBS * (phi - Math.PI / 2)) / 2)),
      0.35,
    );
    ribValues[i] = rib;
    const grooveDepth = 0.075 * ring; // grooves fade toward poles
    const s = 1 - grooveDepth * (1 - rib);
    v.x *= s;
    v.z *= s;
    // squash + gentle bulge at the equator
    v.y *= SQUASH * (1 + 0.04 * ring);
    // pole dimples (top where stem sits, bottom)
    const d2 = v.x * v.x + v.z * v.z;
    const dimple = 0.16 * Math.exp(-d2 / 0.06);
    v.y -= Math.sign(v.y) * dimple;
    // slight organic asymmetry (deterministic)
    const n =
      0.012 * Math.sin(phi * 3 + 1.3) * ring +
      0.008 * Math.sin(lat * 7 + phi * 2);
    v.multiplyScalar(1 + n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  // keep rib values per vertex for colors before merge
  geo.setAttribute('rib', new THREE.BufferAttribute(ribValues, 1));
  return geo;
}

function pumpkinColors(geo) {
  const p = geo.attributes.position;
  const rib = geo.attributes.rib;
  const out = new Float32Array(p.count * 3);
  const lobe = new THREE.Color('#e86a10'); // sRGB
  const groove = new THREE.Color('#9a3d06');
  const pole = new THREE.Color('#c48a2a'); // yellowish near stem/bottom
  const c = new THREE.Color();
  let ymax = -Infinity;
  for (let i = 0; i < p.count; i++) ymax = Math.max(ymax, Math.abs(p.getY(i)));
  for (let i = 0; i < p.count; i++) {
    const r = rib.getX(i);
    c.copy(groove).lerp(lobe, smoothstep(0.0, 0.7, r));
    const polar = smoothstep(0.55, 0.95, Math.abs(p.getY(i)) / ymax);
    const nearAxis =
      1 - smoothstep(0.0, 0.35, Math.hypot(p.getX(i), p.getZ(i)));
    c.lerp(pole, Math.min(1, polar * nearAxis * 0.9));
    out.set([c.r, c.g, c.b], i * 3);
  }
  return out;
}

function stemGeometry(topY) {
  // curved, twisted, tapered stem with slightly flared base
  const H = 0.42,
    segs = 24,
    radial = 10;
  const pts = [];
  const geo = new THREE.CylinderGeometry(1, 1, H, radial, segs, false);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = (v.y + H / 2) / H; // 0 bottom .. 1 top
    const ang = Math.atan2(v.z, v.x);
    const rBase =
      THREE.MathUtils.lerp(0.11, 0.055, t) + 0.06 * Math.exp(-t * 12); // flare
    const ridges = 1 + 0.12 * Math.cos(ang * 5 + t * 2.5); // twisted ridges
    const r = rBase * ridges * (Math.hypot(v.x, v.z) > 0.001 ? 1 : 0);
    const bend = 0.18 * t * t; // curve sideways
    v.set(
      Math.cos(ang) * r + bend,
      topY - 0.05 + t * H,
      Math.sin(ang) * r - bend * 0.4,
    );
    p.setXYZ(i, v.x, v.y, v.z);
  }
  return geo;
}

// ---------- CANDLE ----------
function candleGeometry() {
  const H = 0.36,
    RAD = 0.11;
  const pts = [];
  pts.push(new THREE.Vector2(0.0001, 0));
  pts.push(new THREE.Vector2(RAD * 1.03, 0));
  pts.push(new THREE.Vector2(RAD, 0.01));
  for (let i = 1; i <= 10; i++)
    pts.push(
      new THREE.Vector2(
        RAD * (1 + 0.015 * Math.sin(i * 1.7)),
        0.01 + (H - 0.03) * (i / 10),
      ),
    );
  // melted rim and dipped top
  pts.push(new THREE.Vector2(RAD * 1.02, H - 0.005));
  pts.push(new THREE.Vector2(RAD * 0.9, H + 0.008));
  pts.push(new THREE.Vector2(RAD * 0.75, H - 0.004));
  pts.push(new THREE.Vector2(0.0001, H - 0.018));
  const geo = new THREE.LatheGeometry(pts, 48);
  // wax drips: push some vertices outward/downward near the top
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const ang = Math.atan2(v.z, v.x);
    const drip =
      Math.max(0, Math.cos(ang * 3 + 0.6)) ** 6 *
      Math.max(Math.cos(ang * 7), 0.3);
    const fromTop = (H - v.y) / H;
    if (fromTop < 0.6 && Math.hypot(v.x, v.z) > RAD * 0.95) {
      const k = 1 + 0.06 * drip * smoothstep(0.6, 0.0, fromTop);
      v.x *= k;
      v.z *= k;
    }
    p.setXYZ(i, v.x, v.y, v.z);
  }
  return { geo, H };
}

function wickGeometry(H) {
  const geo = new THREE.CylinderGeometry(0.006, 0.008, 0.05, 8, 4);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const t = (v.y + 0.025) / 0.05;
    v.x += 0.01 * t * t;
    v.y += H - 0.018 + 0.025;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  return geo;
}

// ---------- BUILD ----------
const io = new NodeIO();

// Pumpkin GLB
{
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('Pumpkin');
  doc.getRoot().setDefaultScene(scene);

  const raw = pumpkinGeometry();
  // compute colors before merging (merge keeps attribute equality → fine since rib continuous)
  raw.deleteAttribute('uv');
  const merged = mergeVertices(raw, 1e-5);
  merged.computeVertexNormals();
  const colors = pumpkinColors(merged);
  merged.deleteAttribute('rib');

  const box = new THREE.Box3().setFromBufferAttribute(
    merged.attributes.position,
  );
  const shellMat = doc
    .createMaterial('PumpkinSkin')
    .setBaseColorFactor([1, 1, 1, 1])
    .setRoughnessFactor(0.55)
    .setMetallicFactor(0);
  addMesh(doc, buffer, scene, 'PumpkinShell', merged, shellMat, { colors });

  const stem = finalize(stemGeometry(box.max.y - 0.16 * 0.0));
  // place stem base into the top dimple
  const topY = (() => {
    let m = -Infinity;
    const p = merged.attributes.position;
    for (let i = 0; i < p.count; i++)
      if (Math.hypot(p.getX(i), p.getZ(i)) < 0.05) m = Math.max(m, p.getY(i));
    return m;
  })();
  const sp = stem.attributes.position;
  const sbox = new THREE.Box3().setFromBufferAttribute(sp);
  for (let i = 0; i < sp.count; i++)
    sp.setY(i, sp.getY(i) - sbox.min.y + topY - 0.04);
  stem.computeVertexNormals();
  const stemMat = doc
    .createMaterial('Stem')
    .setBaseColorFactor([0.18, 0.13, 0.05, 1])
    .setRoughnessFactor(0.85)
    .setMetallicFactor(0);
  addMesh(doc, buffer, scene, 'Stem', stem, stemMat);

  await io.write(`${OUT}/pumpkin.glb`, doc);
  const tris = merged.index.count / 3 + stem.index.count / 3;
  console.log(
    'pumpkin bbox',
    box.min.toArray().map((n) => +n.toFixed(3)),
    box.max.toArray().map((n) => +n.toFixed(3)),
    'tris',
    tris,
    'topY',
    topY.toFixed(3),
  );
  if (process.env.PREVIEW)
    fs.writeFileSync(
      `./pumpkin_preview.json`,
      JSON.stringify({
        pos: Array.from(merged.attributes.position.array),
        idx: Array.from(merged.index.array),
        col: Array.from(colors),
        spos: Array.from(stem.attributes.position.array),
        sidx: Array.from(stem.index.array),
      }),
    );
}

// Candle GLB
{
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('Candle');
  doc.getRoot().setDefaultScene(scene);
  const { geo, H } = candleGeometry();
  const body = finalize(geo);
  const wax = doc
    .createMaterial('Wax')
    .setBaseColorFactor([0.93, 0.86, 0.72, 1])
    .setRoughnessFactor(0.45)
    .setMetallicFactor(0)
    .setEmissiveFactor([0.08, 0.04, 0.0]);
  addMesh(doc, buffer, scene, 'CandleBody', body, wax);
  const wick = finalize(wickGeometry(H));
  const wickMat = doc
    .createMaterial('Wick')
    .setBaseColorFactor([0.03, 0.02, 0.02, 1])
    .setRoughnessFactor(1)
    .setMetallicFactor(0);
  addMesh(doc, buffer, scene, 'Wick', wick, wickMat);
  // empty node marking where the flame should go
  scene.addChild(
    doc.createNode('FlameAnchor').setTranslation([0.006, H + 0.045, 0]),
  );
  await io.write(`${OUT}/candle.glb`, doc);
  const box = new THREE.Box3().setFromBufferAttribute(body.attributes.position);
  console.log(
    'candle bbox',
    box.min.toArray().map((n) => +n.toFixed(3)),
    box.max.toArray().map((n) => +n.toFixed(3)),
    'tris',
    body.index.count / 3 + wick.index.count / 3,
  );
}
