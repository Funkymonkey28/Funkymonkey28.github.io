import Universe from './Universe';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default class Camera {
	constructor() {
		this.universe = new Universe();
		this.sizes = this.universe.sizes;
		this.scene = this.universe.scene;
		this.canvas = this.universe.canvas;
		//console.log(this.sizes, this.scene, this.canvas, this.universe)

		this.createPerspectiveCamera();
		this.createOrthographicCamera();
		this.setOrbitControls();
	}

	createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35, 
			this.sizes.aspect,
			0.1,
			7000
		);
		this.scene.add(this.perspectiveCamera);
		this.perspectiveCamera.position.z = 500;
	}

	createOrthographicCamera() {
		this.frustrum = 5;
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.sizes.frustrum)/2,
			(this.sizes.aspect * this.sizes.frustrum)/2,
			this.sizes.frustrum/2,
			-this.sizes.frustrum/2,
			-100,
			100
		);
		this.scene.add(this.OrthographicCamera);
	}

	setOrbitControls(){
		this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
		this.controls.enableDamping = true;
		this.controls.enableZoom = true;
		this.controls.minDistance = 50;
		this.controls.maxDistance = 500;
	}

	resize() {
		//Updating Perspective camer on resize
		this.perspectiveCamera.aspect = this.sizes.aspect;
		this.perspectiveCamera.updateProjectionMatrix();

		// Updating Orthogrpahic Camera on resize
		this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum)/2;
		this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum)/2;
		this.orthographicCamera.top = this.sizes.frustrum/2;
		this.orthographicCamera.bottom = -this.sizes.frustrum/2;
		this.orthographicCamera.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
