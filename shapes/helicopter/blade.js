import {BezierCuad} from '../../curves/bezier.js';
import {SweepSurface} from '../../surfaces/sweeping.js';
import {Color} from '../../3d/color.js';

export class Blade extends SweepSurface {

	constructor() {

		var shape = new BezierCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0]]);

		shape.move([-1.0, 0.0, 0.0]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[4.0, 0.0, 0.0]]);

		var c = new Color([]);

		super(shape, path, 2, 2, [0.5, 0.5], c);

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
