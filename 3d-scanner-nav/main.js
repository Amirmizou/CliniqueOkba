import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* ================================================================
   PROPORTIONS from reference photos (Siemens Symbia Pro.specta)
   ─────────────────────────────────────────────────────────────
   Measured ratios from source images:
     • Table length ≈ 3× gantry outer diameter
     • Gantry bore ≈ 55% of outer radius
     • Table top height ≈ 40% of gantry total height
     • Table width (depth) ≈ 35% of gantry diameter
     • Detector head width ≈ 55% of gantry diameter
     • Detector head depth ≈ table width
     • Table base width ≈ 55% of table length
   
   Base unit: gantry outer radius = 3.5
   ================================================================ */

const GR  = 3.5;          // gantry outer radius
const BR  = GR * 0.55;    // bore (inner) radius = 1.925
const TL  = GR * 2 * 3;   // table length = 21
const TW  = GR * 2 * 0.35;// table width (depth) = 2.45
const TH  = 2.8;          // table surface height from ground
const GCY = GR * 0.12;    // gantry center Y offset above base

/* ================================================================
   SCENE, RENDERER, CAMERA
   ================================================================ */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0c);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 500);
// Camera pulled back far enough to see the full machine
camera.position.set(-16, 8, 24);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 8;
controls.maxDistance = 60;
// Target center of entire machine (between table center and gantry)
controls.target.set(-2, TH, 0);
// Respecte prefers-reduced-motion (accessibilité + batterie)
const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 0.2;

/* ================================================================
   ENVIRONMENT MAP (procedural gradient for reflections)
   ================================================================ */
const pmremGen = new THREE.PMREMGenerator(renderer);
const envScene = new THREE.Scene();
const envGeo = new THREE.SphereGeometry(50, 64, 64);
const envMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {},
    vertexShader: `varying vec3 vWorldPos;
        void main(){ vWorldPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vWorldPos;
        void main(){
            float y = normalize(vWorldPos).y;
            vec3 top = vec3(0.12, 0.13, 0.16);
            vec3 mid = vec3(0.05, 0.05, 0.07);
            vec3 bot = vec3(0.02, 0.02, 0.03);
            vec3 col = mix(bot, mid, smoothstep(-0.3, 0.0, y));
            col = mix(col, top, smoothstep(0.0, 0.6, y));
            gl_FragColor = vec4(col, 1.0);
        }`
});
envScene.add(new THREE.Mesh(envGeo, envMat));
const envMap = pmremGen.fromScene(envScene, 0, 0.1, 100).texture;
scene.environment = envMap;

/* ================================================================
   LIGHTING — 3-point studio
   ================================================================ */
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const key = new THREE.DirectionalLight(0xffffff, 1.5);
key.position.set(-10, 16, 12);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024); // 1024 suffit pour une navbar → moins de GPU
key.shadow.camera.left = -20; key.shadow.camera.right = 20;
key.shadow.camera.top = 15;   key.shadow.camera.bottom = -5;
key.shadow.bias = -0.0002;
scene.add(key);

const fill = new THREE.DirectionalLight(0xc0d0ff, 0.45);
fill.position.set(12, 10, -8);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffeedd, 0.4);
rim.position.set(4, 3, 18);
scene.add(rim);

const sweepLight = new THREE.PointLight(0x00ccff, 0, 6);
scene.add(sweepLight);

/* ================================================================
   MATERIALS
   ================================================================ */
const bodyWhite = new THREE.MeshPhysicalMaterial({
    color: 0xf0f0f0, roughness: 0.18, metalness: 0.0,
    clearcoat: 0.15, clearcoatRoughness: 0.3,
});
const softWhite   = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.5, metalness: 0.05 });
const panelGray   = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.6, metalness: 0.1 });
const tunnelMat  = new THREE.MeshStandardMaterial({ color: 0xf0f2f5, roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide });
const footingGray = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.65, metalness: 0.15 });
const darkFooting = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.2 });
const orangeLabel = new THREE.MeshStandardMaterial({ color: 0xff6611, roughness: 0.3, emissive: 0xff4400, emissiveIntensity: 0.15 });
const cushionMat  = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.85, metalness: 0.0 });
const pipeMat     = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3, metalness: 0.3 });
const screenMat   = new THREE.MeshPhysicalMaterial({
    color: 0x111122, roughness: 0.05, metalness: 0.9,
    clearcoat: 1.0, clearcoatRoughness: 0.05,
    emissive: 0x112244, emissiveIntensity: 0.15
});
const ledCyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.12 });

