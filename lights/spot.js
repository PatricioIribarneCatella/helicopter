export class SpotLight {

	constructor(position, direction, color) {
		this.direction = direction;
		this.offset = position;
		this.position = position;
		this.color = color;
	}

	/* private methods */

	/* public methods */

	update(controller) {
	
	}

	getDirection() {
		return this.direction;
	}

	getPosition() {
		return this.position;
	}

	getColor() {
		return this.color;
	}
}
