import {ShaderProgram} from './program.js';

//
// Manages the scene and the objects
// that live in. (Shaders too)
//
export class Scene {

	constructor(gl, canvas, vert_shader_id, frag_shader_id) {
		this.gl = gl;
		this.canvas = canvas;
		this.vs_id = vert_shader_id;
		this.fs_id = frag_shader_id;
		this.elements = [];
		this.program = new ShaderProgram(this.gl, this.vs_id, this.fs_id);
	}

	/* public methods */

	add(element) {
		this.elements.push(element);
	}

	draw() {
		var i;
		for (i = 0; i < this.elements.length; i++) {
			this.elements[i].draw(this.program);
		}
	}
}

