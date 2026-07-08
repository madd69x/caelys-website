import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Initialize Lenis for smooth scrolling
const lenis = new Lenis()

// Synchronize Lenis scrolling with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

// Palette Colors — Matte Tones
const colorIvory = 0xf7f6f1;
const colorPaleBlue = 0xd6dce9;
const colorPeriwinkle = 0x90aad6;
const colorSlateNavy = 0x3b4d75;
const colorDeepSpace = 0x1c223c;

// Custom Cursor
const cursor = document.getElementById('cursor');
let mouse = new THREE.Vector2(0, 0);
let targetMouse = new THREE.Vector2(0, 0);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const interactables = document.querySelectorAll('a, button, input');
interactables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.backgroundColor = '#f7f6f1';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursor.style.backgroundColor = '#90aad6';
  });
});

// Three.js Setup — High Quality Matte Render
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(colorDeepSpace, 0.008);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 18;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized for mobile
renderer.setClearColor(colorDeepSpace, 0); // Transparent background to show HTML through
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ==============================
// LIGHTING — Soft Matte Studio Setup
// ==============================

// Key light — warm directional from top-right
const keyLight = new THREE.DirectionalLight(0xf0e8d8, 2.0);
keyLight.position.set(15, 20, 15);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill light — cool from the left
const fillLight = new THREE.DirectionalLight(0x8899bb, 1.0);
fillLight.position.set(-15, 5, 10);
scene.add(fillLight);

// Rim light — from behind for edge definition
const rimLight = new THREE.DirectionalLight(0xd6dce9, 0.8);
rimLight.position.set(0, -5, -20);
scene.add(rimLight);

// Soft ambient
const ambientLight = new THREE.AmbientLight(0x3b4d75, 0.6);
scene.add(ambientLight);

// Hemisphere light for natural sky/ground fill
const hemiLight = new THREE.HemisphereLight(0xd6dce9, 0x1c223c, 0.5);
scene.add(hemiLight);

// ==============================
// THE DRAGON: Smooth Serpentine Spline Body — Matte Finish
// ==============================

const NUM_SPINE_POINTS = 80;
const SEGMENT_LENGTH = 0.65;
const BODY_SCALE = 1.4;
const spinePoints = [];
for (let i = 0; i < NUM_SPINE_POINTS; i++) {
  spinePoints.push(new THREE.Vector3(0, 0, -i * 0.8));
}

// Matte dragon body material — high roughness, zero metalness
let dragonMesh = null;
const dragonMaterial = new THREE.MeshStandardMaterial({
  color: 0xd8e6f8, // Mystical whitish-blue / glacial porcelain (#d8e6f8)
  roughness: 0.75,
  metalness: 0.1,
  flatShading: false,
  side: THREE.DoubleSide
});

// Subtle secondary shell for depth
let dragonShellMesh = null;
// Texture loading removed – using solid material without texture
const dragonShellMaterial = new THREE.MeshStandardMaterial({
  color: 0x90aad6, // Periwinkle tint for icy depth
  roughness: 0.9,
  metalness: 0.0,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide
});

// ==============================
// DRAGON HEAD DETAILS — Majestic Chinese Dragon Face
// ==============================
const dragonGroup = new THREE.Group();
scene.add(dragonGroup);

const dragonHeadGroup = new THREE.Group();

// Facial materials matching website palette
const hornMat = new THREE.MeshStandardMaterial({ color: colorSlateNavy, roughness: 0.5, metalness: 0.3 });
const accentMat = new THREE.MeshStandardMaterial({ color: colorPeriwinkle, roughness: 0.7, metalness: 0.1 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xfff8e7, roughness: 0.4, metalness: 0.0, emissive: 0xeedd99, emissiveIntensity: 0.6 });
const pupilMat = new THREE.MeshStandardMaterial({ color: colorDeepSpace, roughness: 0.9, metalness: 0.0 });
const whiskerMat = new THREE.MeshStandardMaterial({ color: colorIvory, roughness: 0.6, metalness: 0.1 });
const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc83c3c, roughness: 0.8, metalness: 0.0 });
const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });

// 1. Cranium & Forehead
const cranium = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 2.2), dragonMaterial);
cranium.position.set(0, 0.4, 0.5);
dragonHeadGroup.add(cranium);

// 2. Snout & Muzzle
const snout = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 2.2), dragonMaterial);
snout.position.set(0, 0.2, 2.0);
dragonHeadGroup.add(snout);

const snoutTip = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 0.8), accentMat);
snoutTip.position.set(0, 0.25, 3.0);
dragonHeadGroup.add(snoutTip);

// 3. Nostrils
const leftNostril = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), pupilMat);
leftNostril.position.set(0.45, 0.55, 3.2);
leftNostril.scale.set(1, 0.6, 1);
dragonHeadGroup.add(leftNostril);

const rightNostril = leftNostril.clone();
rightNostril.position.set(-0.45, 0.55, 3.2);
dragonHeadGroup.add(rightNostril);

// 4. Fierce Eyebrow Ridges & Eyes
const lBrow = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 1.0), accentMat);
lBrow.position.set(0.7, 1.1, 1.3);
lBrow.rotation.set(0.2, 0, -0.2);
dragonHeadGroup.add(lBrow);

const rBrow = lBrow.clone();
rBrow.position.set(-0.7, 1.1, 1.3);
rBrow.rotation.set(0.2, 0, 0.2);
dragonHeadGroup.add(rBrow);

const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), eyeMat);
lEye.position.set(0.75, 0.75, 1.2);
dragonHeadGroup.add(lEye);

const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), pupilMat);
lPupil.position.set(0.85, 0.75, 1.4);
lPupil.scale.set(0.6, 1.2, 0.6); // Vertical reptilian slit pupil
dragonHeadGroup.add(lPupil);

const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), eyeMat);
rEye.position.set(-0.75, 0.75, 1.2);
dragonHeadGroup.add(rEye);

const rPupil = lPupil.clone();
rPupil.position.set(-0.85, 0.75, 1.4);
dragonHeadGroup.add(rPupil);

// 5. Majestic Branching Stag Antlers / Horns
const lHornMain = new THREE.Mesh(new THREE.ConeGeometry(0.35, 3.2, 12), hornMat);
lHornMain.position.set(0.8, 2.0, -0.4);
lHornMain.rotation.set(-0.6, 0, -0.3);
dragonHeadGroup.add(lHornMain);

const lHornBranch = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.5, 8), hornMat);
lHornBranch.position.set(1.1, 2.4, -0.1);
lHornBranch.rotation.set(-0.2, 0, -0.6);
dragonHeadGroup.add(lHornBranch);

const rHornMain = lHornMain.clone();
rHornMain.position.set(-0.8, 2.0, -0.4);
rHornMain.rotation.set(-0.6, 0, 0.3);
dragonHeadGroup.add(rHornMain);

const rHornBranch = lHornBranch.clone();
rHornBranch.position.set(-1.1, 2.4, -0.1);
rHornBranch.rotation.set(-0.2, 0, 0.6);
dragonHeadGroup.add(rHornBranch);

// 6. Long Flowing Chinese Dragon Whiskers (Barbels)
const lWhiskerCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.8, 0.1, 2.8),
  new THREE.Vector3(1.8, -0.4, 2.0),
  new THREE.Vector3(2.4, -1.2, 0.5),
  new THREE.Vector3(2.8, -2.0, -1.0)
]);
const lWhisker = new THREE.Mesh(new THREE.TubeGeometry(lWhiskerCurve, 20, 0.08, 6, false), whiskerMat);
dragonHeadGroup.add(lWhisker);

const rWhiskerCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.8, 0.1, 2.8),
  new THREE.Vector3(-1.8, -0.4, 2.0),
  new THREE.Vector3(-2.4, -1.2, 0.5),
  new THREE.Vector3(-2.8, -2.0, -1.0)
]);
const rWhisker = new THREE.Mesh(new THREE.TubeGeometry(rWhiskerCurve, 20, 0.08, 6, false), whiskerMat);
dragonHeadGroup.add(rWhisker);

