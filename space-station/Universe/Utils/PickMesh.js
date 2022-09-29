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
		this.pointer = new THREE.Vector2( 0, 0 );
		
		if(this.pointer !== undefined){
			window.addEventListener( 'pointermove', this.onPointerMove );
			window.requestAnimationFrame( this.render );
		}
	}

	onPointerMove( event ) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		
		//CHECK: Why is this.pointer always undefined??? was set in constructor
		this.pointer.x = (( event.clientX / window.innerWidth ) * 2 - 1);
		this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
		console.log(this.pointer);
	}
	
	render() {
		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera( this.pointer, this.camera );
		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects( this.scene.children );
	
		for ( let i = 0; i < intersects.length; i ++ ) {
			intersects[ i ].object.material.color.set( 0xff0000 );
		}
		// renderer.render( this.scene, this.camera );
		// this.renderer.update();
	}
}