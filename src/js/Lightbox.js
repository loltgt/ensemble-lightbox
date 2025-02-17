/*!
 * ensemble Lightbox
 *
 * @version 0.0.4
 * @link https://github.com/loltgt/ensemble-lightbox
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

/**
 * @namespace ensemble
 * @exports Lightbox
 * @exports Modal
 */

import { Modal } from "@loltgt/ensemble-modal";


/**
 * Lightbox ensemble Component
 *
 * @class
 * @extends Modal
 * @inheritdoc
 * @param {Element} [element] An optional Element node for lightbox grouping
 * @param {object} options Options object
 * @param {string} [options.ns=modal] The namespace for lightbox
 * @param {string} [options.root=body] A root Element node
 * @param {string[]} [options.className=[modal, modal-lightbox]] The component CSS class name
 * @param {string} [options.selector] A selector to find elements
 * @param {object} [options.contents] An object with contents
 * @param {boolean} [options.effects=true] Allow effects
 * @param {boolean} [options.windowed=false] Allow framing in a window
 * @param {boolean} [options.clone=true] Allow clone of Element nodes
 * @param {boolean} [options.backdrop=true] Allow close on tap or click from outside the modal
 * @param {boolean} [options.keyboard=true] Allow keyboard navigation
 * @param {boolean} [options.navigation=true] Allow navigation
 * @param {boolean} [options.captions=true] Allow captions
 * @param {boolean} [options.infinite=true] Allow carousel alike loop navigation
 * @param {boolean} [options.autoDiscover=true] Allow auto-discover type of contents
 * @param {mixed} [options.autoHide=navigation] Allow auto-hide navigation or captions, boolean or string value, "true" for both
 * @param {mixed} [options.overlay=false] Allow overlay on navigation or captions, boolean or string value, "true" for both
 * @param {boolean} [options.checkOrigin=true] Allow check origin for URLs
 * @param {object} [options.close] Parameters for close button
 * @param {object} [options.prev] Parameters for button of previous arrow
 * @param {object} [options.next] Parameters for button of next arrow
 * @param {function} [options.onOpen] onOpen callback, on modal open
 * @param {function} [options.onClose] onOpen callback, on modal close
 * @param {function} [options.onShow] onShow callback, on modal show, after openes
 * @param {function} [options.onHide] onHide callback, on modal hide, before closes
 * @param {function} [options.onContent] onContent callback, on content shown
 * @param {function} [options.onStep] onStep callback, on slide step
 * @param {function} [options.onSlide] onSlide callback, on slide
 * @param {function} [options.onCaption] onCaption callback, on caption shown
 * @todo L10n and a11y
 * @example
 * var lightbox = new ensemble.Lightbox({contents: [{type: 'image', src: 'image.png'}]});
 * lightbox.open();
 */
class Lightbox extends Modal {

  /**
   * Default properties
   *
   * @returns {object}
   */
  _defaults() {
    return Object.assign(super._defaults(), {
      className: ['modal', 'modal-lightbox'],
      selector: '',
      contents: null,
      navigation: true,
      caption: true,
      infinite: true,
      autoDiscover: true,
      autoHide: 'navigation',
      overlay: false,
      checkOrigin: true,
      prev: {
        onclick: this.prev,
        innerText: '\u003C',
        ariaLabel: 'Previous'
      },
      next: {
        onclick: this.next,
        innerText: '\u003E',
        ariaLabel: 'Next'
      },
      onStep: function() {},
      onSlide: function() {},
      onCaption: function() {}
    });
  }

  /**
   * Methods binding
   */
  _bindings() {
    super._bindings();

    this.add = this.binds(this.add);
    this.remove = this.binds(this.remove);
    this.prev = this.binds(this.prev);
    this.next = this.binds(this.next);
  }

  /**
   * Constructor method
   *
   * @constructs
   */
  constructor() {
    if (! new.target) {
      throw 'Bad invocation. Must be called with `new`.';
    }

    super(...arguments);
  }

