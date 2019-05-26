import {BezierCuad} from '../../curves/bezier.js';
import {SweepSurface} from '../../surfaces/sweeping.js';
import {RevolutionSurface} from '../../surfaces/revolution.js';
import {Color} from '../../3d/color.js';

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
	
		var k, p;

		var pos_buffer = [];

		p = path.get(0.0);

		// Add level zero to create the 'floor'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		// Move all the points to the new buffer
		for (k = 0; k < this.position_buffer.length; k++) {
			pos_buffer.push(this.position_buffer[k]);
		}

		p = path.get(1.0);
		
		// Add final level to create the 'roof'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		this.position_buffer = pos_buffer;

		this.rows += 2;
	}
}

export class StairwayStep extends SweepSurface {

	constructor() {
		
		var shape = new BezierCuad([[0.0, 0.0, 0.0],
					[0.0, 1.0, 0.0],
					[0.0, 2.0, 0.0],
					[1.0, 1.0, 0.0],
					[2.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[0.0, 0.0, 0.0]]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[4.0, 0.0, 0.0]]);

		var c = new Color([0.94, 0.50, 0.50]);

		super(shape, path, 10, 10, [1, 1], c);

		this._complete(path);
		this._createColor();
	}

	_complete(path) {
		
		var k, p;

		var pos_buffer = [];

		p = path.get(0.0);

		// Add level zero to create the 'floor'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		// Move all the points to the new buffer
		for (k = 0; k < this.position_buffer.length; k++) {
			pos_buffer.push(this.position_buffer[k]);
		}

		p = path.get(1.0);
		
		// Add final level to create the 'roof'
		for (k = 0; k < this.cols; k++) {
			pos_buffer.push(p[0]);
			pos_buffer.push(p[1]);
			pos_buffer.push(p[2]);
		}

		this.position_buffer = pos_buffer;

		this.rows += 2;
	}
}