const root = new THREE.Group();

/* ================================================================
   1. GANTRY — D-shaped ring body
      Positioned at the RIGHT end of the table
   ================================================================ */
const gantryX = TL / 2 - GR * 0.6; // right side, overlapping table end slightly

function createGantryShape(oR, iR) {
    const s = new THREE.Shape();
    s.moveTo(-oR, -oR * 0.92);
    s.lineTo(-oR, oR * 0.15);
    const N = 40;
    for (let i = 0; i <= N; i++) {
        const a = Math.PI - (i / N) * Math.PI;
        s.lineTo(Math.cos(a) * oR, Math.sin(a) * oR * 0.82 + oR * 0.15);
    }
    s.lineTo(oR, -oR * 0.92);
    s.closePath();

    const hole = new THREE.Path();
    for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const px = Math.cos(a) * iR;
        const py = Math.sin(a) * iR + GCY;
        if (i === 0) hole.moveTo(px, py); else hole.lineTo(px, py);
    }
    s.holes.push(hole);
    return s;
}

const gantryDepth = TW + 0.4;
const gantryGeo = new THREE.ExtrudeGeometry(createGantryShape(GR, BR), {
    depth: gantryDepth, bevelEnabled: true, bevelSegments: 5,
    bevelSize: 0.15, bevelThickness: 0.12, steps: 1
});
const gantryMesh = new THREE.Mesh(gantryGeo, bodyWhite);
gantryMesh.position.set(gantryX, GR * 0.92, -gantryDepth / 2);
gantryMesh.castShadow = true;
gantryMesh.receiveShadow = true;
root.add(gantryMesh);

// Back panel
const bpGeo = new RoundedBoxGeometry(GR * 2 + 0.3, GR * 2 + 0.3, 0.1, 3, 0.05);
const backPanel = new THREE.Mesh(bpGeo, panelGray);
backPanel.position.set(gantryX, GR * 0.92 + GCY, -gantryDepth / 2 - 0.05);
root.add(backPanel);

// Tunnel cylinder
const tLen = gantryDepth + 0.4;
const tunnelGeo = new THREE.CylinderGeometry(BR + 0.01, BR + 0.01, tLen, 64, 1, true);
const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
tunnelMesh.rotation.x = Math.PI / 2;
tunnelMesh.position.set(gantryX, GR * 0.92 + GCY, 0);
root.add(tunnelMesh);

// Decorative inner rings
for (let i = -1; i <= 1; i++) {
    const rGeo = new THREE.TorusGeometry(BR - 0.04, 0.025, 12, 72);
    const r = new THREE.Mesh(rGeo, footingGray);
    r.position.set(gantryX, GR * 0.92 + GCY, i * 0.6);
    root.add(r);
}

// Orange accent ring (front)
const accentRingGeo = new THREE.TorusGeometry(BR + 0.08, 0.045, 14, 80);
const accentRing = new THREE.Mesh(accentRingGeo, orangeLabel);
accentRing.position.set(gantryX, GR * 0.92 + GCY, tLen / 2 - 0.5);
root.add(accentRing);

sweepLight.position.set(gantryX, GR * 0.92 + GCY, 0);

// Gantry base pads
const padGeo = new RoundedBoxGeometry(GR * 1.1, 0.35, gantryDepth + 0.6, 3, 0.06);
[-1, 1].forEach(side => {
    const pad = new THREE.Mesh(padGeo, darkFooting);
    pad.position.set(gantryX + side * GR * 0.5, 0.18, 0);
    pad.receiveShadow = true;
    root.add(pad);
});

/* ================================================================
   2. DETECTOR HEAD — Siemens Symbia Pro.specta
      From reference: chunky multi-segment housing, articulated
      arm with visible joints, mounted at ~1 o'clock on gantry.
      Width ≈ 45% of gantry diameter, thick & layered.
   ================================================================ */
const detW = GR * 2 * 0.42; // width ≈ 2.94
const detD = TW * 0.95;      // depth close to table width
const detH = 0.9;            // chunky height

const detGroup = new THREE.Group();

// ── Upper housing (main detector body) ──
const detUpperGeo = new RoundedBoxGeometry(detW, detH * 0.55, detD, 5, 0.1);
const detUpper = new THREE.Mesh(detUpperGeo, bodyWhite);
detUpper.position.y = detH * 0.25;
detUpper.castShadow = true;
detGroup.add(detUpper);

