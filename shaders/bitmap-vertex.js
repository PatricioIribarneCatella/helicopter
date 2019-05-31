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
				vec4 textureColor = texture2D(uSampler, vec2(aTextureCoord.s, aTextureCoord.t)); 	\
				float scale = max(max(textureColor.x, textureColor.y), textureColor.z); 		\
				vec4 position = pv * model * vec4(aVertexPosition, 1.0); 				\
				position.y += 10.0 * scale; 								\
				gl_Position = position; 								\
				vec3 color = aVertexColor; 								\
				color.x = color.x * scale; 								\
				color.y = color.y * scale; 								\
				color.z = color.z * scale; 								\
				vColor = vec4(color, 1.0); 								\
			    }';

