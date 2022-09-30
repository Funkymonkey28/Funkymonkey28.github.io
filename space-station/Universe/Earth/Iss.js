import Universe from '../Universe';
import PickMesh from '../Utils/PickMesh';
import * as THREE from "three";

export default class Iss {
	constructor() {
		this.universe = new Universe();
		this.scene = this.universe.scene;

		this.resources = this.universe.resources;
		this.iss = this.resources.items.iss;
		this.actualIss = this.iss.scene;
		//console.log(this.actualIss.children);

		this.meshArray = new Array();
		this.setModel();

		this.pickIss.on("meshSelected", () => {
			this.selectedIssComponent = this.pickIss.selectedMesh;
			console.log(this.selectedIssComponent);
		})
	}

	setModel() {
		this.scene.add(this.actualIss);
		this.findMeshGroup(this.actualIss.children);
		this.pickIss = new PickMesh(this.meshArray);
	}

	findMeshGroup( searchArray ){
		for (let i = 0; i < searchArray.length; i++) {
			const childMesh = searchArray[i];
			if(childMesh.children.length > 0){
				this.findMeshGroup(childMesh.children);
			}
			
			// Useful groups on ISS model are named such that they start numbers 01 - 45.
			if(parseInt(childMesh.name.slice(0, 1)) < 46) {
				this.meshArray.push(childMesh);
			}
		}
	}
	
	//Remove unimportant groups and remove
	cleanMeshGroup( uncleanedMesh ){

	}

	resize() {

	}

	update() {

	}
}
