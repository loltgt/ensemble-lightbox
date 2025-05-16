/*!
 * ensemble Lightbox
 * @version 0.4.0
 * @link https://github.com/loltgt/ensemble-lightbox
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */
(function (exports) {
  'use strict';

  


  
  const l10n = new Proxy({}, {
    
    get(self, marker) {
      return self.lang && self[self.lang][marker] || marker;
    }
  });

  



  
  const REJECTED_TAGS = 'html|head|body|meta|link|style|script';

  
  const DENIED_PROPS = 'attributes|classList|innerHTML|outerHTML|nodeName|nodeType';


  
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
      return !! el.insertBefore(compo[ns], el.firstElementChild || null);
    }

    
    remove(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.removeChild(compo[ns]);
    }

    
    fill(node) {
      if (! node instanceof Element || RegExp(REJECTED_TAGS, 'i').test(node.tagName) || RegExp(`(<(${REJECTED_TAGS})*>)`, 'i').test(node.innerHTML)) {
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
      currentTarget.focus && currentTarget.focus(options);
    }

    
    static blur(event, delay = 1e2) {
      const {currentTarget} = event;
      setTimeout(() => currentTarget.blur && currentTarget.blur(), delay);
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

    
    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    
    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    
    getAttr(node, attr) {
      return node.getAttribute(attr);
    }

    
    icon(type, name, prefix, path, hash, viewBox) {
      const ns = this.options.ns;
      const className = prefix ? `${prefix}-${name}` : name;
      const icon = this.compo('span', 'icon', {className});

      if (type != 'font') {
        if (type == 'symbol' || type == 'shape') {
          const svgNsUri = 'http://www.w3.org/2000/svg';
          const svg = new Compo(ns, 'svg', false, false, null, svgNsUri);
          const tag = type == 'symbol' ? 'use' : 'path';
          const node = new Compo(ns, tag, false, false, null, svgNsUri);

          if (viewBox) {
            const m = viewBox.match(/\d+ \d+ (\d+) (\d+)/);

            if (m) {
              Object.entries({
                width: m[1],
                height: m[2],
                viewBox: m[0]
              }).forEach(a => svg.setAttr(a[0], a[1]));
            }
          }

          if (tag == 'use') {
            node.setAttr('href', `#${hash}`);
          } else {
            node.setAttr('d', path);
          }

          svg.append(node);
          icon.append(svg);
        } else if (type == 'svg' && this.origin()) {
          const img = this.compo(ns, 'img', false, {
            'src': `${path}#${hash}`
          });
          icon.append(img);
        }
      }

      return icon;
    }

    
    origin(b, a) {
      a = URL.canParse(a) ? a : (window.origin != 'null' ? window.origin : window.location.origin);
      b = URL.canParse(b) ? new URL(b).origin : a;

      return a && b && a === b;
    }

    
    cst(node, prop) {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? (parseFloat(time) * 1e3) : parseInt(time);
      }

      return time || 0;
    }

    
    delay(func, node, time) {
      const delay = node ? this.cst(node, 'transitionDuration') : 0;

      setTimeout(func, delay || time);
    }

    
    wrap(method) {
      const self = this;

      if (this[method] && typeof method != 'function') {
        throw new TypeError(l10n.EMETH);
      }

      return function() { method.call(self, ...arguments, this); }
    }

  }

  
   


  
  class Modal extends base {

    
    defaults() {
      return {
        ns: 'modal',
        root: 'body',
        className: 'modal',
        dialog: true,
        modal: true,
        window: false,
        icons: {
          type: 'shape',
          prefix: 'icon'
        },
        effects: true,
        clone: true,
        backdrop: true,
        keyboard: true,
        close: {
          trigger: this.close,
          text: '\u00D7',
          icon: 'm20 4-8 8 8 8-8-8-8 8 8-8-8-8 8 8 8-8Z',
          viewBox: '0 0 24 24'
        },
        locale: {
          close: 'Close'
        },
        onOpen: () => {},
        onClose: () => {},
        onShow: () => {},
        onHide: () => {},
        onContent: () => {},
        onInit: () => {},
        onResume: () => {}
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

    
    init(target) {
      const el = this.element;
      if (! el) return;

      this.layout();

      const content = this.$ = this.content(el);

      this.stage.append(content);

      
      this.options.onInit.call(this, this, target);
    }

    
    resume(target) {
      
      this.options.onResume.call(this, this, target);
    }

    
    layout() {
      const opts = this.options;

      const data = this.modal = this.data({
        onclick: false
      });

      const modal = this.modal.$ = this.compo(opts.dialog ? 'dialog' : false, false, {
        className: typeof opts.className == 'object' ? Object.values(opts.className).join(' ') : opts.className,
        hidden: true,
        onclick: function() {
          data.onclick && typeof data.onclick == 'function' && data.onclick.apply(this, arguments);
        }
      });
      const body = this.modal.body = this.compo(false, 'body');
      const stage = this.stage = this.compo(false, 'stage');
      const nav = this.nav = this.data(true);

      const path = 'close';
      const {close: closeParams, icons, locale} = opts;
      const close = nav[path] = this.compo('button', ['button', path], {
        onclick: closeParams.trigger,
        innerText: icons.type == 'text' ? closeParams.text : '',
        ariaLabel: locale.close
      });

      if (icons.type != 'text') {
        const {type, prefix, src, viewBox} = icons;
        const {icon: ref, viewBox: v} = closeParams;
        const icon = this.icon(type, type == 'font' ? ref : path, prefix, src ?? ref, ref ?? path, v ?? viewBox);

        const svg = icon.first;
        svg.setAttr('stroke', 'currentColor');
        svg.setAttr('stroke-width', '2px');

        close.append(icon);
      }

      body.append(stage);
      body.append(close);
      modal.append(body);

      if (opts.window) {
        modal.classList.add(`${opts.ns}-window`);
      }
      if (opts.backdrop) {
        modal.classList.add(`${opts.ns}-backdrop`);
        data.onclick = this.backdrop;
      }

      if (opts.effects) {
        modal.classList.add(`${opts.ns}-effects`);
      }

      this.root = this.selector(opts.root);
      this.built = true;
    }

    
    content(node, clone) {
      const opts = this.options;
      const content = this.compo(false, 'content');

      clone = clone ?? opts.clone;
      let inner = clone ? this.cloneNode(node, true) : node;

      
      opts.onContent.call(this, this, content, inner);

      if (inner) {
        content.fill(inner);
      }

      return content;
    }

    
    open(evt, target) {
      this.event().prevent(evt);

      if (this.opened) return;

      const opts = this.options;

      if (this.built) {
        this.resume(target);
      } else {
        this.init(target);
      }

      this.opened = true;

      
      opts.onOpen.call(this, this, target, evt);

      this.show(target);

      if (opts.keyboard) {
        this.event('keydown').add(this.keyboard);
      }
    
      this.event().blur(evt);
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
    }

    
    show(target) {
      const {options: opts, root} = this;
      const modal = this.modal.$;
      const ns = modal.ns, dialog = modal[ns];
      const self = this;

      modal.bind(root);

      this.target = target;

      this.delay(() => {
       
        if (opts.dialog) {
          try {
            if (opts.modal)
              dialog.showModal();
            else
              dialog.show();

           
            dialog.focus();
          } catch (err) {
            console.error('show', err.message);

            modal.setAttr('open', '');
          }
       
        } else {
          const button = this.selector('button', dialog);
          if (button) {
            button.focus();
            button.blur();
          }
        }

        modal.show();

        
        opts.onShow.call(self, self, target);
      });
    }

    
    hide(target) {
      const {options: opts, root} = this;
      const modal = this.modal.$;
      const ns = modal.ns, dialog = modal[ns];
      const self = this;

      modal.hide();

     
      if (opts.dialog) {
        try {
          dialog.close();
        } catch (err) {
          console.error('hide', err.message);

          modal.delAttr('open');
        }
     
      } else if (this.target) {
        this.target.focus();
      }
     
      const doc = document;
      doc.hasFocus() && doc.activeElement.blur();

      this.delay(() => {
        modal.unbind(root);

        
        opts.onHide.call(self, self, target);
      }, modal, 3e2);
    }

    
    backdrop(evt) {
      const opts = this.options;
      const target = evt.target;
      const regex = new RegExp(`${opts.ns}-backdrop`);

      if (regex.test(target.className) || regex.test(target.parentElement.className)) {
        this.close(evt);
      }
    }

    
    keyboard(evt) {
      switch (evt.keyCode) {
       
        case 27: this.close(evt); break;
      }
    }

  }

  



  
  class Lightbox extends Modal {

    
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

    
    binds() {
      super.binds();

      this.add = this.wrap(this.add);
      this.remove = this.wrap(this.remove);
      this.prev = this.wrap(this.prev);
      this.next = this.wrap(this.next);
      this.route = this.wrap(this.route);
    }

    
    constructor() {
      super(...arguments);
    }

    
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

      
      opts.onInit.call(this, this, target);
    }

    
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

      
      opts.onResume.call(this, this, target);
    }

    
    layout() {
      super.layout();

      const {$: modal, body} = this.modal;
      const {stage, options: opts, nav} = this;

      this.bidi = this.dir;

      let props = null;

     
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

    
    modus(item) {
      if (! this.data().isData(item)) {
        const obj = this.prepare([item]);
        item = this.content(obj[0]);
      }

      return item.$ ? item : null;
    }

    
    add(item) {
      const content = modus(item);

      if (content) {
        this.contents.push(content);
        this.$.append(content.$);
      }

      this.options.controls && this.controls();
    }

    
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

    
    prev(evt) {
      this.event().prevent(evt);

      this.step(-1);

      this.event().blur(evt);
    }

    
    next(evt) {
      this.event().prevent(evt);

      this.step(1);

      this.event().blur(evt);
    }

    
    route(evt, point) {
      point = this.dir == 'rtl' ? ! (point > 0) : point > 0;

      this[point ? 'next' : 'prev'](evt);
    }

    
    step(point) {
      const {options: opts, contents} = this;
    
      if (point === 0) {
        this.current = this.current || contents[0];
        this.index = this.index || 0;
      }

      let {index, current, abs} = this;
      const len = contents.length;

      
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

      
      opts.onSlide.call(this, this, content, previous);

      move && previous.$.remove(previous.inner);

      this.index = index;
      this.current = content;

      opts.caption && this.caption();
      opts.autoHide && this.autoHide(content);
    }

    
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

    
    caption(text) {
      const {options: opts, heading, current} = this;

      heading.$.empty();

      text = text ?? current.caption;

      
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

    
    pointers() {
      const self = this;
      const time_thresold = 100;
      const move_thresold = 45;
      let t = 0;
      let x = 0;
      let y = 0;

      return {
        
        hit(evt) {
          const h = evt.changedTouches;
          const s = h ? h[0] : evt;
          t = evt.timeStamp;
          x = s.screenX;
          y = s.screenY;
        },
        
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
        
        nil(evt) {
          y = x = t = 0;
        }
      };
    }

    
    keyboard(evt) {
      super.keyboard(evt);

      switch (evt.keyCode) {
       
        case 37: this.route(evt, -1); break;
       
        case 39: this.route(evt, 1); break;
      }

      this.options.autoHide && this.autoHide();
    }

    
    get dir() {
      return document.dir;
    }

  }

  exports.Lightbox = Lightbox;
  exports.Modal = Modal;

})(this.ensemble = this.ensemble || {});
