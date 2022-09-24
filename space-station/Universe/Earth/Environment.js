import Universe from '../Universe';
import * as THREE from "three";

export default class Environment {
	constructor() {
		this.universe = new Universe();
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;

		this.setSunlight();
		
	}

	setSunlight() {
		this.sunlight = new THREE.DirectionalLight("#ffffff, 3");
		this.sunlight.castShadow = true;
		this.sunlight.shadow.camera.far = 20;
		this.sunlight.shadow.mapSize.set(1024,1024);
		this.sunlight.shadow.normalBias = 0.05;
		this.sunlight.position.set(1.5, 7, 3);
		this.scene.add(this.sunlight);
	}
	
	resize() {

	}

	update() {

	}
}
