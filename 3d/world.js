//
// Represents the 'World'
//
export class World {

	constructor() {
		this.matrix = mat4.create();
		this.elements = [];
	}

	/* public methods */

	add(e) {
		this.elements.push(e);
	}

	draw(camera, controller) {
		var i;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(camera, controller, this.matrix);
		}
	}
}
