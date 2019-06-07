// SKY VERTEX SHADER

var sky_vertex_shader = 'attribute vec3 aVertexPosition; 					\
			 attribute vec2 aTextureCoord; 						\
				   								\
			 uniform mat4 model; 							\
			 uniform mat4 pv; 							\
												\
			 varying vec2 vTextureCoord; 						\
												\
			 void main(void) { 							\
												\
				gl_Position = pv * model * vec4(aVertexPosition, 1.0); 		\
				vec2 uvCoord = aTextureCoord; 					\
				vTextureCoord = uvCoord;					\
			 }';

