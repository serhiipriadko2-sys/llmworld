// ... (imports remain similar, adding HemisphereLight)
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html, useCursor, Float, Sparkles, Cloud, Environment, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { GameState } from '../services/geminiService';
import { LOCATIONS } from '../constants';

// ... (Constants & Types remain the same)

const LOCATION_COORDS: Record<string, [number, number, number]> = {
  "Haven's Rest": [0, 0, 0],
  "Whispering Woods": [-12, 0, -8],
  "Jagged Peaks": [12, 4, -8],
  "Sunken Valley": [-8, -1, 10],
  "The Ashen Wastes": [10, 1, 10],
};

type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'ash';

const LOCATION_WEATHER: Record<string, WeatherType> = {
  "Haven's Rest": 'clear',
  "Whispering Woods": 'fog',
  "Jagged Peaks": 'snow',
  "Sunken Valley": 'rain',
  "The Ashen Wastes": 'ash',
};

interface NodeProps {
  position: [number, number, number];
  name: string;
  type: string;
  isCurrent: boolean;
  isReachable: boolean;
  isLocked: boolean;
  onClick: () => void;
}

// --- Weather Components ---
// (Keeping existing weather components: Rain, Snow, WeatherSystem)

const Rain = () => {
  const count = 1000;
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= 20 * delta;
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 25;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#a5b4fc" size={0.15} transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
};

const Snow = () => {
  const count = 1000;
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, speeds };
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= particles.speeds[i] * delta;
      positions[i * 3] += Math.sin(time + i) * 0.02;
      if (positions[i * 3 + 1] < -2) {
        positions[i * 3 + 1] = 25;
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.2} transparent opacity={0.8} sizeAttenuation={true} />
    </points>
  );
};

const WeatherSystem = ({ weather }: { weather: WeatherType }) => {
  return (
    <group>
      {weather === 'rain' && <Rain />}
      {weather === 'snow' && <Snow />}
      {weather === 'ash' && (
        <Sparkles count={800} scale={50} size={4} speed={0.4} opacity={0.8} color="#fb923c" position={[0, 5, 0]} />
      )}
      {weather === 'fog' && (
        <>
          <fogExp2 attach="fog" args={['#1f2937', 0.03]} />
          <Cloud position={[-10, 5, -8]} opacity={0.5} speed={0.1} bounds={[15, 4, 15]} segments={20} color="#e5e7eb" />
        </>
      )}
      {weather !== 'fog' && <fogExp2 attach="fog" args={['#0f172a', weather === 'clear' ? 0.005 : 0.02]} />}
    </group>
  );
};

// --- Environment Models ---

const TreePine = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.1, 0.2, 1, 6]} />
      <meshStandardMaterial color="#3f2e26" roughness={1} />
    </mesh>
    <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
      <coneGeometry args={[0.9, 1.5, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
    <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
      <coneGeometry args={[0.6, 1.2, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  </group>
);

const TreeDeciduous = ({ position, scale, color }: { position: [number, number, number], scale: number, color: string }) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.15, 0.25, 1, 6]} />
      <meshStandardMaterial color="#4a3728" roughness={1} />
    </mesh>
    <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  </group>
);

