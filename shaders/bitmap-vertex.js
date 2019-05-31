// MATRIX with BITMAP VERTEX SHADER

var bitmap_vertex_shader = 'attribute vec3 aVertexPosition; 								\
			    attribute vec3 aVertexColor; 								\
			    attribute vec2 aTextureCoord; 								\
				   											\
			    uniform mat4 model; 									\
			    uniform mat4 pv; 										\
			    uniform sampler2D uSampler; 								\
															\
			    varying highp vec4 vColor; 									\
															\
			    void main(void) { 										\
				vec4 position = pv * model * vec4(aVertexPosition, 1.0); 				\
				vec4 textureColor = texture2D(uSampler, vec2(aTextureCoord.s, aTextureCoord.t)); 	\
				position.y += 5.0 * max(max(textureColor.x, textureColor.y), textureColor.z); 		\
				gl_Position = position; 								\
				vColor = vec4(aVertexColor, 1.0); 							\
			    }';

