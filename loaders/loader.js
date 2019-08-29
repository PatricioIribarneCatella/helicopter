//
// class to manage
// async loading resources
// (images and shaders)
// Then calls the 'start' method
// of the app
//
class Loader {

	constructor(images, shaders, app) {
		
		this.imagesPaths = images;
		this.shadersPaths = shaders;
		this.app = app;

		this.imageLoader = new ImageLoader(this.imagesPaths,
					new FileLoader(this.shadersPaths, this.app));
	}

	/* public method */

	start() {
		this.imageLoader.start();
	}
}