const Vegetation = () => {
  const items = useMemo(() => {
    const result = [];
    
    // Whispering Woods (Dense Forest)
    for (let i = 0; i < 60; i++) {
      result.push({
        type: 'pine',
        x: -12 + (Math.random() - 0.5) * 14,
        z: -8 + (Math.random() - 0.5) * 14,
        scale: 0.8 + Math.random() * 0.6,
        color: Math.random() > 0.7 ? "#064e3b" : "#065f46" // Dark greens
      });
    }

    // Haven's Rest (Mixed, Autumnal)
    for (let i = 0; i < 20; i++) {
      result.push({
        type: 'deciduous',
        x: 0 + (Math.random() - 0.5) * 10,
        z: 0 + (Math.random() - 0.5) * 10,
        scale: 0.7 + Math.random() * 0.5,
        color: Math.random() > 0.6 ? "#d97706" : (Math.random() > 0.5 ? "#65a30d" : "#15803d") // Orange, Lime, Green
      });
    }

    // Sunken Valley (Sparse, Swampy)
    for (let i = 0; i < 15; i++) {
      result.push({
        type: 'deciduous',
        x: -8 + (Math.random() - 0.5) * 8,
        z: 10 + (Math.random() - 0.5) * 8,
        scale: 0.6 + Math.random() * 0.4,
        color: "#3f6212" // Olive
      });
    }

    return result;
  }, []);

  return (
    <group>
      {items.map((item, i) => (
        item.type === 'pine' ? 
          <TreePine key={i} position={[item.x, 0, item.z]} scale={item.scale} color={item.color} /> :
          <TreeDeciduous key={i} position={[item.x, 0, item.z]} scale={item.scale} color={item.color} />
      ))}
    </group>
  );
};

