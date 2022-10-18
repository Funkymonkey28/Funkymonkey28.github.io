import Universe from '../Universe';
import PickMesh from '../Utils/PickMesh';
import * as THREE from "three";
import Modal from '../Utils/Modal';
import EventEmitter from 'events';

export default class Iss extends EventEmitter{
	constructor( issDescription ) {
		super();

		this.issDescription = issDescription;
		this.universe = new Universe();
		this.scene = this.universe.scene;

		this.resources = this.universe.resources;
		this.iss = this.resources.items.iss;
		this.actualIss = this.iss.scene;
	
		this.meshArray = new Array();
		this.modal = new Modal(this);
		
		this.issComponents = {}; // NOTE: currently not using, but will be useful later
		this.componentMaterials = {}; //Used to find out which materials need to be highlighted for a component

		this.setModel();

		this.actualIss.traverse(
			(child) => {
				//Creating Material Array
				let materialArray = [];
				if(child.material){
					let materialGroup = child.name;
					
					let index  = child.name.lastIndexOf('_');
					let expectedUnderscoreIndex = child.name.length - 2;
					if(index === expectedUnderscoreIndex){
						materialGroup = child.name.slice(0, index);
					}

					if(this.componentMaterials[materialGroup]){
						this.componentMaterials[materialGroup].push(child);
					}
					else{
						this.componentMaterials[materialGroup] = [child];
					}
				}

				//Organising into component name groups
				let partNo = parseInt(child.name.slice(0, 2));
				if(partNo < 47) {
					this.meshArray.push(child);
					if(this.issComponents[partNo]){
						this.issComponents[partNo].push(child)
					}
					else{
						this.issComponents[partNo] = new Array();
						this.issComponents[partNo].push(child);
					}
				}
			}
		);

		this.pickIss.on("meshSelected", () => {
			this.selectedIssComponent = this.pickIss.selectedMesh;
			if(this.selectedIssComponent){
				this.findComponentName(this.selectedIssComponent);

				//Show modal
				this.emit("showInfo");
			}
		})

		this.pickIss.on("meshDeselected", () => {
			this.emit("closeInfo");
		})

		this.modal.on("close", () => {
			//NOTE: bad design, should move into the PickMesh class
			//Adjust selection area
			this.pickIss.resetXCursorConstraint();
			this.pickIss.resetSelectedMaterials();
		})
	}

	setModel() {
		this.scene.add(this.actualIss);
		this.pickIss = new PickMesh(this.meshArray, this.componentMaterials);
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
			let componentNo = parseInt(this.selectedIssComponentName.slice(0,2));
			info["header"] = this.issDescription[componentNo]["name"];
			info["content"] = this.issDescription[componentNo]["content"];
			//console.log(info["content"]);
		}
		else{
			info["header"] = "";
			info["body"] = "testing";
		}
		
		return info;
	}

	resize() {

	}

	update() {

	}
}
