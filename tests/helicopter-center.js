import { App } from '../scene/app.js';
import { Scene } from '../scene/scene.js';
import { Camera } from '../scene/camera.js';

import { ShaderProgram } from '../shaders/program.js';

import { Rotation } from '../transformations/rotation.js';

import { Graphic } from '../3d/graphic.js';
import { World } from '../3d/world.js';
import { Color } from '../3d/color.js';

import { BackCenter } from '../shapes/helicopter/back.js';
import { FrontCenter } from '../shapes/helicopter/front.js';
import { HexagonCenter, CurveCenter } from '../shapes/helicopter/center.js';

export class HelicopterCenterBack extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var model = new BackCenter(50, 50);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}

export class HelicopterCenterFront extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var model = new FrontCenter(50, 50);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}

export class HelicopterCenterHexagon extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var model = new HexagonCenter(50, 50);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}

export class HelicopterCenterCurve extends App {
    constructor(gl, canvas) {
        super(gl, canvas);
    }

    /* public methods */

    start() {
        var scene = new Scene(this.gl);

        var shader = new ShaderProgram(this.gl, matrix_vertex_shader, simple_fragment_shader);

        // Perspective camera moved 7 units from the origin
        var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 15.0]);
        scene.addCamera(camera);

        // World
        var world = new World();

        var model = new CurveCenter(50, 50);

        var t1 = [new Rotation([1.0, 1.0, 0.0], 0.0, 0.01)];
        var gt1 = new Graphic(this.gl, model, t1, shader);

        world.add(gt1);

        scene.add(world);

        scene.draw();
    }
}