// 7. Cheek Fins
const lCheekFin = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.8, 8), accentMat);
lCheekFin.position.set(1.4, -0.2, 0.4);
lCheekFin.rotation.set(0, -0.4, -1.0);
dragonHeadGroup.add(lCheekFin);

const rCheekFin = lCheekFin.clone();
rCheekFin.position.set(-1.4, -0.2, 0.4);
rCheekFin.rotation.set(0, 0.4, 1.0);
dragonHeadGroup.add(rCheekFin);

// 8. Articulated Lower Jaw, Beard, Teeth & Tongue
const jawGroup = new THREE.Group();
jawGroup.position.set(0, -0.5, 0.5); // Hinge point at back of jaw, moved down to expose mouth

const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 2.6), dragonMaterial);
jawMesh.position.set(0, -0.2, 1.3);
jawGroup.add(jawMesh);

const chinBeard = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.4, 8), whiskerMat);
chinBeard.position.set(0, -0.8, 1.5);
chinBeard.rotation.x = -0.5;
jawGroup.add(chinBeard);

const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 1.6), mouthMat);
tongue.position.set(0, 0.1, 1.5);
jawGroup.add(tongue);

// Upper fangs
const lUpperFang = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 6), toothMat);
lUpperFang.position.set(0.6, -0.3, 2.9);
lUpperFang.rotation.x = Math.PI;
dragonHeadGroup.add(lUpperFang);

const rUpperFang = lUpperFang.clone();
rUpperFang.position.set(-0.6, -0.3, 2.9);
dragonHeadGroup.add(rUpperFang);

// Lower fangs
const lLowerFang = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), toothMat);
lLowerFang.position.set(0.5, 0.25, 2.3); // Moved slightly up relative to the lowered jaw
jawGroup.add(lLowerFang);

const rLowerFang = lLowerFang.clone();
rLowerFang.position.set(-0.5, 0.25, 2.3);
jawGroup.add(rLowerFang);

dragonHeadGroup.add(jawGroup);

dragonGroup.add(dragonHeadGroup);
dragonHeadGroup.scale.set(BODY_SCALE, BODY_SCALE, BODY_SCALE);
dragonHeadGroup.position.set(0, 0, 3);

// Click handler
window.addEventListener('click', () => {
  gsap.to(jawGroup.rotation, { x: 0.5, duration: 0.2, yoyo: true, repeat: 1 });
});

// ==============================
// DRAGON TAIL & BACK — Minecraft-Style Angular Spiked Club & Dorsal Spines
// ==============================
const dragonTailGroup = new THREE.Group();

// 1. Tail Spade Main Block (Diamond/Box core)
const tailCore = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 1.8), dragonMaterial);
dragonTailGroup.add(tailCore);

// Helper for Minecraft Voxel Fins
function createVoxelFin(isLeft) {
  const finGroup = new THREE.Group();
  const dir = isLeft ? 1 : -1;
  
  // Create a stepped voxel pattern (3 blocks stepping outwards and backwards)
  const sizes = [
    { w: 1.0, h: 0.2, d: 1.2, x: 0.8, z: 0.2 },
    { w: 0.8, h: 0.2, d: 1.0, x: 1.5, z: 0.6 },
    { w: 0.6, h: 0.2, d: 0.6, x: 2.1, z: 1.0 }
  ];
  
  sizes.forEach(s => {
    const boxGeo = new THREE.BoxGeometry(s.w, s.h, s.d);
    const boxMesh = new THREE.Mesh(boxGeo, accentMat);
    boxMesh.position.set(s.x * dir, 0, s.z);
    finGroup.add(boxMesh);
  });
  
  finGroup.rotation.x = -0.1;
  return finGroup;
}

// 2. Horizontal Voxel Wing-Spikes (Minecraft tail spade fins)
const lTailFin = createVoxelFin(true);
lTailFin.position.set(0.2, 0, 0.4);
lTailFin.scale.set(0.8, 0.8, 0.8);
dragonTailGroup.add(lTailFin);

const rTailFin = createVoxelFin(false);
rTailFin.position.set(-0.2, 0, 0.4);
rTailFin.scale.set(0.8, 0.8, 0.8);
dragonTailGroup.add(rTailFin);

// 3. Dorsal & Ventral Tail Spikes
const topTailSpike = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 4), hornMat);
topTailSpike.position.set(0, 0.7, 0.2);
topTailSpike.rotation.x = -0.4;
dragonTailGroup.add(topTailSpike);

const bottomTailSpike = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 4), hornMat);
bottomTailSpike.position.set(0, -0.6, 0.2);
bottomTailSpike.rotation.x = Math.PI + 0.4;
dragonTailGroup.add(bottomTailSpike);

// 4. Stinger Tip Diamond Spike (Ivory pearl finish)
const tailStinger = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 4), whiskerMat);
tailStinger.position.set(0, 0, 1.6);
tailStinger.rotation.x = Math.PI / 2;
dragonTailGroup.add(tailStinger);

dragonGroup.add(dragonTailGroup);
dragonTailGroup.scale.set(BODY_SCALE * 0.8, BODY_SCALE * 0.8, BODY_SCALE * 0.8);

// 5. Minecraft-Style Dorsal Spines along the spine
const dorsalSpines = [];
const numSpines = 24;
for (let i = 0; i < numSpines; i++) {
  const spikeGeo = new THREE.ConeGeometry(0.35, 1.0, 4); // 4-sided Minecraft diamond pyramid
  const spikeMesh = new THREE.Mesh(spikeGeo, i % 2 === 0 ? hornMat : accentMat);
  dragonGroup.add(spikeMesh);
  dorsalSpines.push(spikeMesh);
}

// 6. Detailed Minecraft-Style Blocky Body Segments
const dragonSegmentsGroup = new THREE.Group();
dragonGroup.add(dragonSegmentsGroup);
const dragonSegments = [];

const bellyMat = new THREE.MeshStandardMaterial({ color: colorIvory, roughness: 0.9, metalness: 0.0 });
const ribMat = new THREE.MeshStandardMaterial({ color: colorPeriwinkle, roughness: 0.8, metalness: 0.1 });
const armorMat = new THREE.MeshStandardMaterial({ color: colorSlateNavy, roughness: 0.8, metalness: 0.2 });

for (let i = 0; i < NUM_SPINE_POINTS - 1; i++) {
  const segmentGroup = new THREE.Group();
  
  // Core Block
  const coreGeo = new THREE.BoxGeometry(1.4 * BODY_SCALE, 1.4 * BODY_SCALE, SEGMENT_LENGTH * 1.1);
  const coreMesh = new THREE.Mesh(coreGeo, dragonMaterial);
  
  // Underbelly Plate (Wider, flatter, on the bottom)
  const bellyGeo = new THREE.BoxGeometry(1.6 * BODY_SCALE, 0.3 * BODY_SCALE, SEGMENT_LENGTH * 1.05);
  const bellyMesh = new THREE.Mesh(bellyGeo, bellyMat);
  bellyMesh.position.y = -0.6 * BODY_SCALE;
  
  // Lateral Ribs (Extending from the sides)
  const ribGeo = new THREE.BoxGeometry(1.7 * BODY_SCALE, 0.5 * BODY_SCALE, SEGMENT_LENGTH * 0.7);
  const ribMesh = new THREE.Mesh(ribGeo, ribMat);
  ribMesh.position.y = 0.1 * BODY_SCALE;
  
  // Upper Armor Plate (Top)
  const armorGeo = new THREE.BoxGeometry(1.2 * BODY_SCALE, 0.2 * BODY_SCALE, SEGMENT_LENGTH * 0.9);
  const armorMesh = new THREE.Mesh(armorGeo, armorMat);
  armorMesh.position.y = 0.7 * BODY_SCALE;
  
  segmentGroup.add(coreMesh);
  segmentGroup.add(bellyMesh);
  segmentGroup.add(ribMesh);
  segmentGroup.add(armorMesh);
  
  dragonSegmentsGroup.add(segmentGroup);
  dragonSegments.push(segmentGroup);
}

