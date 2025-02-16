# ensemble Lightbox

ensemble.Lightbox JavaScript class from loltgt

This lightbox modal supports: image, video, audio, iframe, remote and inline contents, PDF.

It has a slider and built-in modal dialog.

It comes with options and hooks to customize.


## Install

Using npm:
```shell
npm install --save-dev github:loltgt/ensemble-lightbox
```

## Usage

Simple usage example:
```javascript
var lightbox = new ensemble.Lightbox({
  contents: [
    {
      type: 'image',
      src: 'image.png'
    }
  ]
});

lightbox.open();
```

## License

[MIT License](LICENSE)
