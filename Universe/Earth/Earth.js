import Universe from '../Universe';
import Iss from './Iss';
import Environment from './Environment';
import issDescription from './issDescription';

export default class Earth {
	constructor() {
		this.universe = new Universe();
		this.sizes = this.universe.sizes;
		this.scene = this.universe.scene;
		this.canvas = this.universe.canvas;
		this.camera = this.universe.camera;
		this.resources = this.universe.resources;

		this.resources.on("ready", () => {
			this.environment = new Environment();
			this.Iss = new Iss(issDescription);

			this.earth = this.resources.items.earth.scene;
			this.scene.add(this.earth);
		});
	}

	resize() {

	}

	update() {

	}
}
