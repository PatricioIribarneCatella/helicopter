import {BezierCuad} from '../../curves/bezier.js';
import {SweepSurface} from '../../surfaces/sweeping.js';

import {Color} from '../../3d/color.js';
import {Container3D} from '../../3d/container.js';
import {Graphic} from '../../3d/graphic.js';

import {Rotation} from '../../transformations/rotation.js';
import {Translation} from '../../transformations/translation.js';
import {Scale} from '../../transformations/scaling.js';

export class Stairway extends SweepSurface {

	constructor() {

		var shape = new BezierCuad([[0.0, 0.0, 0.0],
					[0.0, 2.0, 0.0],
					[0.0, 4.0, 0.0],
					[1.0, 4.0, 0.0],
					[2.0, 4.0, 0.0],
					[2.0, 2.0, 0.0],
					[2.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[0.0, 0.0, 0.0]]);

		shape.move([-1.0, -2.0, 0.0]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[0.25, 0.0, 0.0],
					[0.5, 0.0, 0.0]]);

		var c = new Color([0.27, 0.50, 0.70]);

		super(shape, path, 10, 5, [1, 1], c);

		this._complete(path);
		this._createColor();
	}

	_complete(path) {
	
		var k, p, n;

		var pos_buffer = [];
		var norm_buffer = [];

		p = path.get(0.0);
		n = [0.0, -1.0, 0.0];

		// Add level zero to create the 'floor'
		for (k = 0; k < this.cols; k++) {
			
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);

			norm_buffer.push(n[0]);
			norm_buffer.push(n[1]);
			norm_buffer.push(n[2]);
		}

		// Move all the points to the new buffer
		for (k = 0; k < this.position_buffer.length; k++) {
			pos_buffer.push(this.position_buffer[k]);
		}

		for (k = 0; k < this.normal_buffer.length; k++) {
			norm_buffer.push(this.normal_buffer[k]);
		}

		p = path.get(1.0);
		n = [0.0, 1.0, 0.0];
		
		// Add final level to create the 'roof'
		for (k = 0; k < this.cols; k++) {
			
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);

			norm_buffer.push(n[0]);
			norm_buffer.push(n[1]);
			norm_buffer.push(n[2]);
		}

		this.position_buffer = pos_buffer;
		this.normal_buffer = norm_buffer;

		this.rows += 2;
	}
}

export class StairwayStep extends SweepSurface {

	constructor() {
		
		var shape = new BezierCuad([[0.0, 0.0, 0.0],
					[0.5, 0.5, 0.0],
					[1.0, 1.0, 0.0],
					[1.5, 0.5, 0.0],
					[2.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[0.0, 0.0, 0.0]]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0]]);

		var c = new Color([0.94, 0.50, 0.50]);

		super(shape, path, 10, 10, [1, 1], c);

		this._complete(path);
		this._createColor();
	}

	_complete(path) {
		
		var k, p, n;

		var pos_buffer = [];
		var norm_buffer = [];

		p = path.get(0.0);
		n = [0.0, -1.0, 0.0];

		// Add level zero to create the 'floor'
		for (k = 0; k < this.cols; k++) {
			
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);

			norm_buffer.push(n[0]);
			norm_buffer.push(n[1]);
			norm_buffer.push(n[2]);
		}

		// Move all the points to the new buffer
		for (k = 0; k < this.position_buffer.length; k++) {
			pos_buffer.push(this.position_buffer[k]);
		}

		for (k = 0; k < this.normal_buffer.length; k++) {
			norm_buffer.push(this.normal_buffer[k]);
		}

		p = path.get(1.0);
		n = [0.0, 1.0, 0.0];
		
		// Add final level to create the 'roof'
		for (k = 0; k < this.cols; k++) {
			
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);

			norm_buffer.push(n[0]);
			norm_buffer.push(n[1]);
			norm_buffer.push(n[2]);
		}

		this.position_buffer = pos_buffer;
		this.normal_buffer = norm_buffer;

		this.rows += 2;
	}
}

export class Steps extends Container3D {

	constructor(gl, shader) {

		super([new Translation([2.0, -2.0, 1.0]),
		       new Rotation([1.0, 0.0, 0.0], Math.PI/4, 0.0)]);

		this.gl = gl;
		this.shader = shader;
		this.visibility = false;
		this.prevState = false;

		this._initialize();
	}

	/* private methods */

	_initialize() {
	
		var step = new StairwayStep();
		var t;

		for (var i = 0; i < 6; i++) {
			
			t = [new Translation([0.0, 0.0, 2*(Math.sqrt(2)/3.0)*i]),
			     new Scale([1.0, 0.5, Math.sqrt(2)/3.0])];
			var gstep = new Graphic(this.gl, step, t, this.shader);

			this.add(gstep);
		}
	}

	_isVisible(controller) {

		var state = controller.getDoorChanged();

		if (state === this.prevState)
			return this.visibility;

		this.prevState = state;

		if (this.visibility) {
			this.visibility = false;
		} else {
			this.visibility = true;
		}

		return this.visibility;
	}
}
