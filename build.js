(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.HELICOPTER = {}));
}(this, function (exports) { 'use strict';

	//
	// Abstract class representing
	// the application object
	//
	class App {
		
		constructor(gl, canvas) {
			this.gl = gl;
			this.canvas = canvas;
			this._init();
		}

		/* private methods */
		
		//
		// Background and WebGl setup
		//
		_init() {
			// black color
			this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

			// clear the color buffer
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
			
			this.gl.enable(this.gl.DEPTH_TEST);                              
			this.gl.depthFunc(this.gl.LEQUAL);

			// viewport init
			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		}

		/* public methods */

		start() {}
	}

	//
	// Manages the scene and the objects
	// that live in. (Shaders too)
	//
	class Scene {

		constructor(gl) {
			this.gl = gl;
		}

		/* public methods */

		add(world) {
			this.world = world;
		}

		addCamera(camera) {
			this.camera = camera;
		}

		addController(controller) {
			this.controller = controller;
		}

		addLights(lights) {
			this.lights = lights;
		}

		draw() {
			window.requestAnimationFrame(() => this.draw());
			
			this.controller.update();

			this.camera.update(this.controller);

			for (var l in this.lights) {
				this.lights[l].update(this.controller);
			}

			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			this.world.draw(this.camera, this.controller, this.lights);

			$("#display").html(this.controller.getInfo());
		}
	}

	//
	// Represents a perspective Camera
	//
	// projection (perspective) + view (position)
	//
	class Camera {

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
			mat4.perspective(this.projMatrix, 45,
					 this.canvas.width / this.canvas.height,
					 0.1, 10000.0);

			// initialize translation matrix
			mat4.translate(this.viewMatrix, this.viewMatrix, this.position);

			mat4.multiply(this.matrix, this.projMatrix, this.viewMatrix);
		}

		/* public methods */

		bind(program) {

			var uniformMatrixPV = program.findUniform("pv");
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
				case "global":
					center = [0.0, 0.0, 0.0];
					eye = [cPos.x, cPos.y, cPos.z];
					this.position = eye;
					break;
				case "orbital":
					eye = [cPos.x + p.x, cPos.y + p.y, cPos.z + p.z];
					this.position = eye;
					break;
				case "lateral":
					aux = [-this.d*Math.sin(angle), 0.0, -this.d*Math.cos(angle)];
					eye = [p.x + aux[0], p.y, p.z + aux[2]];
					this.position = eye;
					break;
				case "up":
					up = [1.0, 0.0, 0.0];
					eye = [p.x, p.y + this.d, p.z];
					this.position = eye;
					break;
				case "back":
					aux = [-this.d*Math.cos(angle), 0.0, this.d*Math.sin(angle)];
					eye = [p.x + aux[0], p.y, p.z + aux[2]];
					this.position = eye;
					break;
			}

			mat4.lookAt(this.viewMatrix, eye, center, up);

			mat4.multiply(this.matrix, this.projMatrix, this.viewMatrix);
		}
	}

	// Compiles a shader source code
	// depending on its type
	//
	function compile(gl, src, type) {

		// compile the shader
		var shader = gl.createShader(type);

		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
		}

		return shader;
	}

	//
	// Manipulates GL programs and
	// loads shaders from src
	//
	class ShaderProgram {

		constructor(gl, vertex_src, fragment_src) {
			
			this.gl = gl;
			this.vs_src = vertex_src;
			this.fs_src = fragment_src;
			
			this._init();
		}

		/* private methods  */
		
		_init() {
			// compile the shader
			var vs = compile(this.gl, this.vs_src, this.gl.VERTEX_SHADER);
			var fs = compile(this.gl, this.fs_src, this.gl.FRAGMENT_SHADER);

			this.program = this.gl.createProgram();
			
			// attach the shader to the program
			this.gl.attachShader(this.program, vs);
			this.gl.attachShader(this.program, fs);

			// link program
			this.gl.linkProgram(this.program);

			if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
				alert("Unable to initialize the shader program.");
			}
		}

		/* public methods  */

		use() {
			// use the program
			this.gl.useProgram(this.program);
		}

		findAttribute(id) {
			return this.gl.getAttribLocation(this.program, id);
		}

		findUniform(id) {
			return this.gl.getUniformLocation(this.program, id);
		}
	}

	//
	// Represents a Rotation
	//
	class Rotation {

		constructor(axis, init_angle, increment) {

			this.raxis = axis;
			this.angle = init_angle;
			this.increment = increment;

			this.modelMatrix = mat4.create();

			this._init();
		}

		/* private methods */

		_init() {
			// initialize rotation matrix
			mat4.identity(this.modelMatrix);
			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    this.raxis);
		}

		/* public methods */

		update(controller) {

			this.angle += this.increment;

			mat4.identity(this.modelMatrix);
			
			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    this.raxis);
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents an Identity
	// transformation
	//
	class Identity {

		constructor() {
			this.modelMatrix = mat4.create();
		}

		/* public methods */

		// it does not need to be updated
		update(controller) {}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a Translation
	//
	class Translation {
		
		constructor(position) {

			this.position = position;
		
			this.modelMatrix = mat4.create();

			this._init();
		}

		/* private methods */

		_init() {
			// initialize rotation matrix
			mat4.identity(this.modelMatrix);
			mat4.translate(this.modelMatrix,
				       this.modelMatrix,
				       this.position);
		}

		/* public methods */
		
		// translation does not need to be updated
		// in every animation frame as a rotation does
		update(controller) {}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a scaling
	// transformation
	//
	class Scale {

		constructor(scale) {
			
			this.scale = scale;

			this.modelMatrix = mat4.create();

			this._init();
		}

		/* private methods */

		_init() {
			// initialize scaling matrix
			mat4.identity(this.modelMatrix);
			mat4.scale(this.modelMatrix,
				   this.modelMatrix,
				   this.scale);
		}

		/* public methods */

		// scaling does not need to be updated
		// in every animation frame as a rotation does
		update(controller) {}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a double Rotation
	// using the 'controller' data
	//
	class HelicopterRotation {

		constructor() {

			this.modelMatrix = mat4.create();
			this.rotateX = mat4.create();
			this.rotateY = mat4.create();
		}

		/* public methods */

		update(controller) {

			var angleX = controller.getRoll();
			var angleY = controller.getYaw();

			mat4.identity(this.modelMatrix);
			mat4.identity(this.rotateX);
			mat4.identity(this.rotateY);

			mat4.rotate(this.rotateX,
				    this.rotateX,
				    angleX,
				    [1.0, 0.0, 0.0]);

			mat4.rotate(this.rotateY,
				    this.rotateY,
				    angleY,
				    [0.0, 1.0, 0.0]);

			mat4.multiply(this.modelMatrix,
				      this.rotateX,
				      this.rotateY);
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a Rotation
	// using the 'Pitch' angle
	//
	class HelixRotation {

		constructor(position) {
			
			this.position = position;
			this.modelMatrix = mat4.create();
		}

		/* public methods */

		update(controller) {
			
			var angle = controller.getPitch();

			mat4.identity(this.modelMatrix);
			
			if (this.position === "left") {
				angle = -angle;
			}

			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    angle,
				    [1.0, 0.0, 0.0]);
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a Rotation of the
	// helix motors
	//
	class MotorRotation {

		constructor(position) {
			
			this.position = position;
			
			this.up = false;
			this.prevState = false;
			this.targetUp = false;
			this.targetDown = false;

			this.angle = 0.0;
			this.delta = 0.01;

			this.modelMatrix = mat4.create();
		}

		/* public methods */

		update(controller) {
			
			var state = controller.getMotorPosChanged();
			var target;

			if (state === this.prevState) {
				
				if (this.up && this.targetDown) {
				
					if (this.position === "left") {
						target = this.angle - this.delta;
						this.angle = Math.max(target, 0.0);
					} else {
						target = this.angle + this.delta;
						this.angle = Math.min(target, 0.0);
					}
					
					if (this.angle == 0.0) {
						this.up = false;
						this.targetDown = false;
					}

				} else if (!this.up && this.targetUp) {

					if (this.position === "left") {
						target = this.angle + this.delta;
						this.angle = Math.min(target, Math.PI/2);
					} else {
						target = this.angle - this.delta;
						this.angle = Math.max(target, -Math.PI/2);
					}
					
					if (this.angle == Math.PI/2 || this.angle == -Math.PI/2) {
						this.up = true;
						this.targetUp = false;
					}
				}
				
				mat4.identity(this.modelMatrix);
		
				mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    [0.0, 1.0, 0.0]);

				return;
			}
			
			this.prevState = state;

			if (this.up) {
				this.targetDown = true;
			} else {
				this.targetUp = true;
			}
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a Rotation
	// applied to the landing gear legs
	//
	class LegRotation {

		constructor(angle, delta) {
			
			this.maxAngle = angle;
			this.angle = 0.0;
			this.delta = delta;

			this.extended = true;
			this.targetContract = false;
			this.targetExtended = false;
			this.prevState = false;
			
			this.modelMatrix = mat4.create();
		}

		/* public methods */

		update(controller) {
			
			var state = controller.getLegPosChanged();
			var target;

			if (state === this.prevState) {

				if (this.extended && this.targetContract) {
					
					if (this.maxAngle > 0.0) {
						target = this.angle + this.delta;
						this.angle = Math.min(target, this.maxAngle);
					} else {
						target = this.angle - this.delta;
						this.angle = Math.max(target, this.maxAngle);
					}
					
					if (this.angle == this.maxAngle) {
						this.extended = false;
						this.targetContract = false;
					}

				} else if (!this.extended && this.targetExtended) {
					
					if (this.maxAngle > 0.0) {
						target = this.angle - this.delta;
						this.angle = Math.max(target, 0.0);
					} else {
						target = this.angle + this.delta;
						this.angle = Math.min(target, 0.0);
					}

					if (this.angle == 0.0) {
						this.extended = true;
						this.targetExtended = false;
					}
				}

				mat4.identity(this.modelMatrix);

				mat4.rotate(this.modelMatrix,
					    this.modelMatrix,
					    this.angle,
					    [1.0, 0.0, 0.0]);

				return;
			}

			this.prevState = state;

			if (this.extended) {
				this.targetContract = true;
			} else {
				this.targetExtended = true;
			}
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents a Rotation
	// that opens the stairway
	// (z axis)
	class StairwayRotation {

		constructor(angle) {
		
			this.angle = angle;
			this.minAngle = angle;
			this.maxAngle = angle - Math.PI/2;
			this.delta = 0.02;

			this.opened = false;
			this.hasEnd = false;
			this.prevState = false;
			this.targetOpen = false;
			this.targetClose = false;

			this.modelMatrix = mat4.create();

			this._init();
		}

		_init() {
		
			mat4.rotate(this.modelMatrix,
				    this.modelMatrix,
				    this.angle,
				    [0.0, 0.0, 1.0]);
		}

		/* public methods */

		update(controller) {
			
			var state = controller.getDoorChanged();
			var target;

			if (state === this.prevState) {

				if (this.opened && this.targetClose) {
				
					target = this.angle + this.delta;
					this.angle = Math.min(target, this.minAngle);

					if (this.angle === this.minAngle) {
						this.opened = false;
						this.targetClose = false;
					}

				} else if (!this.opened && this.targetOpen) {
				
					target = this.angle - this.delta;
					this.angle = Math.max(target, this.maxAngle);

					if (this.angle === this.maxAngle) {
						this.opened = true;
						this.hasEnd = true;
						this.targetOpen = false;
					}
				}
				
				mat4.identity(this.modelMatrix);
				
				mat4.rotate(this.modelMatrix,
					    this.modelMatrix,
					    this.angle,
					    [0.0, 0.0, 1.0]);
			
				return;
			}
			
			this.prevState = state;

			if (this.opened) {
				this.targetClose = true;
				this.hasEnd = false;
			} else {
				this.targetOpen = true;
			}
		}

		getMatrix() {
			return this.modelMatrix;
		}

		hasFinished() {
			return this.hasEnd;
		}
	}

	//
	// Represents a Translation
	// using the data in the 'controller'
	//
	class HelicopterTranslation {
		
		constructor() {

			this.modelMatrix = mat4.create();
		}

		/* public methods */
		
		update(controller) {
			
			var pos = controller.getPosition();

			mat4.identity(this.modelMatrix);
			mat4.translate(this.modelMatrix,
				       this.modelMatrix,
				       [pos.x, pos.y, pos.z]);
		}

		getMatrix() {
			return this.modelMatrix;
		}
	}

	//
	// Represents the 'World'
	//
	class World {

		constructor() {
			this.matrix = mat4.create();
			this.elements = [];
		}

		/* public methods */

		add(e) {
			this.elements.push(e);
		}

		draw(camera, controller, lights) {
			var i;
			for (i = 0; i < this.elements.length; i++) {
				this.elements[i].draw(camera,
						      controller,
						      lights,
						      this.matrix);
			}
		}
	}

	class Color {

		constructor(c) {
			if (c.length == 0) {
				this.auto = true;
			} else {
				this.color = {
					"r": c[0],
					"g": c[1],
					"b": c[2]
				};
				this.auto = false;
			}
		}

		get(rows, cols, i, j) {

			if (this.auto)
				return {
					"r": 1.0 / rows * i,
					"g": 0.2,
					"b": 1.0 / cols * j
				};
			else
				return this.color;
		}
	}

	//
	// Combines a Model element
	// and a list of transformations
	// to aplicate on it
	//
	class Graphic {

		constructor(gl, element, transformations, shader) {
			
			this.gl = gl;
			this.model = element;
			this.ts = transformations;
			this.program = shader;
			this.texture = null;

			this._init();
		}

		/* private methods */

		_handleLoadedTexture() {
			
			this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0,
					   this.gl.RGBA, this.gl.RGBA,
					   this.gl.UNSIGNED_BYTE, this.texture.image);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_WRAP_S,
					      this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_WRAP_T,
					      this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_MIN_FILTER,
					      this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_MAG_FILTER,
					      this.gl.LINEAR);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		}

		_createIndexes() {
			
			this.index_buffer = [];
			var cols = this.model.getCols();
			var rows = this.model.getRows();

			for (var i = 0.0; i < (rows - 1); i++) {
				if ((i % 2) == 0) {
					// even rows stay normal
					for (var j = 0; j < cols; j++) {
						this.index_buffer.push(i * cols + j);
						this.index_buffer.push((i + 1) * cols + j);
					}
				} else {
					// odd rows get flipped
					for (var j = (cols - 1); j >= 0; j--) {
						this.index_buffer.push(i * cols + j);
						this.index_buffer.push((i + 1) * cols + j);
					}
				}
			}
		}

		_initBuffers() {
			
			this.webgl_position_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER,
					   new Float32Array(this.model.getPosition()),
					   this.gl.STATIC_DRAW);
		
			this.webgl_color_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER,
					   new Float32Array(this.model.getColor()),
					   this.gl.STATIC_DRAW);

			this.webgl_coord_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_coord_buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER,
					   new Float32Array(this.model.getCoord()),
					   this.gl.STATIC_DRAW);

			this.webgl_normal_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER,
					   new Float32Array(this.model.getNormals()),
					   this.gl.STATIC_DRAW);

			this.webgl_index_buffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
					   new Uint16Array(this.index_buffer),
					   this.gl.STATIC_DRAW);
		}

		_init() {
			// initialize model matrix element
			this.matrix = mat4.create();
			this.normalMatrix = mat4.create();

			this._createIndexes();
			this._initBuffers();
		}

		_bindTexture() {

			if (this.texture) {
				
				var uniformSampler = this.program.findUniform("uSampler");

				this.gl.activeTexture(this.gl.TEXTURE0);
				this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
				this.gl.uniform1i(uniformSampler, 0);
			}
		}
		
		_bindTransformations() {

			var uniformMatrixModel = this.program.findUniform("model");
			this.gl.uniformMatrix4fv(uniformMatrixModel, false, this.matrix);
		}

		_bindNormals() {
		
			var uniformNormalModel = this.program.findUniform("normal");
			this.gl.uniformMatrix4fv(uniformNormalModel, false, this.normalMatrix);
		}

		_bindLights(lights, eye) {
		
			var uniformDirectLight = this.program.findUniform("directLight");
			var uniformRedLightPos = this.program.findUniform("leftLightPos");
			var uniformGreenLightPos = this.program.findUniform("rightLightPos");

			this.gl.uniform3fv(uniformDirectLight, lights.direct.getDirection());
			this.gl.uniform3fv(uniformRedLightPos, lights.red.getPosition());
			this.gl.uniform3fv(uniformGreenLightPos, lights.green.getPosition());

			var uniformDirectColor = this.program.findUniform("directColor");
			var uniformRedColor = this.program.findUniform("pointLeftColor");
			var uniformGreenColor = this.program.findUniform("pointRightColor");

			this.gl.uniform3fv(uniformDirectColor, lights.direct.getColor());
			this.gl.uniform3fv(uniformRedColor, lights.red.getColor());
			this.gl.uniform3fv(uniformGreenColor, lights.green.getColor());

			var uniformEye = this.program.findUniform("eye");
			
			this.gl.uniform3fv(uniformEye, eye);
		}

		_hasTobindCoordBuffer() {
			return this._useUVCoords() && this.texture;
		}

		_bindBuffers() {

			// connect position data in local buffers 
			// with shader vertex position buffer
			var vertexPositionAttribute = this.program.findAttribute("aVertexPosition");
			
			this.gl.enableVertexAttribArray(vertexPositionAttribute);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_position_buffer);
			this.gl.vertexAttribPointer(vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

			if (this._useColor()) {
				
				// connect color data in local buffers
				// with shader vertex color buffer
				var vertexColorAttribute = this.program.findAttribute("aVertexColor");
				
				this.gl.enableVertexAttribArray(vertexColorAttribute);
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_color_buffer);
				this.gl.vertexAttribPointer(vertexColorAttribute, 3, this.gl.FLOAT, false, 0, 0);
			}

			if (this._isLighting()) {
				
				// connect normals data in local buffers
				// with shader vertex normal buffer
				var vertexNormalAttribute = this.program.findAttribute("aVertexNormal");

				this.gl.enableVertexAttribArray(vertexNormalAttribute);
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_normal_buffer);
				this.gl.vertexAttribPointer(vertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
			}

			if (this._hasTobindCoordBuffer()) {
				
				// connect texture data in local buffers
				// with shader vertex texture buffer
				var vertexTextureAttribute = this.program.findAttribute("aTextureCoord");

				this.gl.enableVertexAttribArray(vertexTextureAttribute);
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.webgl_coord_buffer);
				this.gl.vertexAttribPointer(vertexTextureAttribute, 2, this.gl.FLOAT, false, 0, 0);
			}
		
			// connect indexes data in local buffers
			// with GPU index buffer
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
		}

		_updateTransformations(matrix) {

			var i;
			mat4.identity(this.matrix);

			for (i = 0; i < this.ts.length; i++) {
				mat4.multiply(this.matrix, this.matrix, this.ts[i].getMatrix());
			}

			mat4.multiply(this.matrix, matrix, this.matrix);
		}

		_updateNormals(viewMatrix) {
		
			mat4.identity(this.normalMatrix);

			mat4.multiply(this.normalMatrix, this.normalMatrix, this.matrix);
			mat4.invert(this.normalMatrix, this.normalMatrix);
			mat4.transpose(this.normalMatrix, this.normalMatrix);
		}

		_animate(controller) {

			var i;	
			for (i = 0; i < this.ts.length; i++) {
				this.ts[i].update(controller);
			}
		}

		_draw() {
		
			this._bindBuffers();

			this.gl.drawElements(this.gl.TRIANGLE_STRIP,
					     this.index_buffer.length,
					     this.gl.UNSIGNED_SHORT, 0);
		}

		_isLighting() {
			return true;
		}

		_useColor() {
			return true;
		}

		_useUVCoords() {
			return true;
		}

		_isVisible(controller) {
			return true;
		}

		/* public methods */

		draw(camera, controller, lights, matrix) {
			
			if (this._isVisible(controller)) {

				this.program.use();
				
				camera.bind(this.program);

				this._updateTransformations(matrix);

				this._bindTransformations();

				if (this._isLighting()) {
					
					this._updateNormals();

					this._bindNormals();

					this._bindLights(lights, camera.getEye());
				}

				this._bindTexture();
				
				this._draw();

				this._animate(controller);
			}
		}

		loadTexture(path) {
			
			this.texture = this.gl.createTexture();

			this.texture.image = new Image();

			this.texture.image.onload = () => this._handleLoadedTexture();
			this.texture.image.src = path;
		}
	}

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
	class Container3D {
		
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

	//
	// It uses the "perlin" noise
	// algorithm described in the
	// paper by Ken Perlin:
	//
	// 	- https://mrl.nyu.edu/~perlin/noise/
	//
	class ImprovedNoise {

		constructor() {
		
			this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10,
				23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87,
				174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
				133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
				89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5,
				202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119,
				248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
				178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249,
				14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
				93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
			
			for (var i = 0; i < 256; i ++) {
				this.p[256 + i] = this.p[i];
			}
		}

		/* private methods */

		_fade(t) {
			return t * t * t * (t * (t * 6 - 15) + 10);
		}

		_lerp(t, a, b) {
			return a + t * (b - a);
		}

		_grad(hash, x, y, z) {

			var h = hash & 15;
			var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
			
			return ((h & 1) == 0 ? u : - u) + ((h & 2) == 0 ? v : - v);
		}

		/* public methods */

		perlin(x, y, z) {
			
			var floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);

			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

			x -= floorX;
			y -= floorY;
			z -= floorZ;

			var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

			var u = this._fade(x), v = this._fade(y), w = this._fade(z);

			var A = this.p[X] + Y,
				AA = this.p[A] + Z,
				AB = this.p[A + 1] + Z,
				B = this.p[X + 1] + Y,
				BA = this.p[B] + Z,
				BB = this.p[B + 1] + Z;

			return this._lerp(w, this._lerp(v, this._lerp(u, this._grad(this.p[AA], x, y, z),
				this._grad(this.p[BA], xMinus1, y, z)),
			this._lerp(u, this._grad(this.p[AB], x, yMinus1, z),
				this._grad(this.p[BB], xMinus1, yMinus1, z))),
			this._lerp(v, this._lerp(u, this._grad(this.p[AA + 1], x, y, zMinus1),
				this._grad(this.p[BA + 1], xMinus1, y, z - 1)),
			this._lerp(u, this._grad(this.p[AB + 1], x, yMinus1, zMinus1),
				this._grad(this.p[BB + 1], xMinus1, yMinus1, zMinus1))));
		}
	}

	//
	// Abstract class 'Surface'
	//
	class Surface {

		constructor(cols, rows, color) {
			
			this.color = color;
			this.cols = cols;
			this.rows = rows;
			
			this.position_buffer = [];
			this.color_buffer = [];
			this.coord_buffer = [];
			this.normal_buffer = [];
		}

		/* private methods */

		_createColor() {
			
			var c;

			for (var i = 0.0; i < this.rows; i++) {
				for (var j = 0.0; j < this.cols; j++) {
			
					c = this.color.get(this.rows, this.cols, i, j);

					this.color_buffer.push(c.r);
					this.color_buffer.push(c.g);
					this.color_buffer.push(c.b);
				}		}	}

		/* public methods */

		getPosition() {
			return this.position_buffer;
		}

		getColor() {
			return this.color_buffer;
		}

		getCoord() {
			return this.coord_buffer;
		}

		getNormals() {
			return this.normal_buffer;
		}

		getCols() {
			return this.cols;
		}

		getRows() {
			return this.rows;
		}
	}

	//
	// Represents a Grid made up 
	// of triangles and drawn it 
	// by TRIANGLE_STRIP
	//
	class Grid extends Surface {

		constructor(rows, cols, color) {
			
			super(cols, rows, color);
			
			this._init();
		}

		/* private methods */

		_createModel() {

			for (var i = 0.0; i < this.rows; i++) {
				for (var j = 0.0; j < this.cols; j++) {
				
					// position buffer
					var x = j - (this.cols - 1.0) / 2.0;
					var y = i - (this.rows - 1.0) / 2.0;
					var z = 0;
					
					this.position_buffer.push(x);
					this.position_buffer.push(y);
					this.position_buffer.push(z);

					// normal buffer
					this.normal_buffer.push(0.0);
					this.normal_buffer.push(0.0);
					this.normal_buffer.push(1.0);

					// uv texture buffer
					var u = i * 1/(this.rows - 1);
					var v = j * 1/(this.cols - 1);

					this.coord_buffer.push(u);
					this.coord_buffer.push(v);
				}		}	}

		_init() {
			// generates a GRID defined by
			// 'cols' and 'rows'
			// with colors per vertex
			// and indexes to render it
			
			this._createModel();
			this._createColor();
		}
	}

	//
	// Represents the terrain with 
	// planes and mountains.
	//
	// It uses the implementation done in Three.js:
	//
	// 	- https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html
	// 	- https://github.com/mrdoob/three.js/blob/master/examples/js/math/ImprovedNoise.js
	//
	class Terrain extends Grid {

		constructor() {
		
			super(200, 200, new Color([]));

			this._transform();
		}
		
		_generateHeight(width, height) {
			
			var size = width * height;
			var data = new Uint8Array(size);
			var quality = 1, z = Math.random() * 0.10;
			
			var noise = new ImprovedNoise();
			
			for (var j = 0; j < 4; j++) {
				
				for ( var i = 0; i < size; i++) {
					
					var x = i % width;
					var y = ~ ~ (i / width);
					
					data[i] += Math.abs(noise.perlin(x/quality, y/quality, z) * quality * 1.75);
				}
				
				quality *= 5;
			}

			return data;
		}

		_transform() {
			
			var data = this._generateHeight(this.cols, this.rows);

			// update z index in the position buffer
			for (var i = 0, j = 0, l = data.length; i < l; i++, j += 3) {
				this.position_buffer[j + 2] = data[i] * 0.5;
			}

			var normals = [];
			var x, y, z;

			// update normal buffer calculus
			for (var j = 0, l = data.length; j < l; j ++) {
					
				x = data[j - 2] - data[j + 2];
				y = data[j - this.cols*2] - data[j + this.cols*2];
				z = 2;

				normals.push(x);
				normals.push(y);
				normals.push(z);
			}

			this.normal_buffer = normals;
		}
	}

	class GraphicLand extends Graphic {

		constructor(gl, shader) {
		
			var land = new Terrain();
			var tland = [new Translation([0.0, -30.0, 0.0]),
				     new Rotation([1.0, 0.0, 0.0], -Math.PI/2, 0.0)];

			super(gl, land, tland, shader);

			this.textures = [];
			this.uniforms = {};
			this.texId = 0;
		}

		/* private methods */

		_bindLights(lights, eye) {

			// Direct Light
			var uniformDirectLight = this.program.findUniform("directLight");
			var uniformDirectColor = this.program.findUniform("directColor");

			this.gl.uniform3fv(uniformDirectLight, lights.direct.getDirection());
			this.gl.uniform3fv(uniformDirectColor, lights.direct.getColor());

			// Left Point Light
			var uniformRedLightPos = this.program.findUniform("leftLightPos");
			var uniformGreenLightPos = this.program.findUniform("rightLightPos");

			this.gl.uniform3fv(uniformRedLightPos, lights.red.getPosition());
			this.gl.uniform3fv(uniformGreenLightPos, lights.green.getPosition());

			// Right Point Light
			var uniformRedColor = this.program.findUniform("pointLeftColor");
			var uniformGreenColor = this.program.findUniform("pointRightColor");

			this.gl.uniform3fv(uniformRedColor, lights.red.getColor());
			this.gl.uniform3fv(uniformGreenColor, lights.green.getColor());

			// Spot Light
			var uniformSpotPos = this.program.findUniform("spotLightPos");
			var uniformSpotDir = this.program.findUniform("spotLightDir");
			var uniformSpotColor = this.program.findUniform("spotColor");

			this.gl.uniform3fv(uniformSpotPos, lights.spot.getPosition());
			this.gl.uniform3fv(uniformSpotDir, lights.spot.getDirection());
			this.gl.uniform3fv(uniformSpotColor, lights.spot.getColor());

			// Camera 'eye'
			var uniformEye = this.program.findUniform("eye");
			this.gl.uniform3fv(uniformEye, eye);
		}

		_useColor() {
			return false;
		}

		_handleLoadedTexture(id) {
		
			var t = this.textures[id];

			this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
			this.gl.bindTexture(this.gl.TEXTURE_2D, t);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0,
					   this.gl.RGBA, this.gl.RGBA,
					   this.gl.UNSIGNED_BYTE, t.image);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_WRAP_S,
					      this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_WRAP_T,
					      this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_MIN_FILTER,
					      this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D,
					      this.gl.TEXTURE_MAG_FILTER,
					      this.gl.LINEAR);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		}

		_bindTexture() {
			
			for (var i = 0; i < this.textures.length; i++) {
				
				var uniformSampler = this.program.findUniform(this.uniforms[i]);

				this.gl.activeTexture(this.gl.TEXTURE0 + i);
				this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i]);
				this.gl.uniform1i(uniformSampler, i);
			}
		}

		_hasTobindCoordBuffer() {
			return true;
		}
		
		/* public methods */

		loadTexture(path, uniformName) {
			
			var texture = this.gl.createTexture();
			var id = this.texId;

			texture.image = new Image();
			texture.image.onload = () => this._handleLoadedTexture(id);
			texture.image.src = path;

			this.textures.push(texture);
			this.uniforms[id] = uniformName;
			this.texId++;
		}
	}

	//
	// Represents a Sphere made up 
	// of triangles and drawn it 
	// by TRIANGLE_STRIP
	//
	class Sphere extends Surface {

		constructor(rows, cols, color) {
			
			super(cols, rows, color);

			this.theta = 2 * Math.PI / this.rows;
			this.phi = 2 * Math.PI / this.cols;
			
			this._init();
		}

		/* private methods */

		_createModel() {

			for (var i = 0; i < this.rows; i++) {

				var theta = i * Math.PI / this.rows;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);

				for (var j = 0; j <= this.cols; j++) {

					var phi = j * 2 * Math.PI / this.cols;
					var sinPhi = Math.sin(phi);
					var cosPhi = Math.cos(phi);

					var x = cosPhi * sinTheta;
					var y = cosTheta;
					var z = sinPhi * sinTheta;

					this.position_buffer.push(x);
					this.position_buffer.push(y);
					this.position_buffer.push(z);

					this.normal_buffer.push(x);
					this.normal_buffer.push(y);
					this.normal_buffer.push(z);

					var u = 1.0 - (j / this.cols);
					var v = 1.0 - (i / this.rows);

					this.coord_buffer.push(u);
					this.coord_buffer.push(v);
				}
			}
			
			this.cols += 1;
		}

		_init() {
			// generates a GRID defined by
			// 'cols' and 'rows'
			// with colors per vertex
			// and indexes to render it
			
			this._createModel();
			this._createColor();
		}
	}

	class GraphicSky extends Graphic {

		constructor(gl, shader) {
		
			var sky = new Sphere(50, 50, new Color([]));
			super(gl, sky, [new Scale([250.0, 250.0, 250.0])],
				shader);
		}

		_isLighting() {
			return false;
		}

		_useColor() {
			return false;
		}
	}

	class GraphicReflect extends Graphic {

		constructor(gl, model, t, shader) {
			super(gl, model, t, shader);
		}

		_useUVCoords() {
			return false;
		}
	}

	class DirectLight {

		constructor(direction, color) {

			this.direction = direction;
			this.color = color;
		}

		/* private methods */
		
		/* public methods */

		// Does not have to be
		// updated
		update(controller) {}

		getDirection() {
			return this.direction;
		}

		getColor() {
			return this.color;
		}
	}

	class PointLight {

		constructor(position, color) {

			this.offset = position;
			this.position = position;
			this.color = color;
		}
		
		/* private methods */
		
		/* public methods */

		update(controller) {
		
			var aux;
			var p = controller.getPosition();
			var angle = controller.getYaw();

			aux = [this.offset[0]*Math.cos(angle) + this.offset[2]*Math.sin(angle),
			       this.offset[1],
			       -this.offset[0]*Math.sin(angle) + this.offset[2]*Math.cos(angle)];
			
			this.position = [p.x + aux[0], p.y + aux[1], p.z + aux[2]];
		}

		getPosition() {
			return this.position;
		}

		getColor() {
			return this.color;
		}
	}

	class SpotLight {

		constructor(position, direction, color) {

			this.direction = direction;
			this.dir = direction;
			this.offset = position;
			this.position = position;
			this.color = color;
		}

		/* private methods */

		/* public methods */

		update(controller) {
		
			var aux;
			var p = controller.getPosition();
			var angle = controller.getYaw();

			aux = [this.offset[0]*Math.cos(angle) + this.offset[2]*Math.sin(angle),
			       this.offset[1],
			       -this.offset[0]*Math.sin(angle) + this.offset[2]*Math.cos(angle)];
			
			this.position = [p.x + aux[0], p.y + aux[1], p.z + aux[2]];

			aux = [this.dir[0]*Math.cos(angle) + this.dir[2]*Math.sin(angle),
			       this.dir[1],
			       -this.dir[0]*Math.sin(angle) + this.dir[2]*Math.cos(angle)];

			this.direction = [aux[0], aux[1], aux[2]];
		}

		getDirection() {
			return this.direction;
		}

		getPosition() {
			return this.position;
		}

		getColor() {
			return this.color;
		}
	}

	//
	// Represents a Cylinder made up 
	// of triangles and drawn it 
	// by TRIANGLE_STRIP
	//
	class Cylinder extends Surface {

		constructor(r, height, rows, cols, color) {
			
			super(cols, rows, color);

			this.r = r;
			this.height = height;

			this.theta = 2 * Math.PI / (this.cols - 1);
			this.zeta = this.height / (this.rows - 1);
			
			this._init();
		}

		/* private methods */

		_createModel() {

			var k;
			
			// create the base at zero plane (z = 0)
			for (k = 0; k < this.cols; k++) {

				this.position_buffer.push(0.0);
				this.position_buffer.push(0.0);
				this.position_buffer.push(0.0);

				this.normal_buffer.push(0.0);
				this.normal_buffer.push(0.0);
				this.normal_buffer.push(-1.0);
			}

			for (var i = 0.0; i < this.rows; i++) {
				for (var j = 0.0; j < this.cols; j++) {
					
					var x = this.r * Math.cos(j * this.theta);
					var y = this.r * Math.sin(j * this.theta);
					var z = i * this.zeta;
					
					this.position_buffer.push(x);
					this.position_buffer.push(y);
					this.position_buffer.push(z);

					this.normal_buffer.push(x);
					this.normal_buffer.push(y);
					this.normal_buffer.push(0.0);
				}		}
			// create the base at 'height' plane (z = this.height)
			for (k = 0; k < this.cols; k++) {

				this.position_buffer.push(0.0);
				this.position_buffer.push(0.0);
				this.position_buffer.push(this.height);

				this.normal_buffer.push(0.0);
				this.normal_buffer.push(0.0);
				this.normal_buffer.push(1.0);
			}

			// update rows
			this.rows += 2;
		}

		_init() {
			// generates a GRID defined by
			// 'cols' and 'rows'
			// with colors per vertex
			// and indexes to render it
			
			this._createModel();
			this._createColor();
		}
	}

	//
	// Abstract class
	// that represents a 'CURVE'
	//
	class Curve {

		constructor(points) {
			this.pos = [0.0, 0.0, 0.0];
			this.points = points;
			this.stretches = [];
		}

		/* private methods */

		_linear(coeffs, u) {
			return [coeffs.a[0]*u + coeffs.b[0],
				coeffs.a[1]*u + coeffs.b[1],
				coeffs.a[2]*u + coeffs.b[2]];
		}

		_cuad(coeffs, u) {
			return [coeffs.a[0]*u*u + coeffs.b[0]*u + coeffs.c[0],
				coeffs.a[1]*u*u + coeffs.b[1]*u + coeffs.c[1],
				coeffs.a[2]*u*u + coeffs.b[2]*u + coeffs.c[2]];
		}

		_cubic(coeffs, u) {
			return [coeffs.a[0]*u*u*u + coeffs.b[0]*u*u + coeffs.c[0]*u + coeffs.d[0],
				coeffs.a[1]*u*u*u + coeffs.b[1]*u*u + coeffs.c[1]*u + coeffs.d[1],
				coeffs.a[2]*u*u*u + coeffs.b[2]*u*u + coeffs.c[2]*u + coeffs.d[2]];
		}

		_calculateNormal(u) {
		
			var t = this._calculateTangent(u);
			var n = [-t[1], t[0], t[2]];

			var norm = Math.sqrt(n[0]*n[0] + n[1]*n[1] + n[2]*n[2]);

			return [n[0] / norm, n[1] / norm, n[2] / norm];
		}

		_calculateBinormal(u) {
			
			return [0.0, 0.0, 1.0];
		}

		/* public methods */

		move(pos) {
			this.pos = pos;
		}

		get(u) {
			var v = this._calculate(u);

			return [v[0] + this.pos[0],
				v[1] + this.pos[1],
				v[2] + this.pos[2]];
		}

		getTangent(u) {
			return this._calculateTangent(u);
		}

		getNormal(u) {
			return this._calculateNormal(u);
		}

		getBinormal(u) {
			return this._calculateBinormal(u);
		}
	}

	class CuadCurve extends Curve {

		constructor(points) {
			super(points);
		}

		/* private methods */

		_calculate(u) {
		
			var s, fracc;

			if (u < 1) {
				u = u * this.stretches.length;

				var integer = Math.floor(u);
				fracc = u - integer;

				s = this.stretches[integer];
			} else {
				s = this.stretches[this.stretches.length - 1];
				fracc = u;
			}
			
			return this._cuad(s.getPosCoeff(), fracc);
		}

		_calculateTangent(u) {
			
			var s, fracc;

			if (u < 1) {
				u = u * this.stretches.length;
				
				var integer = Math.floor(u);
				fracc = u - integer;

				s = this.stretches[integer];
			} else {
				s = this.stretches[this.stretches.length - 1];
				fracc = u;
			}
			
			var t = this._linear(s.getTangCoeff(), fracc);
			var norm = Math.sqrt(t[0]*t[0] + t[1]*t[1] + t[2]*t[2]);

			return [t[0] / norm, t[1] / norm, t[2] / norm];
		}
	}

	//
	// Represents a stretch from
	// a given curve
	//
	class Stretch {

		getPosCoeff() {
			return this.coeffs;
		}

		getTangCoeff() {
			return this.tcoeffs;
		}
	}

	class CuadStretch extends Stretch {

		constructor(c, tc) {

			super();

			this.coeffs = {
				"a": c[0],
				"b": c[1],
				"c": c[2]
			};

			this.tcoeffs = {
				"a": tc[0],
				"b": tc[1]
			};
		}
	}

	//
	// Bezier cuadratic and cubic curves
	//

	//
	// Cuadratic:
	//   If len(points) + 1 % 3 == 0
	//   its correct
	//
	class BezierCuad extends CuadCurve {

		constructor(points) {
			super(points);
			this._init();
		}

		_init() {

			var p0, p1, p2;
			var a, b, c;
			var at, bt;

			for (var i = 0; i < this.points.length - 1; i += 2) {
				
				p0 = this.points[i];
				p1 = this.points[i+1];
				p2 = this.points[i+2];
				
				// position coefficients
				a = [p0[0]-2*p1[0]+p2[0], p0[1]-2*p1[1]+p2[1], p0[2]-2*p1[2]+p2[2]];
				b = [-2*p0[0]+2*p1[0], -2*p0[1]+2*p1[1], -2*p0[2]+2*p1[2]];
				c = p0;

				// tangent coefficients
				at = [2*p0[0]-4*p1[0]+2*p2[0], 2*p0[1]-4*p1[1]+2*p2[1], 2*p0[2]-4*p1[2]+2*p2[2]];
				bt = [-2*p0[0]+2*p1[0], -2*p0[1]+2*p1[1], -2*p0[2]+2*p1[2]];

				var s = new CuadStretch([a, b, c], [at, bt]);

				this.stretches.push(s);
			}
		}
	}

	//
	// Represents a Sweep surface
	// made from a 'shape' curve object
	// and a 'path' curve object
	// 
	// Rows and columns are given
	// by levels and res (a.k.a vertical 
	// 	resolution)
	//
	// 'endScale' must be zero if
	// the object has to mantain its original
	// shape's size
	//
	class SweepSurface extends Surface {

		constructor(shape, path, levels, res, endScale, color) {
			
			super(res, levels, color);

			this.shape = shape;
			this.path = path;
			this.endScale = endScale;

			this._init();
		}

		/* private methods */
		
		_createModel() {

			var u, v, p, t, b, n, nS, scaleX, scaleY, posP, posS, matrix;

			var gradientScaleX = (this.endScale[0] - 1) / (this.rows - 1);
			var gradientScaleY = (this.endScale[1] - 1) / (this.rows - 1);

			matrix = mat4.create();

			matrix[3] = 0.0; matrix[7] = 0.0; matrix[11] = 0.0;
			matrix[15] = 1.0;

			for (var i = 0.0; i < this.rows; i++) {
			
				u = i / (this.rows - 1);

				scaleX = 1 + (i * gradientScaleX);
				scaleY = 1 + (i * gradientScaleY);

				t = this.path.getTangent(u);
				b = this.path.getBinormal(u);
				n = this.path.getNormal(u);
				posP = this.path.get(u);

				for (var k = 0; k < 3; k++) {
				
					matrix[k] = b[k];
					matrix[k+4] = n[k];
					matrix[k+8] = t[k];
					matrix[k+12] = 0.0;
				}

				for (var j = 0.0; j < this.cols; j++) {

					v = j / (this.cols - 1);

					posS = this.shape.get(v);
					nS = this.shape.getNormal(v);

					// scale shape
					posS = [posS[0]*scaleX, posS[1]*scaleY, posS[2]];

					// transform position
					p = vec4.fromValues(posS[0], posS[1], posS[2], 1);
					p = vec4.transformMat4(p, p, matrix);
					p = [p[0] + posP[0], p[1] + posP[1], p[2] + posP[2]];

					this.position_buffer.push(p[0]);
					this.position_buffer.push(p[1]);
					this.position_buffer.push(p[2]);

					// transform normal
					p = vec4.fromValues(nS[0], nS[1], nS[2], 1);
					p = vec4.transformMat4(p, p, matrix);

					this.normal_buffer.push(p[0]);
					this.normal_buffer.push(p[1]);
					this.normal_buffer.push(p[2]);
				}
			}
		}

		_init() {
			this._createModel();
			this._createColor();
		}
	}

	class BackCenter extends SweepSurface {

		constructor(cols, rows) {
			
			var shape = new BezierCuad([[2.0, 4.0, 0.0],
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
						[2.0, 4.0, 0.0]]);

			shape.move([-3.0, -2.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[2.0, 0.0, 0.0]]);

			var c = new Color([0.0, 1.0, 1.0]);

			super(shape, path, rows, cols, [0.5, 0.5], c);

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

	class FrontCenter extends SweepSurface {

		constructor(cols, rows) {
			
			var shape = new BezierCuad([[2.0, 4.0, 0.0],
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
						[2.0, 4.0, 0.0]]);

			shape.move([-3.0, -2.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[2.0, 0.0, 0.0],
						[3.0, 0.0, 0.0],
						[4.0, 0.0, 0.0],
						[5.0, 0.0, 0.0],
						[6.0, 0.0, 0.0]]);

			var c = new Color([0.0, 1.0, 1.0]);

			super(shape, path, rows, cols, [0.6, 0.3], c);

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

	//
	// BSpline cuadratic and cubic curves
	//

	//
	// Cuadratic
	//
	class BSplineCuad extends CuadCurve {

		constructor(points) {
			super(points);
			this._init();
		}

		_init() {
			
			var p0, p1, p2;
			var a, b, c;
			var at, bt;

			for (var i = 0; i <= this.points.length - 3; i++) {
				
				p0 = this.points[i];
				p1 = this.points[i+1];
				p2 = this.points[i+2];

				// position coefficients
				a = [p0[0]-2*p1[0]+p2[0], p0[1]-2*p1[1]+p2[1], p0[2]-2*p1[2]+p2[2]];
				a = [0.5*a[0], 0.5*a[1], 0.5*a[2]];
				b = [-2*p0[0]+2*p1[0], -2*p0[1]+2*p1[1], -2*p0[2]+2*p1[2]];
				b = [0.5*b[0], 0.5*b[1], 0.5*b[2]];
				c = [0.5*(p0[0]+p1[0]), 0.5*(p0[1]+p1[1]), 0.5*(p0[2]+p1[2])];

				// tangent coefficients
				at = [2*p0[0]-4*p1[0]+2*p2[0], 2*p0[1]-4*p1[1]+2*p2[1], 2*p0[2]-4*p1[2]+2*p2[2]];
				at = [0.5*at[0], 0.5*at[1], 0.5*at[2]];
				bt = [-2*p0[0]+2*p1[0], -2*p0[1]+2*p1[1], -2*p0[2]+2*p1[2]];
				bt = [0.5*bt[0], 0.5*bt[1], 0.5*bt[2]];

				var s = new CuadStretch([a, b, c], [at, bt]);

				this.stretches.push(s);
			}
		}
	}

	class HexagonCenter extends SweepSurface {

		constructor(cols, rows) {
		
	                var shape = new BezierCuad([[2.0, 4.0, 0.0],
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
	                                        [2.0, 4.0, 0.0]]);

	                shape.move([-3.0, -2.0, 0.0]);

	                var path = new BezierCuad([[0.0, 0.0, 0.0],
	                                        [1.0, 0.0, 0.0],
	                                        [2.0, 0.0, 0.0],
	                                        [3.0, 0.0, 0.0],
	                                        [4.0, 0.0, 0.0],
	                                        [5.0, 0.0, 0.0],
	                                        [6.0, 0.0, 0.0]]);

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

	class CurveCenter extends SweepSurface {

		constructor(cols, rows) {

	                var shape = new BSplineCuad([[4.0, 9.0, 0.0],
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
	                                        [5.0, 9.0, 0.0]]);

	                shape.move([-6.0, -6.0, 0.0]);

	                var path = new BezierCuad([[0.0, 0.0, 0.0],
	                                        [1.0, 0.0, 0.0],
	                                        [2.0, 0.0, 0.0]]);

	                var c = new Color([0.29, 0.0, 0.50]);

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

	//
	// Represents a Revolution surface
	// made from a 'shape' curve object
	// and a coordinate axis
	// 
	// Rows and columns are given
	// by rows and res (a.k.a vertical 
	// 	resolution)
	//
	class RevolutionSurface extends Surface {

		constructor(shape, axis, rows, res, color) {
			
			super(res, rows, color);

			this.shape = shape;
			this.axis = axis;

			this._init();
		}

		/* private methods */
		
		_createModel() {

			var p, v, nS, ang, pos, matrix;
			
			matrix = mat4.create();

			for (var i = 0.0; i < this.rows; i++) {
			
				ang = 2 * Math.PI * (i / this.rows - 1);

				mat4.identity(matrix);
				mat4.rotate(matrix, matrix, ang, this.axis);
				
				for (var j = 0.0; j < this.cols; j++) {

					v = j / (this.cols - 1);

					pos = this.shape.get(v);
					nS = this.shape.getNormal(v);

					// transform position
					p = vec4.fromValues(pos[0], pos[1], pos[2], 1);
					vec4.transformMat4(p, p, matrix);

					this.position_buffer.push(p[0]);
					this.position_buffer.push(p[1]);
					this.position_buffer.push(p[2]);

					// transform normal
					p = vec4.fromValues(nS[0], nS[1], nS[2], 1);
					vec4.transformMat4(p, p, matrix);

					this.normal_buffer.push(p[0]);
					this.normal_buffer.push(p[1]);
					this.normal_buffer.push(p[2]);
				}
			}

			for (var j = 0.0; j < this.cols; j++) {
				
				v = j / (this.cols - 1);

				pos = this.shape.get(v);

				this.position_buffer.push(pos[0]);
				this.position_buffer.push(pos[1]);
				this.position_buffer.push(pos[2]);
				
				nS = this.shape.getNormal(v);

				this.normal_buffer.push(nS[0]);
				this.normal_buffer.push(nS[1]);
				this.normal_buffer.push(nS[2]);
			}

			this.rows += 1;
		}

		_init() {
			this._createModel();
			this._createColor();
		}
	}

	class Blade extends SweepSurface {

		constructor() {

			var shape = new BezierCuad([[0.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[2.0, 0.0, 0.0]]);

			shape.move([-1.0, 0.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[2.0, 0.0, 0.0],
						[4.0, 0.0, 0.0]]);

			var c = new Color([0.5, 0.5, 0.5]);

			super(shape, path, 2, 2, [0.5, 0.5], c);

			this._createColor();
		}
	}

	class HelixContainer extends RevolutionSurface {

		constructor() {
			
			var shape = new BSplineCuad([[2.0, 2.0, 0.0],
	                                            [2.0, 4.0, 0.0],
	                                            [4.0, 4.0, 0.0],
	                                            [4.0, 2.0, 0.0],
	                                            [4.0, 0.0, 0.0],
	                                            [2.0, 0.0, 0.0],
	                                            [2.0, 2.0, 0.0],
	                                            [2.0, 4.0, 0.0]]);

			shape.move([4.0, -2.0, 0.0]);

	                var c = new Color([1.0, 0.84, 0.0]);

	                super(shape, [0.0, 1.0, 0.0], 16, 100, c);
		}
	}

	class HelixConnector extends SweepSurface {

		constructor(cols, rows) {
			
			var shape = new BSplineCuad([[3.0, 6.0, 0.0],
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
						[5.0, 6.0, 0.0]]);

			shape.move([-4.0, -3.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[2.0, 0.0, 0.0],
						[3.0, 0.0, 0.0],
						[4.0, 0.0, 0.0],
						[5.0, 0.0, 0.0],
						[6.0, 0.0, 0.0]]);

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

	class Helix extends Container3D {
		
		constructor(position, gl, shader) {
		
			super([new Identity()]);
			
			this.position = position;
			this.gl = gl;
			this.shader = shader;
			
			this._initialize();
		}

		_initialize() {

			var cylinder = new Cylinder(1, 1, 50, 50, new Color([1.0, 0.84, 0.0]));
			var t6 = [new Translation([0.0, -1.25, 0.0]),
				  new Rotation([1.0, 0.0, 0.0], -Math.PI/2, 0.0),
				  new Scale([1.0, 1.0, 2.5])];
			var gc = new Graphic(this.gl, cylinder, t6, this.shader);

			this.add(gc);

			var connector = new HelixConnector(50, 50);
			var t7 = [new Rotation([1.0, 0.0, 0.0], Math.PI/2, 0.0),
				  new Scale([1.0, 1.0/6.0, 3.0/16.0])];
			var gconn = new Graphic(this.gl, connector, t7, this.shader);

			this.add(gconn);

			//// Blades + Cylinder + Container ////
			
			// Container
			var t8 = [new Translation([9.0, 0.0, 0.0]),
				  new HelixRotation(this.position),
				  new Rotation([1.0, 0.0, 0.0], Math.PI/2, 0.0)];
			var containerAndBlades = new Container3D(t8);

			var container = new HelixContainer(50, 50);
			var gcontainer = new Graphic(this.gl, container, [new Scale([0.4, 0.4, 0.4])], this.shader);

			containerAndBlades.add(gcontainer);

			// Add all the 'blades'
			var blade = new Blade();

			var blades = new Container3D([new Rotation([0.0, 1.0, 0.0], 0.0, 0.02)]);

			var t;
			var ang_rate = 2*Math.PI / 12;
			for (var ang = 0.0; ang < 2*Math.PI; ang += ang_rate) {
			
				t = [new Rotation([0.0, 1.0, 0.0], ang, 0.0),
				     new Rotation([1.0, 0.0, 0.0], Math.PI/4, 0.0),
				     new Scale([0.5, 1.0, 1.0]),
				     new Translation([-4.0, 0.0, 0.0])];

				var gb = new Graphic(this.gl, blade, t, this.shader);
				blades.add(gb);
			}

			containerAndBlades.add(blades);

			// Cylinder
			var thc = [new Translation([0.0, -1.25, 0.0]),
				  new Rotation([1.0, 0.0, 0.0], -Math.PI/2, 0.0),
				  new Scale([0.6, 0.6, 2.0])];
			var helixCylinder = new Graphic(this.gl, cylinder, thc, this.shader);

			containerAndBlades.add(helixCylinder);

			this.add(containerAndBlades);
		}
	}

	class LandingGear extends SweepSurface {

		constructor() {

			var shape = new BSplineCuad([[0.0, 2.0, 0.0],
						[0.0, 4.0, 0.0],
						[2.0, 4.0, 0.0],
						[2.0, 2.0, 0.0],
						[2.0, 0.0, 0.0],
						[0.0, 0.0, 0.0],
						[0.0, 2.0, 0.0],
						[0.0, 4.0, 0.0]]);

			shape.move([-1.0, -2.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[0.5, 0.0, 0.0],
						[1.0, 0.0, 0.0]]);

			var c = new Color([0.0, 0.50, 0.0]);

			super(shape, path, 16, 100, [1, 1], c);

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

	class LandingGearBase extends RevolutionSurface {

		constructor() {
			
			var shape = new BezierCuad([[0.0, 4.0, 0.0],
						[0.5, 4.0, 0.0],
						[1.0, 4.0, 0.0],
						[3.0, 3.0, 0.0],
						[5.0, 2.0, 0.0],
						[5.0, 1.0, 0.0],
						[5.0, 0.0, 0.0],
						[2.5, 0.0, 0.0],
						[0.0, 0.0, 0.0]]);

			var c = new Color([0.2, 0.2, 0.2]);

			super(shape, [0.0, 1.0, 0.0], 4, 20, c);
		}
	}

	class LandingLeg extends Container3D {

		constructor(position, gl, shader) {

			var upAngle, downAngle;
		
			var up = Math.PI/3;
			var down = 2*Math.PI/3;

			if (position === "left") {
				upAngle = up;
				downAngle = -down;
			} else {
				upAngle = -up;
				downAngle = down;
			}

			var delta = 0.01;

			super([new LegRotation(upAngle, delta)]);

			this.delta = delta;
			this.upAngle = upAngle;
			this.downAngle = downAngle;

			this.gl = gl;
			this.shader = shader;
			this.position = position;

			this._initialize();
		}

		_initialize() {
		
			var gear = new LandingGear();

			//// Up ////
			var tgUp = [new Translation([-0.25, -1.0, 0.0]),
				    new Scale([0.25, 0.5, 0.25])];
			var up = new Graphic(this.gl, gear, tgUp, this.shader);

			this.add(up);

			//// Cylinder Union ////
			var union = new Cylinder(0.125, 0.6, 20, 20, new Color([0.0, 0.0, 1.0]));
			var tuni = [new Translation([0.0, -1.5, 0.0]),
				    new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
				    new Translation([0.0, 0.0, -0.30])];
			var gunion = new Graphic(this.gl, union, tuni, this.shader);

			this.add(gunion);

			//// Down and Base ////

			var tcDown = [new Translation([0.0, -1.5, 0.0]),
				      new LegRotation(this.downAngle, this.delta*2)];
			var cdown = new Container3D(tcDown);

			//// Down ////
			var tgDown = [new Translation([0.0, -0.5, 0.0]),
				      new Scale([0.25, 0.5, 0.25])];
			var down = new Graphic(this.gl, gear, tgDown, this.shader);
			
			cdown.add(down);

			//// Base ////
			var base = new LandingGearBase();
			var tbase = [new Translation([0.0, -1.3, 0.0]),
				     new LegRotation(this.upAngle, this.delta),
			     	     new Scale([2.0/5.0, 1.0/4.0, 2.0/5.0]),
				     new Rotation([0.0, 1.0, 0.0], Math.PI/4, 0.0),
				     new Translation([0.0, -4.0, 0.0])];
			var gbase = new Graphic(this.gl, base, tbase, this.shader);

			cdown.add(gbase);

			this.add(cdown);
		}
	}

	class Stairway extends SweepSurface {

		constructor() {

			var shape = new BezierCuad([[0.0, 0.0, 0.0],
						[0.0, 2.0, 0.0],
						[0.0, 4.0, 0.0],
						[1.0, 4.0, 0.0],
						[2.0, 4.0, 0.0],
						[2.0, 2.0, 0.0],
						[2.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[0.0, 0.0, 0.0]]);

			shape.move([-1.0, -2.0, 0.0]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[0.25, 0.0, 0.0],
						[0.5, 0.0, 0.0]]);

			var c = new Color([0.27, 0.50, 0.70]);

			super(shape, path, 10, 5, [1, 1], c);

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

	class StairwayStep extends SweepSurface {

		constructor() {
			
			var shape = new BezierCuad([[0.0, 0.0, 0.0],
						[0.5, 0.5, 0.0],
						[1.0, 1.0, 0.0],
						[1.5, 0.5, 0.0],
						[2.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[0.0, 0.0, 0.0]]);

			var path = new BezierCuad([[0.0, 0.0, 0.0],
						[1.0, 0.0, 0.0],
						[2.0, 0.0, 0.0]]);

			var c = new Color([0.94, 0.50, 0.50]);

			super(shape, path, 10, 10, [1, 1], c);

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

	class Step extends Graphic {

		constructor(gl, shader, id, size, r1, r2) {
		
			var step = new StairwayStep();
			
			var t = [new Translation([0.0, 0.0, 2*(Math.sqrt(2)/3.0)*id]),
				 new Scale([1.0, 0.5, Math.sqrt(2)/3.0])];

			super(gl, step, t, shader);

			this.id = id + 1;
			this.current = id + 1;
			this.size = size;

			this.r1 = r1;
			this.r2 = r2;

			this.hasChanged = false;
			this.visibility = false;
			this.prevState = false;
		}

		_isVisible(controller) {

			var state = controller.getDoorChanged();

			if (state === this.prevState) {

				if (this.hasChanged &&
					this.r1.hasFinished() &&
					this.r2.hasFinished() && this.current > 0) {
					
					this.current -= 1;
					
					if (this.current == 0)
						this.visibility = true;

				} else if (!this.hasChanged && this.visibility) {
					
					if (this.current == this.size) {
						this.visibility = false;
						this.current = this.id;
					} else
						this.current++;
				}

				return this.visibility;
			}

			this.prevState = state;

			if (this.visibility) {
				this.hasChanged = false;
				this.current = this.id - (this.size - this.id);
			} else {
				this.hasChanged = true;
			}

			return this.visibility;
		}
	}

	class Steps extends Container3D {

		constructor(gl, shader, r1, r2) {

			super([new Translation([2.0, -2.0, 1.0]),
			       new Rotation([1.0, 0.0, 0.0], Math.PI/4, 0.0)]);

			this.gl = gl;
			this.shader = shader;
			this.r1 = r1;
			this.r2 = r2;

			this._initialize();
		}

		/* private methods */

		_initialize() {

			for (var i = 0; i < 6; i++) {

				var gstep = new Step(this.gl,
						     this.shader,
						     i, 6,
						     this.r1, this.r2);
				this.add(gstep);
			}
		}
	}

	class HelicopterApp extends App {

		constructor(gl, canvas) {
			super(gl, canvas);
		}

		/* public methods */

		start() {
		
			var scene = new Scene(this.gl);

			var shader = new ShaderProgram(this.gl,
						       normal_vertex_shader,
						       normal_fragment_shader);

			var landShader = new ShaderProgram(this.gl,
							   bitmap_vertex_shader,
							   bitmap_fragment_shader);

			var skyShader = new ShaderProgram(this.gl,
							  sky_vertex_shader,
							  sky_fragment_shader);

			var reflectShader = new ShaderProgram(this.gl,
							      normal_vertex_shader,
							      reflect_fragment_shader);

			// Perspective camera
			var camera = new Camera(this.gl, this.canvas, [0.0, 0.0, 40.0]);
			scene.addCamera(camera);

			// Keyboard controller
			var controller = new HeliController();
			scene.addController(controller);

			// Lights
			var lights = {
				direct: new DirectLight([0.0, 1.0, 1.0], [1.0, 1.0, 1.0]),
				spot: new SpotLight([1.75, -0.25, 0.0],
						    [1.0, -2.0, 0.0],
						    [1.0, 1.0, 1.0]),
				red: new PointLight([-1.5, -0.5, 0.75], [1.0, 0.0, 0.0]),
				green: new PointLight([-1.5, -0.5, -0.75], [0.0, 1.0, 0.0])
			};
			scene.addLights(lights);

			// World
			var world = new World();

			// Sky sphere
			var gsky = new GraphicSky(this.gl, skyShader);
			gsky.loadTexture("./img/sunset.jpg");

			world.add(gsky);
			
			// Lanscape
			var gland = new GraphicLand(this.gl, landShader);
			gland.loadTexture("./img/pasto.jpg", "uSPasto");
			gland.loadTexture("./img/piedras.jpg", "uSPiedras");
			gland.loadTexture("./img/tierra.jpg", "uSTierra");
			gland.loadTexture("./img/tierraseca.jpg", "uSTierraSeca");

			world.add(gland);

			// Helicopter Tree
			var t = [new HelicopterTranslation(),
				 new HelicopterRotation(),
				 new Rotation([0.0, 1.0, 0.0], Math.PI, 0.0),
				 new Scale([0.25, 0.25, 0.25]),
				 new Translation([-4.0, 0.0, 0.0])];
			var helicopter = new Container3D(t);

			////////////////////
			//     Center     //
			////////////////////

			// Front center
			var front = new FrontCenter(50, 50);
			var t1 = [new Rotation([0.0, 1.0, 0.0], Math.PI, 0.0)];
			var gfront = new GraphicReflect(this.gl, front, t1, reflectShader);
			gfront.loadTexture("./img/sunset.jpg");

			helicopter.add(gfront);

			// First curve center
			var frontHelixAndLegs = new Container3D([new Identity()]);
			var curve = new CurveCenter(50, 50);
			var t2 = [new Identity()];
			var gcurve1 = new Graphic(this.gl, curve, t2, shader);
			
			frontHelixAndLegs.add(gcurve1);

			helicopter.add(frontHelixAndLegs);

			// Hexagon center
			var t3 = [new Translation([2.0, 0.0, 0.0])];
			var hexaCenterAndDoor = new Container3D(t3);
			var hexa = new HexagonCenter(50, 50);
			var ghexa = new GraphicReflect(this.gl,
						hexa, [new Identity()], reflectShader);
			ghexa.loadTexture("./img/sunset.jpg");

			hexaCenterAndDoor.add(ghexa);

			helicopter.add(hexaCenterAndDoor);

			// Second curve center
			var backHelixAndLegs = new Container3D([new Translation([8.0, 0.0, 0.0])]);
			
			var t4 = [new Scale([2.0, 1.0, 1.0])];
			var gcurve2 = new Graphic(this.gl, curve, t4, shader);
			
			backHelixAndLegs.add(gcurve2);
			
			// Lights
			var reds = new Sphere(20, 20, new Color([1.0, 0.0, 0.0]));
			var greens = new Sphere(20, 20, new Color([0.0, 1.0, 0.0]));
			var scaleS = new Scale([0.4, 0.4, 0.4]);

			// Red sphere light
			var treds = [new Translation([2.0, -1.0, -5.0]),
				     scaleS];
			var gred = new Graphic(this.gl, reds, treds, shader);

			backHelixAndLegs.add(gred);

			// Green sphere light
			var tgreens = [new Translation([2.0, -1.0, 5.0]),
				       scaleS];
			var ggreen = new Graphic(this.gl, greens, tgreens, shader);

			backHelixAndLegs.add(ggreen);

			helicopter.add(backHelixAndLegs);

			// Back center
			var back = new BackCenter(50, 50);
			var t5 = [new Translation([12.0, 0.0, 0.0])];
			var gback = new Graphic(this.gl, back, t5, shader);

			helicopter.add(gback);

			////////////////////
			//     Helixes    //
			////////////////////

			var leftHelix = new Helix("left", this.gl, shader);
			var rightHelix = new Helix("right", this.gl, shader);

			////// Front helixes //////

			var t9 = [new Translation([1.0, 2.0, -2.0]),
				  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
				  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
				  new MotorRotation("right")];
			var rightFrontHelix = new Container3D(t9);
			rightFrontHelix.add(rightHelix);

			var t10 = [new Translation([1.0, 2.0, 2.0]),
				   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
				   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
				   new MotorRotation("left")];
			var leftFrontHelix = new Container3D(t10);
			leftFrontHelix.add(leftHelix);

			frontHelixAndLegs.add(rightFrontHelix);
			frontHelixAndLegs.add(leftFrontHelix);

			////// Back helixes //////

			var t11 = [new Translation([2.0, 2.0, -2.0]),
				  new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
				  new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0),
				  new MotorRotation("right")];
			var rightBackHelix = new Container3D(t11);
			rightBackHelix.add(rightHelix);

			var t12 = [new Translation([2.0, 2.0, 2.0]),
				   new Rotation([0.0, 0.0, 1.0], Math.PI/2, 0.0),
				   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
				   new MotorRotation("left")];
			var leftBackHelix = new Container3D(t12);
			leftBackHelix.add(leftHelix);

			backHelixAndLegs.add(rightBackHelix);
			backHelixAndLegs.add(leftBackHelix);

			//////////////////////
			//   Landing legs   //
			//////////////////////

			var leftLeg = new LandingLeg("left", this.gl, shader);
			var rightLeg = new LandingLeg("right", this.gl, shader);
			
			////// Front legs //////

			var t13 = [new Translation([1.0, -2.8, -2.0]),
				   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
			var rightFrontLeg = new Container3D(t13);
			rightFrontLeg.add(rightLeg);

			var t14 = [new Translation([1.0, -2.8, 2.0]),
				   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
			var leftFrontLeg = new Container3D(t14);
			leftFrontLeg.add(leftLeg);

			frontHelixAndLegs.add(rightFrontLeg);
			frontHelixAndLegs.add(leftFrontLeg);

			////// Back legs //////

			var t15 = [new Translation([2.0, -2.8, -2.0]),
				   new Rotation([0.0, 1.0, 0.0], Math.PI/2, 0.0)];
			var rightBackLeg = new Container3D(t15);
			rightBackLeg.add(rightLeg);

			var t16 = [new Translation([2.0, -2.8, 2.0]),
				   new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0)];
			var leftBackLeg = new Container3D(t16);
			leftBackLeg.add(leftLeg);

			backHelixAndLegs.add(rightBackLeg);
			backHelixAndLegs.add(leftBackLeg);

			///////////////////////
			//  Door & Stairway  //
			///////////////////////
			
			var door = new Stairway();

			var r1 = new StairwayRotation(-Math.PI/4);
			var r2 = new StairwayRotation(Math.PI/2);

			var tdoor = [new Translation([3.0, -2.0, 1.0]),
				     new Rotation([0.0, 1.0, 0.0], -Math.PI/2, 0.0),
				     r1];
			var cdoor = new Container3D(tdoor);

			var t17 = [new Scale([1.0, Math.sqrt(2)/2.0, 1.5]),
				   new Translation([0.0, 2.0, 0.0])];
			var gstair1 = new Graphic(this.gl, door, t17, shader);

			cdoor.add(gstair1);

			var t18 = [new Translation([0.0, 2*Math.sqrt(2), 0.0]),
				   r2,
				   new Scale([1.0, Math.sqrt(2)/2.0, 1.5]),
				   new Translation([0.0, 2.0, 0.0])];
			var gstair2 = new Graphic(this.gl, door, t18, shader);

			cdoor.add(gstair2);

			hexaCenterAndDoor.add(cdoor);

			var steps = new Steps(this.gl, shader, r1, r2);

			hexaCenterAndDoor.add(steps);

			world.add(helicopter);

			scene.add(world);

			scene.draw();
		}
	}

	exports.HelicopterApp = HelicopterApp;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
