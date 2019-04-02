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

	add(world) {
		this.world = world;
	}

	addCamera(camera) {
		this.camera = camera;
	}

	draw() {
		window.requestAnimationFrame(() => this.draw());
		
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.world.draw(this.camera);
	}
}

