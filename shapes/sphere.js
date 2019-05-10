//
// Represents a Sphere made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Sphere {

	constructor(rows, cols) {
		
		this.rows = rows;
		this.cols = cols;

		this.theta = 2 * Math.PI / this.rows;
		this.phi = 2 * Math.PI / this.cols;
		
		this.position_buffer = [];
		this.color_buffer = [];
		
		this._init();
	}

	/* private methods */

	_createModel() {

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				
				// position = (x, y, z = 0)
				var x = Math.cos(i * this.theta) * Math.sin(j * this.phi);
				var y = Math.sin(i * this.theta) * Math.sin(j * this.phi);
				var z = Math.cos(j * this.phi);
				
				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);
			};
		};
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
		// generates a GRID defined by
		// 'cols' and 'rows'
		// with colors per vertex
		// and indexes to render it
		
		this._createModel();
		this._createColor();
	}

	/* public methods */

	getPosition() {
		return this.position_buffer;
	}

	getColor() {
		return this.color_buffer;
	}

	getCols() {
		return this.cols;
	}

	getRows() {
		return this.rows;
	}
}

