/* ==========================================================================
   VALYRIAN REALM - GAMING COMMUNITY HUB
   Three.js 3D Animations & Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  initHeroScene();
  initArmoryProductViewer();
  initAudioEngine();
  initScrollAndTabs();
});

/* ==========================================================================
   1. HERO THREE.JS SCENE (Floating Mythic Emblem & Ember Particles)
   ========================================================================== */
let heroScene, heroCamera, heroRenderer, emblemGroup, particleSystem;
let mouseX = 0, mouseY = 0;

function initHeroScene() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  // Scene setup
  heroScene = new THREE.Scene();
  heroCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  heroCamera.position.z = 8;

  // Renderer setup
  heroRenderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
  heroRenderer.setSize(window.innerWidth, window.innerHeight);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  heroScene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xe5b842, 2.5, 20);
  goldLight.position.set(4, 3, 5);
  heroScene.add(goldLight);

  const crimsonLight = new THREE.PointLight(0xe63946, 2, 20);
  crimsonLight.position.set(-4, -2, 3);
  heroScene.add(crimsonLight);

  // Mythic Gaming Emblem Group
  emblemGroup = new THREE.Group();

  // Central Core Sphere (Glowing Valyrian Orb)
  const orbGeo = new THREE.IcosahedronGeometry(1.2, 2);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0xe5b842,
    emissive: 0xa88120,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: true
  });
  const coreOrb = new THREE.Mesh(orbGeo, orbMat);
  emblemGroup.add(coreOrb);

  // Outer Dragon Ring 1
  const ring1Geo = new THREE.TorusGeometry(2.2, 0.08, 16, 100);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color: 0xe5b842,
    metalness: 0.9,
    roughness: 0.1
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  emblemGroup.add(ring1);

  // Outer Dragon Ring 2
  const ring2Geo = new THREE.TorusGeometry(2.8, 0.05, 16, 100);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    metalness: 0.8,
    roughness: 0.3
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  emblemGroup.add(ring2);

  // Orbiting Crystal Floating Artifacts
  const crystalGeo = new THREE.OctahedronGeometry(0.35);
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.1 });
  for (let i = 0; i < 4; i++) {
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    const angle = (i / 4) * Math.PI * 2;
    crystal.position.set(Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0);
    emblemGroup.add(crystal);
  }

  emblemGroup.position.set(3, 0, 0); // Position to right side of Hero text
  heroScene.add(emblemGroup);

  // Rising Ember Particle System
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    scales[i] = Math.random() * 0.08 + 0.02;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xe5b842,
    size: 0.12,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(particleGeo, particleMat);
  heroScene.add(particleSystem);

  // Mouse Parallax Event
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Responsive Resize
  window.addEventListener('resize', onHeroResize);
  onHeroResize();

  // Animation Loop
  animateHero();
}

function onHeroResize() {
  if (!heroCamera || !heroRenderer) return;
  heroCamera.aspect = window.innerWidth / window.innerHeight;
  heroCamera.updateProjectionMatrix();
  heroRenderer.setSize(window.innerWidth, window.innerHeight);

  // Adjust emblem position on mobile
  if (window.innerWidth < 1024) {
    emblemGroup.position.set(0, 1.5, -2);
  } else {
    emblemGroup.position.set(3.2, 0, 0);
  }
}

