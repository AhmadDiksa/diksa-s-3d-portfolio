'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Local avatar model
const GLB_URL = "/free_human_skull.glb";

function AvatarModel() {
  const { scene } = useGLTF(GLB_URL);
  const groupRef = useRef<THREE.Group>(null);
  
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetRotationY = mouse.current.x * (Math.PI / 3);
      const targetRotationX = -mouse.current.y * (Math.PI / 6);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 3);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, delta * 3);

      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -9, 0]} scale={0.017}>
      <primitive object={scene} />
    </group>
  );
}


// Preload the model
useGLTF.preload(GLB_URL);

export default function HeroScene() {
  return (
    <div className="w-full h-full relative pointer-events-none" style={{ overflow: 'visible' }}>
      <div
        className="pointer-events-none"
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 35 }}
          shadows
          gl={{ alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          className="pointer-events-none"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
          
          <Suspense fallback={null}>
            <AvatarModel />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2} far={4} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
