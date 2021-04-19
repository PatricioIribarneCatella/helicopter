import { BezierCuad } from '../../curves/bezier.js';
import { BSplineCuad } from '../../curves/bspline.js';
import { SweepSurface } from '../../surfaces/sweeping.js';
import { Color } from '../../3d/color.js';

export class HexagonCenter extends SweepSurface {
    constructor(cols, rows) {
        var shape = new BezierCuad([
            [2.0, 4.0, 0.0],
            [3.0, 4.0, 0.0],
            [4.0, 4.0, 0.0],
            [5.0, 3.0, 0.0],
            [6.0, 2.0, 0.0],
            [5.0, 1.0, 0.0],
            [4.0, 0.0, 0.0],
            [3.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 2.0, 0.0],
            [1.0, 3.0, 0.0],
            [2.0, 4.0, 0.0],
        ]);

        shape.move([-3.0, -2.0, 0.0]);

        var path = new BezierCuad([
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
            [3.0, 0.0, 0.0],
            [4.0, 0.0, 0.0],
            [5.0, 0.0, 0.0],
            [6.0, 0.0, 0.0],
        ]);

        var c = new Color([0.0, 1.0, 1.0]);

        super(shape, path, rows, cols, [1, 1], c);

        this._complete(path);
        this._createColor();
    }

    _complete(path) {
        var k, p, n;

        var pos_buffer = [];
        var norm_buffer = [];

        p = path.get(0.0);
        n = [0.0, -1.0, 0.0];

        // Add level zero to create the 'floor'
        for (k = 0; k < this.cols; k++) {
            pos_buffer.push(p[0]);
            pos_buffer.push(p[1]);
            pos_buffer.push(p[2]);

            norm_buffer.push(n[0]);
            norm_buffer.push(n[1]);
            norm_buffer.push(n[2]);
        }

        // Move all the points to the new buffer
        for (k = 0; k < this.position_buffer.length; k++) {
            pos_buffer.push(this.position_buffer[k]);
        }

        for (k = 0; k < this.normal_buffer.length; k++) {
            norm_buffer.push(this.normal_buffer[k]);
        }

        p = path.get(1.0);
        n = [0.0, 1.0, 0.0];

        // Add final level to create the 'roof'
        for (k = 0; k < this.cols; k++) {
            pos_buffer.push(p[0]);
            pos_buffer.push(p[1]);
            pos_buffer.push(p[2]);

            norm_buffer.push(n[0]);
            norm_buffer.push(n[1]);
            norm_buffer.push(n[2]);
        }

        this.position_buffer = pos_buffer;
        this.normal_buffer = norm_buffer;

        this.rows += 2;
    }
}

export class CurveCenter extends SweepSurface {
    constructor(cols, rows) {
        var shape = new BSplineCuad([
            [4.0, 9.0, 0.0],
            [5.0, 9.0, 0.0],
            [6.0, 9.0, 0.0],
            [7.0, 9.0, 0.0],
            [8.0, 9.0, 0.0],
            [9.0, 8.0, 0.0],
            [10.0, 7.0, 0.0],
            [11.0, 6.0, 0.0],
            [10.0, 4.0, 0.0],
            [9.0, 3.0, 0.0],
            [8.0, 3.0, 0.0],
            [7.0, 3.0, 0.0],
            [6.0, 3.0, 0.0],
            [5.0, 3.0, 0.0],
            [4.0, 3.0, 0.0],
            [3.0, 3.0, 0.0],
            [2.0, 4.0, 0.0],
            [1.0, 6.0, 0.0],
            [2.0, 7.0, 0.0],
            [3.0, 8.0, 0.0],
            [4.0, 9.0, 0.0],
            [5.0, 9.0, 0.0],
        ]);

        shape.move([-6.0, -6.0, 0.0]);

        var path = new BezierCuad([
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
        ]);

        var c = new Color([0.29, 0.0, 0.5]);

        super(shape, path, rows, cols, [1, 1], c);

        this._complete(path);
        this._createColor();
    }

    _complete(path) {
        var k, p, n;

        var pos_buffer = [];
        var norm_buffer = [];

        p = path.get(0.0);
        n = [0.0, -1.0, 0.0];

        // Add level zero to create the 'floor'
        for (k = 0; k < this.cols; k++) {
            pos_buffer.push(p[0]);
            pos_buffer.push(p[1]);
            pos_buffer.push(p[2]);

            norm_buffer.push(n[0]);
            norm_buffer.push(n[1]);
            norm_buffer.push(n[2]);
        }

        // Move all the points to the new buffer
        for (k = 0; k < this.position_buffer.length; k++) {
            pos_buffer.push(this.position_buffer[k]);
        }

        for (k = 0; k < this.normal_buffer.length; k++) {
            norm_buffer.push(this.normal_buffer[k]);
        }

        p = path.get(1.0);
        n = [0.0, 1.0, 0.0];

        // Add final level to create the 'roof'
        for (k = 0; k < this.cols; k++) {
            pos_buffer.push(p[0]);
            pos_buffer.push(p[1]);
            pos_buffer.push(p[2]);

            norm_buffer.push(n[0]);
            norm_buffer.push(n[1]);
            norm_buffer.push(n[2]);
        }

        this.position_buffer = pos_buffer;
        this.normal_buffer = norm_buffer;

        this.rows += 2;
    }
}
