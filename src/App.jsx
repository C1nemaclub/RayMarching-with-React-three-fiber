import {
  Box,
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  OrbitControls,
  PivotControls,
  TransformControls,
  Wireframe,
  shaderMaterial,
  useTexture,
} from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { Color, DoubleSide, Texture, Vector3, BoxGeometry, Matrix4, BackSide } from 'three';
import { useControls } from 'leva';
import { useMemo, useRef, useState } from 'react';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

const CustomMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color('dodgerblue'),
    uResolution: { x: window.innerWidth, y: window.innerHeight },
    uTexture: new Texture(),
    uPosition: { x: 0, y: 0, z: 0 },
    uRemapped: true,
    uSpherePosition: { x: 0, y: 0, z: 0 },
    uBlendFactor: 0.5,
  },
  vertexShader,
  fragmentShader
);

extend({ CustomMaterial });

const mapCoordinates = (coords) => {
  const x = coords.x;
  const y = coords.z;
  const z = -coords.y;
  return { x, y, z };
};

function App() {
  const shaderRef = useRef();
  const sphereRef = useRef();
  const texture = useTexture(
    'https://images.unsplash.com/photo-1706349067986-433baf49d558?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );

  const data = useControls({
    speed: { value: 0, min: 0, max: 10 },
    'Blend Factor': { value: 0.5, min: 0.1, max: 5, step: 0.01 },
    Remapped: { value: true },
  });

  useFrame((state) => {
    shaderRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    shaderRef.current.material.uniforms.uRemapped.value = data.Remapped;
    shaderRef.current.material.uniforms.uBlendFactor.value = data['Blend Factor'];
    const spherePosition = sphereRef.current.object.getWorldPosition(sphereRef.current.object.position);
    shaderRef.current.material.uniforms.uSpherePosition.value = mapCoordinates(spherePosition);
  });

  return (
    <>
      <mesh ref={shaderRef} rotation-x={Math.PI / 2}>
        <boxGeometry args={[20, 20, 20]} />
        <customMaterial side={BackSide} uTexture={texture} />
      </mesh>

      <TransformControls mode='translate' ref={sphereRef}>
        <mesh>
          <boxGeometry />
          <meshBasicMaterial visible={false} />
        </mesh>
      </TransformControls>

      <ambientLight intensity={5} />
      <OrbitControls makeDefault />
      <color args={['#363636']} attach='background' />
    </>
  );
}

export default App;
