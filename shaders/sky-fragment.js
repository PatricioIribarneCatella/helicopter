// SKY FRAGMENT SHADER

var sky_fragment_shader = 'precision highp float; 									\
			   varying vec2 vTextureCoord; 									\
															\
			   uniform sampler2D uSampler; 									\
															\
			   void main(void) { 										\
															\
				vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); 	\
															\
				gl_FragColor = vec4(textureColor.rgb, textureColor.a); 					\
			   }';
