//
// Represents a perspective Camera
//
// projection (perspective) + view (position)
//
export class Camera {
    constructor(gl, canvas, pos) {
        this.gl = gl;
        this.canvas = canvas;

        // invert the z index
        this.position = [pos[0], pos[1], -pos[2]];
        this.d = 7.0;

        this.projMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.matrix = mat4.create();

        this._init();
    }

    /* private methods */

    _init() {
        // initialize perspective matrix
        mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 10000.0);

        // initialize translation matrix
        mat4.translate(this.viewMatrix, this.viewMatrix, this.position);

        mat4.multiply(this.matrix, this.projMatrix, this.viewMatrix);
    }

    /* public methods */

    bind(program) {
        var uniformMatrixPV = program.findUniform('pv');
        this.gl.uniformMatrix4fv(uniformMatrixPV, false, this.matrix);
    }

    getView() {
        return this.viewMatrix;
    }

    getEye() {
        return this.position;
    }

    update(controller) {
        var type = controller.getCameraType();

        var cPos = controller.getCameraPosition();
        var p = controller.getPosition();
        var angle = controller.getYaw();

        var center = [p.x, p.y, p.z];
        var up = [0.0, 1.0, 0.0];
        var eye, aux;

        switch (type) {
            case 'global':
                center = [0.0, 0.0, 0.0];
                eye = [cPos.x, cPos.y, cPos.z];
                this.position = eye;
                break;
            case 'orbital':
                eye = [cPos.x + p.x, cPos.y + p.y, cPos.z + p.z];
                this.position = eye;
                break;
            case 'lateral':
                aux = [-this.d * Math.sin(angle), 0.0, -this.d * Math.cos(angle)];
                eye = [p.x + aux[0], p.y, p.z + aux[2]];
                this.position = eye;
                break;
            case 'up':
                up = [1.0, 0.0, 0.0];
                eye = [p.x, p.y + this.d, p.z];
                this.position = eye;
                break;
            case 'back':
                aux = [-this.d * Math.cos(angle), 0.0, this.d * Math.sin(angle)];
                eye = [p.x + aux[0], p.y, p.z + aux[2]];
                this.position = eye;
                break;
        }

        mat4.lookAt(this.viewMatrix, eye, center, up);

        mat4.multiply(this.matrix, this.projMatrix, this.viewMatrix);
    }
}
