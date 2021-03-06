import { Scale } from '../../transformations/scaling.js';
import { Rotation } from '../../transformations/rotation.js';
import { Sphere } from '../../shapes/sphere.js';

import { Graphic } from '../graphic.js';
import { Color } from '../color.js';

export class GraphicSky extends Graphic {
    constructor(gl, shader) {
        var sky = new Sphere(50, 50, new Color([]));
        super(gl, sky, [new Scale([250.0, 250.0, 250.0])], shader);
    }

    _isLighting() {
        return false;
    }

    _useColor() {
        return false;
    }
}
