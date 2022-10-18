import Universe from '../Universe';
import * as THREE from "three";
import { EventEmitter } from "events";

export default class PickMesh extends EventEmitter{
	constructor( meshes, highlightGroups ) {
		super();
		this.meshes = meshes;
		this.highlightGroups = highlightGroups;

		this.universe = new Universe();
		this.canvas = this.universe.canvas;
		this.scene = this.universe.scene;
		this.resources = this.universe.resources;
		this.camera = this.universe.camera;
		this.renderer = this.universe.renderer;
		
		this.raycaster = new THREE.Raycaster();
		this.cursor = new THREE.Vector2();
		this.xCursorConstraint = {
			"min": -1,
			"max": 1,
		};
		this.selectedMesh = null;
		this.highlightedMesh = null;

		window.addEventListener( 'pointermove', (event) => {
			// this.cursor.x = (( event.clientX / this.bounds.width ) * 2 - 1);
			// this.cursor.y = - ( event.clientY / this.bounds.height ) * 2 + 1;
			const rect = this.canvas.getBoundingClientRect();
			this.cursor.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
			this.cursor.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

			if(this.cursor.x <= this.xCursorConstraint["max"] &&  this.cursor.x >= this.xCursorConstraint["min"]){
				this.highlight();
			}
			else{
				this.resetHoverMaterials();
			}
			
		});

		window.addEventListener( 'click', () => {
			window.requestAnimationFrame( () => {
				if(this.cursor.x <= this.xCursorConstraint["max"] &&  this.cursor.x >= this.xCursorConstraint["min"]){
					// update the picking ray with the camera and pointer position
					this.raycaster.setFromCamera( this.cursor, this.camera.perspectiveCamera );
					// calculate objects intersecting the picking ray
					const intersects = this.raycaster.intersectObjects( this.meshes );
		
					//Taking the first intersected object. This works
					if(intersects.length > 0){
						this.resetSelectedMaterials();
						let mesh = intersects[ 0 ].object;
					
						//mesh.material.color.set( 0x00ff00 );
						this.colourComponent(mesh, 0x00ff00);

						this.selectedMesh = mesh;
						
						//Adjust selection area
						this.addXCursorConstraint(-1,0.5);
						this.emit("meshSelected");
					}
					else{
						//this.emit("meshDeselected");
					}
				}
			} );
		})

		window.addEventListener( 'keydown', (event) => {
			const key = event.key;
			if ( key === "Backspace" || key === "Delete" || key === "Escape"){
				if (this.highlightedMesh){
					//this.highlightedMesh.material.color.set( 0xffffff );
					this.colourComponent(this.highlightedMesh, 0xffffff);
					this.highlightedMesh = null;
				}

				if (this.selectedMesh){
					//this.selectedMesh.material.color.set( 0xffffff );
					this.colourComponent(this.selectedMesh, 0xffffff);
					this.selectedMesh = null;
					//console.log(this.selectedMesh);
				}
				//Adjust selection area
				this.resetXCursorConstraint();
				this.emit("meshDeselected");
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
			this.raycaster.setFromCamera( this.cursor, this.camera.perspectiveCamera );
			// calculate objects intersecting the picking ray
			const intersects = this.raycaster.intersectObjects( this.meshes );

			//Taking the first intersected object. This works
			if(intersects.length > 0){
				//console.log(intersects[0]);
				let mesh = intersects[ 0 ].object;
				if(mesh !== this.selectedMesh){
					//mesh.material.color.set( 0xff0000 );
					this.colourComponent(mesh, 0xff0000);
					this.highlightedMesh = mesh;
				}
			}
			else {
				this.highlightedMesh = null;
			}
		} );	
	}

	colourComponent( mesh, colour ) {
		if(this.highlightGroups){
			mesh.material.color.set(colour);

			let materialGroup = mesh.name;
			let index  = mesh.name.lastIndexOf('_');
			let expectedUnderscoreIndex = mesh.name.length - 2;
			if(index === expectedUnderscoreIndex){
				materialGroup = mesh.name.slice(0, index);
			}

			let highlightGroup =  this.highlightGroups[materialGroup]
			for (let componentMesh in highlightGroup){
				highlightGroup[componentMesh].material.color.set(colour);
			}

		}
		else{
			mesh.material.color.set(colour);
		}
	}

	resetHoverMaterials() {
		//NOTE: parent is selected. But when one of the childs gets a hover it resets the parent. Not desired
		if(this.highlightedMesh && (this.highlightedMesh !== this.selectedMesh)){
			//this.highlightedMesh.material.color.set( 0xffffff );
			this.colourComponent(this.highlightedMesh, 0xffffff);
			this.highlightedMesh = null;
		}
	};

	resetSelectedMaterials() {
		if(this.selectedMesh && (this.highlightedMesh !== this.selectedMesh)) {
			//this.selectedMesh.material.color.set( 0xffffff );
			this.colourComponent(this.selectedMesh, 0xffffff);
			this.selectedMesh = null;
		}
	}

	addXCursorConstraint(min, max){
		this.xCursorConstraint["min"] = min;
		this.xCursorConstraint["max"] = max;
	}

	resetXCursorConstraint(){
		this.xCursorConstraint["min"] = -1;
		this.xCursorConstraint["max"] = 1;
	}
}

