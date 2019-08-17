//
// Utility class to start loading
// all the textures, and then
// runs the 'callback'
//
class Loader {

	constructor(paths, shaders, app) {
		this.paths = paths;
		this.app = app;
		this.shaders = shaders;
		this.images = {};
		this.imagesToLoad = paths.length;
	}

	/* private methods */

	_loadImage(url, callback) {
	
		var image = new Image();
		
		image.src = url;
		image.onload = callback;
		
		return image;
	}

	_onImageLoad() {
	
		--this.imagesToLoad;
		
		// If all the images are loaded call the callback.
		if (this.imagesToLoad === 0)
			this.app.start(this.images, this.shaders);
	}

	/* public methods */

	start() {
		for (var img = 0; img < this.imagesToLoad; img++) {
			var image = this._loadImage(this.paths[img].path, () => this._onImageLoad());
			this.images[this.paths[img].name] = image;
		}
	}
}

