//
// Utility class to store
// files text and type
//
class ShaderFile {
    constructor(path, type, callback) {
        this.path = path;
        this.type = type;
        this.callback = callback;

        this.text = null;

        this._init();
    }

    /* private methods */

    _init() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', this.path, true);

        xhr.addEventListener('load', () => {
            this.text = xhr.responseText;
            this.callback();
        });

        xhr.send();
    }

    /* public methods */

    getText() {
        return this.text;
    }

    getType() {
        return this.type;
    }
}