// ── Lower housing (slightly narrower, gray panel) ──
const detLowerGeo = new RoundedBoxGeometry(detW - 0.15, detH * 0.35, detD - 0.1, 4, 0.08);
const detLower = new THREE.Mesh(detLowerGeo, panelGray);
detLower.position.y = -detH * 0.15;
detLower.castShadow = true;
detGroup.add(detLower);

// ── Bottom face plate (dark detector window) ──
const detFaceGeo = new RoundedBoxGeometry(detW - 0.4, 0.06, detD - 0.4, 3, 0.03);
const detFace = new THREE.Mesh(detFaceGeo, tunnelMat);
detFace.position.y = -detH * 0.35;
detGroup.add(detFace);

// ── Vent grille lines on front face ──
for (let i = 0; i < 6; i++) {
    const ventGeo = new THREE.BoxGeometry(detW * 0.6, 0.006, 0.012);
    const ventMesh = new THREE.Mesh(ventGeo, footingGray);
    ventMesh.position.set(
        -detW * 0.1,
        -detH * 0.05 + (i - 2.5) * 0.06,
        detD / 2 + 0.005
    );
    detGroup.add(ventMesh);
}

// ── Panel seam lines (horizontal grooves, both sides) ──
[-1, 1].forEach(side => {
    const seamGeo = new THREE.BoxGeometry(detW + 0.01, 0.008, 0.015);
    const seamMesh = new THREE.Mesh(seamGeo, footingGray);
    seamMesh.position.set(0, 0.05, side * (detD / 2 + 0.005));
    detGroup.add(seamMesh);
});

// ── Side accent strips (thin orange Siemens line) ──
[-1, 1].forEach(side => {
    const stripGeo = new THREE.BoxGeometry(detW - 0.4, 0.025, 0.025);
    const stripMesh = new THREE.Mesh(stripGeo, orangeLabel);
    stripMesh.position.set(0, detH * 0.05, side * (detD / 2 + 0.01));
    detGroup.add(stripMesh);
});

// ── Orange label badge ──
const labelGeo = new RoundedBoxGeometry(1.0, 0.03, 0.3, 2, 0.015);
const labelMesh = new THREE.Mesh(labelGeo, orangeLabel);
labelMesh.position.set(detW * 0.15, detH * 0.25 + 0.01, detD / 2 + 0.005);
detGroup.add(labelMesh);

// ── Small indicator button (like on the real unit) ──
const btnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 12);
const btnMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.5 });
const btn = new THREE.Mesh(btnGeo, btnMat);
btn.rotation.x = Math.PI / 2;
btn.position.set(-detW * 0.35, detH * 0.2, detD / 2 + 0.01);
detGroup.add(btn);

// ── Articulated Arm Segments ──
// Segment 1: Mounting bracket at gantry (thick block)
const armSeg1Geo = new RoundedBoxGeometry(1.0, 1.4, 1.2, 3, 0.1);
const armSeg1 = new THREE.Mesh(armSeg1Geo, softWhite);
armSeg1.castShadow = true;

// Segment 2: Elbow joint (cylinder)
const jointGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.25, 20);
const jointMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.4 });
const joint1 = new THREE.Mesh(jointGeo, jointMat);
joint1.rotation.x = Math.PI / 2;
joint1.position.set(0, 0.8, 0);

// Segment 3: Forearm beam connecting to detector
const armSeg2Geo = new RoundedBoxGeometry(0.8, 1.6, 0.9, 3, 0.08);
const armSeg2 = new THREE.Mesh(armSeg2Geo, softWhite);
armSeg2.position.set(-0.6, 1.6, 0);
armSeg2.castShadow = true;

// Joint 2 (wrist)
const joint2 = new THREE.Mesh(jointGeo.clone(), jointMat);
joint2.rotation.x = Math.PI / 2;
joint2.position.set(-0.6, 2.3, 0);

// Arm base group
const armGroup = new THREE.Group();
armGroup.add(armSeg1);
armGroup.add(joint1);
armGroup.add(armSeg2);
armGroup.add(joint2);

// ── Panel line on arm segment ──
const armPanelGeo = new THREE.BoxGeometry(0.8, 0.008, 0.92);
const armPanel = new THREE.Mesh(armPanelGeo, footingGray);
armPanel.position.set(-0.6, 1.2, 0);
armGroup.add(armPanel);

