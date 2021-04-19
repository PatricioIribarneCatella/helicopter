// MATRIX VERTEX SHADER

var matrix_vertex_shader = `attribute vec3 aVertexPosition;
			    attribute vec3 aVertexColor;

			    uniform mat4 model;
			    uniform mat4 pv;

			    varying highp vec4 vColor;

			    void main(void) {
				gl_Position = pv * model * vec4(aVertexPosition, 1.0);
				vColor = vec4(aVertexColor, 1.0);
			    }`;

