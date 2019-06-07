// NORMAL MATRIX FRAGMENT SHADER

var normal_fragment_shader = 'precision highp float; 										\
			      varying vec3 vNormal; 										\
			      varying vec3 vPosWorld; 										\
			      varying highp vec4 vColor; 									\
																\
			      uniform vec3 directLight; 									\
			      uniform vec3 leftLightPos; 									\
			      uniform vec3 rightLightPos; 									\
																\
			      uniform vec3 directColor; 									\
			      uniform vec3 pointLeftColor; 									\
			      uniform vec3 pointRightColor; 									\
																\
			      uniform vec3 eye; 										\
																\
			      void main(void) { 										\
																\
				   float gloss = 64.0; 										\
																\
				   vec3 rVec = reflect(-normalize(directLight), normalize(vNormal)); 				\
				   vec3 eyeVec = normalize(eye); 								\
																\
				   vec3 ambientDirectLight = directColor; 							\
			  	   vec3 diffuseDirectLight = directColor; 							\
				   vec3 specularDirectLight = directColor; 							\
																\
				   vec3 directDiff = max(0.0, dot(normalize(directLight), vNormal)) * diffuseDirectLight; 	\
				   vec3 directSpec = pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularDirectLight; 		\
																\
																\
				   float distL = distance(leftLightPos, vPosWorld); 						\
				   float decayL = (5.0 / (0.4*distL*distL + distL + 5.0)); 					\
																\
				   vec3 ambientLeftLight = pointLeftColor; 							\
				   vec3 diffuseLeftLight = pointLeftColor; 							\
				   vec3 specularLeftLight = pointLeftColor; 							\
																\
				   vec3 surfaceTolight = normalize(leftLightPos - vPosWorld); 					\
				   rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 leftDiff = decayL * max(0.0, dot(surfaceTolight, vNormal)) * diffuseLeftLight; 		\
				   vec3 leftSpec = decayL * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularLeftLight; 	\
																\
				   float distR = distance(leftLightPos, vPosWorld); 						\
				   float decayR = (5.0 / (0.4*distR*distR + distR + 5.0)); 					\
																\
				   vec3 ambientRightLight = pointRightColor; 							\
				   vec3 diffuseRightLight = pointRightColor; 							\
				   vec3 specularRightLight = pointRightColor; 							\
																\
				   surfaceTolight = normalize(rightLightPos - vPosWorld); 					\
				   rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 rightDiff = decayR * max(0.0, dot(surfaceTolight, vNormal)) * diffuseRightLight; 	\
				   vec3 rightSpec = decayR * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularRightLight; 	\
																\
																\
				   vec3 kDiffuse = vColor.xyz; 									\
				   vec3 kSpecular = vec3(1.0, 1.0, 1.0); 							\
				   vec3 kAmbientD = vec3(0.2, 0.2, 0.2); 							\
				   vec3 kAmbientP = vec3(0.1, 0.1, 0.1); 							\
																\
				   vec3 ambientInten = kAmbientD * ambientDirectLight + kAmbientP * (ambientLeftLight + ambientRightLight); 	\
				   vec3 diffInten = kDiffuse * (directDiff + leftDiff + rightDiff); 				\
				   vec3 specInten = kSpecular * (directSpec + leftSpec + rightSpec); 				\
																\
				   vec3 color = ambientInten + diffInten + specInten; 						\
																\
				   gl_FragColor = vec4(color, 1.0); 								\
			     }';

