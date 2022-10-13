import Universe from '../Universe';
import * as THREE from "three";
import { EventEmitter } from "events";

export default class PickMesh extends EventEmitter{
	constructor( meshes ) {
		super();
		this.meshes = meshes;

		this.universe = new Universe();
		this.canvas = this.universe.canvas;
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;
		this.camera = this.universe.camera;
		this.renderer = this.universe.renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
		this.selectedMesh = null;
		this.highlightedMesh = null;

		//window.addEventListener( 'pointermove', this.onPointerMove );
		window.addEventListener( 'pointermove', (event) => {
			// this.pointer.x = (( event.clientX / this.bounds.width ) * 2 - 1);
			// this.pointer.y = - ( event.clientY / this.bounds.height ) * 2 + 1;

			//const rect = document.getElementById("canvas-main").getBoundingClientRect();
			const rect = this.canvas.getBoundingClientRect();
			this.pointer.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
			this.pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

			// console.log(this.pointer.x);
			// console.log(this.pointer.y);

			// console.log("bounds height: " + this.bounds.height);
			// console.log("bounds width: " + this.bounds.width);
			console.log(this.bounds);

			// console.log("innnerHeight: " + window.innerHeight);
			// console.log("innerWidth: " + window.innerWidth);
			// console.log("-----------------------------------");
			this.highlight();
		});

		window.addEventListener( 'click', () => {
			window.requestAnimationFrame( () => {
				// update the picking ray with the camera and pointer position
				this.raycaster.setFromCamera( this.pointer, this.camera.perspectiveCamera );
				// calculate objects intersecting the picking ray
				const intersects = this.raycaster.intersectObjects( this.meshes );
	
				//Taking the first intersected object. This works
				if(intersects.length > 0){
					this.resetSelectedMaterials();
					let mesh = intersects[ 0 ].object;
					mesh.material.color.set( 0x00ff00 );
					this.selectedMesh = mesh;
					this.emit("meshSelected");
				}
				else{
					this.emit("noMeshSelected");
				}
			} );
			//console.log(this.selectedMesh);
			//NOTE: create clear overlay to stop any interaction with mesh when info is being displayed
		})

		window.addEventListener( 'keydown', (event) => {
			const key = event.key;
			if ( key === "Backspace" || key === "Delete" || key === "Escape"){
				if (this.highlightedMesh){
					this.highlightedMesh.material.color.set( 0xffffff );
					this.highlightedMesh = null;
				}

				if (this.selectedMesh){
					this.selectedMesh.material.color.set( 0xffffff );
					this.selectedMesh = null;
					//console.log(this.selectedMesh);
				}

				this.emit("meshSelected");
			}
		});
	}

	highlight() {
		this.resetHoverMaterials();
		this.hoverMesh();
		this.renderer.update();
	}

	hoverMesh() {
		window.requestAnimationFrame( () => {
			// update the picking ray with the camera and pointer position
			this.raycaster.setFromCamera( this.pointer, this.camera.perspectiveCamera );
			// calculate objects intersecting the picking ray
			const intersects = this.raycaster.intersectObjects( this.meshes );

			//Taking the first intersected object. This works
			if(intersects.length > 0){
				//console.log(intersects[0]);
				let mesh = intersects[ 0 ].object;
				if(mesh !== this.selectedMesh){
					mesh.material.color.set( 0xff0000 );
					this.highlightedMesh = mesh;
				}
			}
			else {
				this.highlightedMesh = null;
			}
		} );	
	}

	resetHoverMaterials() {
		//NOTE: parent is selected. But when one of the childs gets a hover it resets the parent. Not desired
		if(this.highlightedMesh && (this.highlightedMesh !== this.selectedMesh)){
			this.highlightedMesh.material.color.set( 0xffffff );
			this.highlightedMesh = null;
		}
	};

	resetSelectedMaterials() {
		if(this.selectedMesh && (this.highlightedMesh !== this.selectedMesh)) {
			this.selectedMesh.material.color.set( 0xffffff );
			this.selectedMesh = null;
		}
	}
}

