// NORMAL MATRIX VERTEX SHADER

var normal_vertex_shader = `attribute vec3 aVertexPosition;
			    attribute vec3 aVertexColor;
			    attribute vec3 aVertexNormal;

			    uniform mat4 normal;
			    uniform mat4 model;
			    uniform mat4 pv;

			    varying highp vec4 vColor;
			    varying vec3 vNormal;
			    varying vec3 vPosWorld;

			    void main(void) {

				gl_Position = pv * model * vec4(aVertexPosition, 1.0);

				vPosWorld = (model * vec4(aVertexPosition, 1.0)).xyz;

				vNormal = (normal * vec4(aVertexNormal, 1.0)).xyz;

				vColor = vec4(aVertexColor, 1.0);
			    }`;

