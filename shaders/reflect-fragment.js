// REFLECTION NORMAL MATRIX FRAGMENT SHADER

var reflect_fragment_shader = `precision highp float;
			      varying vec3 vNormal;
			      varying vec3 vPosWorld;
			      varying highp vec4 vColor; 

			      uniform vec3 directLight;
			      uniform vec3 leftLightPos;
			      uniform vec3 rightLightPos;

			      uniform vec3 directColor;
			      uniform vec3 pointLeftColor;
			      uniform vec3 pointRightColor;

			      uniform vec3 eye;
			      uniform sampler2D uSampler;

			      void main(void) {

				   vec3 eyeToSurface = normalize(vPosWorld - eye);
				   vec3 r = reflect(eyeToSurface, normalize(vNormal));
				   float m = 2.0 * sqrt(pow(r.x, 2.0) + pow(r.y, 2.0) + pow(r.z + 1.0, 2.0));
				   vec2 uvCoord = r.xy / m + 0.5;
				   vec4 textureColor = texture2D(uSampler, uvCoord) * vec4(0.5, 0.5, 0.5, 1.0);

				   float gloss = 64.0;

				   vec3 rVec = reflect(-normalize(directLight), normalize(vNormal));
				   vec3 eyeVec = normalize(eye);

				   vec3 ambientDirectLight = directColor;
			  	   vec3 diffuseDirectLight = directColor;
				   vec3 specularDirectLight = directColor;

				   vec3 directDiff = 0.2 * max(0.0, dot(normalize(directLight), vNormal)) * diffuseDirectLight;
				   vec3 directSpec = pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularDirectLight;

				   float a = 1.0;
				   float b = 1.0;
				   float c = 5.0;
				   float d = 1.0;

				   float distL = distance(leftLightPos, vPosWorld);
				   float decayL = (d / (a * distL*distL + b * distL + c));

				   vec3 ambientLeftLight = decayL * pointLeftColor;
				   vec3 diffuseLeftLight = decayL * pointLeftColor;
				   vec3 specularLeftLight = decayL * pointLeftColor;

				   vec3 surfaceTolight = normalize(leftLightPos - vPosWorld);
				   rVec = reflect(-surfaceTolight, normalize(vNormal));

				   vec3 leftDiff = max(0.0, dot(surfaceTolight, vNormal)) * diffuseLeftLight;
				   vec3 leftSpec = pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularLeftLight;

				   float distR = distance(leftLightPos, vPosWorld);
				   float decayR = (d / (a * distR*distR + b * distR + c));

				   vec3 ambientRightLight = decayR * pointRightColor;
				   vec3 diffuseRightLight = decayR * pointRightColor;
				   vec3 specularRightLight = decayR * pointRightColor;

				   surfaceTolight = normalize(rightLightPos - vPosWorld);
				   rVec = reflect(-surfaceTolight, normalize(vNormal));

				   vec3 rightDiff = max(0.0, dot(surfaceTolight, vNormal)) * diffuseRightLight;
				   vec3 rightSpec = pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularRightLight;


				   vec3 kDiffuse = vColor.xyz;
				   vec3 kSpecular = vec3(1.0, 1.0, 1.0);
				   vec3 kAmbientD = vec3(0.2, 0.2, 0.2);
				   vec3 kAmbientP = vec3(0.1, 0.1, 0.1);

				   vec3 ambientInten = kAmbientD * ambientDirectLight + kAmbientP * (ambientLeftLight + ambientRightLight);
				   vec3 diffInten = kDiffuse * (directDiff + leftDiff + rightDiff);
				   vec3 specInten = kSpecular * (directSpec + leftSpec + rightSpec);

				   vec3 color = ambientInten + diffInten + specInten;

				   gl_FragColor = vec4(color, 1.0) + textureColor;
			     }`;

