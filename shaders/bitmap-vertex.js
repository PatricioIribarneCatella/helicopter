// MATRIX with BITMAP VERTEX SHADER

var bitmap_vertex_shader = 'attribute vec3 aVertexPosition; 								\
			    attribute vec3 aVertexColor; 								\
			    attribute vec3 aVertexNormal; 								\
			    attribute vec2 aTextureCoord; 								\
				   											\
			    uniform mat4 normal; 									\
			    uniform mat4 model; 									\
			    uniform mat4 pv; 										\
			    uniform sampler2D uSampler; 								\
															\
			    varying highp vec4 vColor; 									\
 			    varying vec3 vNormal; 									\
			    varying vec3 vPosWorld; 									\
															\
			    void main(void) { 										\
															\
				vec4 textureColor = texture2D(uSampler, vec2(aTextureCoord.s, aTextureCoord.t)); 	\
				float scale = max(max(textureColor.x, textureColor.y), textureColor.z); 		\
															\
				vec4 position = pv * model * vec4(aVertexPosition, 1.0); 				\
				position.y += 10.0 * scale; 								\
				gl_Position = position; 								\
															\
				vPosWorld = (model * vec4(aVertexPosition, 1.0)).xyz; 					\
															\
				vNormal = (normal * vec4(aVertexNormal, 1.0)).xyz; 					\
															\
				vec3 color = aVertexColor; 								\
				color.x = color.x * scale; 								\
				color.y = color.y * scale; 								\
				color.z = color.z * scale; 								\
															\
				vColor = vec4(color, 1.0); 								\
			    }';

