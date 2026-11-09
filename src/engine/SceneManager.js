
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 35, 110);

    this.createLights();
    this.createWorld();
  }

  createLights() {
    const ambient = new THREE.HemisphereLight(
      0xffffff,
      0x647b55,
      2
    );
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(20, 35, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    this.scene.add(sun);
  }

  createWorld() {
    // Pulau utama
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 31, 2, 48),
      new THREE.MeshStandardMaterial({ color: 0x62a84f })
    );
    ground.position.y = -1;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Area pasir di sekitar pulau
    const sand = new THREE.Mesh(
      new THREE.CylinderGeometry(30, 33, 1.2, 48),
      new THREE.MeshStandardMaterial({ color: 0xe6d19a })
    );
    sand.position.y = -1.7;
    this.scene.add(sand);

    // Laut
    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshStandardMaterial({
        color: 0x168fc4,
        roughness: 0.8
      })
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -2.35;
    this.scene.add(ocean);

    this.createTrees();
  }

  createTrees() {
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x79502c
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x238b45
    });

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 17 + Math.random() * 8;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.35, 2, 7),
        trunkMaterial
      );
      trunk.position.y = 1;

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 3, 7),
        leafMaterial
      );
      leaves.position.y = 3;

      tree.add(trunk, leaves);
      tree.position.set(x, 0, z);
      tree.rotation.y = Math.random() * Math.PI * 2;

      this.scene.add(tree);
    }
  }
}
