/*!
 * ensemble Lightbox
 *
 * @version 0.4.0
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
 * Lightbox ensemble component
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
 * @param {boolean} [options.dialog=true] Use HTMLDialogElement
 * @param {boolean} [options.modal=false] Allow modal mode
 * @param {boolean} [options.window=false] Allow window mode
 * @param {object} [options.icons] Set icons model
 * @param {string} [options.icons.type='text'] Set icons type: text, font, svg, symbol, shape
 * @param {string} [options.icons.prefix='icon'] Set icons CSS class name prefix, for icons: font
 * @param {string} [options.icons.src] Set icons SVG image src, for icons: svg
 * @param {boolean} [options.icons.autoDir] Set automatic invert arrow shape direction for ltr and rtl [i18n] 
 * @param {boolean} [options.effects=true] Allow effects
 * @param {boolean} [options.clone=true] Allow clone of Element nodes
 * @param {boolean} [options.backdrop=false] Allow backdrop, close on tap or click from outside the modal
 * @param {boolean} [options.keyboard=true] Allow keyboard navigation
 * @param {boolean} [options.touch=true] Allow touch navigation
 * @param {boolean} [options.mouse=true] Allow mouse navigation
 * @param {boolean} [options.arrows=true] Allow arrows on screen navigation
 * @param {boolean} [options.captions=true] Allow captions
 * @param {boolean} [options.infinite=true] Allow carousel alike loop navigation
 * @param {boolean} [options.autoDiscover=true] Allow auto-discover type of contents
 * @param {boolean|string} [options.autoHide='arrows'] Allow auto-hide "arrows" or "captions", "true" for both
 * @param {boolean|string} [options.overlay=false] Allow overlay for "arrows" or "captions", "true" for both
 * @param {boolean} [options.checkOrigin=true] Allow check origin for URLs
 * @param {object} [options.close] Parameters for close button
 * @param {function} [options.close.trigger] Function trigger, default to self.close
 * @param {object} [options.close.text] Icon text, for icons: text
 * @param {object} [options.close.icon] Icon name, symbol href, shape path, URL hash
 * @param {object} [options.prev] Parameters for previous button
 * @param {function} [options.prev.trigger] Function trigger, default to self.close
 * @param {string} [options.prev.text] Icon text, for icons: text
 * @param {string} [options.prev.icon] Icon name, symbol href, shape path, URL hash
 * @param {string} [options.prev.viewBox] Icon SVG viewBox
 * @param {object} [options.next] Parameters for next button
 * @param {function} [options.next.trigger] Function trigger, default to self.close
 * @param {string} [options.next.text] Icon text, for icons: text
 * @param {string} [options.next.icon] Icon name, symbol href, shape path, URL hash
 * @param {string} [options.next.viewBox] Icon SVG viewBox
 * @param {object} [options.locale] Localization strings
 * @param {function} [options.onOpen] onOpen callback, on modal open
 * @param {function} [options.onClose] onOpen callback, on modal close
 * @param {function} [options.onShow] onShow callback, on modal show, after openes
 * @param {function} [options.onHide] onHide callback, on modal hide, before closes
 * @param {function} [options.onContent] onContent callback, on content layout
 * @param {function} [options.onStep] onStep callback, on slide step
 * @param {function} [options.onSlide] onSlide callback, on slide
 * @param {function} [options.onCaption] onCaption callback, on caption shown
 * @param {function} [options.onInit] onInit callback, on component initialization
 * @param {function} [options.onResume] onResume callback, on component resuming
 * @example
 * const lightbox = new ensemble.Lightbox({contents: [{type: "image", src: "image.png", alt: "Image"}]});
 * lightbox.open();
 */
class Lightbox extends Modal {

