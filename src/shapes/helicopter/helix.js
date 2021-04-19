import { BSplineCuad } from '../../curves/bspline.js';
import { BezierCuad } from '../../curves/bezier.js';
import { SweepSurface } from '../../surfaces/sweeping.js';
import { RevolutionSurface } from '../../surfaces/revolution.js';

import { Color } from '../../3d/color.js';
import { Container3D } from '../../3d/container.js';
import { Graphic } from '../../3d/graphic.js';

import { Identity } from '../../transformations/identity.js';
import { Rotation } from '../../transformations/rotation.js';
import { Translation } from '../../transformations/translation.js';
import { Scale } from '../../transformations/scaling.js';
import { HelixRotation } from '../../transformations/helicopter/rotation.js';

import { Cylinder } from '../../shapes/cylinder.js';
import { Blade } from '../../shapes/helicopter/blade.js';

export class HelixContainer extends RevolutionSurface {
    constructor() {
        var shape = new BSplineCuad([
            [2.0, 2.0, 0.0],
            [2.0, 4.0, 0.0],
            [4.0, 4.0, 0.0],
            [4.0, 2.0, 0.0],
            [4.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
            [2.0, 2.0, 0.0],
            [2.0, 4.0, 0.0],
        ]);

        shape.move([4.0, -2.0, 0.0]);

        var c = new Color([1.0, 0.84, 0.0]);

        super(shape, [0.0, 1.0, 0.0], 16, 100, c);
    }
}

export class HelixConnector extends SweepSurface {
    constructor(cols, rows) {
        var shape = new BSplineCuad([
            [3.0, 6.0, 0.0],
            [5.0, 6.0, 0.0],
            [6.0, 4.0, 0.0],
            [8.0, 4.0, 0.0],
            [8.0, 2.0, 0.0],
            [6.0, 2.0, 0.0],
            [5.0, 0.0, 0.0],
            [3.0, 0.0, 0.0],
            [2.0, 2.0, 0.0],
            [0.0, 2.0, 0.0],
            [0.0, 4.0, 0.0],
            [2.0, 4.0, 0.0],
            [3.0, 6.0, 0.0],
            [5.0, 6.0, 0.0],
        ]);

        shape.move([-4.0, -3.0, 0.0]);

        var path = new BezierCuad([
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [2.0, 0.0, 0.0],
            [3.0, 0.0, 0.0],
            [4.0, 0.0, 0.0],
            [5.0, 0.0, 0.0],
            [6.0, 0.0, 0.0],
        ]);

        var c = new Color([0.4, 0.4, 0.4]);

        super(shape, path, rows, cols, [0.2, 0.2], c);

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

export class Helix extends Container3D {
    constructor(position, gl, shader) {
        super([new Identity()]);

        this.position = position;
        this.gl = gl;
        this.shader = shader;

        this._initialize();
    }

    _initialize() {
        var cylinder = new Cylinder(1, 1, 50, 50, new Color([1.0, 0.84, 0.0]));
        var t6 = [
            new Translation([0.0, -1.25, 0.0]),
            new Rotation([1.0, 0.0, 0.0], -Math.PI / 2, 0.0),
            new Scale([1.0, 1.0, 2.5]),
        ];
        var gc = new Graphic(this.gl, cylinder, t6, this.shader);

        this.add(gc);

        var connector = new HelixConnector(50, 50);
        var t7 = [
            new Rotation([1.0, 0.0, 0.0], Math.PI / 2, 0.0),
            new Scale([1.0, 1.0 / 6.0, 3.0 / 16.0]),
        ];
        var gconn = new Graphic(this.gl, connector, t7, this.shader);

        this.add(gconn);

        //// Blades + Cylinder + Container ////

        // Container
        var t8 = [
            new Translation([9.0, 0.0, 0.0]),
            new HelixRotation(this.position),
            new Rotation([1.0, 0.0, 0.0], Math.PI / 2, 0.0),
        ];
        var containerAndBlades = new Container3D(t8);

        var container = new HelixContainer(50, 50);
        var gcontainer = new Graphic(this.gl, container, [new Scale([0.4, 0.4, 0.4])], this.shader);

        containerAndBlades.add(gcontainer);

        // Add all the 'blades'
        var blade = new Blade();

        var blades = new Container3D([new Rotation([0.0, 1.0, 0.0], 0.0, 0.02)]);

        var t;
        var ang_rate = (2 * Math.PI) / 12;
        for (var ang = 0.0; ang < 2 * Math.PI; ang += ang_rate) {
            t = [
                new Rotation([0.0, 1.0, 0.0], ang, 0.0),
                new Rotation([1.0, 0.0, 0.0], Math.PI / 4, 0.0),
                new Scale([0.5, 1.0, 1.0]),
                new Translation([-4.0, 0.0, 0.0]),
            ];

            var gb = new Graphic(this.gl, blade, t, this.shader);
            blades.add(gb);
        }

        containerAndBlades.add(blades);

        // Cylinder
        var thc = [
            new Translation([0.0, -1.25, 0.0]),
            new Rotation([1.0, 0.0, 0.0], -Math.PI / 2, 0.0),
            new Scale([0.6, 0.6, 2.0]),
        ];
        var helixCylinder = new Graphic(this.gl, cylinder, thc, this.shader);

        containerAndBlades.add(helixCylinder);

        this.add(containerAndBlades);
    }
}
