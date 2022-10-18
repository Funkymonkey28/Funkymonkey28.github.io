import Universe from './Universe';
import * as THREE from "three";
import { CineonToneMapping, PCFSoftShadowMap } from 'three';

export default class Camera {
	constructor() {
		this.universe = new Universe();
		this.sizes = this.universe.sizes;
		this.scene = this.universe.scene;
		this.canvas = this.universe.canvas;
		this.camera = this.universe.camera;

		//console.log(this.camera, this.camera.perspectiveCamera);
		this.setRenderer();
	}
	setRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,

		})
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.CineonToneMapping;
		this.renderer.toneMappingExposure = 1.75;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setPixelRatio(this.sizes.pixelRatio);
	}
	resize() {
		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.renderer.setPixelRatio(this.sizes.pixelRatio);
	}

	update() {
		this.renderer.render(this.scene, this.camera.perspectiveCamera);
	}
}
