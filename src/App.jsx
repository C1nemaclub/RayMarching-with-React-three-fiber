import { OrbitControls, TransformControls, shaderMaterial, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import { BackSide, Color, MathUtils, Texture } from 'three';
import fragmentShader from './shaders/fragmentShader.glsl';
import vertexShader from './shaders/vertexShader.glsl';

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
    uSphereRadius: 1.5,
  },
  vertexShader,
  fragmentShader
);

extend({ CustomMaterial });

CustomMaterial.key = MathUtils.generateUUID();

const mapCoordinates = (coords) => {
  const x = coords.x;
  const y = coords.z;
  const z = -coords.y;
  return { x, y, z };
};

function App() {
  const shaderRef = useRef();
  const sphereRef = useRef();
  const wireframeRef = useRef();
  const texture = useTexture(
    'https://images.unsplash.com/photo-1706349067986-433baf49d558?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  );

  const data = useControls({
    'Blend Factor': { value: 0.5, min: 0.1, max: 6, step: 0.01 },
    uSphereRadius: { value: 1, min: 0.1, max: 15, step: 0.01 },
    Remapped: { value: true },
    wireframe: { value: false },
  });

  useFrame((state) => {
    shaderRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    shaderRef.current.material.uniforms.uRemapped.value = data.Remapped;
    shaderRef.current.material.uniforms.uBlendFactor.value = data['Blend Factor'];
    shaderRef.current.material.uniforms.uSphereRadius.value = data.uSphereRadius;
    const spherePosition = sphereRef.current.object.getWorldPosition(sphereRef.current.object.position);
    shaderRef.current.material.uniforms.uSpherePosition.value = mapCoordinates(spherePosition);
    wireframeRef.current.geometry = shaderRef.current.geometry;

    wireframeRef.current.visible = data.wireframe ? true : false;
  });

  return (
    <>
      <mesh ref={shaderRef} rotation-x={Math.PI / 2}>
        <boxGeometry args={[20, 20, 20]} />
        <customMaterial side={BackSide} uTexture={texture} key={CustomMaterial.key} />
      </mesh>

      <lineSegments ref={wireframeRef}>
        <edgesGeometry />
        <lineBasicMaterial color='white' />
      </lineSegments>

      <TransformControls mode='translate' ref={sphereRef} position={[0, 1, 0]}>
        <mesh position={[0, 1, 0]}>
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
