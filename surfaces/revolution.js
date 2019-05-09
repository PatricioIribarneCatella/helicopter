import {Surface} from './surface.js';

//
// Represents a Revolution surface
// made from a 'shape' curve object
// and a coordinate axis
// 
// Rows and columns are given
// by rows and res (a.k.a vertical 
// 	resolution)
//
export class RevolutionSurface extends Surface {

	constructor(shape, axis, rows, res) {
		
		super(res, rows);

		this.shape = shape;
		this.axis = axis;

		this._init();
	}

	/* private methods */
	
	_createModel() {

		var m;
		mat4.create(m);

		for (var i = 0.0; i < this.rows; i++) {
		
			mat4.identity(m);
			mat4.rotate(m, m, i / this.rows, this.axis);
			
			for (var j = 0.0; j < this.cols; j++) {

				// check
				var p = m * this.shape.get(j / this.cols);

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
