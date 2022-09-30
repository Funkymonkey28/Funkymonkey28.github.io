import Universe from '../Universe';
import * as THREE from "three";

export default class PickMesh {
	constructor( meshes ) {
		this.meshes = meshes;

		this.universe = new Universe();
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;
		this.camera = this.universe.camera;
		this.renderer = this.universe.renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
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
			console.log(this.highlightedMesh);
			//NOTE: create clear overlay to stop any interaction with mesh when info is being displayed
		})
	}

	highlight() {
		this.resetMaterials();
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
				mesh.material.color.set( 0xff0000 );
				this.highlightedMesh = mesh;
			}
		} );	
	}

	resetMaterials() {
		if(this.highlightedMesh){
			this.highlightedMesh.material.color.set( 0xffffff );
			this.highlightedMesh = null;
		}
	};
}

