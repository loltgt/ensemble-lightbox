/*!
 * loltgt ensemble.Lightbox
 *
 * @version 0.0.1
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

// (function(window, module, require, ensemble) {

  // const Modal = ensemble ? ensemble.Modal : require('../../../ensemble-modal/src/js/Modal');

  import { Modal } from '../../../ensemble-modal/src/js/Modal.js';


  class Lightbox extends Modal {

    _defaults() {
      return Object.assign(super._defaults(), {
        selector: '',
        contents: null,
        navigation: true,
        captioned: true,
        infinite: true,
        autoDiscover: true,
        autoHide: 'navigation', // true | 'captions|navigation'
        overlayed: false, // true | 'captions|navigation'
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
      super.generator();

      const box = this.box.wrap;
      const cnt = this.cnt;
      const opts = this.options;

      const gallery = this.gallery = this.compo('gallery');
      cnt.append(gallery);

      box.classList.add(opts.ns + '-lightbox');

      if (opts.navigation) {
        var nav = this.nav = this.data(true);
        const wrap = nav.wrap = this.compo('nav');
        const prev = nav.prev = this.compo('button', 'prev', opts.prev);
        const next = nav.next = this.compo('button', 'next', opts.next);

        wrap.append(prev);
        wrap.append(next);
      }

      if (opts.captioned) {
        var captions = this.captions = this.data(true);
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
        data = this.data({ src });
      } else {
        data = src;
      }

      const csrc = data.src;
      let mtype = data.type;
      let ctype = data.type;

      if (ctype) {
        ctype = ctype.match(/(^image|video|audio)|(pdf$)/);
        ctype = ctype ? ctype[0] : '';
      }

      const exref = /^https?:\/\//.test(csrc);
      let dhref = false;
      let xclassm;

      if (opts.autoDiscover && csrc && ! ctype) {
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
      if (ctype == 'pdf') {
        ctype = 'iframe';
        xclassm = 'pdf';
      }
      //TODO
      // backward compatibility
      if (opts.checkOrigin && csrc && exref && ! dhref) {
        const worigin = window.origin != 'null' ? window.origin : window.location.origin;
        const corigin = new URL(csrc).origin;

        if (worigin != corigin) {
          ctype = '';
        }
      }

      if (csrc && ! ctype) {
        //TODO
        if (csrc[0] == '#') {
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
      if (! xclassm && mtype != ctype) {
        xclassm = mtype;
      }

      data.ref = data.ref || null;
      data.type = ctype;
      data.src = csrc;

      opts.onContent.call(this, this, data);

      if (ctype) {
        wrap.classList.add(opts.ns + '-' + ctype);
      }
      if (xclassm) {
        wrap.classList.add(opts.ns + '-' + xclassm);
      }

      const inner = this.inner(data);

      data.fresh = function() {
        data.node && data.inner.inject(data.node);
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
                props.children.push({ tag: 'source', name: true, props: source });
              }
            } else if (data.children && data.children.length) {
              for (const child of data.children) {
                const tag = child.tagName.toLowerCase();

                if (tag != 'source' || tag != 'img') {
                  continue;
                }

                props.children.push({ tag: tag, name: true, props: child.attributes });
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
              props.children.push({ tag: 'source', name: true, props: source });
            }

            if (data.subtitles && typeof data.subtitles == 'object') {
              for (const track of data.subtitles) {
                props.children.push({ tag: 'track', name: true, props: track });
              }
            }
          } else if (data.children && data.children.length) {
              for (const child of data.children) {
                const tag = child.tagName.toLowerCase();

                if (tag != 'source' || tag != 'track') {
                  continue;
                }

                props.children.push({ tag: tag, name: true, props: child.attributes });
              }
          }

          break;

        case 'iframe':
          props.frameBorder = 0;

          if (! props.src) return null;

          break;

        default:
          tag = 'div';
          name = 'custom-element';
      }

      return { tag, name, props };
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
            const data = this.data(true);
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
            c.push(this.data(true));
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

      if (! opts.infinite && this.way != 0 && this.way === step) {
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

        adjacent = !! sibling ? sibling : child;
        index = !! sibling ? (step === -1 ? index - 1 : index + 1) : (step === -1 ? clenm1 : 0);

        current.stale('inner');
      }

      if (! opts.infinite) {
        let way = 0;

        if (! adjacent.wrap.previous) {
          way = -1;
        } else if (! adjacent.wrap.next) {
          way = 1;
        }

        this.way = parseInt(way);

        if (opts.navigation) {
          this.navigation(way);
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

      if (! this.options.infinite && typeof way != 'undefined') {
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

      if (! text) {
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
          const caption = this.compo('p', true, { innerText: line });
          captions.wrap.append(caption);
        }
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


  // window.ensemble = { ...ensemble, ...{ Lightbox } };
  // module.exports = Lightbox;

// }((typeof window != 'undefined' ? window : {}), (typeof module != 'undefined' ? module : {}), (typeof require != 'undefined' ? require : function() {}), globalThis.ensemble));


export { Lightbox, Modal };