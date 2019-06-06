var bitmap_fragment_shader = 'precision highp float; 										\
			      varying vec3 vNormal; 										\
			      varying vec3 vPosWorld; 										\
			      varying highp vec4 vColor; 									\
																\
			      uniform vec3 leftLightPos; 									\
			      uniform vec3 rightLightPos; 									\
																\
			      uniform vec3 pointLeftColor; 									\
			      uniform vec3 pointRightColor; 									\
																\
			      uniform vec3 eye; 										\
																\
			      void main(void) { 										\
																\
				   float gloss = 64.0; 										\
																\
				   vec3 eyeVec = normalize(eye); 								\
																\
				   float distL = distance(leftLightPos, vPosWorld); 						\
				   float decayL = (5.0 / (0.2*distL*distL + distL + 5.0)); 					\
																\
				   vec3 specularLeftLight = pointLeftColor; 							\
																\
				   vec3 surfaceTolight = normalize(leftLightPos - vPosWorld); 					\
				   vec3 rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 leftSpec = decayL * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularLeftLight; 	\
																\
				   float distR = distance(leftLightPos, vPosWorld); 						\
				   float decayR = (5.0 / (0.2*distR*distR + distR + 5.0)); 					\
																\
				   vec3 specularRightLight = pointRightColor; 							\
																\
				   surfaceTolight = normalize(rightLightPos - vPosWorld); 					\
				   rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 rightSpec = decayR * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularRightLight; 	\
																\
																\
				   vec3 kDiffuse = vColor.xyz; 									\
				   vec3 kAmbient = vec3(0.2, 0.2, 0.2); 							\
				   vec3 kSpecular = vec3(1.0, 1.0, 1.0); 							\
																\
				   vec3 ambientInten = kAmbient * vec3(1.0, 1.0, 1.0); 						\
				   vec3 diffInten = kDiffuse * vec3(1.0, 1.0, 1.0); 						\
				   vec3 specInten = kSpecular * (leftSpec + rightSpec); 					\
																\
				   vec3 color = ambientInten + diffInten + specInten; 						\
																\
				   gl_FragColor = vec4(color, 1.0); 								\
			     }';