function animateHero() {
  requestAnimationFrame(animateHero);

  // Emblem rotations
  if (emblemGroup) {
    emblemGroup.rotation.y += 0.008;
    emblemGroup.rotation.x += 0.004;

    // Smooth mouse tilt parallax
    emblemGroup.position.x += ( (window.innerWidth >= 1024 ? 3.2 : 0) + mouseX * 0.5 - emblemGroup.position.x ) * 0.05;
    emblemGroup.position.y += ( -mouseY * 0.5 - emblemGroup.position.y ) * 0.05;
  }

  // Floating particles motion
  if (particleSystem) {
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += 0.015; // Move up
      if (positions[i + 1] > 10) {
        positions[i + 1] = -10; // Reset to bottom
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.001;
  }

  heroRenderer.render(heroScene, heroCamera);
}

/* ==========================================================================
   2. INTERACTIVE 3D ARMORY PRODUCT VIEWER
   ========================================================================== */
let armoryScene, armoryCamera, armoryRenderer, armoryControls;
let currentProductMeshGroup;
let ledMaterials = [];
let currentGlowColor = 0xe5b842;

const productsData = {
  headset: {
    name: "Dragonfire Pro Wireless Headset",
    price: "$289 USD",
    desc: "Forged with 50mm Valyrian beryllium drivers, spatial audio tracking, and high-density memory foam earcups designed for marathon campaign raids.",
    specs: [
      { name: "Audio Frequency", val: "10Hz - 45,000Hz" },
      { name: "Wireless Latency", val: "< 1ms Ultra-Fast" },
      { name: "Battery Life", val: "75 Hours" },
      { name: "Chassis Material", val: "Valyrian Titanium" }
    ]
  },
  keyboard: {
    name: "Valyrian Blade Mechanical Keyboard",
    price: "$249 USD",
    desc: "Optical-magnetic mechanical switches with 0.1mm adjustable actuation, forged brass top plate, and custom keycap engraving.",
    specs: [
      { name: "Switch Type", val: "Valyrian Gold Optical" },
      { name: "Polling Rate", val: "8,000Hz Hyper-Polling" },
      { name: "Top Plate", val: "CNC Solid Brass" },
      { name: "RGB Profiles", val: "16.8M Valyrian Glow" }
    ]
  },
  controller: {
    name: "Mythic Gamepad Pro Controller",
    price: "$199 USD",
    desc: "Hall effect anti-drift thumbsticks, mechanical microswitch buttons, and customizable rear paddle triggers.",
    specs: [
      { name: "Stick Tech", val: "Hall Effect Magnetic" },
      { name: "Response Time", val: "0.5ms Wired / BT" },
      { name: "Rear Paddles", val: "4 Programmable" },
      { name: "Weight", val: "240g Ergonomic" }
    ]
  }
};

function initArmoryProductViewer() {
  const container = document.getElementById('product-3d-canvas');
  if (!container) return;

  armoryScene = new THREE.Scene();
  armoryCamera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  armoryCamera.position.set(0, 1, 5.5);

  armoryRenderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
  armoryRenderer.setSize(container.clientWidth, container.clientHeight);
  armoryRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting for 3D Product
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  armoryScene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 5, 5);
  armoryScene.add(mainLight);

  const rimLight = new THREE.PointLight(currentGlowColor, 2, 10);
  rimLight.position.set(-4, -2, -3);
  rimLight.name = "rimLight";
  armoryScene.add(rimLight);

  // Orbit Controls
  if (window.THREE.OrbitControls) {
    armoryControls = new THREE.OrbitControls(armoryCamera, armoryRenderer.domElement);
    armoryControls.enableDamping = true;
    armoryControls.dampingFactor = 0.05;
    armoryControls.maxDistance = 8;
    armoryControls.minDistance = 3;
    armoryControls.enablePan = false;
  }

  // Load default product model
  loadProductModel('headset');

  // Product Selector Event Delegation
  const selectorContainer = document.querySelector('.product-selector');
  if (selectorContainer) {
    selectorContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.product-tab');
      if (!tab) return;

      document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const prodKey = tab.getAttribute('data-product');
      loadProductModel(prodKey);
      updateProductDetailsUI(prodKey);
    });
  }

  // Color Selector Event Listeners
  document.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');

      const hexStr = btn.getAttribute('data-color');
      const hexNum = parseInt(hexStr, 16);
      changeLEDColor(hexNum);
    });
  });

  // Resize listener
  window.addEventListener('resize', () => {
    if (!armoryCamera || !armoryRenderer || !container) return;
    armoryCamera.aspect = container.clientWidth / container.clientHeight;
    armoryCamera.updateProjectionMatrix();
    armoryRenderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Render loop
  animateArmory();
}

function loadProductModel(type) {
  if (currentProductMeshGroup) {
    armoryScene.remove(currentProductMeshGroup);
  }

  currentProductMeshGroup = new THREE.Group();
  ledMaterials = [];

  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x11131a, metalness: 0.85, roughness: 0.2 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe5b842, metalness: 0.95, roughness: 0.1 });
  const ledMat = new THREE.MeshStandardMaterial({
    color: currentGlowColor,
    emissive: currentGlowColor,
    emissiveIntensity: 0.8,
    metalness: 0.5
  });
  ledMaterials.push(ledMat);

  if (type === 'headset') {
    // Headset Headband Arc
    const headbandGeo = new THREE.TorusGeometry(1.5, 0.12, 16, 50, Math.PI);
    const headband = new THREE.Mesh(headbandGeo, obsidianMat);
    headband.rotation.x = Math.PI / 2;
    currentProductMeshGroup.add(headband);

    // Left & Right Earcups
    const cupGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 32);

    const leftCup = new THREE.Mesh(cupGeo, obsidianMat);
    leftCup.position.set(-1.5, -0.3, 0);
    leftCup.rotation.z = Math.PI / 2;
    currentProductMeshGroup.add(leftCup);

    const leftRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 16, 32), ledMat);
    leftRing.position.set(-1.7, -0.3, 0);
    leftRing.rotation.y = Math.PI / 2;
    currentProductMeshGroup.add(leftRing);

    const rightCup = new THREE.Mesh(cupGeo, obsidianMat);
    rightCup.position.set(1.5, -0.3, 0);
    rightCup.rotation.z = Math.PI / 2;
    currentProductMeshGroup.add(rightCup);

    const rightRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.05, 16, 32), ledMat);
    rightRing.position.set(1.7, -0.3, 0);
    rightRing.rotation.y = Math.PI / 2;
    currentProductMeshGroup.add(rightRing);

  } else if (type === 'keyboard') {
    // Keyboard Base Plate
    const baseGeo = new THREE.BoxGeometry(3.6, 0.25, 1.6);
    const base = new THREE.Mesh(baseGeo, obsidianMat);
    currentProductMeshGroup.add(base);

    // Gold Rim Frame
    const frameGeo = new THREE.BoxGeometry(3.7, 0.1, 1.7);
    const frame = new THREE.Mesh(frameGeo, goldMat);
    frame.position.y = -0.1;
    currentProductMeshGroup.add(frame);

    // LED Glow Underbar
    const stripGeo = new THREE.BoxGeometry(3.65, 0.05, 1.65);
    const strip = new THREE.Mesh(stripGeo, ledMat);
    strip.position.y = -0.16;
    currentProductMeshGroup.add(strip);

    // Keycaps Grid Representation
    const keyGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    for (let x = -1.5; x <= 1.5; x += 0.3) {
      for (let z = -0.6; z <= 0.6; z += 0.3) {
        const key = new THREE.Mesh(keyGeo, obsidianMat);
        key.position.set(x, 0.2, z);
        currentProductMeshGroup.add(key);
      }
    }

  } else if (type === 'controller') {
    // Gamepad Body Center
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.6, 1.2);
    const body = new THREE.Mesh(bodyGeo, obsidianMat);
    currentProductMeshGroup.add(body);

    // Handles Left/Right
    const handleGeo = new THREE.CylinderGeometry(0.35, 0.25, 1.2, 16);
    const leftHandle = new THREE.Mesh(handleGeo, obsidianMat);
    leftHandle.position.set(-1.0, -0.4, 0.2);
    leftHandle.rotation.z = Math.PI / 6;
    currentProductMeshGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, obsidianMat);
    rightHandle.position.set(1.0, -0.4, 0.2);
    rightHandle.rotation.z = -Math.PI / 6;
    currentProductMeshGroup.add(rightHandle);

    // Glowing Emblem Core Button
    const emblemButton = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32), ledMat);
    emblemButton.position.set(0, 0.35, 0);
    currentProductMeshGroup.add(emblemButton);
  }

  currentProductMeshGroup.position.set(0, 0, 0);
  armoryScene.add(currentProductMeshGroup);
}

