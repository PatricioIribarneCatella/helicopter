import {Surface} from './surface.js';

//
// Represents a Sweep surface
// made from a 'shape' curve object
// and a 'path' curve object
// 
// Rows and columns are given
// by levels and res (a.k.a vertical 
// 	resolution)
//
export class SweepSurface extends Surface {

	constructor(shape, path, levels, res) {
		
		super(res, levels);

		this.shape = shape;
		this.path = path;

		this._init();
	}

	/* private methods */
	
	_createModel() {
	
		for (var i = 0.0; i < this.rows; i++) {
		
			var u = i / this.rows;

			var t = this.path.getTangent(u);
			var b = this.path.getBinormal(u);
			var n = this.path.getNormal(u);

			// check
			var matrix = mat(t, n, b, this.path.get(u));

			for (var j = 0.0; j < this.cols; j++) {

				var v = j / this.cols;

				// check
				var p = matrix * this.shape.get(v);

				this.position_buffer.push(p.x);
				this.position_buffer.push(p.y);
				this.position_buffer.push(p.z);
			}
		}
	}

	_createColor() {
	
		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				this.color_buffer.push(1.0 / this.rows * i);
				this.color_buffer.push(0.2);
				this.color_buffer.push(1.0 / this.cols * j);
			};
		};
	}

	_init() {
		this._createModel();
		this._createColor();
	}
}
