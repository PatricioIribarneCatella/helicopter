//
// Represents a Cylinder made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Cylinder {

	constructor(r, height, rows, cols) {
		
		this.r = r;
		this.height = height;
		this.rows = rows;
		this.cols = cols;

		this.theta = 2 * Math.PI / (this.cols - 1);
		this.zeta = this.height / (this.rows - 1);
		
		this.position_buffer = [];
		this.color_buffer = [];
		
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
		}

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				
				var x = this.r * Math.cos(j * this.theta);
				var y = this.r * Math.sin(j * this.theta);
				var z = i * this.zeta;
				
				this.position_buffer.push(x);
				this.position_buffer.push(y);
				this.position_buffer.push(z);
			};
		};

		// create the base at 'height' plane (z = this.height)
		for (k = 0; k < this.cols; k++) {
			this.position_buffer.push(0.0);
			this.position_buffer.push(0.0);
			this.position_buffer.push(this.height);
		}

		// update rows
		this.rows += 2;
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

