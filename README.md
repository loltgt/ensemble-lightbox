# ensemble Lightbox

ensemble.Lightbox JavaScript class, based on ensemble.Modal and ensemble from loltgt

This lightbox modal component supports: image, video, audio, iframe, JS and inline content, PDF.

It has a slider, built-in modal dialog and swipe gesture navigation.

It comes with options and hooks to customize.


## Demo

Live demo on this page: [https://loltgt.github.io/ensemble-lightbox/demo/](https://loltgt.github.io/ensemble-lightbox/demo/)

View source from `demo` to discover options and examples.


## Install

Using npm:
```shell
npm install --save-dev loltgt/ensemble-lightbox
```

## Usage

Simple usage example:
```javascript
const lightbox = new ensemble.Lightbox(document.body,
  {
    selector: "a",
    infinite: false
  }
);

for (const item of document.querySelectorAll("a")) {
  item.addEventListener("click", lightbox.open);
}
```

Another example, passing contents via options:
```javascript
const lightbox = new ensemble.Lightbox(
  {
    contents: [
      {
        type: "image",
        src: "image.png"
      },
      {
        type: "iframe",
        src: "https://example.org/"
      }
    ]
  }
);

lightbox.open();
```

## License

[MIT License](LICENSE)
