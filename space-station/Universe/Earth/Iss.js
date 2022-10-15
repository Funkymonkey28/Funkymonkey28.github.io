import Universe from '../Universe';
import PickMesh from '../Utils/PickMesh';
import * as THREE from "three";
import Modal from '../Utils/Modal';
import EventEmitter from 'events';

export default class Iss extends EventEmitter{
	constructor() {
		super();
		this.universe = new Universe();
		this.scene = this.universe.scene;

		this.resources = this.universe.resources;
		this.iss = this.resources.items.iss;
		this.actualIss = this.iss.scene;
		this.meshArray = new Array();
		this.modal = new Modal(this);
		// NOTE: currently not using, but will be useful later
		this.issComponents = {};
		console.log(this.issComponents);

		this.setModel();

		this.pickIss.on("meshSelected", () => {
			this.selectedIssComponent = this.pickIss.selectedMesh;
			if(this.selectedIssComponent){
				this.findComponentName(this.selectedIssComponent);

				//Adjust selection area
				this.pickIss.addXCursorConstraint(-1,0.5);
				//Show modal
				this.emit("showInfo");
			}
		})

		this.pickIss.on("meshDeselected", () => {
			//Adjust selection area
			this.pickIss.resetXCursorConstraint();

			this.emit("closeInfo");
		})

		this.modal.on("close", () => {
			//Adjust selection area
			this.pickIss.resetXCursorConstraint();
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
			
			// Useful groups on ISS model are named such that they start numbers 01 - 46.
			let partNo = parseInt(childMesh.name.slice(0, 2));
			if(partNo < 47) {
				this.meshArray.push(childMesh);
				if(this.issComponents[partNo]){
					this.issComponents[partNo].push(childMesh)
				}
				else{
					this.issComponents[partNo] = new Array();
					this.issComponents[partNo].push(childMesh);
				}
			}
		}
	}
	
	findComponentName( mesh ){
		if(mesh){
			if(parseInt(mesh.name.slice(0,1)) < 47) {
				this.selectedIssComponentName = mesh.name;
			}
			else if(parseInt(mesh.parent.name.slice(0,1)) < 47) {
				this.selectedIssComponentName = mesh.parent.name;
			}
			else if(mesh.parent){
				this.findComponentName(mesh.parent);
			}
		}
	}

	getModalInfo() {
		let info = {}
		if(this.selectedIssComponentName){
			info["header"] = this.selectedIssComponentName;
		}
		else{
			info["header"] = "";
		}
		info["body"] = "testing";
		return info;
	}

	resize() {

	}

	update() {

	}
}