  /**
   * Element generator
   */
  generator() {
    super.generator();

    const modal = this.modal.wrap;
    const frame = this.frame;
    const opts = this.options;

    const gallery = this.gallery = this.compo(false, 'gallery');
    frame.append(gallery);

    if (opts.navigation) {
      var nav = this.nav = this.data(true);
      const wrap = nav.wrap = this.compo(false, 'nav');
      const prev = nav.prev = this.compo('button', ['button', 'prev'], opts.prev);
      const next = nav.next = this.compo('button', ['button', 'next'], opts.next);

      wrap.append(prev);
      wrap.append(next);
    }

    if (opts.captions) {
      var captions = this.captions = this.data(true);
      captions.wrap = this.compo(false, 'captions');
    }
    if (opts.overlay) {
      const overlay = opts.overlay.toString().match(/captions|navigation/);
      modal.classList.add(opts.ns + '-overlay');

      if (overlay) {
        modal.classList.add(opts.ns + '-overlay-' + overlay[0]);
      }
    }
    if (opts.autoHide) {
      const autohide = opts.autoHide.toString().match(/captions|navigation/);
      modal.classList.add(opts.ns + '-autohide');

      if (autohide) {
        modal.classList.add(opts.ns + '-autohide-' + autohide[0]);
      }
    }

    if (opts.windowed) {
      opts.navigation && frame.append(nav.wrap);
      opts.captions && frame.append(captions.wrap);
    } else {
      opts.navigation && modal.append(nav.wrap);
      opts.captions && modal.append(captions.wrap);
    }
  }

  /**
   * On this stage the component is populated with progeny
   *
   * @param {Element} target The element is invoking
   */
  populate(target) {
    console.log('populate', target);

    const opts = this.options, el = this.element;
    let contents;

    if (opts.contents && typeof opts.contents == 'object') {
      contents = opts.contents;
    } else if (opts.selector && el) {
      contents = this.selector(opts.selector, el, true);
    }
    contents = this.contents = this.prepare(contents);

    for (const obj of contents) {
      const content = this.content(obj);

      if (target && target === content.ref) {
        this.index = contents.indexOf(content);
        this.current = content;
      }

      this.add(content);
    }

    this.current = this.current || contents[0];
    this.index = this.index || 0;
    this.slide(0);

    opts.navigation && this.navigation();
    opts.captions && this.caption();
  }

  /**
   * Processing when the component is resumed
   *
   * @param {Element} target The element is invoking
   */
  resume(target) {
    console.log('resume', target);

    const opts = this.options;
    const contents = this.contents;

    for (const content of contents) {
      content.wrap.hide();

      if (target && target === content.ref) {
        this.index = contents.indexOf(content);
        this.current = content;
      }
    }

    this.current = this.current || contents[0];
    this.index = this.index || 0;
    this.slide(0);

    opts.navigation && this.navigation();
    opts.captions && this.caption();
  }

  /**
   * The single content
   *
   * @see window.origin
   * @see window.location
   * @see URL()
   *
   * @param {mixed} src A URL source or an ensemble Data object
   * @param {boolean} clone Clones the whole Element node tree
   * @returns {Data} data An ensemble Data instance
   */
  content(src, clone) {
    const opts = this.options;
    const wrap = this.compo(false, 'object');
    wrap.hide();

    var data;

    if (typeof src == 'string') {
      data = this.data({src});
    } else {
      data = src;
    }

    const srcref = data.src;
    const srctype = data.type;
    let mtype = data.type;

    if (mtype) {
      mtype = mtype.match(/(^image|video|audio)|(pdf$)/);
      mtype = mtype ? mtype[0] : '';
    }

    const xnref = /^https?:\/\//.test(srcref);
    let bsrc = false;
    let mfn;

    if (opts.autoDiscover && srcref && ! mtype) {
      if (/\.jpg|\.jpeg|\.png|\.apng|\.gif|\.webp|\.avif|\.bmp|\.svg$/i.test(srcref)) {
        mtype = 'image';
      } else if (/\.pdf$/.test(srcref)) {
        mtype = 'pdf';
      } else if (/\.mp4|\.webm|\.ogv|\.m4v|\.hevc|\.ivf|\.obu|\.ismv|\.mkv$/i.test(srcref)) {
        mtype = 'video';
      } else if (/\.mp3|\.opus|\.ogg|\.m4a|\.aac|\.flac|\.wav|\.weba|\.mka$/i.test(srcref)) {
        mtype = 'audio';
      } else if (/^data:image\/jpeg|png|apng|gif|webp|avif|bmp|svg\+xml/.test(srcref)) {
        bsrc = true;
        mtype = 'image';
      }
    }
    if (mtype == 'pdf') {
      mtype = 'iframe';
      mfn = 'pdf';
    }
    //TODO backward compatibility
    if (opts.checkOrigin && srcref && xnref && ! bsrc) {
      const a = window.origin != 'null' ? window.origin : window.location.origin;
      const b = new URL(srcref).origin;

      if (a != b) {
        mtype = '';
      }
    }

    if (srcref && ! mtype) {
      //TODO href
      if (srcref[0] == '#') {
        const node = this.selector(srcref);

        if (node) {
          data.node = node;

          if (/iframe|img|picture|video|audio/i.test(node.nodeName)) {
            if (/img|picture/i.test(node.nodeName)) {
              mtype = 'image';
            } else {
              mtype = node.nodeName.toLowerCase();
            }
          } else {
            mtype = 'element';
          }
        }
      } else {
        mtype = 'iframe';
      }
    }
    if (mtype == 'element') {
      clone = typeof clone != 'undefined' ? clone : opts.clone;
      data.node = clone ? this.cloneNode(data.node, true) : data.node;
    }
    if (! mfn && srctype != mtype) {
      mfn = srctype;
    }

    data.ref = data.ref || null;
    data.type = mtype;
    data.src = srcref;

    opts.onContent.call(this, this, data);

    if (mtype) {
      wrap.classList.add(opts.ns + '-' + mtype);
    }
    if (mfn) {
      wrap.classList.add(opts.ns + '-' + mfn);
    }

    const inner = this.inner(data);

    data.fresh = function() {
      data.node && data.inner.fill(data.node);
      data.wrap.show();
    };
    data.stale = function() {
      data.node && data.inner.empty();
      data.wrap.hide();
    }
    data.wrap = wrap;
    data.inner = data.compo(inner.tag, inner.name, inner.props, true, data.fresh, data.stale);

    return data;
  }

