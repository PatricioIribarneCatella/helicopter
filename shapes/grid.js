//
// Represents a Grid made up 
// of triangles and drawn it 
// by TRIANGLE_STRIP
//
export class Grid {

	constructor(rows, cols) {
		
		this.rows = rows;
		this.cols = cols;

		this.position_buffer = [];
		this.color_buffer = [];

		this._init();
	}

	/* private methods */

	_createModel() {

		for (var i = 0.0; i < this.rows; i++) {
			for (var j = 0.0; j < this.cols; j++) {
				// position = (x, y, z = 0)
				this.position_buffer.push(j - (this.cols - 1.0) / 2.0);
				this.position_buffer.push(i - (this.rows - 1.0) / 2.0);
				this.position_buffer.push(0);
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

	getIndexes() {
		return this.index_buffer;
	}

	getCols() {
		return this.cols;
	}

	getRows() {
		return this.rows;
	}
}

