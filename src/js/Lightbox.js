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

import { Modal } from 'ensemble-modal';


/**
 * Lightbox ensemble component
 *
 * @class
 * @extends Modal
 * @inheritdoc
 * @param {Element} [element] An optional Element node for lightbox grouping
 * @param {object} [options] Options object
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
 * @param {boolean} [options.controls=true] Allow controls on screen navigation
 * @param {boolean} [options.caption=true] Allow content caption
 * @param {boolean} [options.infinite=true] Allow carousel alike loop navigation
 * @param {boolean} [options.autoDiscover=true] Allow auto-discover type of contents
 * @param {boolean|string} [options.autoHide='controls'] Allow auto-hide "controls" or "caption", (true) for both
 * @param {boolean|string} [options.overlay=false] Allow overlay for "controls" or "caption", (true) for both
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
      controls: true,
      caption: true,
      infinite: true,
      autoDiscover: true,
      autoHide: 'controls',
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

      this.$.append(content.$);
    }

    this.step(0);

    /**
     * options.onInit callback
     * @event #options.onInit
     * @type {function}
     * @param {object} this This component object
     * @param {Element} target The element is invoking
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

    if (opts.controls && this.dir != this.bidi)
      this.arrows();

    this.step(0);

    /**
     * options.onResume callback
     * @event #options.onResume
     * @type {function}
     * @param {object} this This component object
     * @param {Element} target The element is invoking
     */
    opts.onResume.call(this, this, target);
  }

  /**
   * Lead layout
   */
  layout() {
    super.layout();

    const {$: modal, body} = this.modal;
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

    if (opts.controls) {
      nav.$ = this.compo('nav', 'nav');
      this.arrows();
    }

    if (opts.caption) {
      var heading = this.heading = this.data(true);
      heading.$ = this.compo(false, 'caption');
    }

    const regexp = /caption|controls/;

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

    opts.controls && body.append(nav.$);
    opts.caption && body.append(heading.$);
  }

  /**
   * The content
   *
   * @emits #options.onContent
   *
   * @param {mixed} source A URL or data object
   * @param {boolean} clone Clones inner nodes
   * @returns {Data} data Content data object
   */
  content(source, clone) {
    const opts = this.options;
    const compo = this.compo(false, 'object');
    compo.hide();

    let data;

    if (typeof source == 'string') {
      data = this.data({source});
    } else if (this.data().isData(source)) {
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

    const ref = data.ref;
    let alt, title, caption = data.caption;

    if (opts.selector && ref) {
      if (this.hasAttr(ref, 'title')) {
        title = this.getAttr(ref, 'title');
      } else if (data.type == 'image') {
        const img = this.selector('img', ref);
        if (img) alt = img.alt;
      }
    }

    data.caption = caption || title || alt;

    if (data.type == 'image') {
      data.alt = alt || caption.replace(/\n/g, ' ');
    }

    /**
     * options.onContent callback
     * @event #options.onContent
     * @type {function}
     * @param {object} this This component object
     * @param {Data} data Content data object
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
   * Handles inner contents
   *
   * @param {Data} data Content data object
   * @param {ref} data.ref A reference to Element found by selector
   * @param {type} data.type Content type
   * @param {src} data.src Content source URL
   * @param {Element} data.node A valid Element node that will be pushed
   * @param {function} data.load load callback, on content load
   * @param {function} data.unload unload callback, on content unload
   * @param {Compo} data.compo The main compo of content
   * @param {mixed} data.inner The inner content, placeholder or compo
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
   * @param {object} contents Contents object
   * @returns {array} Array of content objects
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
   * Transforms item to content
   *
   * @param {object} item Content object
   * @returns {Data} Content data object
   */
  modus(item) {
    if (! this.data().isData(item)) {
      const obj = this.prepare([item]);
      item = this.content(obj[0]);
    }

    return item.$ ? item : null;
  }

  /**
   * Adds a content
   *
   * @param {object} item Content object
   */
  add(item) {
    const content = modus(item);

    if (content) {
      this.contents.push(content);
      this.$.append(content.$);
    }

    this.options.controls && this.controls();
  }

  /**
   * Removes a content
   *
   * @param {object} item Content object
   */
  remove(item) {
    const content = modus(item);

    if (content) {
      const index = this.contents.indexOf(content);

      if (index != -1) {
        this.contents.splice(index, 1);
        this.$.remove(content.$);
      }
    }

    this.options.controls && this.controls();
  }

  /**
   * Steps to previous content
   *
   * @param {Event} evt An Event
   */
  prev(evt) {
    this.event().prevent(evt);

    this.step(-1);

    this.event().blur(evt);
  }

  /**
   * Steps to next content
   *
   * @param {Event} evt An Event
   */
  next(evt) {
    this.event().prevent(evt);

    this.step(1);

    this.event().blur(evt);
  }

  /**
   * Steps based on language text direction [i18n]
   *
   * @param {Event} evt An Event
   * @param {number} point Step to: previous = -1, next = 1
   */
  route(evt, point) {
    point = this.dir == 'rtl' ? ! (point > 0) : point > 0;

    this[point ? 'next' : 'prev'](evt);
  }

  /**
   * Steps to previous or next content
   *
   * @emits #options.onStep
   *
   * @param {number} point Step to: previous = -1, next = 1, null = 0
   */
  step(point) {
    const {options: opts, contents} = this;
  
    if (point === 0) {
      this.current = this.current || contents[0];
      this.index = this.index || 0;
    }

    let {index, current, abs} = this;
    const len = contents.length;

    /**
     * options.onStep callback
     * @event #options.onStep
     * @type {function}
     * @param {object} this This component object
     * @param {number} point Step to: previous = -1, next = 1, null = 0
     * @param {Data} current Current content
     * @returns {boolean} Force move
     */
    if (! opts.onStep.call(this, this, point, current)) {
      if (len == 0)
        return;
      if (! opts.infinite && abs != 0 && abs === point)
        return;
    }

    if (point != 0) {
      const sibling = point === -1 ? contents[index - 1] : contents[index + 1];
      index = !! sibling ? (point === -1 ? index - 1 : index + 1) : (point === -1 ? len - 1 : 0);
    }

    this.slide(index);
  }

  /**
   * Slides to index content
   *
   * @emits #options.onSlide
   *
   * @param {number} index Slide to index
   */
  slide(index) {
    const {options: opts, contents} = this;

    const len = contents.length;
    let previous = this.current;
    let content = contents[index];
    let move = previous != content;

    if (len == 0 || ! content)
      return;

    move && previous.unload('inner');

    if (! opts.infinite) {
      let abs = 0;

      if (! content.$.previous)
        abs = -1;
      else if (! content.$.next)
        abs = 1;

      this.abs = abs;

      opts.controls && this.controls(abs);
    }

    content.render('inner');
    content.$.append(content.inner);

    /**
     * options.onSlide callback
     * @event #options.onSlide
     * @type {function}
     * @param {object} this This component object
     * @param {Data} content New current content
     * @param {Data} previous Previous content
     */
    opts.onSlide.call(this, this, content, previous);

    move && previous.$.remove(previous.inner);

    this.index = index;
    this.current = content;

    opts.caption && this.caption();
    opts.autoHide && this.autoHide(content);
  }

  /**
   * Auto-hide controller
   *
   * When called with "content" argument, locks auto-hide for type = iframe;
   * without "content" argument, kicks auto-hide to regain focus.
   *
   * @param {Data} [content] Content data object
   */
  autoHide(content) {
    const modal = this.modal.$;
    let cssName = 'modal-autohide';

    if (content && this.data().isData(content)) {
      if (/true|controls/.test(this.options.autoHide)) {
        cssName = `${cssName}-lock`;

        if (content.type == 'iframe')
          modal.classList.add(cssName);
        else if (modal.classList.contains(cssName))
          modal.classList.remove(cssName);
      }
    } else {
      modal.classList.remove(cssName);
      this.delay(() => modal.classList.add(cssName));
    }
  }

  /**
   * Controls navigation controller
   *
   * @param {number} abs Can step: 0 = both, next = -1, previous = 1
   */
  controls(abs) {
    const {options: opts, nav} = this;

    if (this.contents.length > 1) {
      nav.$.show();
    } else {
      nav.$.hide();

      return;
    }

    if (! opts.infinite && typeof abs != 'undefined') {
      const {prev, next} = nav;

      switch (abs) {
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
   * @param {string} text Text for caption
   */
  caption(text) {
    const {options: opts, heading, current} = this;

    heading.$.empty();

    text = text ?? current.caption;

    /**
     * options.onCaption callback
     * @event #options.onCaption
     * @type {function}
     * @param {object} this This component object
     * @param {Data} current Current content
     * @param {string} text Text for caption
     * @returns {boolean} Discard caption
     */
    if (opts.onCaption.call(this, this, current, text)) {
      return;
    }

    if (text) {
      text = text.split(/\n{2}/g);

      for (const line of text) {
        const caption = this.compo('p', false, {innerText: line});
        heading.$.append(caption);
      }
    }
  }

  /**
   * Arrow buttons
   */
  arrows() {
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

        const svg = icon.first;
        svg.setAttr('stroke', 'currentColor');
        svg.setAttr('stroke-width', '2px');

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
      // Left
      case 37: this.route(evt, -1); break;
      // Right
      case 39: this.route(evt, 1); break;
    }

    this.options.autoHide && this.autoHide();
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
