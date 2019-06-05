// NORMAL MATRIX FRAGMENT SHADER

var normal_fragment_shader = 'precision highp float; 										\
			      varying vec3 vNormal; 										\
			      varying vec3 vPosWorld; 										\
			      varying highp vec4 vColor; 									\
																\
			      void main(void) { 										\
																\
				   vec3 surfaceTolight = vec3(0.0, 0.0, 1.0); 							\
																\
				   vec3 rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
				   vec3 eyeVec = vec3(0.0, 0.0, 1.0); 								\
																\
				   float gloss = 64.0; 										\
																\
				   vec3 ambientLight = vec3(1.0, 1.0, 1.0); 							\
			  	   vec3 diffuseLight = vec3(1.0, 1.0, 1.0); 							\
				   vec3 specularLight = vec3(1.0, 1.0, 1.0); 							\
																\
				   vec3 kDiffuse = vColor.xyz; 									\
				   vec3 kAmbient = vec3(0.2, 0.2, 0.2); 							\
				   vec3 kSpecular = vec3(1.0, 1.0, 1.0); 							\
																\
				   vec3 ambientInten = kAmbient * ambientLight; 						\
				   vec3 diffInten = kDiffuse * max(0.0, dot(surfaceTolight, vNormal)) * diffuseLight; 		\
				   vec3 specInten = kSpecular * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularLight; 	\
																\
				   vec3 color = ambientInten + diffInten + specInten; 						\
																\
				   gl_FragColor = vec4(color, 1.0); 								\
			     }';

