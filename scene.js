//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor() {
		this.elements = [];
	}

	/* public methods */

	add(element) {
		this.elements.push(element);
	}

	draw() {
		window.requestAnimationFrame(draw);
		
		var i;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].draw();
		}
		
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].update();
		}
	}
}