// 7. Lateral Voxel Fins (attached to specific segments)
const lateralFinIndices = [10, 25, 45, 65];

lateralFinIndices.forEach(idx => {
  if (idx < dragonSegments.length) {
    const leftFin = createVoxelFin(true);
    leftFin.scale.set(1.2, 1.2, 1.2);
    
    const rightFin = createVoxelFin(false);
    rightFin.scale.set(1.2, 1.2, 1.2);
    
    dragonSegments[idx].add(leftFin);
    dragonSegments[idx].add(rightFin);
  }
});

// ==============================
// BACKGROUND: Celestial Lanterns, Auspicious Clouds & Stardust
// ==============================
const backgroundGroup = new THREE.Group();
scene.add(backgroundGroup);

// 1. Lanterns
const lanterns = [];
const lanternBodyGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.2, 12);
const lanternCapGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 12);
const lanternGlowGeo = new THREE.SphereGeometry(0.2, 12, 12);
const tasselGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4);

const lanternMat = new THREE.MeshStandardMaterial({
  color: colorIvory, roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.9
});
const lanternCapMat = new THREE.MeshStandardMaterial({ color: colorSlateNavy, roughness: 0.6 });
const lanternGlowMat = new THREE.MeshStandardMaterial({
  color: 0xffaa44, emissive: 0xff8822, emissiveIntensity: 1.5
});
const tasselMat = new THREE.MeshStandardMaterial({ color: 0xc83c3c, roughness: 0.9 });

for (let i = 0; i < 20; i++) {
  const lantern = new THREE.Group();
  
  const body = new THREE.Mesh(lanternBodyGeo, lanternMat);
  const topCap = new THREE.Mesh(lanternCapGeo, lanternCapMat);
  topCap.position.y = 0.6;
  const bottomCap = new THREE.Mesh(lanternCapGeo, lanternCapMat);
  bottomCap.position.y = -0.6;
  const glow = new THREE.Mesh(lanternGlowGeo, lanternGlowMat);
  const tassel = new THREE.Mesh(tasselGeo, tasselMat);
  tassel.position.y = -0.9;
  
  lantern.add(body, topCap, bottomCap, glow, tassel);
  
  lantern.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 30 - 15
  );
  lantern.userData = {
    speedY: 0.02 + Math.random() * 0.03,
    wobbleSpeed: 0.5 + Math.random() * 1.5,
    wobbleOffset: Math.random() * Math.PI * 2,
    baseX: lantern.position.x
  };
  
  lanterns.push(lantern);
  backgroundGroup.add(lantern);
}

// 2. Auspicious Clouds (Xiangyun)
const clouds = [];
const cloudGeo = new THREE.SphereGeometry(1.5, 16, 16);
const cloudMat = new THREE.MeshStandardMaterial({
  color: colorPaleBlue, roughness: 1.0, transparent: true, opacity: 0.5
});

for (let i = 0; i < 10; i++) {
  const cloud = new THREE.Group();
  for (let j = 0; j < 4; j++) {
    const puff = new THREE.Mesh(cloudGeo, cloudMat);
    puff.position.set(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 2
    );
    puff.scale.set(1 + Math.random() * 0.5, 0.6 + Math.random() * 0.3, 1 + Math.random() * 0.5);
    cloud.add(puff);
  }
  cloud.position.set(
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 40 - 20
  );
  cloud.userData = {
    speedX: (Math.random() - 0.5) * 0.02,
    baseY: cloud.position.y,
    floatSpeed: 0.2 + Math.random() * 0.5,
    floatOffset: Math.random() * Math.PI * 2
  };
  clouds.push(cloud);
  backgroundGroup.add(cloud);
}

// 3. Stardust Embers
const stardustGeo = new THREE.OctahedronGeometry(0.1);
const stardustMat = new THREE.MeshStandardMaterial({
  color: 0xffdd88, emissive: 0xffaa44, emissiveIntensity: 1.0
});
const embers = [];
for (let i = 0; i < 100; i++) {
  const ember = new THREE.Mesh(stardustGeo, stardustMat);
  ember.position.set(
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 40 - 10
  );
  ember.userData = {
    speedY: 0.05 + Math.random() * 0.05,
    wobbleSpeed: 1.0 + Math.random() * 2.0,
    wobbleOffset: Math.random() * Math.PI * 2,
    baseX: ember.position.x
  };
  embers.push(ember);
  backgroundGroup.add(ember);
}

// ==============================
// DRAGON BREATH PARTICLES (Mystical Fire Trail)
// ==============================
const breathParticles = [];
const NUM_BREATH_PARTICLES = 60;
const breathGeo = new THREE.SphereGeometry(0.08, 8, 8);
const breathMats = [
  new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: 0xff6622, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }),
];

for (let i = 0; i < NUM_BREATH_PARTICLES; i++) {
  const particle = new THREE.Mesh(breathGeo, breathMats[i % breathMats.length]);
  particle.position.set(0, -100, 0); // Hidden initially
  particle.userData = {
    life: 0,
    maxLife: 30 + Math.random() * 40,
    velocity: new THREE.Vector3(),
    active: false,
    baseScale: 0.5 + Math.random() * 1.0
  };
  scene.add(particle);
  breathParticles.push(particle);
}

let breathEmitCounter = 0;

// ==============================
// THE FLAMING PEARL (Spiritual Energy)
// ==============================
const pearlGroup = new THREE.Group();
scene.add(pearlGroup);

const pearlGeo = new THREE.SphereGeometry(0.8, 32, 32);
const pearlMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffaa00,
  emissiveIntensity: 2.5,
  roughness: 0.1,
  metalness: 0.8,
  transparent: true,
  opacity: 0.95
});
const pearlMesh = new THREE.Mesh(pearlGeo, pearlMat);
pearlGroup.add(pearlMesh);

