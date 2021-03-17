(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ensemble = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  'use strict';
  /*!
   * loltgt ensemble.Compo
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */
  // (function(window, module, require, ensemble) {

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Modal = _exports.Lightbox = void 0;
  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;

  class Compo {
    // #rejectedTagNames = /html|head|body|meta|link|style|script/i;
    // #rejectedTags = /(<(html|head|body|meta|link|style|script)*>)/i;
    // #deniedProps = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;
    //TODO
    // tag, name
    constructor(ns, tag, name, props) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      const ctag = name ? tag.toString() : 'div'; // if (this.#rejectedTagNames.test(ctag)) {

      if (REJECTED_TAG_NAMES.test(ctag)) {
        throw new Error(`ensemble.Compo error: The tag name provided (\'${ctag}\') is not a valid name.`);
      }

      const node = this[_ns] = document.createElement(ctag);
      this[_ns].__compo = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const cprop = prop.toString(); // if (this.#deniedProps.test(cprop)) {

          if (DENIED_PROPS.test(cprop)) {
            throw new Error(`ensemble.Compo error: The property name provided (\'${cprop}\')' is not a valid name.`);
          }

          if (cprop.indexOf('on') === 0 && props[cprop]) {
            node[cprop] = props[cprop].bind(this);
          } else if (typeof props[cprop] != 'object') {
            node[cprop] = props[cprop];
          } else if (cprop === 'children') {
            if (typeof props[cprop] == 'object' && props[cprop].length) {
              for (const child of props.children) {
                const tag = child.tag;
                const name = child.name;
                const props = child.props;
                this.append(new Compo(ns, tag, name, props));
              }
            }
          }
        }
      } //TODO args coherence


      if (name != false && name != true) {
        const _name = node.className;
        node.className = ns + '-' + tag;

        if (name) {
          node.className += ' ' + ns + '-' + name;
        }

        if (_name) {
          node.className += ' ' + _name;
        }
      }
    }

    install(root) {
      root.appendChild(this[this._ns]);
    }

    uninstall(root) {
      root.removeChild(this[this._ns]);
    }

    up(node) {
      this.node = Object.seal({
        ref: node
      });
      return !!node.replaceWith(this[this._ns]);
    } // return bool


    append(compo) {
      const _ns = this._ns;
      return !!this[_ns].appendChild(compo[_ns]);
    } // return bool


    prepend(compo) {
      const _ns = this._ns;
      return !!this[_ns].prependChild(compo[_ns]);
    } // return bool


    remove(compo) {
      const _ns = this._ns;
      return !!this[_ns].removeChild(compo[_ns]);
    } //TODO


    replace(compo) {} //TODO


    clone(deep = false) {}

    inject(node) {
      // if (node instanceof Element === false || this.#rejectedTagNames.test(node.tagName) || this.#rejectedTags.test(node.innerHTML)) {
      if (node instanceof Element === false || REJECTED_TAG_NAMES.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
        throw new Error('ensemble.Compo error: The remote object could not be resolved into a valid node.');
      }

      this.empty();
      this._node = this[this._ns].appendChild(node);
    }

    empty() {
      while (this.first) {
        this.remove(this.first);
      }
    }

    hasAttr(attr) {
      return this[this._ns].hasAttribute(attr);
    }

    getAttr(attr) {
      return this[this._ns].getAttribute(attr);
    } // return undef


    setAttr(attr, value) {
      this[this._ns].setAttribute(attr, value);
    } // return undef


    delAttr(attr) {
      this[this._ns].removeAttribute(attr);
    }

    getStyle(prop) {
      return window.getComputedStyle(this[this._ns])[prop];
    }

    show() {
      this[this._ns].hidden = false;
    }

    hide() {
      this[this._ns].hidden = true;
    }

    enable() {
      this[this._ns].disabled = false;
    }

    disable() {
      this[this._ns].disabled = true;
    }

    get children() {
      return Array.prototype.map.call(this[this._ns].children, node => {
        return node.__compo;
      });
    }

    get first() {
      const _ns = this._ns;
      return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
    }

    get last() {
      const _ns = this._ns;
      return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
    }

    get previous() {
      const _ns = this._ns;
      return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
    }

    get next() {
      const _ns = this._ns;
      return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
    }

    get classList() {
      return this[this._ns].classList;
    }

    static isCompo(node) {
      return Symbol.for(node) === Symbol.for(Compo.prototype);
    } //TODO undef


    get [Symbol.toStringTag]() {
      return 'ensemble.Compo';
    }

  }
  /*!
   * loltgt ensemble.Data
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  class Data {
    constructor(ns, obj) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      if (obj && typeof obj === 'object') {
        Object.assign(this, {}, obj);
      }

      const _ns = this._ns = '_' + ns;

      this[_ns] = {
        ns
      };
    }

    compo(tag, name, props, defer = false, fresh = false, stale = false) {
      const ns = this[this._ns].ns;
      let compo;

      if (defer) {
        compo = {
          ns,
          tag,
          name,
          props,
          fresh,
          stale
        };
      } else {
        compo = new Compo(ns, tag, name, props);
      }

      if (fresh && typeof fresh === 'function') {
        compo.fresh = props.onfresh = fresh;
      }

      if (stale && typeof stale === 'function') {
        compo.stale = props.onstale = stale;
      }

      return compo;
    }

    async render(slot) {
      const _ns = this._ns;

      if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].fresh();
      } else {
        this[_ns][slot] = {
          rendered: true,
          fresh: this[slot].fresh,
          stale: this[slot].stale,
          params: this[slot]
        };
        this[slot] = new Compo(this[slot].ns, this[slot].tag, this[slot].name, this[slot].props);

        this[_ns][slot].fresh();
      }
    }

    async stale(slot) {
      const _ns = this._ns;

      if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].stale();
      }
    }

    async reflow(slot, force) {
      const _ns = this._ns;

      if (force) {
        this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
      } else if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].fresh();
      }
    }

    static isData(node) {
      return Symbol.for(node) === Symbol.for(Data.prototype);
    }

    get [Symbol.toStringTag]() {
      return 'ensemble.Data';
    }

  }
  /*!
   * loltgt ensemble.Event
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  class Event {
    constructor(ns, name, node) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document;
      this[_ns] = {
        name,
        node
      };
    }

    add(handle, options = false) {
      this[this._ns].node.addEventListener(this[this._ns].name, handle, options);
    }

    remove(handle) {
      this[this._ns].node.removeEventListener(this[this._ns].name, handle);
    }

    static isEvent(node) {
      return Symbol.for(node) === Symbol.for(Event.prototype);
    }

    get [Symbol.toStringTag]() {
      return 'ensemble.Event';
    }

  }
  /*!
   * loltgt ensemble.base
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  class base {
    constructor() {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }
    }

    defaults(defaults, options) {
      const j = {};

      for (const k in defaults) {
        if (defaults[k] != null && typeof defaults[k] === 'object') {
          j[k] = Object.assign(defaults[k], options[k]);
        } else {
          j[k] = typeof options[k] != 'undefined' ? options[k] : defaults[k];
        }
      }

      return j;
    }

    compo(tag, name, props) {
      return new Compo(this.options.ns, tag, name, props);
    }

    data(obj) {
      return new Data(this.options.ns, obj);
    }

    event(event, node, concurrency = true) {
      if (typeof event === 'string') {
        return new Event(this.options.ns, event, node);
      } else if (event) {
        event.preventDefault();
        event.target.blur();
      }
    }

    selector(query, node, all = false) {
      node = node || document;
      return all ? node.querySelectorAll(query) : node.querySelector(query);
    } // return bool


    appendNode(root, node) {
      return !!root.appendChild(node);
    } // return bool


    prependNode(root, node) {
      return !!root.prependChild(node);
    } // return bool


    removeNode(root, node) {
      return !!root.removeChild(node);
    }

    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    getAttr(node, attr) {
      return node.getAttribute(attr);
    } // return undef


    setAttr(node, attr, value) {
      node.setAttribute(attr, value);
    } // return undef


    delAttr(node, attr) {
      node.removeAttribute(attr);
    }

    binds(method) {
      const self = this;
      return function (e) {
        method.call(self, e, this);
      };
    }

    delay(func, node, dtime) {
      const delay = node ? this.timing(node) : 0;
      setTimeout(func, delay || dtime);
    }

    timing(node, prop = 'transitionDuration') {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? parseFloat(time) * 1e3 : parseInt(time);
      }

      return time || 0;
    }

  }
  /*!
   * loltgt ensemble.Modal
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  class Modal extends base {
    _defaults() {
      return {
        ns: 'modal',
        root: 'body',
        fx: true,
        windowed: false,
        cloning: true,
        backClose: false,
        keyboard: true,
        close: {
          onclick: this.close,
          innerText: '\u00D7',
          ariaLabel: 'Close'
        },
        onOpen: function () {},
        onClose: function () {},
        onShow: function () {},
        onHide: function () {},
        onContent: function () {}
      };
    }

    _bindings() {
      this.open = this.binds(this.open);
      this.close = this.binds(this.close);
      this.backx = this.binds(this.backx);
      this.keyboard = this.binds(this.keyboard);
    }

    constructor(element, options = {}) {
      super();

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);
      this.element = element;
    }

    generator() {
      const opts = this.options;
      const box = this.box = this.compo('dialog', true, {
        className: opts.ns,
        hidden: true,
        ariaModal: true,
        role: 'dialog',
        onclick: opts.backClose ? this.backx : null
      });
      const cnt = this.cnt = this.compo('content');
      const close = this.compo('button', 'close', opts.close);
      box.append(cnt);

      if (opts.windowed) {
        box.classList.add(opts.ns + '-windowed');
        cnt.append(close);
      } else {
        box.append(close);
      }

      if (opts.fx) {
        box.classList.add(opts.ns + '-fx');
      }

      this.root = this.selector(opts.root);
      this.built = true;
      return box;
    }

    populate(target) {
      const content = this.content(this.element);
      this.cnt.append(content);
    }

    resume(target) {
      console.log('resume', target);
    }

    content(node, clone) {
      const opts = this.options;
      const wrap = this.compo('object');
      clone = typeof clone != 'undefined' ? clone : opts.cloning;
      let inner = clone ? this.cloneNode(node, true) : node;
      opts.onContent.call(this, this, wrap, inner);

      if (inner) {
        wrap.inject(inner);
      }

      return wrap;
    } //TODO


    destroy() {
      this.box.remove();
      this.built = false;
    }

    open(e, target) {
      this.event(e);
      if (this.opened) return;
      const opts = this.options;

      if (this.built) {
        this.resume(target);
      } else {
        this.generator();
        this.populate(target);
      }

      this.opened = true;
      opts.onOpen.call(this, this, target, e);
      this.show(target);

      if (opts.keyboard) {
        this.event('keydown').add(this.keyboard);
      }

      console.log('open', this);
    }

    close(e, target) {
      this.event(e);
      if (!this.opened) return;
      const opts = this.options;
      this.opened = false;
      opts.onClose.call(this, this, target, e);
      this.hide(target);

      if (opts.keyboard) {
        this.event('keydown').remove(this.keyboard);
      }

      console.log('close', this);
    }

    show(target) {
      const opts = this.options;
      const root = this.root;
      const box = this.box;
      box.install(root);
      this.delay(function () {
        box.show();
        opts.onShow.call(self, self, target);
      });
    }

    hide(target) {
      const opts = this.options;
      const root = this.root;
      const box = this.box;
      box.hide();
      this.delay(function () {
        box.uninstall(root);
        opts.onHide.call(self, self, target);
      }, box, 3e2);
    } //TODO


    backx(e) {
      this.event(e);
      if (e.target != this.box && e.target != this.cnt) return;
      this.close(e);
    }

    keyboard(e) {
      this.event(e);
      const kcode = e.keyCode || 0; // Escape

      if (kcode === 27) this.close(e);
    }

  }
  /*!
   * loltgt ensemble.Lightbox
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  _exports.Modal = Modal;

  class Lightbox extends Modal {
    _defaults() {
      return Object.assign(super._defaults(), {
        selector: '',
        contents: null,
        navigation: true,
        captioned: true,
        infinite: true,
        autoDiscover: true,
        autoHide: 'navigation',
        // true | 'captions|navigation'
        overlayed: false,
        // true | 'captions|navigation'
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
        onStep: function () {},
        onSlide: function () {},
        onCaption: function () {}
      });
    }

    _bindings() {
      super._bindings();

      this.add = this.binds(this.add);
      this.remove = this.binds(this.remove);
      this.prev = this.binds(this.prev);
      this.next = this.binds(this.next);
    }

    generator() {
      const box = super.generator();
      const cnt = this.cnt;
      const opts = this.options;
      const gallery = this.gallery = this.compo('gallery');
      cnt.append(gallery);
      box.classList.add(opts.ns + '-lightbox');

      if (opts.navigation) {
        var nav = this.nav = this.data();
        const wrap = nav.wrap = this.compo('nav');
        const prev = nav.prev = this.compo('button', 'prev', opts.prev);
        const next = nav.next = this.compo('button', 'next', opts.next);
        wrap.append(prev);
        wrap.append(next);
      }

      if (opts.captioned) {
        var captions = this.captions = this.data();
        captions.wrap = this.compo('captions');
      }

      if (opts.overlayed) {
        const overlay = opts.overlayed.toString().match(/captions|navigation/);
        box.classList.add(opts.ns + '-overlayed');

        if (overlay) {
          box.classList.add(opts.ns + '-overlayed-' + overlayed[0]);
        }
      }

      if (opts.autoHide) {
        const autohide = opts.autoHide.toString().match(/captions|navigation/);
        box.classList.add(opts.ns + '-autohide');

        if (autohide) {
          box.classList.add(opts.ns + '-autohide-' + autohide[0]);
        }
      }

      if (opts.windowed) {
        opts.navigation && cnt.append(nav.wrap);
        opts.captioned && cnt.append(captions.wrap);
      } else {
        opts.navigation && box.append(nav.wrap);
        opts.captioned && box.append(captions.wrap);
      }
    }

    populate(target) {
      console.log('populate', target);
      const opts = this.options;
      let contents;

      if (opts.contents && typeof opts.contents == 'object') {
        contents = opts.contents;
      } else if (opts.selector) {
        contents = this.selector(opts.selector, this.element, true);
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
      opts.captioned && this.caption();
    }

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
      opts.captioned && this.caption();
    }
    /*
      this.add( this.content() )
      this.remove( this.content() )
        String 'image.jpg'
       String '#div'
       Element <video src="video.mp4">
       Data {
        ref: <button>,
        type: 'pdf',
        src: 'document.pdf'
      }
       Data {
        ref: <a>,
        src: '#div'
      }
       Data {
        src: 'image.jpg'
      }
    */


    content(src, clone) {
      const opts = this.options;
      const wrap = this.compo('object');
      wrap.hide();
      var data;

      if (typeof src == 'string') {
        data = this.data({
          src
        });
      } else {
        data = src;
      }

      const csrc = data.src;
      let ctype = data.type;

      if (ctype) {
        ctype = ctype.match(/(^image|video|audio)|(pdf$)/);
        ctype = ctype ? ctype[0] : '';
      }

      const exref = /^https?:\/\//.test(csrc);
      let dhref = false;
      let xclassn;

      if (opts.autoDiscover && csrc && !ctype) {
        if (/\.jpg|\.jpeg|\.png|\.apng|\.gif|\.webp|\.avif|\.bmp|\.svg$/i.test(csrc)) {
          ctype = 'image';
        } else if (/\.pdf$/.test(csrc)) {
          ctype = 'pdf';
        } else if (/\.mp4|\.webm|\.ogv|\.m4v|\.hevc|\.ivf|\.obu|\.ismv|\.mkv$/i.test(csrc)) {
          ctype = 'video';
        } else if (/\.mp3|\.opus|\.ogg|\.m4a|\.aac|\.flac|\.wav|\.weba|\.mka$/i.test(csrc)) {
          ctype = 'audio';
        } else if (/^data:image\/jpeg|png|apng|gif|webp|avif|bmp|svg\+xml/.test(csrc)) {
          dhref = true;
          ctype = 'image';
        }
      }

      if (ctype === 'pdf') {
        ctype = 'iframe';
        xclassn = 'pdf';
      }

      if (opts.checkOrigin && csrc && exref && !dhref) {
        const worigin = window.origin != 'null' ? window.origin : window.location.origin;
        const corigin = new URL(csrc).origin;

        if (worigin != corigin) {
          ctype = '';
        }
      }

      if (csrc && !ctype) {
        //TODO
        if (csrc[0] === '#') {
          const qel = this.selector(csrc);

          if (qel) {
            data.node = qel;

            if (/iframe|img|picture|video|audio/i.test(qel.nodeName)) {
              if (/img|picture/i.test(qel.nodeName)) {
                ctype = 'image';
              } else {
                ctype = qel.nodeName.toLowerCase();
              }
            } else {
              ctype = 'element';
            }
          }
        } else {
          ctype = 'iframe';
        }
      }

      if (ctype === 'element') {
        clone = typeof clone != 'undefined' ? clone : opts.cloning;
        data.node = clone ? this.cloneNode(data.node, true) : data.node;
      }

      data.ref = data.ref || null;
      data.type = ctype;
      data.src = csrc;
      opts.onContent.call(this, this, data);

      if (ctype) {
        wrap.classList.add(opts.ns + '-' + ctype);
      }

      if (xclassn) {
        wrap.classList.add(opts.ns + '-' + xclassn);
      }

      const inner = this.inner(data);

      data.fresh = function () {
        data.node && data.inner.inject(data.node);
        data.wrap.show();
      };

      data.stale = function () {
        data.node && data.inner.empty();
        data.wrap.hide();
      };

      data.wrap = wrap;
      data.inner = data.compo(inner.tag, inner.name, inner.props, true, data.fresh, data.stale);
      return data;
    }
    /*
      Data {
        ref: <a>,
        type: 'image',
        src: undefined | 'image.jpg',
        node: undefined | Element,
         ... /properties
           fresh: Function,
        stale: Function,
        wrap: Compo,
        inner: Object { tag, name, props }  -->  Compo
      }
        {
        tag: 'img' | 'picture' | 'video' | 'audio' | 'iframe' | 'div.custom-element',
        name: Data.type | ?true,
        props: {
          srcset,
          sizes,
          onload,
          onabort,
          onerror,
          preload,
          controls,
          onseek,
        }
      }
    */


    inner(data) {
      let tag = data.type;
      let name = true;
      let props = {};

      for (const prop in data) {
        if (!/ref|src|type|sources|subtitles|children/.test(prop) && prop[0] != '_') {
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
                props.children.push({
                  tag: 'source',
                  name: true,
                  props: source
                });
              }
            } else if (data.children && data.children.length) {
              for (const child of data.children) {
                const tag = child.tagName.toLowerCase();

                if (tag != 'source' || tag != 'img') {
                  continue;
                }

                props.children.push({
                  tag: tag,
                  name: true,
                  props: child.attributes
                });
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
              props.children.push({
                tag: 'source',
                name: true,
                props: source
              });
            }

            if (data.subtitles && typeof data.subtitles == 'object') {
              for (const track of data.subtitles) {
                props.children.push({
                  tag: 'track',
                  name: true,
                  props: track
                });
              }
            }
          } else if (data.children && data.children.length) {
            for (const child of data.children) {
              const tag = child.tagName.toLowerCase();

              if (tag != 'source' || tag != 'track') {
                continue;
              }

              props.children.push({
                tag: tag,
                name: true,
                props: child.attributes
              });
            }
          }

          break;

        case 'iframe':
          props.frameBorder = 0;
          if (!props.src) return null;
          break;

        default:
          tag = 'div';
          name = 'custom-element';
      }

      return {
        tag,
        name,
        props
      };
    }
    /*
      <a href="content.jpg">
      <a data-href="content.jpg" data-type="image/jpeg">
      <a href="content.jpg" data-type="image">
      <button data-href="content.jpg" data-type="image/jpeg">
      <img src="image.jpg">
      <img srcset sizes>
      <picture><source src="image.webp" type="image/webp"><img src="image.jpg">
      <a data-type="image" data-sources="[{\"src\": \"image.avif\", \"type\": \"image/avif\"}]">
      <video src="video.mp4">
      <a data-type="video" data-sources="[{\"src\": \"video.ogv\", \"type\": \"video/theora\"}, {\"src\": \"video.mp4\", \"type\": \"video/mp4\"}}]">
      <audio><source src="audio.ogg" type="audio/ogg"><source src="audio.mp4" type="audio/aac">Fallback text</audio>
      <a href="#div"> <div id="div">
      <a href="#video"> <video id="video" src="video.webm">
      <button data-href="document.pdf">
      <a href="document.pdf" data-type="pdf">
      <a href="document.pdf" data-type="application/pdf">
       ?: <video src="blob:">
      ?: <svg>
      ?: m3u, m3u8
        contents: [ 'image.jpg', 'video.mp4' ]
       contents: [
        {
          type: 'image',
          src: 'image.jpg',
          srcset,
          sizes,
          onload,
          onabort,
          onerror,
        },
        {
          type: 'video',
          preload,
          controls,
          sources: [
            {
              src: 'video.webm',
              type: 'video/webm'
            }
          ],
          subtitles: ?,
          onseek,
        }
      ]
          [
        Data {
          ref: <button>,
          type: 'pdf',
          src: 'document.pdf'
        },
        Data {
          ref: <a>,
          src: '#div'
        },
        Data {
          src: 'image.jpg'
        }
      ]
    */


    prepare(contents) {
      const c = [];

      if (contents && typeof contents == 'object' && contents.length) {
        for (const obj of contents) {
          if (typeof obj == 'object' && 'nodeName' in obj) {
            const data = this.data();
            const sds = obj.dataset;
            Object.assign(data, sds);
            data.ref = obj;

            if (sds.sources) {
              try {
                data.sources = JSON.parse(sds.sources);
              } catch {}
            }

            if (obj.href) {
              data.src = obj.href;
            } else if (sds.href) {
              data.src = sds.href;
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

            if (sds.caption) {
              data.caption = sds.caption;
            }

            c.push(data);
          } else if (typeof obj == 'string') {
            c.push(obj);
          } else if ('type' in obj && /(^element|iframe|image|video|audio|pdf)/.test(obj.type)) {
            c.push(this.data(obj));
          } else {
            c.push(this.data());
          }
        }
      }

      return c;
    }

    add(content) {
      this.gallery.append(content.wrap);
      this.options.navigation && this.navigation();
    }

    remove(content) {
      this.gallery.remove(content.wrap);
      this.options.navigation && this.navigation();
    }

    prev(e) {
      this.event(e);
      this.slide(-1);
    }

    next(e) {
      this.event(e);
      this.slide(1);
    }

    slide(step) {
      const opts = this.options;

      if (!opts.infinite && this.way != 0 && this.way === step) {
        return;
      }

      const contents = this.contents;
      let index = this.index;
      let current = this.current;
      let adjacent = current;
      opts.onStep.call(this, this, current, step);

      if (step != 0) {
        const clenm1 = contents.length - 1;
        const sibling = step === -1 ? contents[index - 1] : contents[index + 1];
        const child = step === -1 ? contents[clenm1] : contents[0];
        adjacent = !!sibling ? sibling : child;
        index = !!sibling ? step === -1 ? index - 1 : index + 1 : step === -1 ? clenm1 : 0;
        current.stale('inner');
      }

      if (!opts.infinite) {
        let way = 0;

        if (!adjacent.wrap.previous) {
          way = -1;
        } else if (!adjacent.wrap.next) {
          way = 1;
        }

        this.way = parseInt(way);

        if (opts.navigation) {
          this.navigation(way);
        }
      }

      adjacent.render('inner');
      adjacent.wrap.append(adjacent.inner);
      opts.onSlide.call(this, this, current, step, current.wrap != adjacent.wrap ? adjacent.wrap : null);
      this.delay(function () {
        step != 0 && current.wrap.remove(current.inner);
      }, current.wrap);
      this.index = index;
      this.current = contents[index];
      opts.captioned && this.caption();
    }

    navigation(way) {
      const nav = this.nav;

      if (this.contents.length > 1) {
        nav.wrap.show();
      } else {
        nav.wrap.hide();
        return;
      }

      if (!this.options.infinite && typeof way != 'undefined') {
        switch (way) {
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

    caption(text) {
      const opts = this.options;
      const captions = this.captions;
      const current = this.current;
      captions.wrap.empty();

      if (opts.onCaption(this, this, current, text)) {
        return;
      }

      if (!text) {
        if (current.caption) {
          text = current.caption;
        } else if (opts.selector) {
          const ref = current.ref;

          if (this.hasAttr(ref, 'title')) {
            text = this.getAttr(ref, 'title');
          } else if (current.type === 'image') {
            const img = this.selector('img', ref);
            text = img.alt;
          }
        }
      }

      if (text) {
        text = text.split(/\n\n|\r\n\r\n/);

        for (const line of text) {
          const caption = this.compo('p', true, {
            innerText: line
          });
          captions.wrap.append(caption);
        }
      }
    }

    keyboard(e) {
      super.keyboard(e);
      const kcode = e.keyCode || 0;

      switch (kcode) {
        // Left
        case 37:
          this.prev(e);
          break;
        // Right

        case 39:
          this.next(e);
          break;
      }
    }

  }

  _exports.Lightbox = Lightbox;
});
//# sourceMappingURL=ensemble-lightbox.js.map
