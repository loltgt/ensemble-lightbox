/*!
 * ensemble Lightbox
 * @version 0.0.4
 * @link https://github.com/loltgt/ensemble-lightbox
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */
(function (exports) {
  'use strict';

  

  
  const _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;

  


  const REJECTED_TAG_NAMES$1 = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;


  
  class _composition {

    
    _render() {
      delete this._element;
      delete this._render;
    }

    
    bound(root, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.appendChild(el);
    }

    
    unbound(root, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.removeChild(el);
    }

    
    overlap(node, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! node.replaceWith(el);
    }

    
    append(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.appendChild(compo[ns]);
    }

    
    prepend(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.prependChild(compo[ns]);
    }

    
    remove(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.removeChild(compo[ns]);
    }

    
    fill(node) {
      if (node instanceof Element == false || REJECTED_TAG_NAMES$1.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
        throw new Error('Object cannot be resolved into a valid node.');
      }

      const ns = this.ns, el = this[ns];
      this.empty();

      return !! el.appendChild(node);
    }

    
    empty() {
      while (this.first) {
        this.remove(this.first);
      }
    }

    
    get children() {
      const ns = this.ns, el = this[ns];
      return Array.prototype.map.call(el.children, (node) => { return node.__compo; });
    }

    
    get first() {
      const ns = this.ns, el = this[ns];
      return el.firstElementChild ? el.firstElementChild.__compo : null;
    }

    
    get last() {
      const ns = this.ns, el = this[ns];
      return el.lastElementChild ? el.lastElementChild.__compo : null;
    }

  }

  



  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;


  
  class Compo extends _composition {

    
    constructor(ns, tag, name, props, options, elementNS) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      super();

      const ns0 = this.ns = '_' + ns;
      const tagName = tag ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(tagName)) {
        throw new Error('Provided tag name is not a valid name.');
      }

      const el = this[ns0] = this._element(ns, tagName, name, props, options, elementNS);

      this.__Compo = true;
      this[ns0].__compo = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const p = prop.toString();

          if (DENIED_PROPS.test(p)) {
            throw new Error('Provided property name is not a valid name.');
          }
         
          if (p.indexOf('on') === 0 && props[p] && typeof props[p] == 'function') {
            el[p] = props[p].bind(this);
          } else if (typeof props[p] != 'object') {
            el[p] = props[p];
          } else if (p == 'children') {
            if (typeof props[p] == 'object' && props[p].length) {
              for (const child of props.children) {
                const tag = child.tag;
                const name = child.name;
                const props = child.props;

                this.append(new Compo(ns, tag, name, props));
              }
            }
          }
        }
      }

      if (name) {
        const nodeClass = el.className;

        el.className = '';

        if (typeof name == 'string') {
          el.className = ns + '-' + name;
        } else if (typeof name == 'object') {
          el.className = name.map((a) => (ns + '-' + a)).join(' ');
        }

        if (nodeClass) {
          el.className += ' ' + nodeClass;
        }
      }

      this._render();
    }

    
    _element(ns, tag, name, props, options, elementNS) {
      if (elementNS) return document.createElementNS(tag, [...elementNS, ...options]);
      else return document.createElement(tag, options);
    }

    
    hasAttr(attr) {
      const ns = this.ns, el = this[ns];
      return el.hasAttribute(attr);
    }

    
    getAttr(attr) {
      const ns = this.ns, el = this[ns];
      return el.getAttribute(attr);
    }

    
    setAttr(attr, value) {
      const ns = this.ns, el = this[ns];
      el.setAttribute(attr, value);
    }

    
    delAttr(attr) {
      const ns = this.ns, el = this[ns];
      el.removeAttribute(attr);
    }

    
    getStyle(prop) {
      const ns = this.ns, el = this[ns];
      return window.getComputedStyle(el)[prop];
    }

    
    show() {
      const ns = this.ns, el = this[ns];
      el.hidden = false;
    }

    
    hide() {
      const ns = this.ns, el = this[ns];
      el.hidden = true;
    }

    
    enable() {
      const ns = this.ns, el = this[ns];
      el.disabled = false;
    }

    
    disable() {
      const ns = this.ns, el = this[ns];
      el.disabled = true;
    }

    
    get node() {
      console.warn('Direct access to the node is discouraged.');

      return this[this.ns];
    }

    
    get parent() {
      const ns = this.ns, el = this[ns];
      return el.parentElement && '__compo' in el.parentElement ? el.parentElement.__compo : null;
    }

    
    get previous() {
      const ns = this.ns, el = this[ns];
      return el.previousElementSibling ? el.previousElementSibling.__compo : null;
    }

    
    get next() {
      const ns = this.ns, el = this[ns];
      return el.nextElementSibling ? el.nextElementSibling.__compo : null;
    }

    
    get classList() {
      const ns = this.ns, el = this[ns];
      return el.classList;
    }

    
    static isCompo(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Compo.prototype);
      else return obj && typeof obj == 'object' && '__Compo' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Compo';
    }

  }

  



  
  class Data {

    
    constructor(ns, obj) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const ns0 = this.ns = '_' + ns;

      this.__Data = true;
      this[ns0] = {ns};
    }

    
    compo(tag, name, props, defer = false, fresh = false, stale = false) {
     
      const ns1 = this.ns, ns = this[ns1].ns;

      let compo;

      if (defer) {
        compo = {ns, tag, name, props, fresh, stale};
      } else {
        compo = new Compo(ns, tag, name, props);
      }
      if (fresh && typeof fresh == 'function') {
        compo.fresh = props.onfresh = fresh;
      }
      if (stale && typeof stale == 'function') {
        compo.stale = props.onstale = stale;
      }

      return compo;
    }

    
    async render(slot) {
      const ns = this.ns, el = this[ns], self = this;

      if (el[slot] && el[slot].rendered) {
        el[slot].fresh();
      } else {
        el[slot] = {rendered: true, fresh: self[slot].fresh, stale: self[slot].stale, params: self[slot]};
        self[slot] = new Compo(self[slot].ns, self[slot].tag, self[slot].name, self[slot].props);
        el[slot].fresh();
      }
    }

    
    async stale(slot) {
      const ns = this.ns, el = this[ns];

      if (el[slot] && el[slot].rendered) {
        el[slot].stale();
      }
    }

    
    async reflow(slot, force) {
      const ns = this.ns, el = this[ns];

      if (force) {
        el[slot] = this.compo(el[slot].params.ns, el[slot].params.name, el[slot].params.props);
      } else if (el[slot] && el[slot].rendered) {
        el[slot].fresh();
      }
    }

    
    static isData(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Data.prototype);
      else return obj && typeof obj == 'object' && '__Data' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Data';
    }

  }

  



  
  class Event {

    
    constructor(ns, name, node) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      const ns0 = this.ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document;

      this.__Event = true;
      this[ns0] = {name, node};
    }

    
    add(handle, options = false) {
      const ns = this.ns, e = this[ns], node = e.node, name = e.name;
      node.addEventListener(name, handle, options);
    }

    
    remove(handle) {
      const ns = this.ns, e = this[ns], node = e.node, name = e.name;
      node.removeEventListener(name, handle);
    }

    
    static isEvent(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);
      else return obj && typeof obj == 'object' && '__Event' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Event';
    }

  }

  



  
  class base {

    
   

    
   

    
    constructor() {
      let element, options;

      if (arguments.length > 1) {
        element = arguments[0];
        options = arguments[1];
      } else {
        options = arguments[0];
      }

      if (options && typeof options != 'object') {
        throw new TypeError('Passed argument "options" is not an Object.');
      }
      if (element && typeof element != 'object') {
        throw new TypeError('Passed argument "element" is not an Object.');
      }

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);

      this.element = element;
    }

    
    defaults(defaults, options) {
      const opts = {};

      for (const key in defaults) {
        if (defaults[key] != null && typeof defaults[key] == 'object') {
          opts[key] = Object.assign(defaults[key], options[key]);
        } else {
          opts[key] = typeof options[key] != 'undefined' ? options[key] : defaults[key];
        }
      }

      return opts;
    }

    
    compo(tag, name, props) {
      const options = this.options, ns = options.ns;
      return tag != undefined ? new Compo(ns, tag, name, props) : Compo;
    }

    
    data(obj) {
      const options = this.options, ns = options.ns;
      return obj != undefined ? new Data(ns, obj) : Data;
    }

    
    event(event, node) {
      if (typeof event == 'string') {
        return new Event(this.options.ns, event, node);
      } else if (event) {
        event.preventDefault();
       
        event.target.blur();
      } else {
        return Event;
      }
    }

    
    selector(query, node, all = false) {
      node = node || document;

      return all ? node.querySelectorAll(query) : node.querySelector(query);
    }

    
    appendNode(parent, node) {
      return !! parent.appendChild(node);
    }

    
    prependNode(parent, node) {
      return !! parent.prependChild(node);
    }

    
    removeNode(root, node) {
      return !! root.removeChild(node);
    }

    
    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    
    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    
    getAttr(node, attr) {
      return node.getAttribute(attr);
    }

    
    setAttr(node, attr, value) {
      node.setAttribute(attr, value);
    }

    
    delAttr(node, attr) {
      node.removeAttribute(attr);
    }

    
    getTime(node, prop = 'transitionDuration') {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? (parseFloat(time) * 1e3) : parseInt(time);
      }

      return time || 0;
    }

    
    binds(method) {
      const self = this;

      return function(event) { method.call(self, event, this); }
    }

    
    delay(func, node, time) {
      const delay = node ? this.getTime(node) : 0;

      setTimeout(func, delay || time);
    }

  }

  
   


  
  class Modal extends base {

    
    _defaults() {
      return {
        ns: 'modal',
        root: 'body',
        className: 'modal',
        effects: true,
        windowed: false,
        clone: true,
        backdrop: true,
        keyboard: true,
        close: {
          onclick: this.close,
          innerText: '\u00D7',
          ariaLabel: 'Close'
        },
        onOpen: function() {},
        onClose: function() {},
        onShow: function() {},
        onHide: function() {},
        onContent: function() {}
      };
    }

    
    _bindings() {
      this.open = this.binds(this.open);
      this.close = this.binds(this.close);
      this.backdrop = this.binds(this.backdrop);
      this.keyboard = this.binds(this.keyboard);
    }

    
    constructor() {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      super(...arguments);
    }

    
    generator() {
      const opts = this.options;

      const data = this.modal = this.data({
        onclick: false
      });

      const modal = this.modal.wrap = this.compo('dialog', false, {
        className: typeof opts.className == 'object' ? opts.className.join(' ') : opts.className,
        hidden: true,
       
       
        onclick: function() {
          data.onclick && typeof data.onclick == 'function' && data.onclick.apply(this, arguments);
        }
      });
      const frame = this.frame = this.compo(false, 'content');

      const close = this.compo('button', ['button', 'close'], opts.close);

      modal.append(frame);

      if (opts.windowed) {
        modal.classList.add(opts.ns + '-windowed');
        frame.append(close);
      } else {
        modal.append(close);
      }
      if (opts.backdrop) {
        data.onclick = this.backdrop;
      }

      if (opts.effects) {
        modal.classList.add(opts.ns + '-effects');
      }

      this.root = this.selector(opts.root);
      this.built = true;
    }

    
    populate(target) {
      console.log('populate', target);

      const el = this.element;
      if (! el) return;

      const content = this.content(el);

      this.frame.append(content);
    }

    
    resume(target) {
      console.log('resume', target);
    }

    
    content(node, clone) {
      const opts = this.options;
      const wrap = this.compo(false, 'object');

      clone = typeof clone != 'undefined' ? clone : opts.clone;

      let inner = clone ? this.cloneNode(node, true) : node;

      opts.onContent.call(this, this, wrap, inner);

      if (inner) {
        wrap.fill(inner);
      }

      return wrap;
    }

    
    destroy() {
      const root = this.root;
      const modal = this.modal.wrap;

      this.removeNode(root, modal);
      this.built = false;
    }

    
    open(evt, target) {
      this.event(evt);

      if (this.opened) return;

      const opts = this.options;

      if (this.built) {
        this.resume(target);
      } else {
        this.generator();
        this.populate(target);
      }

      this.opened = true;
      opts.onOpen.call(this, this, target, evt);
      this.show(target);

      if (opts.keyboard) {
        this.event('keydown').add(this.keyboard);
      }

      console.log('open', this);
    }

    
    close(evt, target) {
      this.event(evt);

      if (! this.opened) return;

      const opts = this.options;

      this.opened = false;
      opts.onClose.call(this, this, target, evt);
      this.hide(target);

      if (opts.keyboard) {
        this.event('keydown').remove(this.keyboard);
      }

      console.log('close', this);
    }

    
    show(target) {
      const opts = this.options;
      const root = this.root;
      this.modal;
      const modal = this.modal.wrap;

      modal.bound(root);

      this.delay(function() {
        modal.show();

        opts.onShow.call(self, self, target);
      });
    }

    
    hide(target) {
      const opts = this.options;
      const root = this.root;
      this.modal;
      const modal = this.modal.wrap;

      modal.hide();

      this.delay(function() {
        modal.unbound(root);

        opts.onHide.call(self, self, target);
      }, modal, 3e2);
    }

    
    backdrop(evt) {
      this.event(evt);

      const target = evt.target;
      const parent = target.parentElement;
      const ns = this.options.ns;

      var regex;

      regex = new RegExp(ns + '-content');

      if (regex.test(target.className) || regex.test(parent.className)) {
        console.log('backdrop', 'overflow', 'close', parent, target);

        this.close(evt);
      }

      regex = new RegExp(ns + '-object');

      if (! regex.test(target.className)) {
        console.log('backdrop', 'overflow', 'return', parent, target);

        return;
      }

      const inner = target.firstElementChild;
      const inner_w = inner.offsetWidth;
      const inner_h = inner.offsetHeight;
      const target_t = target.offsetTop;
      const target_l = target.offsetLeft;
      const target_w = target.offsetWidth;
      const target_h = target.offsetHeight;

      const x = evt.x;
      const y = evt.y;

      const crop_t = (target_h - inner_h) / 2;
      const crop_l = (target_w - inner_w) / 2;
      const crop_b = crop_t + inner_h;
      const crop_r = crop_l + inner_w;

      console.log('backdrop', 'coords', {x, y}, {target_t, target_l, target_w, target_h}, {crop_t, crop_r, crop_b, crop_l});

      if (
        (y > target_t || x > target_l || x < target_w || y < target_h) &&
        (y < crop_t || x > crop_r || y > crop_b || x < crop_l)
      ) {
        console.log('backdrop', 'overflow', 'close', parent, target);

        this.close(evt);
      }
    }

    
    keyboard(evt) {
      this.event(evt);

      switch (evt.keyCode) {
       
        case 27: this.close(evt); break;
      }
    }

  }

  



  
  class Lightbox extends Modal {

    
    _defaults() {
      return Object.assign(super._defaults(), {
        className: ['modal', 'modal-lightbox'],
        selector: '',
        contents: null,
        backdrop: false,
        navigation: true,
        captions: true,
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

    
    _bindings() {
      super._bindings();

      this.add = this.binds(this.add);
      this.remove = this.binds(this.remove);
      this.prev = this.binds(this.prev);
      this.next = this.binds(this.next);
    }

    
    constructor() {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      super(...arguments);
    }

    
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
     
      if (opts.checkOrigin && srcref && xnref && ! bsrc) {
        const a = window.origin != 'null' ? window.origin : window.location.origin;
        const b = new URL(srcref).origin;

        if (a != b) {
          mtype = '';
        }
      }

      if (srcref && ! mtype) {
       
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
      };
      data.wrap = wrap;
      data.inner = data.compo(inner.tag, inner.name, inner.props, true, data.fresh, data.stale);

      return data;
    }

    
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

    
    prepare(contents) {
      const a = [];

      if (contents && typeof contents == 'object' && contents.length) {
        for (const obj of contents) {
         
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

    
    add(content) {
      this.gallery.append(content.wrap);

      this.options.navigation && this.navigation();
    }

    
    remove(content) {
      this.gallery.remove(content.wrap);

      this.options.navigation && this.navigation();
    }

    
    prev(evt) {
      this.event(evt);

      this.slide(-1);
    }

    
    next(evt) {
      this.event(evt);

      this.slide(1);
    }

    
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

    
    keyboard(evt) {
      super.keyboard(evt);

      switch (evt.keyCode) {
       
        case 37: this.prev(evt); break;
       
        case 39: this.next(evt); break;
      }
    }

  }

  exports.Lightbox = Lightbox;
  exports.Modal = Modal;

})(this.ensemble = this.ensemble || {});