  /**
   * Detects and handles inner contents
   *
   * @param {Data} data An ensemble Data instance
   * @param {ref} data.ref A reference to Element found by selector
   * @param {type} data.type Content type
   * @param {src} data.src Content source URL
   * @param {Element} [data.node] A valid Element node that will be pushed
   * @param {function} data.fresh fresh callback, on content load
   * @param {function} data.stale stale callback, on content unload
   * @param {Compo} data.wrap The main composition of content
   * @param {mixed} data.inner The inner content, Object placeholder or ensemble Compo
   * @returns {object} props Properties for composition 
   */
  inner(data) {
    let tag = data.type;
    let name = true;
    let props = {};

    for (const prop in data) {
      if (! /ref|src|type|sources|subtitles|children/.test(prop) && prop[0] != '_') {
        props[prop] = data[prop];
      }
    }

    if (data.src) {
      props.src = data.src;
    }

    switch (data.type) {
      case 'image':
        tag = 'img';

        if (data.sources || data.children) {
          tag = 'picture';

          props.children = [];

          if (data.sources && typeof data.source == 'object') {
            for (const source of data.sources) {
              props.children.push({tag: 'source', name: true, props: source});
            }
          } else if (data.children && data.children.length) {
            for (const child of data.children) {
              const tag = child.tagName.toLowerCase();

              if (tag != 'source' || tag != 'img') {
                continue;
              }

              props.children.push({tag: tag, name: true, props: child.attributes});
            }
          }
        }

        break;

      case 'video':
      case 'audio':
        props.controls = data.controls ? data.controls : true;
        props.children = [];

        if (data.sources && typeof data.sources == 'object') {
          for (const source of data.sources) {
            props.children.push({tag: 'source', name: true, props: source});
          }

          if (data.subtitles && typeof data.subtitles == 'object') {
            for (const track of data.subtitles) {
              props.children.push({tag: 'track', name: true, props: track});
            }
          }
        } else if (data.children && data.children.length) {
            for (const child of data.children) {
              const tag = child.tagName.toLowerCase();

              if (tag != 'source' || tag != 'track') {
                continue;
              }

              props.children.push({tag: tag, name: true, props: child.attributes});
            }
        }

        break;

      case 'iframe':
        if (! props.src) return null;

        break;

      default:
        tag = 'div';
        name = 'custom-element';
    }

    return {tag, name, props};
  }

  /**
   * The content preparation stage
   *
   * @param {object} contents Passed object of contents
   * @returns {array} An array of contents
   */
  prepare(contents) {
    const a = [];

    if (contents && typeof contents == 'object' && contents.length) {
      for (const obj of contents) {
        //TODO nodeName
        if (typeof obj == 'object' && 'nodeName' in obj) {
          const data = this.data(true);
          const dc = obj.dataset;

          Object.assign(data, dc);

          data.ref = obj;

          if (dc.sources) {
            try {
              data.sources = JSON.parse(dc.sources);
            } catch {}
          }
          if (obj.href) {
            data.src = obj.href;
          } else if (dc.href) {
            data.src = dc.href;
          } else if (/iframe|img|picture|video|audio/i.test(obj.nodeName)) {
            const tag = obj.nodeName.toLowerCase();

            if (/img|picture/.test(tag)) {
              data.type = 'image';
            } else {
              data.type = tag;
            }
            if (tag != 'iframe' && obj.children && obj.children.length) {
              data.children = obj.children;
            }
          } else {
            data.type = 'element';
            data.node = obj;
          }
          if (dc.caption) {
            data.caption = dc.caption;
          }

          a.push(data);
        } else if (typeof obj == 'string') {
          a.push(obj);
        } else if ('type' in obj && /(^element|iframe|image|video|audio|pdf)/.test(obj.type)) {
          a.push(this.data(obj));
        } else {
          a.push(this.data(true));
        }
      }
    }

    return a;
  }

