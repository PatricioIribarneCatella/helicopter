import { Graphic } from '../graphic.js';
import { Color } from '../color.js';

export class GraphicReflect extends Graphic {
    constructor(gl, model, t, shader) {
        super(gl, model, t, shader);
    }

    _useUVCoords() {
        return false;
    }
}
