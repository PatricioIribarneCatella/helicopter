export class PointLight {

	constructor(position, color) {
		this.offset = position;
		this.position = position;
		this.color = color;
	}
	
	/* private methods */
	
	/* public methods */

	update(controller) {
	
	}

	getPosition() {
		return this.position;
	}

	getColor() {
		return this.color;
	}
}