// Glowing aura
const auraGeo = new THREE.SphereGeometry(1.2, 32, 32);
const auraMat = new THREE.MeshBasicMaterial({
  color: 0xffaa00,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const auraMesh = new THREE.Mesh(auraGeo, auraMat);
pearlGroup.add(auraMesh);

// Add detailed mystical rings
const ringGeo1 = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
const ring1 = new THREE.Mesh(ringGeo1, ringMat);
const ringGeo2 = new THREE.TorusGeometry(1.7, 0.03, 16, 64);
const ring2 = new THREE.Mesh(ringGeo2, ringMat);
const ringGeo3 = new THREE.TorusGeometry(2.0, 0.02, 16, 64);
const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xffdd88, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
pearlGroup.add(ring1);
pearlGroup.add(ring2);
pearlGroup.add(ring3);

const pearlLight = new THREE.PointLight(0xffdd66, 5, 20);
pearlGroup.add(pearlLight);

// --- 3D SCISSORS — Matte ---
const scissorGroup = new THREE.Group();
const scissorMat = new THREE.MeshStandardMaterial({
  color: colorIvory,
  roughness: 0.4,
  metalness: 0.3
});
const handleMatScissor = new THREE.MeshStandardMaterial({
  color: colorPeriwinkle,
  roughness: 0.7,
  metalness: 0.1
});

// Top Half
const topHalf = new THREE.Group();
const bladeGeo = new THREE.BoxGeometry(4, 0.5, 0.1);
const topBlade = new THREE.Mesh(bladeGeo, scissorMat);
topBlade.position.set(2, 0, 0);
const handleGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
const topHandle = new THREE.Mesh(handleGeo, handleMatScissor);
topHandle.position.set(-1.5, 0, 0);
topHalf.add(topBlade);
topHalf.add(topHandle);

// Bottom Half
const bottomHalf = new THREE.Group();
const bottomBlade = new THREE.Mesh(bladeGeo, scissorMat);
bottomBlade.position.set(2, 0, 0);
const bottomHandle = new THREE.Mesh(handleGeo, handleMatScissor);
bottomHandle.position.set(-1.5, 0, 0);
bottomHalf.add(bottomBlade);
bottomHalf.add(bottomHandle);

// Pivot Pin
const pinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
const pin = new THREE.Mesh(pinGeo, scissorMat);
pin.rotation.x = Math.PI / 2;

// Initial Open State
topHalf.rotation.z = Math.PI / 8;
bottomHalf.rotation.z = -Math.PI / 8;

scissorGroup.add(topHalf);
scissorGroup.add(bottomHalf);
scissorGroup.add(pin);

// Start near camera
scissorGroup.position.set(0, -3, 18);
scissorGroup.scale.set(0.3, 0.3, 0.3);
scene.add(scissorGroup);

// Animation Loop
const clock = new THREE.Clock();
let elapsedTime = 0;

function animate() {
  elapsedTime = clock.getElapsedTime();

  // Smooth mouse interpolation
  mouse.lerp(targetMouse, 0.05);
  
  // Flaming Pearl — follows mouse but FLEES from the dragon when it gets close
  const pearlTime = elapsedTime * 1.5;
  
  // Base target from mouse + gentle autonomous float
  const pearlBaseX = mouse.x * 16 + Math.sin(pearlTime * 0.7) * 3;
  const pearlBaseY = mouse.y * 10 + Math.sin(pearlTime) * 1.5 + Math.cos(pearlTime * 0.4) * 2;
  const pearlBaseZ = Math.cos(pearlTime * 0.8) * 3;
  const pearlBase = new THREE.Vector3(pearlBaseX, pearlBaseY, pearlBaseZ);
  
  // Check distance between dragon head and pearl
  const dragonToPearl = new THREE.Vector3().subVectors(pearlGroup.position, spinePoints[0]);
  const distToPearl = dragonToPearl.length();
  
  // When dragon gets close, pearl darts away!
  const fleeRadius = 40;  // Start fleeing when dragon is within this distance
  const pearlTarget = pearlBase.clone();
  if (distToPearl < fleeRadius && distToPearl > 0.01) {
    // Flee direction: away from the dragon head
    const fleeDir = dragonToPearl.normalize();
    // Flee strength increases as dragon gets closer (inverse relationship)
    const fleeStrength = ((fleeRadius - distToPearl) / fleeRadius) * 25;
    pearlTarget.add(fleeDir.multiplyScalar(fleeStrength));
  }
  
  pearlGroup.position.lerp(pearlTarget, 0.04);
  
  // Aura pulsation and ring spin
  auraMesh.scale.setScalar(1.0 + Math.sin(elapsedTime * 6) * 0.15);
  ring1.rotation.x += 0.02;
  ring1.rotation.y += 0.03;
  ring2.rotation.x -= 0.03;
  ring2.rotation.z += 0.02;
  ring3.rotation.y -= 0.02;
  ring3.rotation.z -= 0.01;

  // Dragon Animation — Dragon eagerly chases the Flaming Pearl but never catches it
  // The dragon always steers directly toward the pearl
  const chaseTarget = pearlGroup.position.clone();
  
  // Add subtle serpentine weaving so the path isn't a boring straight line
  const weaveTime = elapsedTime * 1.2;
  const weaveAmount = 2.5;
  // Perpendicular weave: compute a sideways offset relative to chase direction
  const chaseDir = new THREE.Vector3().subVectors(chaseTarget, spinePoints[0]);
  if (chaseDir.lengthSq() > 0.01) {
    const right = new THREE.Vector3().crossVectors(chaseDir.normalize(), new THREE.Vector3(0, 1, 0)).normalize();
    const weaveOffset = right.multiplyScalar(Math.sin(weaveTime) * weaveAmount);
    chaseTarget.add(weaveOffset);
    // Add a gentle vertical wave too
    chaseTarget.y += Math.sin(weaveTime * 1.6) * 1.5;
  }
  
  // Soft steering — dragon glides calmly toward the pearl
  spinePoints[0].lerp(chaseTarget, 0.02);
  
  // Step 1: Smooth follow-the-leader relaxation
  for (let i = 1; i < NUM_SPINE_POINTS; i++) {
    const prev = spinePoints[i - 1];
    const curr = spinePoints[i];
    
    const dir = new THREE.Vector3().subVectors(curr, prev);
    if (dir.lengthSq() < 0.0001) {
      dir.set(0, 0, -1);
    } else {
      dir.normalize();
    }
    
    // Natural trailing target position
    const target = prev.clone().add(dir.multiplyScalar(SEGMENT_LENGTH));
    curr.lerp(target, 0.5);
  }
  
  // Step 2: Strict distance constraint pass (ensures zero stretching, lagging, or jitter)
  for (let i = 1; i < NUM_SPINE_POINTS; i++) {
    const prev = spinePoints[i - 1];
    const curr = spinePoints[i];
    const dir = new THREE.Vector3().subVectors(curr, prev);
    const dist = dir.length();
    if (dist > 0.0001) {
      dir.normalize();
      curr.copy(prev).add(dir.multiplyScalar(SEGMENT_LENGTH));
    }
  }
  
  // Update head position & orientation smoothly
  dragonHeadGroup.position.copy(spinePoints[0]);
  if (spinePoints.length > 1) {
    // For Object3D, lookAt() points the local +Z axis at the target.
    // The snout geometry is along +Z, so +Z must point FORWARD (away from body).
    // Reflect spinePoints[1] through spinePoints[0] to get a point ahead of the head.
    const forwardTarget = new THREE.Vector3()
      .subVectors(spinePoints[0], spinePoints[1])  // direction from body toward head
      .add(spinePoints[0]);                          // project ahead of head
    dragonHeadGroup.lookAt(forwardTarget);
  }
  
  // Animate Dragon Mouth (Rhythmic opening and closing)
  // Negative rotation.x opens the jaw DOWNWARD (correct anatomical direction)
  if (jawGroup) {
    jawGroup.rotation.x = Math.min(0, -Math.abs(Math.sin(elapsedTime * 2.5)) * 0.3);
  }
  
  // Update tail position & orientation (Minecraft-style spiked club)
  const tailIdx = NUM_SPINE_POINTS - 1;
  dragonTailGroup.position.copy(spinePoints[tailIdx]);
  if (tailIdx > 0) {
    // Tail stinger is along +Z. lookAt points +Z at target.
    // We want +Z pointing AWAY from the body (trailing behind).
    // Reflect spinePoints[tailIdx-1] through spinePoints[tailIdx].
    const tailForward = new THREE.Vector3()
      .subVectors(spinePoints[tailIdx], spinePoints[tailIdx - 1])  // direction from body toward tail end
      .add(spinePoints[tailIdx]);                                    // project behind tail
    dragonTailGroup.lookAt(tailForward);
  }
  
  // Update dorsal spines along the back
  for (let i = 0; i < dorsalSpines.length; i++) {
    const spineIdx = Math.min((i * 3) + 3, NUM_SPINE_POINTS - 2);
    const pos = spinePoints[spineIdx];
    const nextPos = spinePoints[spineIdx + 1];
    const prevPos = spinePoints[spineIdx - 1];
    
    dorsalSpines[i].position.copy(pos);
    
    const forward = new THREE.Vector3().subVectors(prevPos, nextPos).normalize();
    const target = pos.clone().add(forward);
    dorsalSpines[i].lookAt(target);
    dorsalSpines[i].rotation.x += Math.PI / 2; // Tilt 90 deg up along spine normal
    
    const t = spineIdx / NUM_SPINE_POINTS;
    const s = BODY_SCALE * (1.0 - t * 0.6);
    dorsalSpines[i].scale.set(s, s, s);
  }
  
  // Update Minecraft body segments
  for (let i = 0; i < NUM_SPINE_POINTS - 1; i++) {
    const p1 = spinePoints[i];
    const p2 = spinePoints[i + 1];
    const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    
    dragonSegments[i].position.copy(midPoint);
    dragonSegments[i].lookAt(p2);
    
    // Taper scale
    const t = i / (NUM_SPINE_POINTS - 1);
    let scale = 1.0;
    if (t < 0.1) scale = 1.0;
    else if (t > 0.8) {
      const tailT = (t - 0.8) / 0.2;
      scale = 0.8 * (1.0 - tailT * 0.85);
    } else {
      const midT = (t - 0.1) / 0.7;
      scale = 1.0 - midT * 0.2;
    }
    dragonSegments[i].scale.set(scale, scale, 1.0);
  }

  // Dragon Breath Particles — mystical wisps stream from the mouth
  breathEmitCounter++;
  if (breathEmitCounter % 2 === 0) { // Emit every 2 frames
    // Find an inactive particle to activate
    for (let i = 0; i < breathParticles.length; i++) {
      const p = breathParticles[i];
      if (!p.userData.active) {
        p.userData.active = true;
        p.userData.life = 0;
        
        // Compute mouth position: forward from the dragon head
        const headPos = spinePoints[0];
        const headDir = new THREE.Vector3().subVectors(spinePoints[0], spinePoints[1]).normalize();
        const mouthPos = headPos.clone().add(headDir.multiplyScalar(4 * BODY_SCALE));
        
        p.position.copy(mouthPos);
        
        // Spread velocity forward + randomized scatter
        const spread = 0.15;
        p.userData.velocity.set(
          headDir.x * 0.3 + (Math.random() - 0.5) * spread,
          headDir.y * 0.3 + (Math.random() - 0.5) * spread + 0.05,
          headDir.z * 0.3 + (Math.random() - 0.5) * spread
        );
        
        p.scale.setScalar(p.userData.baseScale);
        p.visible = true;
        break; // Only emit one per frame
      }
    }
  }
  
  // Update active particles
  for (let i = 0; i < breathParticles.length; i++) {
    const p = breathParticles[i];
    if (p.userData.active) {
      p.userData.life++;
      p.position.add(p.userData.velocity);
      
      // Fade out and shrink
      const lifeRatio = p.userData.life / p.userData.maxLife;
      const fadeScale = p.userData.baseScale * (1 - lifeRatio);
      p.scale.setScalar(Math.max(fadeScale, 0.01));
      p.material.opacity = (1 - lifeRatio) * 0.7;
      
      // Float upward slightly
      p.position.y += 0.01;
      
      // Recycle when dead
      if (p.userData.life >= p.userData.maxLife) {
        p.userData.active = false;
        p.visible = false;
        p.position.set(0, -100, 0);
      }
    }
  }

  // Background Animations
  const parallaxX = mouse.x * 5;
  const parallaxY = mouse.y * 5;

  lanterns.forEach(lantern => {
    lantern.position.y += lantern.userData.speedY;
    if (lantern.position.y > 25) lantern.position.y = -25;
    const wobble = Math.sin(elapsedTime * lantern.userData.wobbleSpeed + lantern.userData.wobbleOffset) * 0.5;
    lantern.position.x = lantern.userData.baseX + wobble + parallaxX * 0.5;
    lantern.rotation.z = Math.sin(elapsedTime * lantern.userData.wobbleSpeed) * 0.1;
  });

  clouds.forEach(cloud => {
    cloud.position.x += cloud.userData.speedX;
    if (cloud.position.x > 35) cloud.position.x = -35;
    if (cloud.position.x < -35) cloud.position.x = 35;
    cloud.position.y = cloud.userData.baseY + Math.sin(elapsedTime * cloud.userData.floatSpeed + cloud.userData.floatOffset) * 0.8 + parallaxY * 0.2;
  });

  embers.forEach(ember => {
    ember.position.y += ember.userData.speedY;
    if (ember.position.y > 25) ember.position.y = -25;
    const wobble = Math.sin(elapsedTime * ember.userData.wobbleSpeed + ember.userData.wobbleOffset) * 0.2;
    ember.position.x = ember.userData.baseX + wobble + parallaxX * 0.8;
    ember.rotation.x += 0.05;
    ember.rotation.y += 0.05;
  });

  backgroundGroup.rotation.x = mouse.y * 0.05;
  backgroundGroup.rotation.y = mouse.x * 0.05;

  // Direct render — no bloom/post-processing
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Resize
function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  
  // Dynamic mobile framing: pull camera back if in portrait mode on a small screen
  if (width < 768 && width < height) {
    camera.position.z = 30; // Zoomed out to fit dragon
  } else {
    camera.position.z = 18; // Default desktop distance
  }
  
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
window.addEventListener('resize', handleResize);
handleResize(); // Initialize with correct zoom

// GSAP Scroll Animations

// --- GRAND OPENING SEQUENCE: THE RIBBON CUT ---
if (!document.getElementById('ribbon-group')) {
  scissorGroup.visible = false;
} else {
  // Hide UI elements so nothing is available to interact with before the cut
  gsap.set('.brutal-header, .content > section, .content > div:not(#ribbon-group), .footer', { opacity: 0, pointerEvents: 'none' });
  
  // Bring WebGL canvas to front during intro so scissors can cut the ribbon
  document.getElementById('webgl-canvas').classList.add('front-layer');

  // 1. Scissors fly from camera towards the ribbon
  window.introTl = gsap.timeline({ paused: true });
  const introTl = window.introTl;

  // 1. Scissors fly from camera towards the ribbon
  introTl.to(scissorGroup.position, {
    x: -2, y: 0, z: 5, // Offset x to -2 so the blades (at x=2 relative to pivot) hit the exact center
    duration: 1,
    ease: "power3.out"
  }, 3.5);
  introTl.to(scissorGroup.scale, {
    x: 1.5, y: 1.5, z: 1.5,
    duration: 1,
    ease: "power3.out"
  }, 3.5);

  // 2. Scissors Snip
  introTl.to(topHalf.rotation, { z: -Math.PI/6, duration: 0.2, ease: "power4.in" }, 4.5);
  introTl.to(bottomHalf.rotation, { z: Math.PI/6, duration: 0.2, ease: "power4.in" }, 4.5);

  // 3. Ribbon snaps and breaks in half
  introTl.to('.main-marquee-left, .bg-marquee-left', {
    y: "100vh", x: "-20vw", rotation: -45, opacity: 0,
    duration: 1, ease: "power2.in"
  }, 4.6);

  introTl.to('.main-marquee-right, .bg-marquee-right', {
    y: "100vh", x: "20vw", rotation: 15, opacity: 0,
    duration: 1, ease: "power2.in"
  }, 4.6);

  // Play Sound Effect at exact moment of cut
  introTl.call(() => playGlobalSound('snip'), null, 4.6);

  // Screen Flash
  introTl.to('#flash-overlay', { opacity: 1, duration: 0.1, ease: "power4.out" }, 4.6);
  
  // The moment the screen flashes, push the WebGL canvas back behind the UI
  introTl.call(() => document.getElementById('webgl-canvas').classList.remove('front-layer'), null, 4.6);
  
  introTl.to('#flash-overlay', { opacity: 0, duration: 1.0, ease: "power2.out" }, 4.7);

  // 4. Scissors drop away
  introTl.to(scissorGroup.position, {
    z: -50, y: -30,
    duration: 1.5, ease: "power2.in"
  }, 4.7);
  introTl.to(scissorGroup.rotation, {
    z: Math.PI / 4, x: Math.PI / 2,
    duration: 1.5, ease: "power2.in"
  }, 4.7);
  
  // Reveal UI elements post-cut
  introTl.to('.brutal-header, .content > section, .content > div:not(#ribbon-group), .footer', { 
    opacity: 1, pointerEvents: 'auto', duration: 1.5, ease: "power2.inOut" 
  }, 4.7);

  // 5. Hero Text
  introTl.from('.hero-content', {
    opacity: 0, y: 100, scale: 0.9,
    duration: 1.5, ease: "power4.out"
  }, 5.0);
}

// --- Scroll Progress Bar ---
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, var(--periwinkle), var(--ivory));
  z-index: 9998; transition: width 0.1s linear; pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
}, { passive: true });

