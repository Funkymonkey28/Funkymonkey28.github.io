import Universe from '../Universe';
import * as THREE from "three";

export default class Environment {
	constructor() {
		this.universe = new Universe();
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;

		this.setSunlight();
		this.setStarField();
		
	}

	setSunlight() {
		this.sunlight = new THREE.DirectionalLight(0xffffff, 2);
		this.sunlight.castShadow = true;
		this.sunlight.shadow.camera.far = 20;
		this.sunlight.shadow.mapSize.set(1024,1024);
		this.sunlight.shadow.normalBias = 0.05;
		this.sunlight.position.set(1.5, 7, 3);
		this.scene.add(this.sunlight);
	}

	setStarField() {
		const points = [];
		for (let i=0; i<6000; i++){
			let star = new THREE.Vector3(
				Math.random() * 6000 - 3000,
				Math.random() * 6000 - 3000,
				Math.random() * 6000 - 3000,
 			);
			points.push(star);
		}
		let starGeo = new THREE.BufferGeometry().setFromPoints(points);
		let sprite = new THREE.TextureLoader().load('/white_circle.png');
		let starMaterial = new THREE.PointsMaterial({
			color: 0xaaaaaa,
			size: 0.7,
			map: sprite,
		});
		let stars = new THREE.Points(starGeo, starMaterial);
		this.scene.add(stars);
	}
	
	resize() {

	}

	update() {

	}
}
