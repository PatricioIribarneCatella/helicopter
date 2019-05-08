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

	_init() {
		
	}

}
