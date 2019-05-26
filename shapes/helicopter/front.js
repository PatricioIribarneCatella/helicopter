import {BezierCuad} from '../../curves/bezier.js';
import {SweepingSurface} from '../../surfaces/sweeping.js';
import {Color} from '../../3d/color.js';

export class FrontCenter extends SweepingSurface {

	constructor(cols, rows) {
		
		var shape = new BezierCuad([[2.0, 4.0, 0.0],
					[3.0, 4.0, 0.0],
					[4.0, 4.0, 0.0],
					[5.0, 3.0, 0.0],
					[6.0, 2.0, 0.0],
					[5.0, 1.0, 0.0],
					[4.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[1.0, 1.0, 0.0],
					[0.0, 2.0, 0.0],
					[1.0, 3.0, 0.0],
					[2.0, 4.0, 0.0]]);

		shape.move([-3.0, -2.0, 0.0]);

		var path = new BezierCuad([[0.0, 0.0, 0.0],
					[1.0, 0.0, 0.0],
					[2.0, 0.0, 0.0],
					[3.0, 0.0, 0.0],
					[4.0, 0.0, 0.0],
					[5.0, 0.0, 0.0],
					[6.0, 0.0, 0.0]]);

		var c = new Color([]);

		super(shape, path, 100, 100, [0.6, 0.3], c);
	}
}
