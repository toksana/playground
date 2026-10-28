'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import CustomShaderMaterial from 'three-custom-shader-material';
import type CSM from 'three-custom-shader-material/vanilla';
import {
  DoubleSide,
  InstancedBufferAttribute,
  MeshBasicMaterial,
  Object3D,
  ShapeGeometry,
} from 'three';
import type { InstancedMesh } from 'three';
import {
  advanceSchedule,
  BAT_COUNT,
  batPose,
  createSchedule,
  flightProgress,
} from '@/lib/bats/batPath';
import type { BatPose, BatSchedule } from '@/lib/bats/batPath';
import { batShape } from '@/lib/bats/batShape';
import { useCarveStore } from '@/store/useCarveStore';
import { batsVertexShader } from './batsShader';

const BAT_COLOR = '#2b2438';
const FLAP_SPEED = 26;
const FLAP_AMOUNT = 0.9;
const BAT_SIZES = [0.8, 0.65, 0.55];
// Fixed phase offsets so the bats don't flap in sync.
const FLAP_PHASES = [0, 2.1, 4.3];

const dummy = new Object3D();
const INDICES = Array.from({ length: BAT_COUNT }, (_, index) => index);
// A schedule whose flights never start: parks every bat offstage.
const OFFSTAGE: BatSchedule = { cycleStart: Infinity, gap: 0 };

const buildGeometry = (): ShapeGeometry => {
  const geometry = new ShapeGeometry(batShape());
  geometry.setAttribute(
    'aPhase',
    new InstancedBufferAttribute(new Float32Array(FLAP_PHASES), 1),
  );
  return geometry;
};

const writeInstance = (mesh: InstancedMesh, index: number, pose: BatPose) => {
  dummy.position.set(...pose.position);
  dummy.rotation.set(0, 0, pose.tilt);
  dummy.scale.setScalar(BAT_SIZES[index] * pose.scale);
  dummy.updateMatrix();
  mesh.setMatrixAt(index, dummy.matrix);
};

const updateFlights = (mesh: InstancedMesh, now: number, s: BatSchedule) => {
  INDICES.forEach((index) => {
    const progress = flightProgress(now, s, index);
    const pose: BatPose =
      progress === null
        ? { position: [0, 0, 0], tilt: 0, scale: 0 }
        : batPose(index, progress);
    writeInstance(mesh, index, pose);
  });
  mesh.instanceMatrix.needsUpdate = true;
};

// A few bats that fly out from behind the pumpkin, loop in front of it and vanish into the
// fog. Active only in reveal; a new round starts 8-15 s after the previous one.
export const Bats = () => {
  const mesh = useRef<InstancedMesh>(null);
  const material = useRef<CSM<typeof MeshBasicMaterial>>(null);
  const schedule = useRef<BatSchedule | null>(null);
  const parked = useRef(false);
  const geometry = useMemo(() => buildGeometry(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlapSpeed: { value: FLAP_SPEED },
      uFlapAmount: { value: FLAP_AMOUNT },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (mesh.current === null || material.current === null) return;
    const now = clock.elapsedTime;

    if (useCarveStore.getState().phase !== 'reveal') {
      if (parked.current) return;
      parked.current = true;
      schedule.current = null;
      updateFlights(mesh.current, now, OFFSTAGE);
      return;
    }

    parked.current = false;
    schedule.current = advanceSchedule(
      schedule.current ?? createSchedule(now, Math.random),
      now,
      Math.random,
    );
    material.current.uniforms.uTime.value = now;
    updateFlights(mesh.current, now, schedule.current);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, BAT_COUNT]}
      frustumCulled={false}
    >
      <CustomShaderMaterial<typeof MeshBasicMaterial>
        ref={material}
        baseMaterial={MeshBasicMaterial}
        vertexShader={batsVertexShader}
        uniforms={uniforms}
        color={BAT_COLOR}
        side={DoubleSide}
      />
    </instancedMesh>
  );
};