  /**
   * Default properties
   *
   * @returns {object}
   */
  defaults() {
    return Object.assign(super.defaults(), {
      className: ['modal', 'modal-lightbox'],
      modal: false,
      icons: {
        type: 'shape',
        prefix: 'icon',
        autoDir: true
      },
      selector: '',
      contents: null,
      backdrop: false,
      touch: true,
      mouse: true,
      arrows: true,
      captions: true,
      infinite: true,
      autoDiscover: true,
      autoHide: 'arrows',
      overlay: false,
      checkOrigin: true,
      prev: {
        trigger: this.prev,
        text: '\u003C',
        icon: 'm5 12 9 10-9-10 9-10-9 10Z',
        viewBox: '0 0 18 24'
      },
      next: {
        trigger: this.next,
        text: '\u003E',
        icon: 'M14 12 4 22l10-10L4 2l10 10Z',
        viewBox: '0 0 18 24'
      },
      locale: {
        close: 'Close',
        prev:  'Previous',
        next: 'Next'
      },
      onStep: () => {},
      onSlide: () => {},
      onCaption: () => {}
    });
  }

  /**
   * Methods binding
   */
  binds() {
    super.binds();

    this.add = this.wrap(this.add);
    this.remove = this.wrap(this.remove);
    this.prev = this.wrap(this.prev);
    this.next = this.wrap(this.next);
    this.route = this.wrap(this.route);
  }

  /**
   * Constructor
   *
   * @constructs
   */
  constructor() {
    super(...arguments);
  }

  /**
   * Initializes the component
   *
   * @emits #options.onInit
   *
   * @param {Element} target The element is invoking
   */
  init(target) {
    const {options: opts, element: el} = this;

    this.layout();

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

    opts.arrows && this.arrows();
    opts.captions && this.caption();

    /**
     * @event #options.onInit
     * @type {function}
     * @param {object} this
     * @param {Element} target
     */
    opts.onInit.call(this, this, target);
  }

  /**
   * Processing on component resume
   *
   * @emits #options.onResume
   *
   * @param {Element} target The element is invoking
   */
  resume(target) {
    const {options: opts, contents, current} = this;

    current.$.remove(current.inner);

    for (const content of contents) {
      if (target && target === content.ref) {
        this.index = contents.indexOf(content);
        this.current = content;
      }
    }

    this.current = this.current || contents[0];
    this.index = this.index || 0;
    this.slide(0);

    if (opts.arrows && this.dir != this.bidi)
      this.buttons();

    opts.arrows && this.arrows();
    opts.captions && this.caption();

    /**
     * @event #options.onResume
     * @type {function}
     * @param {object} this
     * @param {Element} target
     */
    opts.onResume.call(this, this, target);
  }

  /**
   * Lead layout
   */
  layout() {
    super.layout();

    const modal = this.modal.$;
    const {stage, options: opts, nav} = this;

    this.bidi = this.dir;

    let props = null;

    //TODO iframe layer
    if (opts.touch || opts.mouse) {
      const pointers = this.pointers();

      props = {
        ...opts.touch && {
          ontouchstart: pointers.hit,
          ontouchend: pointers.drop,
          ontouchover: pointers.drop,
          ontouchcancel: pointers.nil
        },
        ...opts.mouse && {
          onmousedown: pointers.hit,
          onmouseup: pointers.drop,
          onmousecancel: pointers.nil
        }
      };
    }

    const content = this.$ = this.compo(false, 'content', props);
    stage.append(content);

    if (opts.arrows) {
      nav.$ = this.compo('nav', 'nav');
      this.buttons();
    }

    if (opts.captions) {
      var captions = this.captions = this.data(true);
      captions.$ = this.compo(false, 'captions');
    }

    const regexp = /captions|arrows/;

    if (opts.overlay) {
      const overlay = opts.overlay.toString().match(regexp);
      modal.classList.add(`${opts.ns}-overlay`);

      if (overlay) {
        modal.classList.add(`${opts.ns}-overlay-${overlay[0]}`);
      }
    }
    if (opts.autoHide) {
      const autohide = opts.autoHide.toString().match(regexp);
      modal.classList.add(`${opts.ns}-autohide`);

      if (autohide) {
        modal.classList.add(`${opts.ns}-autohide-${autohide[0]}`);
      }
    }

    if (opts.window) {
      opts.arrows && stage.append(nav.$);
      opts.captions && stage.append(captions.$);
    } else {
      opts.arrows && modal.append(nav.$);
      opts.captions && modal.append(captions.$);
    }
  }