// --- Section Reveal Animations ---
const textElements = gsap.utils.toArray('.brutal-text:not(.hero-content .brutal-text), .mono-text:not(.marquee-container .mono-text, .hero-content .mono-text)');
textElements.forEach(el => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 95%",
      end: "top 60%",
      scrub: 1
    },
    x: (Math.random() > 0.5 ? 100 : -100),
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  });
});

// Staggered card reveals — cards cascade in one by one
const cardGroups = document.querySelectorAll('.about-grid');
cardGroups.forEach(grid => {
  const cards = grid.querySelectorAll('.brutal-card');
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        end: "top 65%",
        scrub: 1
      },
      y: 60,
      opacity: 0,
      scale: 0.95,
      delay: i * 0.1,
      duration: 1,
      ease: "power3.out"
    });
  });
});

// Scroll rotates background
gsap.to(backgroundGroup.rotation, {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  },
  z: Math.PI / 4
});

// Zoom camera in
gsap.to(camera.position, {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  },
  z: 5
});

// --- Dynamic Tagline with Typing Effect ---
const taglines = [
  "Diplomacy. Discourse. Decision.",
  "Where Ideas Become Arguments. And Arguments Become Change.",
  "The Planet Needs Thinkers Who Act.",
  "500+ Delegates. 30+ Schools. One Vision.",
  "Jodhpur's Premier Youth Leadership Summit."
];
let currentTaglineIndex = 0;
const taglineEl = document.getElementById("dynamic-tagline");

