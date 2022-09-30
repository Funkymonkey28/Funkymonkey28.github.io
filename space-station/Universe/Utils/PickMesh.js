import Universe from '../Universe';
import * as THREE from "three";

export default class PickMesh {
	constructor() {
		this.universe = new Universe();
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;
		this.camera = this.universe.camera;
		this.renderer = this.universe.renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
		this.highlightedMesh = new Array();

		//window.addEventListener( 'pointermove', this.onPointerMove );
		window.addEventListener( 'pointermove', (event) => {
			// calculate pointer position in normalized device coordinates
			// (-1 to +1) for both components
			this.pointer.x = (( event.clientX / window.innerWidth ) * 2 - 1);
			this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			this.highlight();
		});
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
			const intersects = this.raycaster.intersectObjects( this.scene.children );
	
			// for ( let i = 0; i < intersects.length; i ++ ) {
			// 	intersects[ i ].object.material.color.set( 0xff0000 );
			// }
			if(intersects.length > 0){
				console.log(intersects[0]);
				let meshMaterial = intersects[ 0 ].object.material;
				meshMaterial.color.set( 0xff0000 );
				this.highlightedMesh.push(meshMaterial);
			}
		} );	
	}

	resetMaterials() {
		// for (let i = 0; i < this.scene.children.length; i++) {
		// 	console.log(this.scene.children);
		// 	if(this.scene.children[i].material) {
		// 		this.scene.children.material.color.set(0xffffff);
		// 	}
		// }
		for (let i = 0; i < this.highlightedMesh.length; i++) {
			this.highlightedMesh[i].color.set( 0xffffff );
		}
		this.highlightedMesh = new Array();
	};
}

