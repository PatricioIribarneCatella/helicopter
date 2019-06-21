import {Surface} from '../surfaces/surface.js';

//
// Represents a Sphere made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Sphere extends Surface {

	constructor(rows, cols, color) {
		
		super(cols, rows, color);

		this.theta = 2 * Math.PI / this.rows;
		this.phi = 2 * Math.PI / this.cols;
		
		this._init();
	}

	/* private methods */

	_createModel() {

		for (var i = 0; i < this.rows; i++) {

			var theta = i * Math.PI / this.rows;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var j = 0; j <= this.cols; j++) {

				var phi = j * 2 * Math.PI / this.cols;
				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;

				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);

				this.normal_buffer.push(x);
				this.normal_buffer.push(y);
				this.normal_buffer.push(z);

				var u = 1.0 - (j / this.cols);
				var v = 1.0 - (i / this.rows);

				this.coord_buffer.push(u);
				this.coord_buffer.push(v);
			}
		}
		
		this.cols += 1;
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

