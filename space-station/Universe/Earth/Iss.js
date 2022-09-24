import Universe from '../Universe';
import * as THREE from "three";

export default class Iss {
	constructor() {
		this.universe = new Universe();
		this.scene = this.universe.scene;

		this.resources = this.universe.resources;
		this.iss = this.resources.items.iss;
		this.actualIss = this.iss.scene;
		console.log(this.actualIss);

		this.setModel();
		
	}

	setModel() {
		this.scene.add(this.actualIss);
	}
	
	resize() {

	}

	update() {

	}
}
