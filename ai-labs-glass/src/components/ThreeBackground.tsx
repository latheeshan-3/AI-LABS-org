import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";



function FloatingSphere({ position, size, color, speed }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshWobbleMaterial
        attach="material"
        factor={0.4}
        speed={1}
        color={color}
        transparent
        opacity={0.2}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function Grid() {
  const gridRef = useRef<THREE.Group>(null);

  // Rotate the grid slowly over time
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={gridRef}>
      {/* Main grid helper */}
      <gridHelper 
        args={[100, 100]} 
        position={[0, -2, 0]} 
      />
    </group>
  );
}


function AnimatedRings() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -15]}>
      <torusGeometry args={[4, 0.1, 16, 100]} />
      <meshBasicMaterial
        color="#2dd4bf"
        transparent
        opacity={0}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900" />
      
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="absolute inset-0 w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
       
        
        {/* Additional floating spheres */}
        <FloatingSphere position={[-6, 2, -8]} size={1} color="#14b8a6" speed={0.8} />
        <FloatingSphere position={[6, -1, -12]} size={0.7} color="#0d9488" speed={1.2} />
        <FloatingSphere position={[0, 3, -18]} size={0.5} color="#2dd4bf" speed={1.5} />
        
        {/* Animated torus ring */}
        <AnimatedRings />
        
        {/* Enhanced grid */}
         <Grid/>
        
        {/* Enhanced stars */}
        <Stars 
          radius={60} 
          depth={30} 
          count={6000} 
          factor={5} 
          fade 
          speed={0.5}
        />
        
        {/* Subtle fog */}
        <fog attach="fog" args={["#0f172a", 25, 70]} />

        {/* Camera Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}