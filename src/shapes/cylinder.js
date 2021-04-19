import {Surface} from '../surfaces/surface.js';

//
// Represents a Cylinder made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Cylinder extends Surface {

	constructor(r, height, rows, cols, color) {
		
		super(cols, rows, color);

		this.r = r;
		this.height = height;

		this.theta = 2 * Math.PI / (this.cols - 1);
		this.zeta = this.height / (this.rows - 1);
		
		this._init();
	}

	/* private methods */

	_createModel() {

		var k;
		
		// create the base at zero plane (z = 0)
		for (k = 0; k < this.cols; k++) {

			this.position_buffer.push(0.0);
			this.position_buffer.push(0.0);
			this.position_buffer.push(0.0);

			this.normal_buffer.push(0.0);
			this.normal_buffer.push(0.0);
			this.normal_buffer.push(-1.0);
		}

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				
				var x = this.r * Math.cos(j * this.theta);
				var y = this.r * Math.sin(j * this.theta);
				var z = i * this.zeta;
				
				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);

				this.normal_buffer.push(x);
				this.normal_buffer.push(y);
				this.normal_buffer.push(0.0);
			};
		};

		// create the base at 'height' plane (z = this.height)
		for (k = 0; k < this.cols; k++) {

			this.position_buffer.push(0.0);
			this.position_buffer.push(0.0);
			this.position_buffer.push(this.height);

			this.normal_buffer.push(0.0);
			this.normal_buffer.push(0.0);
			this.normal_buffer.push(1.0);
		}

		// update rows
		this.rows += 2;
	}

	_init() {
		// generates a GRID defined by
		// 'cols' and 'rows'
		// with colors per vertex
		// and indexes to render it
		
		this._createModel();
		this._createColor();
	}
}

