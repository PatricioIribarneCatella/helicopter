import { App } from '../scene/app.js';
import { Scene } from '../scene/scene.js';
import { Camera } from '../scene/camera.js';

import { ShaderProgram } from '../shaders/program.js';

import { RevolutionSurface } from '../surfaces/revolution.js';
import { BezierCuad, BezierCubic } from '../curves/bezier.js';

import { Rotation } from '../transformations/rotation.js';

import { Graphic } from '../3d/graphic.js';
import { World } from '../3d/world.js';
import { Color } from '../3d/color.js';

export class BezierQuadCurveRevApp extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var shape = new BezierCuad([
            [0.0, 9.0, 0.0],
            [3.0, 12.0, 0.0],
            [6.0, 9.0, 0.0],
            [3.0, 6.0, 0.0],
            [6.0, 3.0, 0.0],
            [3.0, 0.0, 0.0],
            [0.0, 3.0, 0.0],
        ]);

        var c = new Color([]);
        var model = new RevolutionSurface(shape, [0.0, 1.0, 0.0], 100, 100, c);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}

export class BezierCubicCurveRevApp extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, -5.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var shape = new BezierCubic([
            [0.0, 9.0, 0.0],
            [3.0, 12.0, 0.0],
            [6.0, 9.0, 0.0],
            [3.0, 6.0, 0.0],
            [6.0, 3.0, 0.0],
            [3.0, 0.0, 0.0],
            [0.0, 3.0, 0.0],
        ]);

        var c = new Color([]);
        var model = new RevolutionSurface(shape, [0.0, 1.0, 0.0], 100, 100, c);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}
