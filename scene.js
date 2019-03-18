import {ShaderProgram} from './program.js';

//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl, vert_shader_id, frag_shader_id) {
		this.gl = gl;
		this.vs_id = vert_shader_id;
		this.fs_id = frag_shader_id;
		this.program = new ShaderProgram(this.gl, this.vs_id, this.fs_id);
		this._init();
	}

	/* private methods */

	_init() {
		console.log("init-scene");
	}

	/* public methods */

	add(element) {
		console.log("add-element-scene");
	}

	draw() {
		console.log("drawing-scene");
	}
}

