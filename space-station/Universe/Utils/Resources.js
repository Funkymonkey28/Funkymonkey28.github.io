import * as THREE from "three";
import { EventEmitter } from "events";
import Universe from '../Universe';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

export default class Resources extends EventEmitter {
	constructor(assets) {
		super();
		this.universe = new Universe();
		this.renderer = this.universe.renderer;
		
		this.assets = assets;
		
		this.items = {};
		this.queue = this.assets.length;
		this.loaded = 0;

		this.setLoaders();
		this.startLoading();
	}

	setLoaders(){
		this.loaders = {}
		this.loaders.GLTFLoader = new GLTFLoader();
		this.loaders.DRACOLoader = new DRACOLoader();
		this.loaders.DRACOLoader.setDecoderPath("/draco/");
		this.loaders.GLTFLoader.setDRACOLoader(this.loaders.DRACOLoader);
	}
	startLoading() {
		for (const asset of this.assets) {
			if(asset.type==="glbModel"){
				this.loaders.GLTFLoader.load(asset.path, (file) => {
					this.singleAssetLoaded(asset, file);
				});
			}
			else if (asset.type === "videoTexture"){
				this.video = {}
				this.videoTexture = {}

				this.video[asset.name] = document.createElement("video");
				this.video[asset.name].src = asset.path;
				this.video[asset.name].muted = true;
				this.video[asset.name].playsInline = true;
				this.video[asset.name].autoplay = true;
				this.video[asset.name].loop = true;
				this.video[asset.name].play();

				this.videoTexture[asset.name] = new THREE.VideoTexture(
					this.video[asset.name]
				);
				this.videoTexture[asset.name].flipY = true;
				this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
				this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
				this.videoTexture[asset.name].generateMipmaps = false;
				this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

				this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
			}
		}
	}

	singleAssetLoaded(asset, file) {
		this.items[asset.name] = file;
		this.loaded++;

		if(asset.type==="glbModel"){
			file.scene.traverse( function ( child ) {
				if ( child.material ) {
					child.material = child.material.clone();
				}
			} );
		}

		if(this.loaded === this.queue){
			this.emit("ready");
		}
	}
}