// Position arm at ~1-2 o'clock on gantry ring
const armAngle = Math.PI * 0.3; // roughly 55 degrees from top
const armRadial = GR * 0.65;
armGroup.position.set(
    gantryX + Math.sin(armAngle) * armRadial,
    GR * 0.92 + GCY + Math.cos(armAngle) * armRadial,
    0
);
root.add(armGroup);

// Position detector at end of arm
detGroup.position.set(
    gantryX + Math.sin(armAngle) * armRadial - 0.6,
    GR * 0.92 + GCY + Math.cos(armAngle) * armRadial + 2.5,
    0
);
root.add(detGroup);

/* ================================================================
   3. MONITOR — wide touchscreen on vertical ceiling-mount arm
      From reference: vertical white pipe from gantry top, small
      swivel joint, wide black tablet-style screen tilted ~15°,
      blue LED + red LED indicators on top bezel.
   ================================================================ */
const monGroup = new THREE.Group();

// ── Vertical mounting pipe (straight from gantry top) ──
const pipeH = 2.5;
const pipeGeo = new THREE.CylinderGeometry(0.06, 0.06, pipeH, 14);
const pipeVert = new THREE.Mesh(pipeGeo, pipeMat);
pipeVert.position.y = pipeH / 2;
pipeVert.castShadow = true;
monGroup.add(pipeVert);

// ── Swivel joint ball at top of pipe ──
const swivelGeo = new THREE.SphereGeometry(0.12, 16, 16);
const swivelMesh = new THREE.Mesh(swivelGeo, new THREE.MeshStandardMaterial({
    color: 0x999999, roughness: 0.35, metalness: 0.5
}));
swivelMesh.position.y = pipeH;
monGroup.add(swivelMesh);

// ── Short horizontal arm from swivel to screen ──
const hArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12);
const hArm = new THREE.Mesh(hArmGeo, pipeMat);
hArm.rotation.z = Math.PI / 2;
hArm.position.set(0.3, pipeH, 0);
monGroup.add(hArm);

// ── Drop arm to screen ──
const dropGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12);
const drop = new THREE.Mesh(dropGeo, pipeMat);
drop.position.set(0.6, pipeH - 0.25, 0);
monGroup.add(drop);

// ── Screen Assembly (tilted forward ~15°) ──
const screenGroup = new THREE.Group();

// Bezel / body (wide landscape tablet)
const scrW = 2.6; 
const scrH = 1.6;
const scrD = 0.12;
const monBodyGeo = new RoundedBoxGeometry(scrW, scrH, scrD, 5, 0.04);
const monBodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25, metalness: 0.7 });
const monBody = new THREE.Mesh(monBodyGeo, monBodyMat);
monBody.castShadow = true;
screenGroup.add(monBody);

// Screen glass (inset, slightly smaller)
const screenGlassGeo = new THREE.PlaneGeometry(scrW - 0.2, scrH - 0.2);
const screenGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a2a,
    roughness: 0.03,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    emissive: 0x0a1a3a,
    emissiveIntensity: 0.25,
});
const screenGlass = new THREE.Mesh(screenGlassGeo, screenGlassMat);
screenGlass.position.z = scrD / 2 + 0.001;
screenGroup.add(screenGlass);

// ── UI Elements on screen (simulated interface) ──
// Create a canvas texture for fake UI
const uiCanvas = document.createElement('canvas');
uiCanvas.width = 512; uiCanvas.height = 320;
const uiCtx = uiCanvas.getContext('2d');

// Dark background
uiCtx.fillStyle = '#080818';
uiCtx.fillRect(0, 0, 512, 320);

// Top status bar
uiCtx.fillStyle = '#1a2a4a';
uiCtx.fillRect(0, 0, 512, 30);
uiCtx.font = '12px sans-serif';
uiCtx.fillStyle = '#4488cc';
uiCtx.fillText('SYMBIA Pro.specta', 10, 20);
uiCtx.fillStyle = '#44cc66';
uiCtx.fillText('● READY', 420, 20);

// Main display panels
uiCtx.strokeStyle = '#1a3a5a';
uiCtx.lineWidth = 1;
uiCtx.strokeRect(15, 45, 230, 180);
uiCtx.strokeRect(265, 45, 230, 180);

