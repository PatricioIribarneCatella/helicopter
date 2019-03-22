//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl) {
		this.gl = gl;
		this.elements = [];
	}

	/* public methods */

	add(element) {
		this.elements.push(element);
	}

	draw() {
		window.requestAnimationFrame(() => this.draw());
		
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		var i;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].draw();
		}
		
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].update();
		}
	}
}

