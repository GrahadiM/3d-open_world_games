
import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// ========================================
// PROJECT AETHER
// MAIN ENTRY POINT
// ========================================

const canvas = document.getElementById("game-canvas");

// ========================================
// SCENE
// ========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x86c8df);

scene.fog = new THREE.Fog(
    0x86c8df,
    35,
    100
);

// ========================================
// CAMERA
// ========================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

camera.position.set(0, 6, 12);

camera.lookAt(0, 0, 0);

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ========================================
// LIGHTING
// ========================================

const ambientLight = new THREE.HemisphereLight(
    0xd8f1ff,
    0x526a4a,
    2
);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(12, 20, 10);

directionalLight.castShadow = true;

directionalLight.shadow.mapSize.set(1024, 1024);

scene.add(directionalLight);

// ========================================
// MATERIALS
// ========================================

const createMaterial = (color) => {

    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.85
    });

};

// ========================================
// ENVIRONMENT
// ========================================

// Main Island

const islandGeometry = new THREE.CylinderGeometry(
    23,
    25,
    2,
    48
);

const island = new THREE.Mesh(
    islandGeometry,
    createMaterial(0x60996a)
);

island.position.y = -1;

island.receiveShadow = true;

scene.add(island);

// Sand Border

const sand = new THREE.Mesh(
    new THREE.CylinderGeometry(
        25,
        26,
        0.5,
        48
    ),
    createMaterial(0xcbb982)
);

sand.position.y = -1.8;

scene.add(sand);

// Ocean

const ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    createMaterial(0x267da5)
);

ocean.rotation.x = -Math.PI / 2;

ocean.position.y = -2.1;

scene.add(ocean);

// ========================================
// TREES
// ========================================

function createTree(x, z) {

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.16,
            0.25,
            1.8,
            6
        ),
        createMaterial(0x68472f)
    );

    trunk.position.set(x, 0, z);

    trunk.castShadow = true;

    scene.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(
            1.15,
            2.5,
            7
        ),
        createMaterial(0x2c7950)
    );

    leaves.position.set(x, 1.8, z);

    leaves.castShadow = true;

    scene.add(leaves);

}

// Generate Island Trees

for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2;

    const radius = 8 + Math.random() * 13;

    const x = Math.cos(angle) * radius;

    const z = Math.sin(angle) * radius;

    createTree(x, z);

}

// ========================================
// ANIMATION LOOP
// ========================================

function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);

}

animate();

// ========================================
// RESPONSIVE RESIZE
// ========================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

});

console.log("Project Aether initialized successfully!");