if (taglineEl) {
  function typeText(text, element, callback) {
    element.innerText = '';
    element.style.opacity = 1;
    let i = 0;
    const speed = 35;
    function type() {
      if (i < text.length) {
        element.innerText += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        setTimeout(callback, 2500); // Pause before erasing
      }
    }
    type();
  }
  
  function eraseText(element, callback) {
    const text = element.innerText;
    let i = text.length;
    function erase() {
      if (i > 0) {
        element.innerText = text.substring(0, i - 1);
        i--;
        setTimeout(erase, 20);
      } else if (callback) {
        setTimeout(callback, 300);
      }
    }
    erase();
  }
  
  function cycleTaglines() {
    typeText(taglines[currentTaglineIndex], taglineEl, () => {
      eraseText(taglineEl, () => {
        currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
        cycleTaglines();
      });
    });
  }
  
  // Start after a short delay
  setTimeout(cycleTaglines, 1500);
}

// --- Live Countdown Timer ---
const summitDate = new Date('2027-05-16T00:00:00+05:30');

function updateCountdown() {
  const now = new Date();
  const diff = summitDate - now;
  
  if (diff <= 0) return;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');
  
  if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
  if (minsEl) minsEl.innerText = String(mins).padStart(2, '0');
  if (secsEl) secsEl.innerText = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// --- Animated Stat Counters ---
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    element.innerText = current + '+';
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Observe stat cards and trigger counter animation
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const h2 = entry.target.querySelector('h2');
      if (h2) {
        const target = parseInt(h2.innerText);
        if (!isNaN(target)) {
          animateCounter(h2, target);
        }
      }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-card[style*="background: var(--accent-color)"], .about-card[style*="background: var(--ivory)"], .about-card[style*="background: var(--pale-blue)"]').forEach(card => {
  statObserver.observe(card);
});

// --- Back to Top Button ---
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  }, { passive: true });
}

// --- Register Button Whoosh Effect ---
const registerBtn = document.getElementById('register-btn');
const flashOverlay = document.getElementById('flash-overlay');

if (registerBtn && flashOverlay) {
  registerBtn.addEventListener('click', () => {
    // 1. Play Synthesized Cinematic Whoosh (Web Audio API)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      
      const bufferSize = audioCtx.sampleRate * 1.5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate Pink Noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // gain compensation
        b6 = white * 0.115926;
      }
      
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      
      // Sweeping Bandpass filter for the "whoosh" motion
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.value = 1.0;
      bandpass.frequency.setValueAtTime(100, audioCtx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
      bandpass.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.2);
      
      // Amplitude Envelope (Fade in quickly, fade out smoothly)
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1.8, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      noiseSource.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      noiseSource.start();
    } catch (e) {
      console.warn("Audio Context blocked or unsupported", e);
    }
    
    // 2. White Screen Flash Animation (GSAP)
    gsap.fromTo(flashOverlay, 
      { opacity: 1 }, 
      { opacity: 0, duration: 1.2, ease: "power2.out" }
    );
    
    // Redirect to register page shortly after the flash
    setTimeout(() => {
      window.location.href = '/register.html';
    }, 500);
  });
}

// --- Header Scroll Animation ---
ScrollTrigger.create({
  trigger: "body",
  start: "top -80",
  end: 99999,
  toggleClass: { className: "scrolled", targets: ".brutal-header" }
});

// --- Register Page Selection Logic ---
const registerCards = document.querySelectorAll('.register-card');
const selectedVerticalName = document.getElementById('selected-vertical-name');

if (registerCards.length > 0) {
  registerCards.forEach(card => {
    card.addEventListener('click', () => {
      // Deselect all
      registerCards.forEach(c => {
        c.classList.remove('selected');
        c.querySelector('.card-action').innerText = 'Select & Register';
      });
      
      // Select clicked
      card.classList.add('selected');
      card.querySelector('.card-action').innerText = 'Selected ✓';
      
      // Update form text
      if (selectedVerticalName) {
        selectedVerticalName.innerText = card.getAttribute('data-vertical');
      }
    });
  });
}

// ==========================================
// Global Loader & Navigation Transitions
// ==========================================
window.addEventListener('load', () => {
  const loader = document.getElementById('global-loader');
  const loaderText = document.getElementById('loader-text');
  const loaderBar = document.getElementById('loader-bar');
  const enterBtn = document.getElementById('enter-experience-btn');
  
  if (loader && loaderText && loaderBar && enterBtn) {
    // Initial text state
    const targetText = "CAELYS SYSTEM ONLINE";
    
    const tl = gsap.timeline({
      onComplete: () => {
        const isHome = !!document.getElementById('ribbon-group');
        if (isHome) {
          // When bar is full on homepage, show the ENTER button instead of fading out
          enterBtn.style.display = 'block';
          gsap.fromTo(enterBtn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        } else {
          // On other pages, just auto-fade the loader
          try { initAudioContext(); playGlobalSound('startup'); } catch (e) {}
          // Also start loader music if audio is unlocked
          startLoaderMusic();
          gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              loader.style.display = 'none';
              stopLoaderMusic();
            }
          });
        }
      }
    });

    // Handle Enter Button Click
    enterBtn.addEventListener('click', () => {
      // 1. Force audio engine unlock
      initAudioContext();
      playGlobalSound('startup');
      
      // 2. Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          loader.style.display = 'none';
          // 3. Trigger 3D ribbon cut if on homepage
          if (window.introTl) {
            window.introTl.play();
          }
        }
      });
    });

    // Scramble text effect
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    let iterations = 0;
    const interval = setInterval(() => {
      loaderText.innerText = targetText.split("").map((char, index) => {
        if (index < iterations) return targetText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      
      if (iterations >= targetText.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);

    // Loader bar fills up quickly
    tl.to(loaderBar, { width: "100%", duration: 1.2, ease: "power4.inOut" });
  } else if (loader) {
    gsap.to(loader, { opacity: 0, duration: 0.8, onComplete: () => {
      loader.style.display = 'none';
      stopLoaderMusic();
    }});
  }
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  if (href && href.startsWith('/') && !href.startsWith('/#')) {
    e.preventDefault();
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.style.display = 'flex';
      startLoaderMusic(); // Start crunching data sound!
      gsap.to(loader, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = href;
        }
      });
    } else {
      window.location.href = href;
    }
  }
});

// ==========================================
// Global Audio Synthesizer (Ambient + UI)
// ==========================================
let globalAudioCtx = null;
let bgGain = null;

let sequencerInterval = null;

