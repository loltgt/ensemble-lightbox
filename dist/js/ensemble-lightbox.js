/*!
 * ensemble Lightbox
 * @version 0.0.4
 * @link https://github.com/loltgt/ensemble-lightbox
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */
(function (exports) {
  'use strict';

  


  
  class locale {

    
    constructor(lang) {
      if (typeof locale[lang] == 'object') {
        return locale[lang];
      } else {
        return locale[0];
      }
    }

    
    static defaults() {
      return Object.fromEntries(['ETAGN', 'EPROP', 'EMTAG', 'EOPTS', 'EELEM', 'EMETH', 'DOM'].map(a => [a, a]));
    }
  }
  
  const l10n = locale.defaults();

  



  const REJECTED_TAGS$1 = 'html|head|body|meta|link|style|script';


  
  class part {

    
    render() {
      delete this.element;
      delete this.render;
    }

    
    bind(node, cb) {
      const el = this[this.ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! node.appendChild(el);
    }

    
    unbind(node, cb) {
      const el = this[this.ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! node.removeChild(el);
    }

    
    place(node, cb) {
      const el = this[this.ns];
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
      if (! node instanceof Element || RegExp(REJECTED_TAGS$1, 'i').test(node.tagName) || RegExp(`(<(${REJECTED_TAGS$1})*>)`, 'i').test(node.innerHTML)) {
        throw new Error(l10n.EMTAG);
      }

      this.empty();

      return !! this[this.ns].appendChild(node);
    }

    
    empty() {
      while (this.first) {
        this.remove(this.first);
      }
    }

    
    get children() {
      return Array.prototype.map.call(this[this.ns].children, (node) => { return node._1; });
    }

    
    get first() {
      const el = this[this.ns];
      return el.firstElementChild ? el.firstElementChild._1 : null;
    }

    
    get last() {
      const el = this[this.ns];
      return el.lastElementChild ? el.lastElementChild._1 : null;
    }

  }

  



  const REJECTED_TAGS = 'html|head|body|meta|link|style|script';
  const DENIED_PROPS ='attributes|classList|innerHTML|outerHTML|nodeName|nodeType';


  
  class Compo extends part {

    
    constructor(ns, tag, name, props, options, elementNS) {
      super();

      const ns0 = this.ns = `_${ns}`;
      const tagName = tag ? tag.toString() : 'div';

      if (RegExp(REJECTED_TAGS, 'i').test(tagName)) {
        throw new Error(l10n.ETAGN);
      }

      const el = this[ns0] = this.element(ns, tagName, name, props, options, elementNS);

      this.__Compo = 1;
      this[ns0]._1 = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const p = prop.toString();

          if (RegExp(DENIED_PROPS).test(p)) {
            throw new Error(l10n.EPROP);
          }

          if (p.indexOf('on') === 0 && props[p] && typeof props[p] == 'function') {
            el[p] = props[p].bind(this);
          } else if (typeof props[p] != 'object') {
            el[p] = props[p];
          } else if (p == 'children') {
            if (typeof props[p] == 'object' && props[p].length) {
              for (const child of props.children) {
                const {tag, name, props} = child;
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
          el.className = `${ns}-${name}`;
        } else if (typeof name == 'object') {
          el.className = Object.values(name).map(a => `${ns}-${a}`).join(' ');
        }

        if (nodeClass) {
          el.className += ` ${nodeClass}`;
        }
      }

      this.render();
    }

    
    element(ns, tag, name, props, options, elementNS) {
      if (elementNS) return document.createElementNS(elementNS, tag, options);
      else return document.createElement(tag, options);
    }

    
    hasAttr(attr) {
      return this[this.ns].hasAttribute(attr);
    }

    
    getAttr(attr) {
      return this[this.ns].getAttribute(attr);
    }

    
    setAttr(attr, value) {
      this[this.ns].setAttribute(attr, value);
    }

    
    delAttr(attr) {
      this[this.ns].removeAttribute(attr);
    }

    
    getStyle(prop) {
      return getComputedStyle(this[this.ns])[prop];
    }

    
    show() {
      this[this.ns].hidden = false;
    }

    
    hide() {
      this[this.ns].hidden = true;
    }

    
    enable() {
      this[this.ns].disabled = false;
    }

    
    disable() {
      this[this.ns].disabled = true;
    }

    
    get node() {
      console.warn(l10n.DOM);

      return this[this.ns];
    }

    
    get parent() {
      const el = this[this.ns];
      return el.parentElement && el.parentElement._1 ? el.parentElement._1 : null;
    }

    
    get previous() {
      const el = this[this.ns];
      return el.previousElementSibling ? el.previousElementSibling._1 : null;
    }

    
    get next() {
      const el = this[this.ns];
      return el.nextElementSibling ? el.nextElementSibling._1 : null;
    }

    
    get classList() {
      return this[this.ns].classList;
    }

    
    static isCompo(obj) {
      return obj instanceof Compo;
    }

  }

  



  
  class Data {

    
    constructor(ns, obj) {
      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const ns0 = this.ns = `_${ns}`;

      this.__Data = 0;
      this[ns0] = {ns};
    }

    
    compo(tag, name, props, defer = false, load = false, unload = false) {
      const ns = this[this.ns].ns;
      let compo;

      if (defer) {
        compo = {ns, tag, name, props, load, unload};
      } else {
        compo = new Compo(ns, tag, name, props);
      }
      if (load && typeof load == 'function') {
        compo.load = props.onload = load;
      }
      if (unload && typeof unload == 'function') {
        compo.unload = props.onunload = unload;
      }

      return compo;
    }

    
    async render(slot) {
      const el = this[this.ns];
      const self = this;
     

      if (el[slot] && el[slot]._) {
        el[slot].load();
      } else {
        el[slot] = {_: self[slot], load: self[slot].load, unload: self[slot].unload};
        self[slot] = new Compo(self[slot].ns, self[slot].tag, self[slot].name, self[slot].props);
        el[slot].load();
      }
    }

    
    async unload(slot) {
      const el = this[this.ns];
     

      if (el[slot] && el[slot]._) {
        el[slot].unload();
      }
    }

    
    async reflow(slot, force) {
      const el = this[this.ns];
     

      if (force) {
        el[slot] = this.compo(el[slot]._.ns, el[slot]._.name, el[slot]._.props);
      } else if (el[slot] && el[slot]._) {
        el[slot].load();
      }
    }

    
    static isData(obj) {
      return obj instanceof Data;
    }

  }

  



  
  class Event {

    
    constructor(ns, name, node) {
      const ns0 = this.ns = `_${ns}`;

      node = (Compo.isCompo(node) ? node[ns] : node) || document;

      this.__Event = 0;
      this[ns0] = {name, node};
    }

    
    add(func, options = false) {
      const {node, name} = this[this.ns];
      node.addEventListener(name, func, options);
    }

    
    remove(func) {
      const {node, name} = this[this.ns];
      node.removeEventListener(name, func);
    }

    
    static prevent(event) {
      event.preventDefault();
    }

    
    static focus(event, options) {
      const {currentTarget} = event;
      currentTarget && currentTarget.focus(options);
    }

    
    static blur(event, delay = 1e2) {
      const {currentTarget} = event;
      setTimeout(() => currentTarget && currentTarget.blur(), delay);
    }

    
    static isEvent(obj) {
      return obj instanceof Event;
    }

  }

  



  
  class base {

    
    constructor() {
      const args = arguments;
      let element, options;

      if (args.length > 1) {
        element = args[0];
        options = args[1];
     
      } else if (args[0] && typeof args[0] == 'object' && args[0].nodeType) {
        element = args[0];
      } else {
        options = args[0];
      }

      if (options && typeof options != 'object') {
        throw new TypeError(l10n.EOPTS);
      }
      if (element && typeof element != 'object') {
        throw new TypeError(l10n.EELEM);
      }

      this.binds();

      this.options = this.opts(this.defaults(), options);
      Object.freeze(this.options);

      this.element = element;
    }

    
    opts(defaults, options = {}) {
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
      const ns = this.options.ns;
      return tag != undefined ? new Compo(ns, tag, name, props) : Compo;
    }

    
    data(obj) {
      const ns = this.options.ns;
      return obj != undefined ? new Data(ns, obj) : Data;
    }

    
    event(name, node) {
      const ns = this.options.ns;
      return name != undefined ? new Event(ns, name, node) : Event;
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

    
    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    
    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    
    getAttr(node, attr) {
      return node.getAttribute(attr);
    }

    
    icon(type, name, prefix, path, hash) {
      const ns = this.options.ns;
      const className = prefix ? `${prefix}-${name}` : name;
      const icon = this.compo('span', 'icon', {className});

      if (type != 'font') {
        if (type == 'symbol' || type == 'path') {
          const svgNsUri = 'http://www.w3.org/2000/svg';
          const svg = new Compo(ns, 'svg', false, false, false, svgNsUri);
          const node = new Compo(ns, type, false, false, false, svgNsUri);

          if (type == 'symbol') {
            node.setAttr('href', `#${name}`);
          } else {
            node.setAttr('d', path);
          }
          svg.append(node);

          icon.append(svg);
       
        } else if (type == 'svg' && path && hash) {
          const img = new compo(ns, 'img', false, {
            'src': `${path}#${hash}`
          });
          icon.append(img);
        }
      }

      return icon;
    }

    
    styleTime(node, prop) {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? (parseFloat(time) * 1e3) : parseInt(time);
      }

      return time || 0;
    }

    
    delay(func, node, time) {
      const delay = node ? this.styleTime(node, 'transitionDuration') : 0;

      setTimeout(func, delay || time);
    }

    
    wrap(method) {
      const self = this;

      if (this[method] && typeof method != 'function') {
        throw new TypeError(l10n.EMETH);
      }

      return function(event) { method.call(self, event, this); }
    }

  }

  
   


  
  class Modal extends base {

    
    defaults() {
      return {
        ns: 'modal',
        root: 'body',
        className: 'modal',
        icons: {
          type: 'text',
          prefix: 'icon',
          src: ''
        },
        effects: true,
        dialog: false,
        clone: true,
        backdrop: true,
        keyboard: true,
        close: {
          trigger: this.close,
          text: '\u00D7',
          icon: 'close'
        },
        locale: {
          close: 'Close'
        },
        onOpen: () => {},
        onClose: () => {},
        onShow: () => {},
        onHide: () => {},
        onContent: () => {}
      };
    }

    
    binds() {
      this.open = this.wrap(this.open);
      this.close = this.wrap(this.close);
      this.backdrop = this.wrap(this.backdrop);
      this.keyboard = this.wrap(this.keyboard);
    }

    
    constructor() {
      super(...arguments);
    }

    
    generator() {
      const opts = this.options;

      const data = this.modal = this.data({
        onclick: false
      });

      const modal = this.modal.$ = this.compo('dialog', false, {
        className: typeof opts.className == 'object' ? Object.values(opts.className).join(' ') : opts.className,
        hidden: true,
       
       
        onclick: function() {
          data.onclick && typeof data.onclick == 'function' && data.onclick.apply(this, arguments);
        }
      });
      const stage = this.stage = this.compo(false, 'content');

      const {close: closeParams, icons, locale} = opts;
      const close = this.compo('button', ['button', 'close'], {
        onclick: closeParams.trigger,
        innerText: icons.type == 'text' ? closeParams.text : '',
        ariaLabel: locale.close
      });

      if (icons.type != 'text') {
        const {type, prefix} = icons;
        const {icon: name, icon: path} = closeParams;
        const icon = this.icon(type, name, prefix, path);

        close.append(icon);
      }

      modal.append(stage);

      if (opts.dialog) {
        modal.classList.add(opts.ns + '-dialog');
        stage.append(close);
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
      console.log('populate', this, target);

      const el = this.element;
      if (! el) return;

      const content = this.content(el);

      this.stage.append(content);
    }

    
    resume(target) {
      console.log('resume', this, target);
    }

    
    content(node, clone) {
      const opts = this.options;
      const compo = this.compo(false, 'object');

      clone = clone ?? opts.clone;
      let inner = clone ? this.cloneNode(node, true) : node;

      opts.onContent.call(this, this, compo, inner);

      if (inner) {
        compo.fill(inner);
      }

      return compo;
    }

    
    open(evt, target) {
      this.event().prevent(evt);

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
    
      this.event().blur(evt);

      console.log('open', this, target);
    }

    
    close(evt, target) {
      this.event().prevent(evt);

      if (! this.opened) return;

      const opts = this.options;

      this.opened = false;
      opts.onClose.call(this, this, target, evt);
      this.hide(target);

      if (opts.keyboard) {
        this.event('keydown').remove(this.keyboard);
      }
    
      this.event().blur(evt);

      console.log('close', this, target);
    }

    
    show(target) {
      const {options: opts, root} = this;
      const modal = this.modal.$;
      const self = this;

      modal.bind(root);

      this.delay(() => {
        modal.show();

        opts.onShow.call(self, self, target);
      });
    }

    
    hide(target) {
      const {options: opts, root} = this;
      const modal = this.modal.$;
      const self = this;

      modal.hide();

      this.delay(() => {
        modal.unbind(root);

        opts.onHide.call(self, self, target);
      }, modal, 3e2);
    }

    
    backdrop(evt) {
      this.event().prevent(evt);

      const target = evt.target;
      const parent = target.parentElement;
      const ns = this.options.ns;

      var regex;

      regex = new RegExp(ns + '-content');

      if (regex.test(target.className) || regex.test(parent.className)) {
        console.log('backdrop', 'close', this, target, parent);

        this.close(evt);
      }

      regex = new RegExp(ns + '-object');

      if (! regex.test(target.className)) {
        console.log('backdrop', 'return', this, target, parent);

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
        console.log('backdrop', 'close', this, target, parent);

        this.close(evt);
      }
    }

    
    keyboard(evt) {
      this.event().prevent(evt);

      switch (evt.keyCode) {
       
        case 27: this.close(evt); break;
      }
    }

  }

  



  
  class Lightbox extends Modal {

    
    defaults() {
      return Object.assign(super.defaults(), {
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
          trigger: this.prev,
          text: '\u003C',
          icon: 'prev'
        },
        next: {
          trigger: this.next,
          text: '\u003E',
          icon: 'next',
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

    
    binds() {
      super.binds();

      this.add = this.wrap(this.add);
      this.remove = this.wrap(this.remove);
      this.prev = this.wrap(this.prev);
      this.next = this.wrap(this.next);
    }

    
    constructor() {
      super(...arguments);
    }

    
    generator() {
      super.generator();

      const modal = this.modal.$;
      const stage = this.stage;
      const opts = this.options;

      const gallery = this.gallery = this.compo(false, 'gallery');
      stage.append(gallery);

      if (opts.navigation) {
        var nav = this.nav = this.data(true);
        const compo = nav.$ = this.compo(false, 'nav');
        const {icons, locale} = opts;

        for (let i = 0; i < 2; i++) {
          const arrow = i ? 'next' : 'prev';
          const button = nav[arrow] = this.compo('button', ['button', arrow], {
            onclick: opts[arrow].trigger,
            innerText: icons.type == 'text' ? opts[arrow].text : '',
            ariaLabel: locale[arrow]
          });
    
          if (opts.icons != 'text') {
            const {type, prefix} = icons;
            const {icon: name, icon: path} = opts[arrow];
            const icon = this.icon(type, name, prefix, path);
      
            button.append(icon);
          }

          compo.append(button);
        }
      }

      if (opts.captions) {
        var captions = this.captions = this.data(true);
        captions.$ = this.compo(false, 'captions');
      }
      if (opts.overlay) {
        const overlay = opts.overlay.toString().match(/captions|navigation/);
        modal.classList.add(`${opts.ns}-overlay`);

        if (overlay) {
          modal.classList.add(`${opts.ns}-overlay-${overlay[0]}`);
        }
      }
      if (opts.autoHide) {
        const autohide = opts.autoHide.toString().match(/captions|navigation/);
        modal.classList.add(`${opts.ns}-autohide`);

        if (autohide) {
          modal.classList.add(`${opts.ns}-autohide-${autohide[0]}`);
        }
      }

      if (opts.dialog) {
        opts.navigation && stage.append(nav.$);
        opts.captions && stage.append(captions.$);
      } else {
        opts.navigation && modal.append(nav.$);
        opts.captions && modal.append(captions.$);
      }
    }

    
    populate(target) {
      console.log('populate', this, target);

      const {options: opts, element: el} = this;
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
      console.log('resume', this, target);

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

      opts.navigation && this.navigation();
      opts.captions && this.caption();
    }

    
    content(src, clone) {
      const opts = this.options;
      const compo = this.compo(false, 'object');
      compo.hide();

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
        clone = clone ?? opts.clone;
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
      };
      data.$ = compo;
      data.inner = data.compo(inner.tag, inner.name, inner.props, true, data.load, data.unload);

      return data;
    }

    
    inner(data) {
      let tag = data.type;
      let name = false;
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

    
    prepare(contents) {
      const a = [];

      if (contents && typeof contents == 'object' && contents.length) {
        for (const obj of contents) {
         
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
      this.gallery.append(content.$);

      this.options.navigation && this.navigation();
    }

    
    remove(content) {
      this.gallery.remove(content.$);

      this.options.navigation && this.navigation();
    }

    
    prev(evt) {
      this.event().prevent(evt);

      this.slide(-1);

      this.event().blur(evt);
    }

    
    next(evt) {
      this.event().prevent(evt);

      this.slide(1);

      this.event().blur(evt);
    }

    
    slide(step) {
      const {options: opts, stepper, contents} = this;

      if (! opts.infinite && stepper != 0 && stepper === step)
        return;

      let {index, current} = this;
      let adjacent = current;

      opts.onStep.call(this, this, current, step);

      if (step != 0) {
        const len = contents.length - 1;
        const sibling = step === -1 ? contents[index - 1] : contents[index + 1];
        const child = step === -1 ? contents[len] : contents[0];

        adjacent = !! sibling ? sibling : child;
        index = !! sibling ? (step === -1 ? index - 1 : index + 1) : (step === -1 ? len : 0);

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

        if (opts.navigation) {
          this.navigation(stepper);
        }
      }

      adjacent.render('inner');
      adjacent.$.append(adjacent.inner);

      opts.onSlide.call(this, this, current, step, (current.$ != adjacent.$ ? adjacent.$ : null));

      this.delay(() => {
        step != 0 && current.$.remove(current.inner);
      }, current.$);

      this.index = index;
      this.current = contents[index];

      opts.captions && this.caption();
    }

    
    navigation(stepper) {
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

    
    caption(text) {
      const {options: opts, captions, current} = this;

      captions.$.empty();

      if (opts.onCaption(this, this, current, text))
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
            text = img.alt;
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

    
    keyboard(evt) {
      super.keyboard(evt);

      const rtl = document.dir != 'ltr';

      switch (evt.keyCode) {
       
        case 37: this[! rtl ? 'prev' : 'next'](evt); break;
       
        case 39: this[! rtl ? 'next' : 'prev'](evt); break;
      }
    }

  }

  exports.Lightbox = Lightbox;
  exports.Modal = Modal;

})(this.ensemble = this.ensemble || {});