// Panel labels
uiCtx.font = '10px sans-serif';
uiCtx.fillStyle = '#3366aa';
uiCtx.fillText('ANTERIOR', 85, 60);
uiCtx.fillText('POSTERIOR', 340, 60);

// Bottom toolbar
uiCtx.fillStyle = '#0a1525';
uiCtx.fillRect(0, 245, 512, 75);
// Toolbar buttons
for (let i = 0; i < 6; i++) {
    uiCtx.fillStyle = '#152540';
    uiCtx.fillRect(20 + i * 80, 258, 60, 40);
    uiCtx.fillStyle = '#3366aa';
    uiCtx.font = '9px sans-serif';
    const labels = ['SCAN', 'RECON', 'REVIEW', 'PATIENT', 'TOOLS', 'SYSTEM'];
    uiCtx.fillText(labels[i], 28 + i * 80, 282);
}

const uiTexture = new THREE.CanvasTexture(uiCanvas);
const uiPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(scrW - 0.25, scrH - 0.25),
    new THREE.MeshBasicMaterial({ map: uiTexture, transparent: true, opacity: 0.85 })
);
uiPlane.position.z = scrD / 2 + 0.002;
screenGroup.add(uiPlane);

// ── LED indicators on top edge ──
const blueLedGeo = new THREE.SphereGeometry(0.035, 10, 10);
const blueLed = new THREE.Mesh(blueLedGeo, new THREE.MeshBasicMaterial({ color: 0x0088ff }));
blueLed.position.set(-0.3, scrH / 2 - 0.08, scrD / 2 + 0.01);
screenGroup.add(blueLed);

const redLedGeo = new THREE.SphereGeometry(0.03, 10, 10);
const redLed = new THREE.Mesh(redLedGeo, new THREE.MeshBasicMaterial({ color: 0xff2222 }));
redLed.position.set(0.3, scrH / 2 - 0.08, scrD / 2 + 0.01);
screenGroup.add(redLed);

// Tilt screen forward ~15°
screenGroup.rotation.x = -0.26;
screenGroup.position.set(0.6, pipeH - 0.75, 0.15);
monGroup.add(screenGroup);

// ── Small cable dangling from bottom of screen ──
const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.4, pipeH - 1.5, 0.1),
    new THREE.Vector3(0.5, pipeH - 1.8, 0.15),
    new THREE.Vector3(0.4, pipeH - 2.1, 0.08),
    new THREE.Vector3(0.35, pipeH - 2.3, 0.0),
]);
const cableMesh = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 12, 0.02, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
);
monGroup.add(cableMesh);

// ── Green power LED on monitor bottom ──
const monLedGeo = new THREE.SphereGeometry(0.03, 10, 10);
const monLed = new THREE.Mesh(monLedGeo, new THREE.MeshBasicMaterial({ color: 0x00ff44 }));
monLed.position.set(0.6, pipeH - 1.55, scrD / 2 + 0.08);
monGroup.add(monLed);

// Position monitor group at gantry top center
monGroup.position.set(gantryX, GR * 0.92 + GCY + GR * 0.82, 0);
root.add(monGroup);

/* ================================================================
   4. PATIENT TABLE — long, extending left from gantry
   ================================================================ */
const tableCenter = gantryX - TL / 2 + GR * 0.4;

// Ground foot
const footGeo = new RoundedBoxGeometry(TL * 0.35, 0.4, TW + 0.6, 3, 0.08);
const footMesh = new THREE.Mesh(footGeo, darkFooting);
footMesh.position.set(tableCenter, 0.2, 0);
footMesh.receiveShadow = true;
root.add(footMesh);

// Hydraulic column
const colGeo = new RoundedBoxGeometry(TL * 0.15, TH - 1.0, TW * 0.8, 3, 0.08);
const colMesh = new THREE.Mesh(colGeo, footingGray);
colMesh.position.set(tableCenter, (TH - 1.0) / 2 + 0.4, 0);
colMesh.castShadow = true;
root.add(colMesh);

// Stacked ridges (5 layers tapering outward)
for (let i = 0; i < 5; i++) {
    const rW = TL * 0.3 + i * TL * 0.04;
    const rD = TW * 0.7 + i * 0.05;
    const rGeo = new RoundedBoxGeometry(rW, 0.18, rD, 3, 0.04);
    const rMesh = new THREE.Mesh(rGeo, i % 2 === 0 ? softWhite : panelGray);
    rMesh.position.set(tableCenter, 0.8 + i * 0.28, 0);
    rMesh.castShadow = true;
    root.add(rMesh);
}

