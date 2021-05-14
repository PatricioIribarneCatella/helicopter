// LAND VERTEX SHADER

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 normal;
uniform mat4 model;
uniform mat4 pv;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosWorld;

void main(void) {

	gl_Position = pv * model * vec4(aVertexPosition, 1.0);

	vPosWorld = (model * vec4(aVertexPosition, 1.0)).xyz;

	vNormal = (normal * vec4(aVertexNormal, 1.0)).xyz;

	vec2 uvCoord = aTextureCoord;
	vTextureCoord = uvCoord;
}