const Rocks = () => {
  const rocks = useMemo(() => {
    const items = [];
    // Ashen Wastes (Volcanic Rocks)
    for (let i = 0; i < 30; i++) {
      items.push({
        x: 10 + (Math.random() - 0.5) * 12,
        z: 10 + (Math.random() - 0.5) * 12,
        scale: 0.5 + Math.random() * 1.2,
        color: "#1c1917", // Dark stone
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
      });
    }
    // Jagged Peaks (Grey Rocks)
    for (let i = 0; i < 20; i++) {
      items.push({
        x: 12 + (Math.random() - 0.5) * 10,
        z: -8 + (Math.random() - 0.5) * 10,
        scale: 0.8 + Math.random() * 1.5,
        color: "#57534e", // Grey stone
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
      });
    }
    return items;
  }, []);

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh 
          key={i} 
          position={[r.x, 0.3, r.z]} 
          rotation={r.rot as [number, number, number]} 
          scale={[r.scale, r.scale, r.scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={r.color} flatShading roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const Water = () => {
    return (
        <group>
          {/* Sunken Valley Lake */}
          <mesh position={[-8, -1.8, 10]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[6, 32]} />
              <meshStandardMaterial 
                  color="#0ea5e9" 
                  transparent 
                  opacity={0.7} 
                  roughness={0.2} 
                  metalness={0.6} 
              />
          </mesh>
          {/* Small Pond near Haven */}
          <mesh position={[2, -1.9, 2]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[2, 16]} />
              <meshStandardMaterial 
                  color="#38bdf8" 
                  transparent 
                  opacity={0.6} 
                  roughness={0.2} 
                  metalness={0.5} 
              />
          </mesh>
        </group>
    )
}

// --- Main Components ---

const AtmosphericTerrain = () => {
  const { geometry, colors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(140, 140, 150, 150);
    const pos = geo.attributes.position;
    const count = pos.count;
    const colorsArr = new Float32Array(count * 3);
    
    // Palette
    const cSnow = new THREE.Color("#f8fafc");
    const cRockGrey = new THREE.Color("#57534e");
    const cRockBlack = new THREE.Color("#1c1917");
    const cGrassLush = new THREE.Color("#4d7c0f"); // Lush green
    const cGrassDark = new THREE.Color("#14532d"); // Forest green
    const cDirt = new THREE.Color("#78350f"); // Brown dirt
    const cSand = new THREE.Color("#d6d3d1");
    const cLava = new THREE.Color("#ef4444"); // Lava red

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // This is actually Z in world space before rotation
      
      // Base Noise
      let z = 
        Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 + 
        Math.sin(x * 0.3 + y * 0.2) * 0.5 +
        (Math.random() - 0.5) * 0.1;

      // Biome Modifications
      
      // Jagged Peaks (Top Right: x > 5, y < -5)
      if (x > 5 && y < -5) {
        z += Math.max(0, (x - 5) * 0.5 + (-y - 5) * 0.5); // Raise mountains
        z += Math.random() * 0.5; // Jaggedness
      }

      // Ashen Wastes (Bottom Right: x > 5, y > 5)
      if (x > 5 && y > 5) {
        z += Math.random() * 0.2; // Rough terrain
        // Crater effect
        const distToCrater = Math.sqrt(Math.pow(x - 10, 2) + Math.pow(y - 10, 2));
        if (distToCrater < 4) z -= (4 - distToCrater) * 0.5;
      }

      // Sunken Valley (Bottom Left: x < -5, y > 5)
      if (x < -5 && y > 5) {
        z -= 1.5; // Sink
      }

      // Flatten center (Haven)
      const distCenter = Math.sqrt(x*x + y*y);
      if (distCenter < 8) z *= 0.3;

      pos.setZ(i, z);

      // Coloring Logic
      let finalColor = cGrassLush;

      // Height/Biome based coloring
      if (x > 5 && y < -5) { // Mountains
        if (z > 4) finalColor = cSnow;
        else finalColor = cRockGrey;
      } else if (x > 5 && y > 5) { // Volcanic
        if (z < -1) finalColor = cLava; // Lava in crater
        else finalColor = cRockBlack;
      } else if (x < -5 && y > 5) { // Swamp
        if (z < -1.5) finalColor = cDirt;
        else finalColor = cGrassDark;
      } else if (x < -5 && y < -5) { // Forest
        finalColor = cGrassDark;
      } else {
        // Plains
        if (z < -1.5) finalColor = cSand; // Shore
        else finalColor = cGrassLush;
      }

      // Noise variation
      finalColor = finalColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.05);

      colorsArr[i * 3] = finalColor.r;
      colorsArr[i * 3 + 1] = finalColor.g;
      colorsArr[i * 3 + 2] = finalColor.b;
    }
    
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
    
    return { geometry: geo, colors: colorsArr };
  }, []);

  return (
    <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial 
          vertexColors
          roughness={0.9}
          metalness={0.1}
          flatShading={true}
        />
      </mesh>
      {/* Infinite Horizon Plane */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
    </group>
  );
};

// ... (RoutePath and BeaconNode remain mostly the same, just ensuring visibility)

const RoutePath = ({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) => {
  const adjustedStart = new THREE.Vector3(start[0], start[1] - 1.5, start[2]);
  const adjustedEnd = new THREE.Vector3(end[0], end[1] - 1.5, end[2]);

  return (
    <Line
      points={[adjustedStart, adjustedEnd]}
      color={active ? "#fbbf24" : "#a1a1aa"} // Lighter inactive color
      lineWidth={active ? 2 : 1}
      dashed={!active}
      dashScale={2}
      gapSize={1}
      transparent
      opacity={active ? 0.8 : 0.4}
    />
  );
};

const BeaconNode = ({ position, name, type, isCurrent, isReachable, isLocked, onClick }: NodeProps) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered && !isLocked && !isCurrent);
  
  const color = useMemo(() => {
    if (isCurrent) return '#10b981';
    if (type === 'risk_zone') return '#f43f5e';
    if (type === 'safe_hub') return '#3b82f6';
    return '#a855f7';
  }, [type, isCurrent]);

  return (
    <group position={position}>
      <mesh 
        visible={false}
        onClick={(e) => { e.stopPropagation(); if (!isLocked && !isCurrent) onClick(); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[2.5, 16, 16]} />
      </mesh>

      <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.6, 0.5, 8]} />
        <meshStandardMaterial color="#52525b" roughness={0.8} />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
        <mesh position={[0, -1.2, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={isCurrent ? 3 : 1.5}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {(isCurrent || isReachable) && (
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.05, 0.5, 12, 16, 1, true]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={isCurrent ? 0.2 : 0.08} 
            side={THREE.DoubleSide} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <pointLight 
        position={[0, -1, 0]} 
        color={color} 
        intensity={isCurrent ? 3 : 1} 
        distance={10} 
        decay={2} 
      />

      <Html position={[0, 1.8, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className={`
          px-3 py-1.5 rounded-sm border-l-2 backdrop-blur-md transition-all duration-300
          ${isCurrent 
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : hovered 
              ? 'bg-zinc-800/90 border-zinc-400 text-zinc-100 scale-110 shadow-lg' 
              : 'bg-black/60 border-zinc-600 text-zinc-400 opacity-80'}
        `}>
          <div className="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">
            {type.replace('_', ' ')}
          </div>
          <div className="text-xs font-serif whitespace-nowrap font-medium">
            {name}
          </div>
        </div>
      </Html>
    </group>
  );
};

const SceneContent = ({ gameState, onAction, isTyping }: { gameState: GameState, onAction: (a: string) => void, isTyping: boolean }) => {
  const currentLocationData = LOCATIONS[gameState.location as keyof typeof LOCATIONS];
  const weather = LOCATION_WEATHER[gameState.location] || 'clear';

  return (
    <>
      {/* Environment & Lighting */}
      <Environment preset="night" blur={0.6} background={false} />
      <Sky sunPosition={[0, -1, 0]} inclination={0.2} azimuth={180} turbidity={10} rayleigh={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <hemisphereLight 
        intensity={0.6} 
        color="#e0f2fe" 
        groundColor="#1f2937" 
      />
      <directionalLight 
        position={[-10, 20, 10]} 
        intensity={1.5} 
        color={weather === 'ash' ? "#fdba74" : "#fff7ed"} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <ambientLight intensity={0.4} />

      <WeatherSystem weather={weather} />
      <AtmosphericTerrain />
      
      <Vegetation />
      <Rocks />
      <Water />

      {Object.entries(LOCATIONS).map(([name, data]) => {
        const pos = LOCATION_COORDS[name] || [0, 0, 0];
        const isCurrent = gameState.location === name;
        const isReachable = currentLocationData.routes.includes(name);
        const isLocked = !isCurrent && !isReachable;

        return (
          <React.Fragment key={name}>
            <BeaconNode
              position={pos}
              name={name}
              type={data.type}
              isCurrent={isCurrent}
              isReachable={isReachable}
              isLocked={isLocked}
              onClick={() => {
                if (isReachable && !isTyping) onAction(`Travel to ${name}`);
              }}
            />
            {data.routes.map(target => {
              const targetPos = LOCATION_COORDS[target];
              if (targetPos && name < target) {
                 return (
                  <RoutePath 
                    key={`${name}-${target}`} 
                    start={pos} 
                    end={targetPos} 
                    active={isCurrent && (target === gameState.location || currentLocationData.routes.includes(target))} 
                  />
                 );
              }
              return null;
            })}
          </React.Fragment>
        );
      })}
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={35}
        autoRotate={false}
        dampingFactor={0.05}
      />
    </>
  );
};

export const GameMap3D = ({ gameState, onAction, isTyping }: { gameState: GameState, onAction: (a: string) => void, isTyping: boolean }) => {
  return (
    <div className="w-full h-full bg-zinc-950 relative">
      <Canvas 
        shadows
        camera={{ position: [0, 12, 24], fov: 35 }}
        dpr={[1, 2]}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <SceneContent gameState={gameState} onAction={onAction} isTyping={isTyping} />
      </Canvas>
      
      {/* Weather Indicator UI */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 shadow-lg">
          <div className="uppercase tracking-widest text-[10px] opacity-50 mb-1">Environment</div>
          <div className="text-zinc-200 flex items-center gap-2 font-bold">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
                LOCATION_WEATHER[gameState.location] === 'clear' ? 'bg-emerald-500' :
                LOCATION_WEATHER[gameState.location] === 'ash' ? 'bg-orange-500' :
                LOCATION_WEATHER[gameState.location] === 'rain' ? 'bg-blue-500' :
                LOCATION_WEATHER[gameState.location] === 'snow' ? 'bg-white' : 'bg-gray-400'
            }`}></span>
            {LOCATION_WEATHER[gameState.location]?.toUpperCase() || 'CLEAR'}
          </div>
        </div>
      </div>
    </div>
  );
};