// Main table body
const tableBodyGeo = new RoundedBoxGeometry(TL, 0.65, TW, 6, 0.18);
const tableBody = new THREE.Mesh(tableBodyGeo, bodyWhite);
tableBody.position.set(tableCenter, TH, 0);
tableBody.castShadow = true;
tableBody.receiveShadow = true;
root.add(tableBody);

// Bottom panel
const tbBotGeo = new RoundedBoxGeometry(TL - 0.1, 0.1, TW - 0.05, 4, 0.04);
const tbBot = new THREE.Mesh(tbBotGeo, panelGray);
tbBot.position.set(tableCenter, TH - 0.35, 0);
root.add(tbBot);

// Cushion
const cushW = TL - 1.0;
const cushGeo = new RoundedBoxGeometry(cushW, 0.15, TW - 0.4, 5, 0.07);
const cushMesh = new THREE.Mesh(cushGeo, cushionMat);
cushMesh.position.set(tableCenter, TH + 0.4, 0);
cushMesh.castShadow = true;
root.add(cushMesh);

// Side LED Strips (both sides)
function createLEDStrip(zPos) {
    const g = new THREE.Group();
    const segCount = 50;
    const totalLen = TL - 3;
    const segLen = totalLen / segCount;
    for (let i = 0; i < segCount; i++) {
        const segGeo = new THREE.BoxGeometry(segLen - 0.02, 0.04, 0.04);
        const t = i / segCount;
        const h = 0.5 + t * 0.12;
        const col = new THREE.Color().setHSL(h, 0.9, 0.6);
        const mat = new THREE.MeshStandardMaterial({
            color: col, emissive: col, emissiveIntensity: 0.6,
            roughness: 0.1, transparent: true, opacity: 0.9
        });
        const seg = new THREE.Mesh(segGeo, mat);
        seg.position.set(tableCenter - totalLen / 2 + i * segLen + segLen / 2, TH - 0.05, zPos);
        g.add(seg);
    }
    const glowGeo = new THREE.PlaneGeometry(totalLen, 0.2);
    const glowMesh = new THREE.Mesh(glowGeo, ledCyanGlowMat);
    glowMesh.position.set(tableCenter, TH - 0.05, zPos + (zPos > 0 ? 0.04 : -0.04));
    if (zPos < 0) glowMesh.rotation.y = Math.PI;
    g.add(glowMesh);
    return g;
}

const ledFront = createLEDStrip(TW / 2 + 0.01);
const ledBack  = createLEDStrip(-TW / 2 - 0.01);
root.add(ledFront);
root.add(ledBack);

// Headrest handle
const hCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -0.6),
    new THREE.Vector3(0, 0.45, -0.45),
    new THREE.Vector3(0, 0.6, 0),
    new THREE.Vector3(0, 0.45, 0.45),
    new THREE.Vector3(0, 0, 0.6),
]);
const hGeo = new THREE.TubeGeometry(hCurve, 16, 0.05, 10, false);
const hMesh = new THREE.Mesh(hGeo, footingGray);
hMesh.position.set(tableCenter - TL / 2 + 0.3, TH + 0.33, 0);
root.add(hMesh);

// Side rails
[-TW / 2 - 0.02, TW / 2 + 0.02].forEach(z => {
    const railGeo = new THREE.BoxGeometry(TL - 0.5, 0.03, 0.03);
    const railMesh = new THREE.Mesh(railGeo, footingGray);
    railMesh.position.set(tableCenter, TH + 0.33, z);
    root.add(railMesh);
});

scene.add(root);

/* ================================================================
   GROUND PLANE
   ================================================================ */
const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.08, metalness: 0.7 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

/* ================================================================
   NAVIGATION MENU
   ================================================================ */
// Libellés alignés sur la vraie navbar de la clinique (mappés vers des ancres/routes lors de l'intégration)
const navItems = [
    { label: 'LE CENTRE',    frac: 0.10, href: '#about' },
    { label: 'SPÉCIALITÉS',  frac: 0.26, href: '#specialties' },
    { label: 'EXAMENS',      frac: 0.42, href: '#equipements' },
    { label: 'MÉDECINS',     frac: 0.60, href: '#medecins' },
    { label: 'CONTACT',      frac: 0.78, href: '#contact' }
];

const navMeshes = [];

