import Universe from '../Universe';
import * as THREE from "three";
import { EventEmitter } from "events";

export default class PickMesh extends EventEmitter{
	constructor( meshes ) {
		super();
		this.meshes = meshes;

		this.universe = new Universe();
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
			// calculate pointer position in normalized device coordinates
			// (-1 to +1) for both components
			this.pointer.x = (( event.clientX / window.innerWidth ) * 2 - 1);
			this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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

