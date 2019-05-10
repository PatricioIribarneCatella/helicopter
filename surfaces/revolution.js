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

		var p, v, pos, matrix;
		mat4.create(matrix);

		for (var i = 0.0; i < this.rows; i++) {
		
			mat4.identity(matrix);
			mat4.rotate(matrix, matrix, i / this.rows, this.axis);
			
			for (var j = 0.0; j < this.cols; j++) {

				v = j / this.cols;

				pos = this.shape.get();
				p = vec4.fromValues(pos[0], pos[1], pos[2], 1);

				vec4.transformMat4(p, p, matrix);

				this.position_buffer.push(p[0]);
				this.position_buffer.push(p[1]);
				this.position_buffer.push(p[2]);
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
