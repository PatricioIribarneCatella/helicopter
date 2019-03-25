import {Scene} from './scene.js';
import {ShaderProgram} from './program.js';

import {Grid} from './grid.js';
import {Triangle} from './triangle.js';

import {Transformation} from './transformation.js';

export class App {
	
	constructor(gl, canvas) {
		this.gl = gl;
		this.canvas = canvas;
		this._init();
	}

	/* private methods */
	
	//
	// Background and WebGl setup
	//
	_init() {
		// black color
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// clear the color buffer
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		this.gl.enable(this.gl.DEPTH_TEST);                              
		this.gl.depthFunc(this.gl.LEQUAL);

		// viewport init
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	/* public methods */

	start() {		
		var scene = new Scene(this.gl);

		var shader = new ShaderProgram(this.gl,
					       matrix_vertex_shader,
					       simple_fragment_shader);
		
		// TRIANLGE
		
		var color = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0];

		var tr = new Triangle(this.gl, color);
		
		var t1 = new Transformation(this.gl, this.canvas, shader);
		
		t1.add(tr);
		
		t1.perspective(true);
		t1.view([0.0, 0.0, -5.0]);
		t1.rotate([0.0, 0.0, 1.0], 0.0, 0.05);
		t1.move([1.0, 0.0, 0.0]);
		
		scene.add(t1);
		
		// GRID
		
		var gr = new Grid(this.gl, 2, 2);
		
		var t2 = new Transformation(this.gl, this.canvas, shader);
		
		t2.add(gr);
		
		t2.perspective(true);
		t2.view([0.0, 0.0, -5.0]);
		t2.rotate([0.0, 1.0, 0.0], 0.0, 0.03);
		t2.move([1.0, 0.0, 0.0]);
		
		scene.add(t2);
		
		scene.draw();
	}
}