  /**
   * Adds a content
   *
   * @param {Compo} content An ensemble Compo component
   */
  add(content) {
    this.gallery.append(content.wrap);

    this.options.navigation && this.navigation();
  }

  /**
   * Removes a content
   *
   * @param {eCompo} content An ensemble Compo component
   */
  remove(content) {
    this.gallery.remove(content.wrap);

    this.options.navigation && this.navigation();
  }

  /**
   * Steps to previous slide
   *
   * @param {Event} evt An Event
   */
  prev(evt) {
    this.event(evt);

    this.slide(-1);
  }

  /**
   * Steps to next slide
   *
   * @param {Event} evt An Event
   */
  next(evt) {
    this.event(evt);

    this.slide(1);
  }

  /**
   * Moves to previous or next slide
   *
   * @param {int} step Step to: previous = -1, next = 1
   */
  slide(step) {
    const opts = this.options;

    if (! opts.infinite && this.stepper != 0 && this.stepper === step) {
      return;
    }

    const contents = this.contents;
    let index = this.index;
    let current = this.current;
    let adjacent = current;

    opts.onStep.call(this, this, current, step);

    if (step != 0) {
      const len = contents.length - 1;
      const sibling = step === -1 ? contents[index - 1] : contents[index + 1];
      const child = step === -1 ? contents[len] : contents[0];

      adjacent = !! sibling ? sibling : child;
      index = !! sibling ? (step === -1 ? index - 1 : index + 1) : (step === -1 ? len : 0);

      current.stale('inner');
    }

    if (! opts.infinite) {
      let stepper = 0;

      if (! adjacent.wrap.previous) {
        stepper = -1;
      } else if (! adjacent.wrap.next) {
        stepper = 1;
      }

      this.stepper = parseInt(stepper);

      if (opts.navigation) {
        this.navigation(stepper);
      }
    }

    adjacent.render('inner');
    adjacent.wrap.append(adjacent.inner);

    opts.onSlide.call(this, this, current, step, (current.wrap != adjacent.wrap ? adjacent.wrap : null));

    this.delay(function() {
      step != 0 && current.wrap.remove(current.inner);
    }, current.wrap);

    this.index = index;
    this.current = contents[index];

    opts.captions && this.caption();
  }

  /**
   * Navigation controller
   *
   * @param {int} stepper Allow steps: 0 = both, next = -1, previous = 1
   */
  navigation(stepper) {
    const nav = this.nav;

    if (this.contents.length > 1) {
      nav.wrap.show();
    } else {
      nav.wrap.hide();

      return;
    }

    if (! this.options.infinite && typeof stepper != 'undefined') {
      switch (stepper) {
        case -1:
          nav.prev.disable();
          nav.next.enable();
          break;
        case 1:
          nav.prev.enable();
          nav.next.disable();
          break;
        default:
          nav.prev.enable();
          nav.next.enable();
      }
    }
  }

  /**
   * Inserts or overwrites caption text
   *
   * @param {string} text Text content
   */
  caption(text) {
    const opts = this.options;
    const captions = this.captions;
    const current = this.current;

    captions.wrap.empty();

    if (opts.onCaption(this, this, current, text)) {
      return;
    }

    if (! text) {
      if (current.caption) {
        text = current.caption;
      } else if (opts.selector) {
        const ref = current.ref;

        if (this.hasAttr(ref, 'title')) {
          text = this.getAttr(ref, 'title');
        } else if (current.type == 'image') {
          const img = this.selector('img', ref);
          text = img.alt;
        }
      }
    }

    if (text) {
      text = text.split(/\n\n|\r\n\r\n/);

      for (const line of text) {
        const caption = this.compo('p', false, {innerText: line});
        captions.wrap.append(caption);
      }
    }
  }

  /**
   * Handles keyboard inputs
   *
   * @param {Event} evt An Event
   * @todo i18n
   */
  keyboard(evt) {
    super.keyboard(evt);

    switch (evt.keyCode) {
      // Left
      case 37: this.prev(evt); break;
      // Right
      case 39: this.next(evt); break;
    }
  }

}


export { Lightbox, Modal };