function initAudioContext() {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    globalAudioCtx = new AudioContext();
    
    bgGain = globalAudioCtx.createGain();
    bgGain.gain.value = 0.4; // Increased volume for beats
    bgGain.connect(globalAudioCtx.destination);
    
    const path = window.location.pathname;
    
    // Base Frequencies for 12-tone scale (starting at C2 = 65.41)
    const baseFreqs = [65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47];
    
    let currentRoot = 0; // C
    let currentScale = [];
    let tempoMs = 400; // Calm, ambient tempo
    
    // Generate Major Pentatonic starting at a root index
    function generateScale(root) {
        let sc = [];
        let rFreq = baseFreqs[root];
        // 5 octaves of major pentatonic (0, 2, 4, 7, 9 semitones)
        for(let oct=0; oct<5; oct++) {
            let mult = Math.pow(2, oct);
            sc.push(rFreq * mult);
            sc.push(rFreq * Math.pow(1.059463, 2) * mult);
            sc.push(rFreq * Math.pow(1.059463, 4) * mult);
            sc.push(rFreq * Math.pow(1.059463, 7) * mult);
            sc.push(rFreq * Math.pow(1.059463, 9) * mult);
        }
        return sc;
    }
    
    currentScale = generateScale(currentRoot);
    
    let noteChance = 0.2;
    let chordChance = 0.3;
    let bassChance = 0.15;
    let kickChance = 0.0; // No aggressive beats
    let hatChance = 0.0; // No aggressive beats
    
    let tickCount = 0;
    
    if (sequencerInterval) clearInterval(sequencerInterval);
    
    // The Algorithmic Conductor
    sequencerInterval = setInterval(() => {
        if (!globalAudioCtx || globalAudioCtx.state === 'suspended') return;
        const now = globalAudioCtx.currentTime;
        tickCount++;
        
        // --- MACRO-STRUCTURE: Change the song every 32 ticks (approx 5.7 seconds) ---
        if (tickCount % 32 === 0) {
            // Modulate Key (-2 to +5 semitones)
            currentRoot = (currentRoot + Math.floor(Math.random() * 8) - 2 + 12) % 12;
            currentScale = generateScale(currentRoot);
            
            // Shift density/mood (Calm variations)
            noteChance = 0.1 + Math.random() * 0.3;
            chordChance = 0.2 + Math.random() * 0.4;
            bassChance = 0.1 + Math.random() * 0.2;
            kickChance = 0.0; 
            hatChance = 0.0;
        }
        
        // --- DRUMS (Synthesized) ---
        
        // 1. KICK DRUM (on downbeats)
        if (tickCount % 4 === 0 && Math.random() < kickChance) {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(1.0, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            
            osc.connect(gain);
            gain.connect(bgGain);
            osc.start(now);
            osc.stop(now + 0.35);
        }
        
        // 2. HI-HAT (on upbeats / 8ths)
        if (tickCount % 2 === 1 && Math.random() < hatChance) {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(8000 + Math.random()*2000, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            
            osc.connect(gain);
            gain.connect(bgGain);
            osc.start(now);
            osc.stop(now + 0.06);
        }
        
        // --- SYNTHS ---
        
        // Random Melody Note
        if (Math.random() < noteChance) {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            osc.type = 'sine';
            // Pick a note from upper octaves (index 10 to 18)
            osc.frequency.value = currentScale[Math.floor(Math.random() * 8) + 10]; 
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (tempoMs/1000) * 1.5);
            
            osc.connect(gain);
            gain.connect(bgGain);
            osc.start(now);
            osc.stop(now + 1);
        }
        
        // Random Ambient Chord (3 notes)
        if (tickCount % 8 === 0 && Math.random() < chordChance) {
            const rootIdx = Math.floor(Math.random() * 5) + 5; // Mid register
            const chordNotes = [currentScale[rootIdx], currentScale[rootIdx+2], currentScale[rootIdx+4]];
            
            chordNotes.forEach(freq => {
                const osc = globalAudioCtx.createOscillator();
                const gain = globalAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 3);
                
                osc.connect(gain);
                gain.connect(bgGain);
                osc.start(now);
                osc.stop(now + 3.1);
            });
        }
        
        // Random Bass Pluck
        if (Math.random() < bassChance) {
            const osc = globalAudioCtx.createOscillator();
            const gain = globalAudioCtx.createGain();
            osc.type = 'triangle';
            // Low octave
            osc.frequency.value = currentScale[Math.floor(Math.random() * 5)];
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            
            osc.connect(gain);
            gain.connect(bgGain);
            osc.start(now);
            osc.stop(now + 1.1);
        }
    }, tempoMs);
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

// Loader Audio Engine
let loaderOsc = null;
let loaderGain = null;
let blipLfo = null;

function startLoaderMusic() {
  if (!globalAudioCtx) return; 
  if (globalAudioCtx.state === 'suspended') return;
  if (loaderOsc) return; 

  const now = globalAudioCtx.currentTime;

  // Deep Meditation Bell
  loaderOsc = globalAudioCtx.createOscillator();
  loaderOsc.type = 'sine';
  loaderOsc.frequency.setValueAtTime(200, now); // Low fundamental
  loaderOsc.frequency.exponentialRampToValueAtTime(190, now + 2); // Slight detune over time
  
  loaderGain = globalAudioCtx.createGain();
  loaderGain.gain.setValueAtTime(0, now);
  loaderGain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Soft strike
  loaderGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // Long resonant decay
  
  // Sub-harmonic for depth
  blipLfo = globalAudioCtx.createOscillator();
  blipLfo.type = 'triangle';
  blipLfo.frequency.setValueAtTime(100, now); 
  
  const blipGain = globalAudioCtx.createGain();
  blipGain.gain.setValueAtTime(0, now);
  blipGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
  blipGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  
  blipLfo.connect(blipGain);
  blipGain.connect(globalAudioCtx.destination);
  
  loaderOsc.connect(loaderGain);
  loaderGain.connect(globalAudioCtx.destination);
  
  // Duck background music slightly while loader plays
  if (bgGain) {
    bgGain.gain.setTargetAtTime(0.02, now, 0.1);
  }
  
  blipLfo.start();
  loaderOsc.start();
}

function stopLoaderMusic() {
  if (loaderGain && globalAudioCtx) {
    loaderGain.gain.setTargetAtTime(0.001, globalAudioCtx.currentTime, 0.1);
    
    // Restore background volume
    if (bgGain) {
      bgGain.gain.setTargetAtTime(0.4, globalAudioCtx.currentTime, 0.5);
    }
    
    setTimeout(() => {
      if (loaderOsc) {
        loaderOsc.stop();
        blipLfo.stop();
        loaderOsc = null;
        blipLfo = null;
        loaderGain = null;
      }
    }, 500);
  }
}

function duckAudio() {
  if (bgGain && globalAudioCtx) {
    const now = globalAudioCtx.currentTime;
    bgGain.gain.cancelScheduledValues(now);
    bgGain.gain.setValueAtTime(bgGain.gain.value, now);
    // Duck to very low volume
    bgGain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);
    // Slowly recover over 1.5 seconds to new base volume (0.4)
    bgGain.gain.linearRampToValueAtTime(0.4, now + 1.5);
  }
}

function playGlobalSound(type) {
  try {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') return;
    
    duckAudio(); // Duck background automatically
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'hover') {
      // Very soft, tiny ambient click (non-annoying)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    }
    else if (type === 'navClick') {
      // High-tech crisp chirp
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.11);
    }
    else if (type === 'actionClick') {
      // Deep bassy pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    }
    else if (type === 'snip') {
      // Loud, satisfying acoustic whoosh + click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1.5, ctx.currentTime + 0.02); // Much louder!
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      // Add a metallic click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(4000, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      
      clickGain.gain.setValueAtTime(0, ctx.currentTime);
      clickGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.01);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(ctx.currentTime);
      clickOsc.stop(ctx.currentTime + 0.06);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    }
    else if (type === 'startup') {
      // Soft swelling synth pad
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); // Middle C
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.1);
    }
  } catch (e) {
    // Ignore audio errors gracefully
  }
}

