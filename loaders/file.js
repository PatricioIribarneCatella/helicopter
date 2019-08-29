//
// Utility class to start loading
// all the files (a.k.a shaders), and then
// runs the 'callback'
//
class FileLoader {

	constructor(paths, app) {
		
		this.paths = paths;
		this.app = app;
		
		this.files = {};
		this.filesToLoad = this.paths.length;
	}

	/* private methods */

	_loadFile(file, callback) {
	
		var f = new File(file.path, file.type, callback);

		return f;
	}

	_onFileLoad() {

		--this.filesToLoad;

		// If all the files are loaded call the callback.
		if (this.filesToLoad === 0)
			this.app.start(this.images, this.files);
	}

	/* public methods */

	start(images) {

		this.images = images;
		
		for (var f = 0; f < this.paths.length; f++) {
			var file = this._loadFile(this.paths[f], () => this._onFileLoad());
			this.files[this.paths[f].name] = file;
		}
	}
}

