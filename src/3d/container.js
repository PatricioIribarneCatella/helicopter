//
// Represents an abstract 3D
// object node in the scene's tree.
//
// It contains childrens:
// 	- others 3D containers
// 		(a.k.a 'Container3D' object)
// 	- graphical objects
// 		(a.k.a 'Graphic' object)
//
export class Container3D {
	
	constructor(transformations) {
		
		this.ts = transformations;
		this.childrens = [];

		this._init();
	}

	/* private methods */

	_init() {
		this.matrix = mat4.create();
	}

	_updateTransformations(matrix) {
	
		var i;
		mat4.identity(this.matrix);

		for (i = 0; i < this.ts.length; i++) {
			mat4.multiply(this.matrix, this.matrix, this.ts[i].getMatrix());
		}

		mat4.multiply(this.matrix, matrix, this.matrix);
	}

	_animate(controller) {

		var i;
		for (i = 0; i < this.ts.length; i++) {
			this.ts[i].update(controller);
		}
	}

	_isVisible(controller) {
		return true;
	}

	/* public methods */

	add(e) {
		this.childrens.push(e);
	}

	draw(camera, controller, lights, matrix) {

		this._updateTransformations(matrix);

		if (this._isVisible(controller)) {

			var i;
			for (i = 0; i < this.childrens.length; i++) {
				this.childrens[i].draw(camera,
							controller,
							lights,
							this.matrix);
			}

			this._animate(controller);
		}
	}
}