// Attach sound to interactive elements
document.addEventListener('mouseover', (e) => {
  const interactive = e.target.closest('a, button, .brutal-btn, .register-card, select, input');
  if (interactive) {
    playGlobalSound('hover');
  }
});

document.addEventListener('mousedown', (e) => {
  const isNav = e.target.closest('a:not(.brutal-btn)');
  const isAction = e.target.closest('button, .brutal-btn, .register-card');
  
  if (isAction) {
    playGlobalSound('actionClick');
  } else if (isNav) {
    playGlobalSound('navClick');
  } else {
    // Just clicking the page unlocks audio
    initAudioContext();
  }
});

// Try to unlock audio on scroll
window.addEventListener('scroll', function unlockAudio() {
  try {
    const ctx = initAudioContext();
    if (ctx && ctx.state === 'running') {
      window.removeEventListener('scroll', unlockAudio);
    }
  } catch(e) {}
}, { passive: true });

// ==============================
// MOBILE DROPDOWN MENU LOGIC
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.brutal-header');
  const existingNav = document.querySelector('.nav');
  if (!header || !existingNav) return;

  // 1. Create Hamburger Button
  const menuBtn = document.createElement('button');
  menuBtn.className = 'mobile-menu-btn mono-text';
  menuBtn.innerHTML = '&#9776;'; // Hamburger icon
  
  // Insert before the nav to keep layout correct
  header.insertBefore(menuBtn, existingNav);

  // 2. Create Mobile Nav Panel
  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';
  
  // Clone links from existing nav
  panel.innerHTML = existingNav.innerHTML;
  
  document.body.appendChild(panel);

  // 3. Toggle Logic
  let menuOpen = false;
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      panel.classList.add('active');
      menuBtn.innerHTML = '&#10005;'; // Cross icon
      document.body.style.overflow = 'hidden'; // prevent scrolling
    } else {
      panel.classList.remove('active');
      menuBtn.innerHTML = '&#9776;'; // Hamburger icon
      document.body.style.overflow = '';
    }
  });

  // Close menu on link click
  const mobileLinks = panel.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      panel.classList.remove('active');
      menuBtn.innerHTML = '&#9776;'; // Hamburger icon
      document.body.style.overflow = '';
    });
  });
});

// Dynamic Cursor Magnetism
document.addEventListener('DOMContentLoaded', () => {
  const customCursor = document.getElementById('cursor');
  if (!customCursor) return;
  
  const interactables = document.querySelectorAll('a, button, .brutal-card, .brutal-btn');
  
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.style.transform = 'translate(-50%, -50%) scale(3)';
      customCursor.style.backgroundColor = 'transparent';
      customCursor.style.border = '2px solid var(--accent-color)';
      customCursor.style.borderRadius = '50%';
    });
    
    el.addEventListener('mouseleave', () => {
      customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
      customCursor.style.backgroundColor = 'var(--accent-color)';
      customCursor.style.border = '0 solid var(--accent-color)';
      customCursor.style.borderRadius = '0';
    });
  });
});

/* ==========================================
   ULTIMATE VISUAL OVERHAUL (JS LOGIC)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Elements
    const noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.appendChild(noise);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursorOutline);

    const audioToggle = document.createElement('div');
    audioToggle.id = 'audio-toggle';
    audioToggle.className = 'muted';
    audioToggle.innerHTML = '&#128263;'; // Muted speaker
    document.body.appendChild(audioToggle);

    // 2. Custom Cursor Logic
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        // Add a slight delay for the outline (smooth trailing)
        setTimeout(() => {
            cursorOutline.style.left = e.clientX + 'px';
            cursorOutline.style.top = e.clientY + 'px';
        }, 50);
    });

    const hoverables = document.querySelectorAll('a, button, .brutal-btn, .register-card, input, select, textarea');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.brutal-section, .brutal-card, .timeline-item');
    revealElements.forEach(el => el.classList.add('reveal-anim'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Play a subtle reveal sound when large sections appear
                if (entry.target.classList.contains('brutal-section') && !audioToggle.classList.contains('muted')) {
                    playGlobalSound('hover');
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Ambient Drone & Toggle Logic
    let ambientOsc1 = null;
    let ambientOsc2 = null;
    let ambientFilter = null;
    
    function startAmbientDrone() {
        if (!globalAudioCtx) initAudioContext();
        if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
        
        if (ambientOsc1) return; // already playing
        
        // Deep sub drone
        ambientOsc1 = globalAudioCtx.createOscillator();
        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.value = 55; // A1
        
        // Higher harmonic drone
        ambientOsc2 = globalAudioCtx.createOscillator();
        ambientOsc2.type = 'triangle';
        ambientOsc2.frequency.value = 110; // A2
        
        // Filter sweeping slowly
        ambientFilter = globalAudioCtx.createBiquadFilter();
        ambientFilter.type = 'lowpass';
        ambientFilter.frequency.value = 200;
        
        const lfo = globalAudioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // very slow sweep
        const lfoGain = globalAudioCtx.createGain();
        lfoGain.gain.value = 300;
        
        lfo.connect(lfoGain);
        lfoGain.connect(ambientFilter.frequency);
        
        ambientOsc1.connect(ambientFilter);
        ambientOsc2.connect(ambientFilter);
        
        const masterAmbient = globalAudioCtx.createGain();
        masterAmbient.gain.value = 0.15; // keep it quiet in background
        ambientFilter.connect(masterAmbient);
        masterAmbient.connect(bgGain); // connect to our existing bgGain
        
        ambientOsc1.start();
        ambientOsc2.start();
        lfo.start();
    }
    
    function stopAmbientDrone() {
        if (ambientOsc1) {
            ambientOsc1.stop();
            ambientOsc2.stop();
            ambientOsc1.disconnect();
            ambientOsc2.disconnect();
            ambientOsc1 = null;
            ambientOsc2 = null;
        }
    }


});
// 5. Autoplay Audio & Better Button Icon
document.addEventListener('DOMContentLoaded', () => {
    const audioToggle = document.getElementById('audio-toggle');
    
    // Replace unicode with SVG sound wave icon
    const svgMuted = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
    const svgPlaying = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    
    if (audioToggle) {
        audioToggle.innerHTML = svgMuted;
        
        // Enhance button style programmatically
        audioToggle.style.background = 'linear-gradient(135deg, rgba(28,34,60,0.9) 0%, rgba(14,21,37,0.9) 100%)';
        audioToggle.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(144,170,214,0.2)';
    }

    // Auto-start on ANY first interaction
    let hasStarted = false;
    const startAudioEngine = () => {
        if (hasStarted) return;
        hasStarted = true;
        
        if (!globalAudioCtx) initAudioContext();
        globalAudioCtx.resume().then(() => {
            if (typeof startAmbientDrone === 'function') startAmbientDrone();
            if (audioToggle) {
                audioToggle.classList.remove('muted');
                audioToggle.innerHTML = svgPlaying;
                audioToggle.classList.add('playing');
            }
        }).catch(e => {
            // Context blocked
            hasStarted = false; 
        });
        
        // Remove listeners
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
            window.removeEventListener(evt, startAudioEngine);
        });
    };

    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, startAudioEngine, { once: true, passive: true });
    });
    
    // Update toggle click listener to use SVG
    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering the auto-start
            const isMuted = audioToggle.classList.contains('muted');
            if (isMuted) {
                audioToggle.classList.remove('muted');
                audioToggle.classList.add('playing');
                audioToggle.innerHTML = svgPlaying;
                if (!globalAudioCtx) initAudioContext();
                globalAudioCtx.resume().then(() => {
                    if (typeof startAmbientDrone === 'function') startAmbientDrone();
                });
            } else {
                audioToggle.classList.add('muted');
                audioToggle.classList.remove('playing');
                audioToggle.innerHTML = svgMuted;
                if (typeof stopAmbientDrone === 'function') stopAmbientDrone();
            }
        });
    }
});

// 6. Canvas Parallax
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        canvas.style.transform = "translate(" + x + "px, " + y + "px) scale(1.05)";
    }
});