function changeLEDColor(hex) {
  currentGlowColor = hex;
  ledMaterials.forEach(mat => {
    mat.color.setHex(hex);
    mat.emissive.setHex(hex);
  });

  const rimLight = armoryScene.getObjectByName('rimLight');
  if (rimLight) rimLight.color.setHex(hex);
}

function updateProductDetailsUI(type) {
  const data = productsData[type];
  if (!data) return;

  document.getElementById('product-name').textContent = data.name;
  document.getElementById('product-price').textContent = data.price;
  document.getElementById('product-desc').textContent = data.desc;

  const specContainer = document.getElementById('spec-container');
  specContainer.innerHTML = data.specs.map(s => `
    <div class="spec-card">
      <div class="spec-name">${s.name}</div>
      <div class="spec-val">${s.val}</div>
    </div>
  `).join('');
}

function animateArmory() {
  requestAnimationFrame(animateArmory);

  if (armoryControls) {
    armoryControls.update();
  } else if (currentProductMeshGroup) {
    currentProductMeshGroup.rotation.y += 0.005;
  }

  armoryRenderer.render(armoryScene, armoryCamera);
}

/* ==========================================================================
   3. WEB AUDIO API AMBIENCE ENGINE & UI SOUNDS
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let ambientOsc1, ambientOsc2, masterGain;

function initAudioEngine() {
  const audioBtn = document.getElementById('audio-toggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      startAmbientSound();
      audioBtn.classList.add('active');
      audioBtn.innerHTML = `<i data-lucide="volume-x"></i>`;
      if (window.lucide) lucide.createIcons();
      isAudioPlaying = true;
    } else {
      stopAmbientSound();
      audioBtn.classList.remove('active');
      audioBtn.innerHTML = `<i data-lucide="volume-2"></i>`;
      if (window.lucide) lucide.createIcons();
      isAudioPlaying = false;
    }
  });
}

function startAmbientSound() {
  if (!audioCtx) return;

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Low background volume

  // Dark Low Fantasy Synthesizer Drone
  ambientOsc1 = audioCtx.createOscillator();
  ambientOsc1.type = 'sawtooth';
  ambientOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A note

  // Lowpass filter for warm dark rumble
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(220, audioCtx.currentTime);

  ambientOsc1.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  ambientOsc1.start();
}

function stopAmbientSound() {
  if (masterGain && audioCtx) {
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (ambientOsc1) ambientOsc1.stop();
    }, 500);
  }
}

/* ==========================================================================
   4. SCROLL & UI INTERACTION HELPERS
   ========================================================================== */
function initScrollAndTabs() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '0.8rem 0';
      navbar.style.background = 'rgba(6, 7, 10, 0.95)';
    } else {
      navbar.style.padding = '1.25rem 0';
      navbar.style.background = 'rgba(6, 7, 10, 0.75)';
    }
  });
}
