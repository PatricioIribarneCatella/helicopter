//
// main function
//
function main() {

	const canvas = document.querySelector("canvas");

	const gl = canvas.getContext("webgl");

	// check if WebGL is available
	if (gl ===  null) {
		alert("WebGl not available");
		return;
	}

	// black color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// clear the color buffer
	gl.clear(gl.COLOR_BUFFER_BIT);
}

main();
