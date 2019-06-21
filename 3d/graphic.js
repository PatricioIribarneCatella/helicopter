//
// Combines a Model element
// and a list of transformations
// to aplicate on it
//
export class Graphic {

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

		mat4.multiply(this.normalMatrix, viewMatrix, this.matrix);
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
				
				this._updateNormals(camera.getView());

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

