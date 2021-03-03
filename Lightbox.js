/*!
 * loltgt ensemble.Lightbox
 *
 * @version 0.0.1
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */


'use strict';

(function(ensemble) {

  class Lightbox extends ensemble.Modal {

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

      this.add = this.add.bind(this);
      this.remove = this.remove.bind(this);
      this.prev = this.prev.bind(this);
      this.next = this.next.bind(this);
    }

    sanitize(contents) {
      return contents && contents.length ? contents : [ this.element ];
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
      const opts = this.options;

      let contents;

      if (opts.contents && typeof opts.contents === 'object') {
        contents = opts.contents;
      } else if (opts.selector) {
        contents = this.selector(opts.selector, this.element, true);
      }
      contents = this.sanitize(contents);

      for (const node of contents) {
        const content = this.content(node);

        // target
        if (target === content.srcNode || target.parentElement === content.srcNode) {
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
        //TODO
        // direct access to reserved __compo
        this.setAttr(child.__compo, 'hidden', true);

        // target
        if (target === child.__compo.srcNode || target.parentElement === child.__compo.srcNode) {
          this.current = child.__compo;
        }
      }

      if (! this.current) {
        this.current = this.gallery.first;
      }

      this.slide(0);

      opts.navigation && this.navigation();
      opts.captioned && this.caption();
    }

    content(node, clone) {
      const wrap = super.content();
      const opts = this.options;

      let chref;
      let ctype;

      if (this.hasAttr(node, 'data-href')) {
        chref = node.dataset.href;
      } else if (this.hasAttr(node, 'href')) {
        chref = node.href;
      }

      // const exref = /^https?:\/\//.test(chref);
      const exref = true;

      let dhref = false;

      if (this.hasAttr(node, 'data-content-type')) {
        if (/^image/.test(node.dataset.contentType)) {
          ctype = 'image';
        }
      } else if (opts.autoDiscover) {
        if (/\.jpg|\.jpeg|\.png|\.apng|\.gif|\.webp|\.avif|\.bmp|\.svg$/i.test(chref)) {
          ctype = 'image';
        } else if (/^data:image\/jpeg|png|apng|gif|webp|avif|bmp|svg\+xml/.test(chref)) {
          dhref = true;
          ctype = 'image';
        } else if (/\.pdf$/.test(chref)) {
          ctype = 'pdf';
        }
      }
      if (opts.checkOrigin) {
        const whost = window.origin;
        const chost = chref.replace(/^(.+\/\/[^\/]+).*$/, '$1');

        // if (! exref && dhref || whost != chost) {
        //   ctype = '';
        // }
      }

      let inner;

      if (ctype === 'image') {
        inner = this.compo('img', true, {
          src: chref
        });
      } else if (chref) {
        if (chref[0] === '#') {
          const qel = this.selector(chref);

          if (qel) {
            inner = cloning ? this.clone(qel, true) : qel;
          }
        } else if (exref) {
          inner = this.compo('iframe', true, {
            src: chref,
            frameborder: 0
          });
          wrap.classList.add(opts.ns + '-iframe');
        }
      }

      wrap.classList.add(opts.ns + '-' + (ctype || 'element'));
      wrap.srcNode = node;
      wrap.setAttr('hidden', true);

      if (inner) {
        wrap.append(inner);
      }

      return wrap;
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
      e.preventDefault();
      e.target.blur();

      this.slide(-1);
    }

    next(e) {
      e.preventDefault();
      e.target.blur();

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


  globalThis.ensemble = { ...ensemble, ...{ Lightbox } };

}(globalThis.ensemble));
