/*!
 * loltgt ensemble.Lightbox
 *
 * @version 0.0.1
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

(function(window, module, require, ensemble) {

  const Modal = ensemble ? ensemble.Modal : require('../ensemble-modal/Modal');


  class Lightbox extends Modal {

    _defaults() {
      return Object.assign(super._defaults(), {
        selector: '',
        contents: null,
        navigation: true,
        captioned: true,
        infinite: true,
        autoDiscover: true,
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

    generator() {
      const box = super.generator();
      const cnt = this.cnt;
      const opts = this.options;

      box.classList.add(opts.ns + '-lightbox');

      const gallery = this.gallery = this.compo('gallery');
      cnt.append(gallery);

      if (opts.navigation) {
        var nav = this.nav = this.compo('nav');
        const prev = this.compo('button', 'prev', opts.prev);
        const next = this.compo('button', 'next', opts.next);

        nav.append(prev);
        nav.append(next);
      }

      if (opts.captioned) {
        var captions = this.captions = this.compo('captions');
      }

      if (opts.windowed) {
        opts.navigation && cnt.append(nav);
        opts.captioned && cnt.append(captions);
      } else {
        opts.navigation && box.append(nav);
        opts.captioned && box.append(captions);
      }
    }

    populate(target) {
      console.log('populate', target);

      const opts = this.options;

      let contents;

      if (opts.contents && typeof opts.contents === 'object') {
        contents = opts.contents;
      } else if (opts.selector) {
        contents = this.selector(opts.selector, this.element, true);
      }
      contents = this.prepare(contents);

      for (const node of contents) {
        const content = this.content(node);

        if (target && target === content.srcNode) {
          this.current = content;
        }

        this.add(content);
      }

      if (! this.current) {
        this.current = this.gallery.first;
      }

      this.slide(0);

      opts.navigation && this.navigation();
      opts.captioned && this.caption();
    }

    resume(target) {
      console.log('resume', target);

      const opts = this.options;
      const childs = this.gallery.children;

      for (const child of childs) {
        this.setAttr(child, 'hidden', true);

        if (target && target === child.srcNode) {
          this.current = child;
        }
      }

      //TODO
      // if (! this.current) {
      //   this.current = this.gallery.first;
      // }

      this.slide(0);

      opts.navigation && this.navigation();
      opts.captioned && this.caption();
    }

    content(data, clone) {
      const opts = this.options;
      clone = typeof clone != 'undefined' ? clone : opts.cloning;
      const wrap = this.compo('object');

      const csrc = data.src;
      let ctype = data.type;

      if (ctype) {
        ctype = ctype.match(/^image|video|audio/);
        ctype = ctype ? ctype[0] : data.type;
      }

      const exref = /^https?:\/\//.test(csrc);
      let dhref = false;
      let xclassn;

      if (csrc && opts.autoDiscover) {
        if (/\.jpg|\.jpeg|\.png|\.apng|\.gif|\.webp|\.avif|\.bmp|\.svg$/i.test(csrc)) {
          ctype = 'image';
        } else if (/^data:image\/jpeg|png|apng|gif|webp|avif|bmp|svg\+xml/.test(csrc)) {
          dhref = true;
          ctype = 'image';
        } else if (/\.pdf$/.test(csrc)) {
          ctype = 'pdf';
        }
      }
      if (ctype === 'pdf') {
        ctype = 'iframe';
        xclassn = 'pdf';
      }
      if (csrc && ! dhref && opts.checkOrigin) {
        const worigin = window.origin != 'null' ? window.origin : window.location.origin;
        const corigin = new URL(csrc).origin;

        if (worigin != corigin) {
          ctype = '';
        }
      }

      if (csrc && ! ctype) {
        if (csrc[0] === '#') {
          const qel = this.selector(csrc);

          if (qel) {
            data.node = qel;
            ctype = 'element';
          }
        } else {
          ctype = 'iframe';
        }
      }

      let inner;

      if (data.pass && data.node) {
        inner = clone ? this.cloneNode(data.node, true) : data.node;
      } else if (ctype) {
        inner = this.inner(data, ctype, csrc);
      }

      if (ctype) {
        wrap.classList.add(opts.ns + '-' + ctype);
      }
      if (xclassn) {
        wrap.classList.add(opts.ns + '-' + xclassn);
      }

      opts.onContent.call(this, this, wrap, inner);

      wrap.srcNode = data.node ? data.node : data;
      wrap.setAttr('hidden', true);

      if (inner) {
        wrap.append(inner);
      }

      return wrap;
    }

    //TODO
    inner(data, ctype, csrc) {
      let tag = ctype;
      const props = {};

      if (csrc) {
        props.src = csrc;
      }

      switch (ctype) {
        case 'image':
          //TODO
          // <picture> or <figure>
          tag = 'img';
          break;
        case 'iframe':
          props.frameBorder = 0;

          if (! csrc) {
            return null;
          }

          break;
      }

      return this.compo(tag, true, props);
    }

    prepare(contents) {
      const c = [];

      if (contents && typeof contents === 'object' && contents.length) {
        for (const obj of contents) {
          if ('nodeName' in obj) {
            const data = { node: obj };
            const sdat = obj.dataset;

            if (sdat.length) {
              for (const p of sdat) {
                if (/{*}/.test(p)) {
                  try {
                    p = JSON.parse(p);
                  } catch {}
                }
              }
            }
            if (sdat.type) {
              data.type = sdat.type;
            }
            if (obj.href) {
              data.src = obj.href;
            } else if (sdat.href) {
              data.src = sdat.href;
            } else if (/iframe|img|picture|figure|video|audio/i.test(obj.nodeName)) {
              if (/img|picture|figure/i.test(obj.nodeName)) {
                data.type = 'image';
              } else {
                data.type = obj.nodeName.toLowerCase();
              }

              data.pass = true;
            } else {
              data.type = 'element';
            }

            c.push(data);
          } else if ('type' in obj && /(^element|iframe|image|video|audio|pdf)/.test(obj.type)) {
            // options freezed
            const data = Object.assign({}, obj);

            c.push(data);
          } else {
            c.push(null);
          }
        }
      }

      return c;
    }

    add(content) {
      this.gallery.append(content);

      this.options.navigation && this.navigation();
    }

    remove(content) {
      this.gallery.remove(content);

      this.options.navigation && this.navigation();
    }

    prev(e) {
      e && ! e.preventDefault() && e.target.blur();

      this.slide(-1);
    }

    next(e) {
      e && ! e.preventDefault() && e.target.blur();

      this.slide(1);
    }

    slide(step) {
      const self = this;
      const opts = this.options;

      if (! opts.infinite && this.way != 0 && this.way === step) {
        return;
      }

      let current = this.current;
      let adjacent = current;

      opts.onStep.call(this, this, current, step);

      if (step != 0) {
        const sibling = (step === -1 ? 'previous' : 'next');
        const child = (step === -1 ? 'last' : 'first');

        adjacent = current[sibling] ? current[sibling] : this.gallery[child];

        current.setAttr('hidden', true);
      }

      if (! opts.infinite) {
        let way = 0;

        if (! adjacent.previous) {
          way = -1;
        } else if (! adjacent.next) {
          way = 1;
        }

        this.way = parseInt(way);

        if (opts.navigation) {
          this.navigation(way);
        }
      }

      setTimeout(function() {
        adjacent.delAttr('hidden');

        opts.onSlide.call(self, self, current, step, (current != adjacent ? adjacent : null));
      }, this.timing(current));

      this.current = adjacent;
      this.caption();
    }

    navigation(way) {
      const nav = this.nav;
      const childs = this.gallery.children;

      if (childs.length > 1) {
        nav.delAttr('hidden');
      } else {
        nav.setAttr('hidden', true);

        return;
      }

      if (! this.options.infinite && typeof way != 'undefined') {
        switch (way) {
          case -1:
            nav.first.setAttr('disabled', true);
            nav.last.delAttr('disabled');
            break;
          case 1:
            nav.first.delAttr('disabled');
            nav.last.setAttr('disabled', true);
            break;
          default:
            nav.first.delAttr('disabled');
            nav.last.delAttr('disabled');
        }
      }
    }

    caption(text) {
      const captions = this.captions;
      const current = this.current;
      const caption = this.compo('p', true);

      if (captions.first) {
        captions.remove(captions.first);
      }

      if (this.options.onCaption(this, this, caption, current, text)) {
        return;
      }

      const source = current.srcNode;
      const inner = source.firstElementChild;

      if (! text) {
        if (this.hasAttr(source, 'data-caption')) {
          text = source.dataset.caption;
        } else if (this.hasAttr(source, 'title')) {
          text = source.title;
        } else if (this.selector('figcaption', source)) {
          text = this.selector('figcaption', source).innerText;
        } else if (inner && (inner.nodeName == 'IMG' || inner.nodeName == 'PICTURE')) {
          text = inner.alt;
        }
      }

      if (text) {
        //TODO
        // direct access to node
        caption.node.innerText = text;

        captions.append(caption);
      }
    }

    keyboard(e) {
      super.keyboard(e);

      const kcode = e.keyCode || 0;

      switch (kcode) {
        // Left
        case 37: this.prev(e); break;
        // Right
        case 39: this.next(e); break;
      }
    }

  }


  window.ensemble = { ...ensemble, ...{ Lightbox } };
  module.exports = Lightbox;

}((typeof window != 'undefined' ? window : {}), (typeof module != 'undefined' ? module : {}), (typeof require != 'undefined' ? require : function() {}), globalThis.ensemble));