  /**
   * The content
   *
   * @emits #options.onContent
   *
   * @param {mixed} source A URL or an ensemble Data object
   * @param {boolean} clone Clones the whole Element node tree
   * @returns {Data} data An ensemble Data instance
   */
  content(source, clone) {
    const opts = this.options;
    const compo = this.compo(false, 'object');
    compo.hide();

    let data;

    if (typeof source == 'string') {
      data = this.data({source});
    } else {
      data = source;
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

    if (opts.checkOrigin && srcref && xnref && ! bsrc && ! this.origin(srcref)) {
      mtype = '';
    }

    if (srcref && ! mtype) {
      if (srcref[0] == '#') {
        const node = this.selector(srcref);

        if (node) {
          data.node = node;

          // ref nodeName
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
      clone = clone ?? opts.clone;
      data.node = clone ? this.cloneNode(data.node, true) : data.node;
    }
    if (! mfn && srctype != mtype) {
      mfn = srctype;
    }

    data.ref = data.ref || null;
    data.type = mtype;
    data.src = srcref;

    /**
     * @event #options.onContent
     * @type {function}
     * @param {object} this
     * @param {mixed} data
     */
    opts.onContent.call(this, this, data);

    if (mtype) {
      compo.classList.add(`${opts.ns}-${mtype}`);
    }
    if (mfn) {
      compo.classList.add(`${opts.ns}-${mfn}`);
    }

    const inner = this.inner(data);

    data.load = () => {
      data.node && data.inner.fill(data.node);
      data.$.show();
    };
    data.unload = () => {
      data.node && data.inner.empty();
      data.$.hide();
    }
    data.$ = compo;
    data.inner = data.compo(inner.tag, inner.name, inner.props, true, data.load, data.unload);

    return data;
  }

  /**
   * Detects and handles inner contents
   *
   * @param {Data} data An ensemble Data instance
   * @param {ref} [data.ref] A reference to Element found by selector
   * @param {type} [data.type] Content type
   * @param {src} [data.src] Content source URL
   * @param {Element} [data.node] A valid Element node that will be pushed
   * @param {function} [data.load] load callback, on content load
   * @param {function} [data.unload] unload callback, on content unload
   * @param {Compo} [data.compo] The main compo of content
   * @param {mixed} [data.inner] The inner content, Object placeholder or compo
   * @returns {object} props Properties for compo
   */
  inner(data) {
    let tag = data.type;
    let name = false;
    let props = {};

    for (const prop in data) {
      // _ circular
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
              props.children.push({tag: 'source', name: false, props: source});
            }
          } else if (data.children && data.children.length) {
            for (const child of data.children) {
              const tag = child.tagName.toLowerCase();

              if (tag != 'source' || tag != 'img')
                continue;

              props.children.push({tag, name: false, props: child.attributes});
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
            props.children.push({tag: 'source', name: false, props: source});
          }

          if (data.subtitles && typeof data.subtitles == 'object') {
            for (const track of data.subtitles) {
              props.children.push({tag: 'track', name: false, props: track});
            }
          }
        } else if (data.children && data.children.length) {
            for (const child of data.children) {
              const tag = child.tagName.toLowerCase();

              if (tag != 'source' || tag != 'track')
                continue;

              props.children.push({tag, name: false, props: child.attributes});
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
   * Prepares contents object
   *
   * @param {object} contents Passed object of contents
   * @returns {array} Array of contents
   */
  prepare(contents) {
    const a = [];

    if (contents && typeof contents == 'object' && contents.length) {
      for (const obj of contents) {
        // ref nodeType
        if (typeof obj == 'object' && obj.nodeType) {
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
          // ref nodeName
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
   * @param {Compo} content A compo
   */
  add(content) {
    this.$.append(content.$);

    this.options.arrows && this.arrows();
  }

  /**
   * Removes a content
   *
   * @param {Compo} content A compo
   */
  remove(content) {
    this.$.remove(content.$);

    this.options.arrows && this.arrows();
  }

  /**
   * Steps to previous slide
   *
   * @param {Event} evt An Event
   */
  prev(evt) {
    this.event().prevent(evt);

    this.slide(-1);

    this.event().blur(evt);
  }

  /**
   * Steps to next slide
   *
   * @param {Event} evt An Event
   */
  next(evt) {
    this.event().prevent(evt);

    this.slide(1);

    this.event().blur(evt);
  }

  /**
   * Steps based on language text direction [i18n]
   *
   * @param {Event} evt An Event
   * @param {number} step Step to: previous = -1, next = 1
   */
  route(evt, step) {
    step = this.dir == 'rtl' ? ! (step > 0) : step > 0;

    this[step ? 'next' : 'prev'](evt);
  }

  /**
   * Moves to previous or next slide
   *
   * @emits #options.onStep
   * @emits #options.onSlide
   *
   * @param {number} step Step to: previous = -1, next = 1
   */
  slide(step) {
    const {options: opts, stepper, contents} = this;

    if (! opts.infinite && stepper != 0 && stepper === step)
      return;

    let {index, current} = this;
    let adjacent = current;

    /**
     * @event #options.onStep
     * @type {function}
     * @param {object} this
     * @param {Compo} current
     * @param {number} step
     */
    opts.onStep.call(this, this, current, step);

    if (contents.length == 0)
      return;

    if (step != 0) {
      const len = contents.length;
      const sibling = step === -1 ? contents[index - 1] : contents[index + 1];
      const child = step === -1 ? contents[len - 1] : contents[0];

      adjacent = !! sibling ? sibling : child;
      index = !! sibling ? (step === -1 ? index - 1 : index + 1) : (step === -1 ? len - 1 : 0);

      current.unload('inner');
    }

    if (! opts.infinite) {
      let stepper = 0;

      if (! adjacent.$.previous) {
        stepper = -1;
      } else if (! adjacent.$.next) {
        stepper = 1;
      }

      this.stepper = parseInt(stepper);

      opts.arrows && this.arrows(stepper);
    }

    adjacent.render('inner');
    adjacent.$.append(adjacent.inner);

    /**
     * @event #options.onSlide
     * @type {function}
     * @param {object} this
     * @param {Compo} current
     * @param {number} step
     * @param {?Compo} adjacent
     */
    opts.onSlide.call(this, this, current, step, (current.$ != adjacent.$ ? adjacent.$ : null));

    step != 0 && current.$.remove(current.inner);

    this.index = index;
    this.current = contents[index];

    opts.captions && this.caption();
  }

  /**
   * Arrows navigation controller
   *
   * @param {number} stepper Allow steps: 0 = both, next = -1, previous = 1
   */
  arrows(stepper) {
    const {options: opts, nav} = this;

    if (this.contents.length > 1) {
      nav.$.show();
    } else {
      nav.$.hide();

      return;
    }

    if (! opts.infinite && typeof stepper != 'undefined') {
      const {prev, next} = nav;

      switch (stepper) {
        case -1: prev.disable(), next.enable(); break;
        case 1: prev.enable(), next.disable(); break;
        default: prev.enable(), next.enable();
      }
    }
  }

  /**
   * Caption text controller
   *
   * @emits #options.onCaption
   *
   * @param {string} text Text content
   */
  caption(text) {
    const {options: opts, captions, current} = this;

    captions.$.empty();

    /**
     * @event #options.onCaption
     * @type {function}
     * @param {object} this
     * @param {Compo} current
     * @param {string} text
     * @returns {boolean} Discard caption
     */
    if (opts.onCaption.call(this, this, current, text))
      return;

    if (! text) {
      if (current.caption) {
        text = current.caption;
      } else if (opts.selector) {
        const {ref} = current;

        if (this.hasAttr(ref, 'title')) {
          text = this.getAttr(ref, 'title');
        } else if (current.type == 'image') {
          const img = this.selector('img', ref);
          if (img) text = img.alt;
        }
      }
    }

    if (text) {
      text = text.split(/\n{2}/);

      for (const line of text) {
        const caption = this.compo('p', false, {innerText: line});
        captions.$.append(caption);
      }
    }
  }

  /**
   * Arrow buttons
   */
  buttons() {
    const {options: opts, nav} = this;
    const {icons, locale} = opts;

    nav.$.empty();

    for (let i = 0; i < 2; i++) {
      const prev = 'prev', next = 'next';
      const path = i ? next : prev;
      const ipath = icons.autoDir && this.dir == 'rtl' ? i ? prev : next : path;
      const button = nav[path] = this.compo('button', ['button', path], {
        onclick: opts[path].trigger,
        innerText: icons.type == 'text' ? opts[ipath].text : '',
        ariaLabel: locale[path]
      });

      if (opts.icons != 'text') {
        const {type, prefix, src, viewBox} = icons;
        const {icon: ref, viewBox: v} = opts[ipath];
        const icon = this.icon(type, type == 'font' ? ref : path, prefix, src ?? ref, ref ?? ipath, v ?? viewBox);
  
        button.append(icon);
      }

      nav.$.append(button);
    }
  }

  /**
   * Pointer events
   *
   * @see TouchEvent
   * @see MouseEvent
   *
   * @mixin
   * @return {object}
   */
  pointers() {
    const self = this;
    const time_thresold = 100;
    const move_thresold = 45;
    let t = 0;
    let x = 0;
    let y = 0;

    return {
      /**
       * Hit event handler
       *
       * @param {Event} evt
       */
      hit(evt) {
        const h = evt.changedTouches;
        const s = h ? h[0] : evt;
        t = evt.timeStamp;
        x = s.screenX;
        y = s.screenY;
      },
      /**
       * Drop event handler
       *
       * @param {Event} evt
       */
      drop(evt) {
        const h = evt.changedTouches;
        const s = h ? h[0] : evt;
        const xx = s.screenX - x;
        const yy = s.screenY - y;
        const rx = Math.abs(xx / yy);
        const ry = Math.abs(yy / xx);

        if (! h) {
          const diff = evt.timeStamp - t;

          if (diff < time_thresold)
            return;
        }
        {
          const diff = Math.abs(rx > ry ? xx : yy);

          if (diff < move_thresold)
            return;
        }

        if (rx > ry) {
          self.route(evt, xx >= 0 ? -1 : 1);
        }
      },
      /**
       * Nullish event handler
       *
       * @param {Event} evt
       */
      nil(evt) {
        y = x = t = 0;
      }
    };
  }

  /**
   * Handles keyboard inputs
   *
   * @param {Event} evt An Event
   */
  keyboard(evt) {
    super.keyboard(evt);

    switch (evt.keyCode) {
      case 37:
      case 39:
        this.event().prevent(evt);

      // Left
      case 37: this.route(evt, -1); break;
      // Right
      case 39: this.route(evt, 1); break;
    }

    if (this.options.autoHide) {
      const modal = this.modal.$;
      const cssName = 'modal-autohide';
      modal.classList.remove(cssName);
      this.delay(() => modal.classList.add(cssName));
    }
  }

  /**
   * Getter for language text direction [i18n]
   *
   * @see document.dir
   *
   * @returns {string} Text direction
   */
  get dir() {
    return document.dir; // [DOM]
  }

}


export { Lightbox, Modal };
