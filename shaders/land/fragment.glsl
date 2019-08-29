// LAND FRAGMENT SHADER

precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld; 
varying vec2 vTextureCoord;

uniform vec3 directLight;
uniform vec3 leftLightPos;
uniform vec3 rightLightPos;
uniform vec3 spotLightPos;
uniform vec3 spotLightDir;

uniform vec3 directColor;
uniform vec3 pointLeftColor;
uniform vec3 pointRightColor;
uniform vec3 spotColor;

uniform float spotIntensity;

uniform sampler2D uSPasto;
uniform sampler2D uSPiedras;
uniform sampler2D uSTierra;
uniform sampler2D uSTierraSeca;

uniform vec3 eye;

void main(void) {

   float gloss = 64.0;
   vec3 eyeVec = normalize(eye);

   vec3 rVec = reflect(-normalize(directLight), normalize(vNormal));

   vec3 ambientDirectLight = directColor;
   vec3 diffuseDirectLight = directColor;
   vec3 specularDirectLight = directColor;

   vec3 directDiff = 0.1 * max(0.0, dot(normalize(directLight), vNormal)) * diffuseDirectLight;
   vec3 directSpec = 0.2 * pow(max(0.0, dot(rVec, eyeVec)), gloss) * specularDirectLight;


   vec3 lightDirection = normalize(spotLightDir);
   vec3 surfaceTolight = normalize(spotLightPos - vPosWorld);

   float limit = 0.60;
   float dotFromLight = pow(dot(lightDirection, -surfaceTolight), 10.0);
   float inLight = smoothstep(0.90, 0.50, dotFromLight);
   inLight = 1.0 - inLight;

   rVec = reflect(-surfaceTolight, normalize(vNormal));
   
   vec3 spotDiff = max(0.0, inLight * dot(surfaceTolight, vNormal)) * spotColor;
   vec3 spotSpec = pow(max(0.0, inLight * dot(rVec, eyeVec)), gloss) * spotColor;

   float a = 0.5;
   float b = 0.5;
   float c = 5.0;
   float d = 1.0;

   float distL = distance(leftLightPos, vPosWorld);
   float decayL = (d / (a * distL*distL + b * distL + c));

   vec3 ambientLeftLight = decayL * pointLeftColor;
   vec3 diffuseLeftLight = decayL * pointLeftColor;
   vec3 specularLeftLight = decayL * pointLeftColor;

   surfaceTolight = normalize(leftLightPos - vPosWorld);
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


   vec3 pasto = texture2D(uSPasto, vec2(vTextureCoord.s, vTextureCoord.t)).xyz;
   vec3 piedras = texture2D(uSPiedras, vec2(vTextureCoord.s, vTextureCoord.t)).xyz;
   vec3 tierra = texture2D(uSTierra, vec2(vTextureCoord.s, vTextureCoord.t)).xyz;
   vec3 tierraSeca = texture2D(uSTierraSeca, vec2(vTextureCoord.s, vTextureCoord.t)).xyz;

   vec3 up = vec3(0.0, 1.0, 0.0);
   float upFactor = max(0.0, dot(up, normalize(vNormal)));
   float planeFactor = 1.0 - upFactor;

   vec3 rocks = mix(mix(mix(piedras, tierra, smoothstep(0.60, 0.80, planeFactor)),
			   tierraSeca, smoothstep(0.50, 0.80, planeFactor)),
		   		pasto, 0.5);
   vec3 terrain = mix(rocks, pasto, smoothstep(0.30, 0.80, upFactor));

   vec3 kDiffuse = terrain;
   
   vec3 kAmbientD = vec3(0.1, 0.1, 0.1);
   vec3 kAmbientP = vec3(0.1, 0.1, 0.1);
   vec3 kSpecular = vec3(1.0, 1.0, 1.0);

   vec3 ambientInten = kAmbientD * ambientDirectLight + kAmbientP * (ambientLeftLight + ambientRightLight);
   vec3 diffInten = kDiffuse * (directDiff + leftDiff + rightDiff) + spotIntensity * spotDiff;
   vec3 specInten = kSpecular * (directSpec + leftSpec + rightSpec + spotSpec);

   vec3 color = ambientInten + diffInten + specInten;

   gl_FragColor = vec4(color, 1.0);
}

