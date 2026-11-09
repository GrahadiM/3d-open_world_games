import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 35, 100);

    this.createLights();
    this.createIsland();
    this.createOcean();
    this.createTrees();
  }

  createLights() {
    const ambient = new THREE.HemisphereLight(0xffffff, 0x668866, 2);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-15, 25, 10);
    sun.castShadow = true;
    this.scene.add(sun);
  }

  createIsland() {
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(24, 26, 2, 48),
      new THREE.MeshStandardMaterial({ color: 0x69b957, roughness: 1 })
    );
    ground.position.y = -1;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const sand = new THREE.Mesh(
      new THREE.CylinderGeometry(25, 27, 1, 48),
      new THREE.MeshStandardMaterial({ color: 0xe5ce8c, roughness: 1 })
    );
    sand.position.y = -1.8;
    this.scene.add(sand);
  }

  createOcean() {
    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({
        color: 0x238ed1,
        roughness: 0.45,
        metalness: 0.1
      })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2.35;
    this.scene.add(ocean);
  }

  createTrees() {
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x79502d });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x238b45 });

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 11;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.25, 2, 7),
        trunkMaterial
      );
      trunk.position.y = 1;
      trunk.castShadow = true;
      tree.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.1, 2.8, 8),
        leafMaterial
      );
      leaves.position.y = 3;
      leaves.castShadow = true;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      this.scene.add(tree);
    }
  }
}