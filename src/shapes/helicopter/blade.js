import { BezierCuad } from '../../curves/bezier.js';
import { SweepSurface } from '../../surfaces/sweeping.js';
import { Color } from '../../3d/color.js';

export class Blade extends SweepSurface {
    constructor() {
        var shape = new BezierCuad([
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
        ]);

        shape.move([-1.0, 0.0, 0.0]);

        var path = new BezierCuad([
            [0.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
            [4.0, 0.0, 0.0],
        ]);

        var c = new Color([0.5, 0.5, 0.5]);

        super(shape, path, 2, 2, [0.5, 0.5], c);

        this._createColor();
    }
}
