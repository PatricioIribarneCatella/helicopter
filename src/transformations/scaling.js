//
// Represents a scaling
// transformation
//
export class Scale {
    constructor(scale) {
        this.scale = scale;

        this.modelMatrix = mat4.create();

        this._init();
    }

    /* private methods */

    _init() {
        // initialize scaling matrix
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
    }

    /* public methods */

    // scaling does not need to be updated
    // in every animation frame as a rotation does
    update(controller) {}

    getMatrix() {
        return this.modelMatrix;
    }
}
