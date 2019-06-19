// BITMAP FRAGMENT SHADER

var bitmap_fragment_shader = 'precision highp float; 										\
			      varying vec3 vNormal; 										\
			      varying vec3 vPosWorld; 										\
			      varying vec2 vTextureCoord; 									\
																\
			      uniform vec3 leftLightPos; 									\
			      uniform vec3 rightLightPos; 									\
			      uniform vec3 spotLightPos; 									\
			      uniform vec3 spotLightDir; 									\
																\
			      uniform vec3 pointLeftColor; 									\
			      uniform vec3 pointRightColor; 									\
			      uniform vec3 spotColor; 										\
																\
			      uniform sampler2D uSPasto; 									\
			      uniform sampler2D uSPiedras; 									\
			      uniform sampler2D uSTierra; 									\
			      uniform sampler2D uSTierraSeca; 									\
																\
			      uniform vec3 eye; 										\
																\
			      void main(void) { 										\
																\
				   float gloss = 64.0; 										\
				   vec3 eyeVec = normalize(eye); 								\
																\
				   vec3 lightDirection = normalize(spotLightDir); 						\
				   vec3 surfaceTolight = normalize(spotLightPos - vPosWorld); 					\
																\
				   float limit = 0.60; 										\
				   float dotFromLight = pow(dot(lightDirection, -surfaceTolight), 10.0); 			\
				   float inLight = smoothstep(0.90, 0.50, dotFromLight);					\
				   inLight = 1.0 - inLight; 									\
																\
				   vec3 rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 spotDiff = max(0.0, inLight * dot(surfaceTolight, vNormal)) * spotColor; 		\
				   vec3 spotSpec = pow(max(0.0, inLight * dot(rVec, eyeVec)), gloss) * spotColor; 		\
																\
																\
				   float distL = distance(leftLightPos, vPosWorld); 						\
				   float decayL = (5.0 / (0.2*distL*distL + distL + 5.0)); 					\
																\
				   vec3 specularLeftLight = pointLeftColor; 							\
																\
				   surfaceTolight = normalize(leftLightPos - vPosWorld); 					\
				   rVec = reflect(-surfaceTolight, normalize(vNormal)); 					\
																\
				   vec3 leftSpec = decayL * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularLeftLight; 	\
																\
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
				   vec3 pasto = texture2D(uSPasto, vec2(vTextureCoord.s, vTextureCoord.t)).xyz; 		\
				   vec3 piedras = texture2D(uSPiedras, vec2(vTextureCoord.s, vTextureCoord.t)).xyz; 		\
				   vec3 tierra = texture2D(uSTierra, vec2(vTextureCoord.s, vTextureCoord.t)).xyz; 		\
				   vec3 tierraSeca = texture2D(uSTierraSeca, vec2(vTextureCoord.s, vTextureCoord.t)).xyz; 	\
																\
				   vec3 kDiffuse = mix(mix(mix(pasto, piedras, 0.3), tierra, 0.2), tierraSeca, 0.3); 		\
				   vec3 kAmbient = vec3(0.2, 0.2, 0.2); 							\
				   vec3 kSpecular = vec3(1.0, 1.0, 1.0); 							\
																\
				   vec3 ambientInten = kAmbient * vec3(1.0, 1.0, 1.0); 						\
				   vec3 diffInten = kDiffuse * (vec3(1.0, 1.0, 1.0) + spotDiff); 				\
				   vec3 specInten = kSpecular * (leftSpec + rightSpec + spotSpec); 				\
																\
				   vec3 color = diffInten + specInten; 								\
																\
				   gl_FragColor = vec4(color, 1.0); 								\
			     }';