function createTextTex(text, hover) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = hover ? 'rgba(0,204,255,0.25)' : 'rgba(255,255,255,0.04)';
    ctx.fillRect(40, c.height - 14, c.width - 80, 3);
    ctx.font = '600 58px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = hover ? '#00eeff' : '#ffffff';
    ctx.fillText(text, c.width / 2, c.height / 2 - 2);
    return new THREE.CanvasTexture(c);
}

navItems.forEach((item) => {
    const x = tableCenter - TL / 2 + 1 + item.frac * (TL - 2);
    const nTex = createTextTex(item.label, false);
    const hTex = createTextTex(item.label, true);

    const mat = new THREE.MeshStandardMaterial({
        map: nTex, transparent: true, roughness: 0.6, metalness: 0.0,
        emissive: new THREE.Color(0x000000), emissiveMap: nTex, emissiveIntensity: 0,
        depthWrite: false, alphaTest: 0.01
    });

    const geo = new THREE.PlaneGeometry(TL / 6, TW * 0.25);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, TH + 0.48, 0);
    mesh.userData = { label: item.label, cur: 0, tgt: 0, nTex, hTex };

    scene.add(mesh);
    navMeshes.push(mesh);
});

/* ================================================================
   INTERACTION
   ================================================================ */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-99, -99);
const navUI = document.getElementById('nav-target');
let hovered = null;

window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    if (hovered) {
        navUI.innerText = '▸ ' + hovered.userData.label;
        navUI.style.color = '#00eeff';
        sweepLight.intensity = 30;
        setTimeout(() => { navUI.style.color = ''; }, 800);
    }
});

/* ================================================================
   ANIMATION
   ================================================================ */
const clock = new THREE.Clock();
let intro = 0;

setTimeout(() => {
    const l = document.getElementById('loading');
    l.style.opacity = '0';
    setTimeout(() => { l.style.display = 'none'; }, 1200);
}, 600);

// Camera final position: show entire scanner comfortably
const camTarget = new THREE.Vector3(-5, 6, 18);

function animate() {
    requestAnimationFrame(animate);
    // Met en pause le rendu quand l'onglet est masqué → CPU/GPU économisés
    if (document.hidden) return;
    const t = clock.getElapsedTime();
    controls.update();

    if (intro < 1) { intro += 0.006; camera.position.lerp(camTarget, 0.012); }

    accentRing.rotation.z = t * 0.3;

    // LED pulse wave
    [ledFront, ledBack].forEach((strip, si) => {
        strip.children.forEach((child, i) => {
            if (child.material && child.material.emissiveIntensity !== undefined) {
                const phase = (i / 50) * Math.PI * 4 + t * 2 + si * Math.PI;
                child.material.emissiveIntensity = 0.4 + Math.sin(phase) * 0.3;
            }
        });
    });

    monLed.material.color.setHSL(0.35, 1, 0.4 + Math.sin(t * 3) * 0.1);
    // Monitor screen LEDs
    blueLed.material.color.setHSL(0.6, 1, 0.45 + Math.sin(t * 2.5) * 0.15);
    redLed.material.color.setHSL(0.0, 1, 0.3 + Math.sin(t * 4) * 0.2);
    if (sweepLight.intensity > 0) sweepLight.intensity *= 0.94;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(navMeshes);
    navMeshes.forEach(m => { m.userData.tgt = 0; });

    if (hits.length > 0) {
        const obj = hits[0].object;
        obj.userData.tgt = 1;
        if (hovered !== obj) {
            hovered = obj;
            navUI.innerText = obj.userData.label;
            navUI.classList.add('active');
            document.body.style.cursor = 'pointer';
        }
    } else if (hovered) {
        hovered = null;
        navUI.classList.remove('active');
        document.body.style.cursor = 'default';
    }

    navMeshes.forEach(m => {
        const u = m.userData;
        u.cur += (u.tgt - u.cur) * 0.12;
        m.material.emissiveIntensity = u.cur * 0.8;
        if (u.cur > 0.3) {
            m.material.emissive.setHex(0x00ccff);
            if (m.material.map !== u.hTex) { m.material.map = u.hTex; m.material.emissiveMap = u.hTex; m.material.needsUpdate = true; }
        } else {
            m.material.emissive.setHex(0x000000);
            if (m.material.map !== u.nTex) { m.material.map = u.nTex; m.material.emissiveMap = u.nTex; m.material.needsUpdate = true; }
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
