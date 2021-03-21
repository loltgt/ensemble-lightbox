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

  /**
   * @namespace ensemble
   * @exports Compo
   */

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Modal = _exports.Lightbox = void 0;

  const _Symbol$2 = typeof Symbol == 'undefined' ? 0 : Symbol;

  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;
  /**
   * Compo is a composition element with shorthands method and utils.
   * 
   * It is a wrapper around an Element node [DOM].
   * It could be used as a base for abstraction of a custom component element.
   *
   * @example
   * new ensemble.Compo('namespace-of-my-foo-component', 'div', 'foo', { id: 'fooDiv', tabIndex: 1 });
   * @class
   */

  class Compo {
    /**
     * Constructor method.
     *
     * @see document.createElement()
     * @see document.createElementNS()
     *
     * //global document.createElement
     * @constructs
     * @constant {RegExp} REJECTED_TAG_NAMES - A regular expression for rejected tag names
     * @constant {RegExp} REJECTED_TAGS - A regular expression for rejected tag
     * @constant {RegExp} DENIED_PROPS - A regular expression for denied properties
     * @param {string} ns - Composition namespace
     * @param {string} tag - The [DOM] Element node tag -or- component name
     * @param {string} name
     * @param {object} props - Properties for Element node -or- component
     * @todo tag, name
     */
    constructor(ns, tag, name, props) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      const ctag = name ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(ctag)) {
        throw new Error(`ensemble.Compo error: The tag name provided (\'${ctag}\') is not a valid name.`);
      }

      const node = this[_ns] = document.createElement(ctag); //TODO

      this.__Compo = true;
      this[_ns].__compo = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const cprop = prop.toString();

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
    /**
     * Install the composition.
     *
     * @see HTMLElement.appendChild()
     *
     * @param {Element} root - A valid Element node
     * @param {function} cb - A function callback
     * @returns {boolean}
     */


    install(root, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]);
      return !!root.appendChild(this[this._ns]);
    }
    /**
     * Uninstall the composition.
     *
     * @see Element.removeChild()
     *
     * @param {Element} root - A valid Element node
     * @param {function} cb - A function callback
     * @returns {boolean}
     */


    uninstall(root, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]);
      return !!root.removeChild(this[this._ns]);
    }
    /**
     * Loads the composition replacing a placeholder element.
     *
     * @see Element.replaceWith()
     *
     * @param {Element} pholder - A valid Element node
     * @param {function} cb - A function callback
     * @returns {boolean}
     * @todo backward compatibility
     */


    up(pholder, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]);
      return !!pholder.replaceWith(this[this._ns]);
    }
    /**
     * Appends a compo inside this composition.
     *
     * @see Element.appendChild()
     *
     * @param {ensemble.Compo} compo - An ensemble.Compo composition
     * @returns {boolean}
     */


    append(compo) {
      const _ns = this._ns;
      return !!this[_ns].appendChild(compo[_ns]);
    }
    /**
     * Prepends a compo inside this composition.
     *
     * @see Element.prependChild()
     *
     * @param {ensemble.Compo} compo - An ensemble.Compo composition
     * @returns {boolean}
     */


    prepend(compo) {
      const _ns = this._ns;
      return !!this[_ns].prependChild(compo[_ns]);
    }
    /**
     * Removes a compo from this composition.
     *
     * @see Element.removeChild()
     *
     * @param {ensemble.Compo} compo - An ensemble.Compo composition
     * @returns {boolean}
     */


    remove(compo) {
      const _ns = this._ns;
      return !!this[_ns].removeChild(compo[_ns]);
    }
    /**
     * Replace this composition with another compo.
     *
     * @todo TODO
     * @param {ensemble.Compo} compo - An ensemble.Compo composition
     */


    replace(compo) {}
    /**
     * Clones this composition.
     * 
     * @todo TODO
     * @param {boolean} deep - Clone also all compo inside this composition
     */


    clone(deep = false) {}
    /**
     * Inject an element node inside this composition.
     * Note that any inner element contained will be removed.
     *
     * @see Element.appendChild()
     *
     * @param {Element} node - A valid Element node
     * @returns {boolean}
     */


    inject(node) {
      if (node instanceof Element == false || REJECTED_TAG_NAMES.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
        throw new Error('ensemble.Compo error: The remote object could not be resolved into a valid node.');
      }

      this.empty();
      return !!this[this._ns].appendChild(node);
    }
    /**
     * Empty this composition.
     * Any inner element contained will be removed.
     *
     * @see Element.remove()
     */


    empty() {
      while (this.first) {
        //TODO
        // backward compatibility
        this.remove(this.first);
      }
    }
    /**
     * Check for an attribute of this composition.
     *
     * @see Element.hasAttribute()
     *
     * @param {string} attr - An attribute
     * @returns {boolean}
     */


    hasAttr(attr) {
      return this[this._ns].hasAttribute(attr);
    }
    /**
     * Gets an attribute from this composition.
     *
     * @see Element.getAttribute()
     *
     * @param {string} attr - An attribute
     * @returns {string}
     */


    getAttr(attr) {
      return this[this._ns].getAttribute(attr);
    }
    /**
     * Sets an attribute in this composition.
     *
     * @see Element.setAttribute()
     *
     * @param {string} attr - An attribute
     * @param {string} value - The value
     */


    setAttr(attr, value) {
      this[this._ns].setAttribute(attr, value);
    }
    /**
     * Removes an attribute from this composition. 
     *
     * @see Element.removeAttribute()
     *
     * @param {string} attr - An attribute
     */


    delAttr(attr) {
      this[this._ns].removeAttribute(attr);
    }
    /**
     * Gets a current style property.
     *
     * @see window.getComputedStyle()
     *
     * //global window.getComputedStyle
     * @param {string} prop - A style property
     * @returns {mixed}
     */


    getStyle(prop) {
      return window.getComputedStyle(this[this._ns])[prop];
    }
    /**
     * Time to show this composition.
     */


    show() {
      this[this._ns].hidden = false;
    }
    /**
     * Time to hide this composition.
     */


    hide() {
      this[this._ns].hidden = true;
    }
    /**
     * Util to set attribute disabled to true
     */


    enable() {
      this[this._ns].disabled = false;
    }
    /**
     * Util to set attribute disabled to false
     */


    disable() {
      this[this._ns].disabled = true;
    }
    /**
     * Getter for node property, intended as the Element node inside this composition.
     * Note that a direct access to the Element node is discouraged.
     *
     * @var {getter}
     * @returns {Element}
     */


    get node() {
      console.warn('ensemble.Compo', 'Direct access to the Element node is strongly discouraged.');
      return this[this._ns];
    }
    /**
     * Getter for parent property, intended as the parent compo of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get parent() {
      const _ns = this._ns;
      return this[_ns].parentElement && '__compo' in this[_ns].parentElement ? this[_ns].parentElement.__compo : null;
    }
    /**
     * Getter for children property, intended as children compo of this composition.
     *
     * @var {getter}
     * @returns {array}
     */


    get children() {
      return Array.prototype.map.call(this[this._ns].children, node => {
        return node.__compo;
      });
    }
    /**
     * Getter for first property, intended as the first compo contained inside of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get first() {
      const _ns = this._ns;
      return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
    }
    /**
     * Getter for last property, intended as the last compo contained inside of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get last() {
      const _ns = this._ns;
      return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
    }
    /**
     * Getter for previous property, intended as the previous sibling of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get previous() {
      const _ns = this._ns;
      return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
    }
    /**
     * Getter for next property, intended as the next sibling of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get next() {
      const _ns = this._ns;
      return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
    }
    /**
     * Getter for classList property, intended as the classList of the Element node inside this composition.
     *
     * @var {getter}
     * @returns {DOMTokenList}
     */


    get classList() {
      return this[this._ns].classList;
    }
    /**
     * Check if passed object is an ensemble.Compo instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isCompo(obj) {
      if (_Symbol$2) return _Symbol$2.for(obj) === _Symbol$2.for(Compo.prototype);else return obj && typeof obj == 'object' && '__Compo' in obj;
    }
    /**
     * Getter for Symbol property, returns the symbolic name for ensemble.Compo class.
     *
     * @see Symbol.toStringTag
     *
     * @override
     * @returns {string}
     * @todo return undef
     * @todo backward compatibility
     */


    get [_Symbol$2.toStringTag]() {
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

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */


  const _Symbol$1 = typeof Symbol == 'undefined' ? 0 : Symbol;
  /**
   * Data is a multi-purpose utility object.
   * 
   * It could be used as a wrapper around a Compo composition, 
   * this object can store any kind of properties. 
   *
   * @example
   * new ensemble.Data('namespace-of-my-foo-component', { compo: ensemble.Compo, foo: 'a text string', fooObj: 'an object' });
   * @class
   */


  class Data {
    /**
     * Constructor method.
     *
     * @constructs
     * @param {string} ns - Data namespace
     * @param {object} obj - A starter Object
     */
    constructor(ns, obj) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const _ns = this._ns = '_' + ns;

      this.__Data = true;
      this[_ns] = {
        ns
      };
    }
    /**
     * The compo method is a utility render.
     * 
     * When you create a composition with this method, it will create a Compo composition or simply an Object placeholder.
     * With the defer render you can have it rendered in place, refresh, or freeze.
     *
     * //global ensemble.Compo
     * @param {string} tag - Element node tag -or- component name
     * @param {string} name
     * @param {object} props - Properties for Element node -or- component
     * @param {boolean} defer - Defer render for composition
     * @param {mixed} fresh - A function callback, called when is loaded the compo
     * @param {mixed} stale - A function callback, called when is unloaded the compo
     * @returns {mixed} compo - An ensemble.Compo element -or- an Object placeholder 
     */


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

      if (fresh && typeof fresh == 'function') {
        compo.fresh = props.onfresh = fresh;
      }

      if (stale && typeof stale == 'function') {
        compo.stale = props.onstale = stale;
      }

      return compo;
    }
    /**
     * Renderizes a composition, passed by reference.
     *
     * //global ensemble.Compo
     * @async
     * @param {mixed} slot - Reference of the element that will be rendered
     */


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
    /**
     * Freezes a composition, passed by reference.
     *
     * @async
     * @param {mixed} slot - Reference of the element that will be rendered
     */


    async stale(slot) {
      const _ns = this._ns;

      if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].stale();
      }
    }
    /**
     * Refresh a composition, passed by reference.
     *
     * @async
     * @param {mixed} slot - Reference of the element that will be rendered.
     * @param {boolean} force - It forces the reflow.
     */


    async reflow(slot, force) {
      const _ns = this._ns;

      if (force) {
        this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
      } else if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].fresh();
      }
    }
    /**
     * Check if passed object is an ensemble.Data instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isData(obj) {
      if (_Symbol$1) return _Symbol$1.for(obj) === _Symbol$1.for(Data.prototype);else return obj && typeof obj == 'object' && '__Data' in obj;
    }
    /**
     * Getter for Symbol property, returns the symbolic name for ensemble.Data class.
     *
     * @see Symbol.toStringTag
     *
     * @override
     * @returns {string}
     * @todo return undef
     * @todo backward compatibility
     */


    get [_Symbol$1.toStringTag]() {
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

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */


  const _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;
  /**
   * Event is an event manager.
   * 
   * It is a wrapper around the native Event [DOM].
   *
   * @example
   * new ensemble.Event('namespace-of-my-foo-component', 'mousewheel', node).add(func, { capture: true });
   * @class
   */


  class Event {
    /**
     * Constructor method.
     *
     * @see Element.addEventListener()
     * @see Element.removeElementListener()
     *
     * //global ensemble.Compo
     * @constructs
     * @param {string} ns - Event namespace
     * @param {string} name - The [DOM] Event type name
     * @param {Element} node - A valid Element node -or- component
     */
    constructor(ns, name, node) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document; //TODO

      this.__Event = true;
      this[_ns] = {
        name,
        node
      };
    }
    /**
     * Adds an event for this composition.
     *
     * @see Element.addEventListener()
     *
     * @param {function} handle - The function handler
     * @param {mixed} options - An options Object -or- useCapture boolean
     */


    add(handle, options = false) {
      this[this._ns].node.addEventListener(this[this._ns].name, handle, options);
    }
    /**
     * Removes an event from this composition.
     *
     * @see Element.removeElementListener()
     *
     * @param {function} handle - The function handler
     * @todo ? removes handle ref.
     */


    remove(handle) {
      this[this._ns].node.removeEventListener(this[this._ns].name, handle);
    }
    /**
     * Check if passed object is an ensemble.Event instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isEvent(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);else return obj && typeof obj == 'object' && '__Event' in obj;
    }
    /**
     * Getter for Symbol property, returns the symbolic name for ensemble.Event class.
     *
     * @see Symbol.toStringTag
     *
     * @override
     * @returns {string}
     * @todo return undef
     * @todo backward compatibility
     */


    get [_Symbol.toStringTag]() {
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

  /**
   * A base class for ensemble components.
   *
   * @abstract
   * @class
   */


  class base {
    /**
     * Constructor method.
     *
     * @constructs
     */
    constructor() {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }
    }
    /**
     * Creates an options Object from a defaults object of pre-defined properties.
     * 
     * Note it supports only the first level of depth.
     *
     * @param {object} defaults - The default options Object
     * @param {object} options - An options Object that would extends
     * @returns {object}
     */


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
    /**
     * Shorthand method for ensemble.Compo class.
     *
     * When passed the first argument it makes a new Compo instance, 
     * otherwise it returns a reference to the Compo class.
     *
     * //global ensemble.Compo
     * @param {string} ns - Composition namespace
     * @param {string} tag - The [DOM] Element node tag -or- component name
     * @param {string} name
     * @returns {mixed}
     */


    compo(tag, name, props) {
      return tag ? new Compo(this.options.ns, tag, name, props) : Compo;
    }
    /**
     * Shorthand method for ensemble.Data class.
     *
     * When passed the first argument it makes a new Data instance, 
     * otherwise it returns a reference to the Data class.
     *
     * //global ensemble.Data
     * @param {object} obj - A starter Object
     * @returns {mixed}
     */


    data(obj) {
      return obj ? new Data(this.options.ns, obj) : Data;
    }
    /**
     * Shorthand method for ensemble.Event class.
     *
     * When the passed first argument is a string it makes a new Event instance, 
     * if you pass an Event as the first argument, a preventDefault and blur will be performed, 
     * otherwise it returns a reference to the Event class.
     *
     * //global ensemble.Event
     * @param {object} obj - A starter Object
     * @returns {mixed}
     */


    event(event, node) {
      if (typeof event === 'string') {
        return new Event(this.options.ns, event, node);
      } else if (event) {
        event.preventDefault();
        event.target.blur();
      } else {
        return Event;
      }
    }
    /**
     * Shortcut to querySelectorAll() and querySelector() [DOM].
     *
     * @see Element.querySelectorAll()
     * @see Element.querySelector()
     *
     * //global document
     * @param {string} query - A text query
     * @param {Element} node - An Element node where find
     * @param {boolean} all - Find single or multiple elements
     * @return {mixed} - Element -or- ElementCollection
     */


    selector(query, node, all = false) {
      node = node || document;
      return all ? node.querySelectorAll(query) : node.querySelector(query);
    }
    /**
     * Shortcut to appendChild() [DOM].
     *
     * @see Element.appendChild()
     *
     * @param {Element} parent - An Element parent
     * @param {Element} node - An Element node to append
     * @returns {boolean}
     */


    appendNode(parent, node) {
      return !!parent.appendChild(node);
    }
    /**
     * Shortcut to prependChild() [DOM].
     *
     * @see Element.prependChild()
     *
     * @param {Element} parent - An Element parent
     * @param {Element} node - An Element node to prepend
     * @returns {boolean}
     */


    prependNode(parent, node) {
      return !!parent.prependChild(node);
    }
    /**
     * Shortcut to cloneNode() [DOM].
     *
     * @see Element.removeNode()
     *
     * @param {Element} parent - An Element parent
     * @param {Element} node - An Element node to remove
     * @returns {boolean}
     */


    removeNode(root, node) {
      return !!root.removeChild(node);
    }
    /**
     * Shortcut to Element.cloneNode() [DOM].
     *
     * @see Element.cloneNode()
     *
     * @param {Element} node - An Element node to clone
     * @param {boolean} deep - Clone also all children inside the Element node
     * @returns {boolean}
     */


    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }
    /**
     * Shortcut to Element.hasAttribute() [DOM].
     *
     * @see Element.hasAttribute()
     *
     * @param {Element} node - An Element node
     * @param {string} attr - An attribute
     * @returns {boolean}
     */


    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }
    /**
     * Shortcut to Element.getAttribute() [DOM].
     *
     * @see Element.getAttribute()
     *
     * @param {Element} node - An Element node
     * @param {string} attr - An attribute
     * @returns {string}
     */


    getAttr(node, attr) {
      return node.getAttribute(attr);
    }
    /**
     * Shortcut to Element.setAttribute() [DOM].
     *
     * @see Element.setAttribute()
     *
     * @param {Element} node - An Element node
     * @param {string} attr - An attribute
     * @param {string} value - The value
     */


    setAttr(node, attr, value) {
      node.setAttribute(attr, value);
    }
    /**
     * Shortcut to Element.removettribute() [DOM].
     *
     * @see Element.removeAttribute()
     *
     * @param {Element} node - An Element node
     * @param {string} attr - An attribute
     */


    delAttr(node, attr) {
      node.removeAttribute(attr);
    }
    /**
     * Creates a proxy function with bindings to instance and optionally an event.
     *
     * @param {function} method - A method from the current instance
     * @returns {function}
     * @todo untrusted method
     */


    binds(method) {
      const self = this;
      return function (e) {
        method.call(self, e, this);
      };
    }
    /**
     * Provides a delay and executes a callback function
     *
     * @see setTimeout()
     *
     * //global window.setTimeout
     * @param {function} func - A function callback
     * @param {mixed} node - An Element node -or- an ensemble.Compo composition
     * @param {int} dtime - A default value of time in milliseconds
     */


    delay(func, node, dtime) {
      const delay = node ? this.timing(node) : 0;
      setTimeout(func, delay || dtime);
    }
    /**
     * Calculates a time, based on a time property of the style of an element
     *
     * //global ensemble.Compo
     * //global window.getComputedStyle
     * @param {mixed} node - An Element node -or- an ensemble.Compo composition
     * @param {string} prop - A style property
     * @returns {int} time - Number of time in milliseconds
     */


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

  /**
   * ensemble.Modal component.
   *
   * @class
   * @extends base
   * @param {Element} element - A valid Element node to display in the modal dialog
   * @param {objects} options - Options object
   * @param {string} [options.ns=modal] - The namespace for modal
   * @param {string} [options.root=body] - The root Element node
   * @param {boolean} [options.fx=true] - Switch for allow effects
   * @param {boolean} [options.windowed=false] - Switch for framing in a window
   * @param {boolean} [options.cloning=true] - Allow cloning of passed element(s)
   * @param {boolean} [options.backClose=true] - Switch for closing on tap/click outside the content
   * @param {boolean} [options.keyboard=true] - Switch for keyboard navigation
   * @param {object} [options.close] - Custom parameters for close button
   * @param {function} [options.onOpen] - onOpen callback, fires when open modal
   * @param {function} [options.onClose] - onOpen callback, fires when close modal
   * @param {function} [options.onShow] - onShow callback, fires when show modal, after it openes
   * @param {function} [options.onHide] - onHide callback, fires when hide modal, before it closes
   * @param {function} [options.onContent] - onContent callback, fires when a content will be shown
   */


  class Modal extends base {
    /**
     * Options object default properties.
     *
     * @returns {object}
     */
    _defaults() {
      return {
        ns: 'modal',
        root: 'body',
        fx: true,
        windowed: false,
        cloning: true,
        backClose: true,
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
    /**
     * Methods binding.
     */


    _bindings() {
      this.open = this.binds(this.open);
      this.close = this.binds(this.close);
      this.backx = this.binds(this.backx);
      this.keyboard = this.binds(this.keyboard);
    }
    /**
     * Constructor method.
     */


    constructor(element, options = {}) {
      super();

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);
      this.element = element;
    }
    /**
     * The generator creates the container box with almost everything the component needs.
     *
     * @todo TODO
     */


    generator() {
      const opts = this.options;
      const data = this.box = this.data({
        onclick: false
      });
      const box = this.box.wrap = this.compo('dialog', true, {
        className: opts.ns,
        hidden: true,
        ariaModal: true,
        role: 'dialog',
        onclick: function () {
          data.onclick && typeof data.onclick == 'function' && data.onclick.apply(this, arguments);
        }
      }); //TODO
      // data.cnt

      const cnt = this.cnt = this.compo('content');
      const close = this.compo('button', 'close', opts.close);
      box.append(cnt);

      if (opts.windowed) {
        box.classList.add(opts.ns + '-windowed');
        cnt.append(close);
      } else {
        box.append(close);
      }

      if (opts.backClose) {
        this.box.onclick = this.backx;
      }

      if (opts.fx) {
        box.classList.add(opts.ns + '-fx');
      }

      this.root = this.selector(opts.root);
      this.built = true;
    }
    /**
     * In this stage the component is populated with all the content progeny.
     *
     * @param {Element} target - The element that is invoking
     * @todo TODO
     */


    populate(target) {
      console.log('ensemble.Modal', 'populate()', target);
      const content = this.content(this.element);
      this.cnt.append(content);
    }
    /**
     * Processing when the component is resumed.
     *
     * @param {Element} target - The element that is invoking
     * @todo TODO
     */


    resume(target) {
      console.log('ensemble.Modal', 'resume()', target);
    }
    /**
     * The single content.
     *
     * @param {Element} node - A valid Element node
     * @param {boolean} clone - Eventually clones Element nodes
     * @returns {Element} wrap - The wrapped (cloned) Element node
     * @todo TODO
     */


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
    }
    /**
     * @todo TODO
     */


    destroy() {
      const root = this.root;
      const box = this.box.wrap;
      this.removeNode(root, box);
      this.built = false;
    }
    /**
     * Opens the modal.
     *
     * @param {Event} e - An Event
     * @param {Element} target - The element that is invoking
     */


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

      console.log('ensemble.Modal', 'open()', this);
    }
    /**
     * Closes the modal.
     *
     * @param {Event} e - An Event
     * @param {Element} target - The element that is invoking
     */


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

      console.log('ensemble.Modal', 'close()', this);
    }
    /**
     * Shows the modal.
     *
     * @param {Element} target - The element that is invoking
     */


    show(target) {
      const opts = this.options;
      const root = this.root;
      this.box;
      const box = this.box.wrap;
      box.install(root);
      this.delay(function () {
        box.show();
        opts.onShow.call(self, self, target);
      });
    }
    /**
     * Hides the modal.
     *
     * @param {Element} target - The element that is invoking
     */


    hide(target) {
      const opts = this.options;
      const root = this.root;
      this.box;
      const box = this.box.wrap;
      box.hide();
      this.delay(function () {
        box.uninstall(root);
        opts.onHide.call(self, self, target);
      }, box, 3e2);
    }
    /**
     * Handles the close on tap/click outside the content.
     *
     * @param {Event} e - An Event
     * @todo test
     */


    backx(e) {
      this.event(e);
      const target = e.target;
      const parent = target.parentElement;
      const ns = this.options.ns;
      var regex;
      regex = new RegExp(ns + '-content');

      if (regex.test(target.className) || regex.test(parent.className)) {
        console.log('ensemble.Modal', 'backx()', 'outside cropbox area', ':then: close', parent, target);
        this.close(e);
      }

      regex = new RegExp(ns + '-object');

      if (!regex.test(target.className)) {
        console.log('ensemble.Modal', 'backx()', 'outside cropbox area', ':then: skip', parent, target);
        return;
      }

      const inner = target.firstElementChild,
            inner_w = inner.offsetWidth,
            inner_h = inner.offsetHeight;
      const target_t = target.offsetTop,
            target_l = target.offsetLeft,
            target_w = target.offsetWidth,
            target_h = target.offsetHeight;
      const x = event.x,
            y = event.y;
      const crop_t = (target_h - inner_h) / 2,
            crop_l = (target_w - inner_w) / 2,
            crop_b = crop_t + inner_h,
            crop_r = crop_l + inner_w;
      console.log('ensemble.Modal', 'backx()', 'coords', {
        x,
        y
      }, {
        target_t,
        target_l,
        target_w,
        target_h
      }, {
        crop_t,
        crop_r,
        crop_b,
        crop_l
      });

      if ((y > target_t || x > target_l || x < target_w || y < target_h) && (y < crop_t || x > crop_r || y > crop_b || x < crop_l)) {
        console.log('ensemble.Modal', 'backx()', 'outside cropbox area', ':then: close', parent, target);
        this.close(e);
      }
    }
    /**
     * Captures keyboard codes corresponding to functions to be triggered.
     *
     * @param {Event} e - An Event
     */


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

  /**
   * ensemble.Lightbox component.
   *
   * @class
   * @extends Modal
   * @param {Element} element - An optional Element node for lightbox grouping
   * @param {object} options - Options object
   * @param {string} [options.ns=modal] - The namespace for lightbox
   * @param {string} [options.root=body] - The root Element node
   * @param {string} [options.selector] - A selector to find elements
   * @param {object} [options.contents] - An object of contents
   * @param {boolean} [options.fx=true] - Switch for allow effects
   * @param {boolean} [options.windowed=false] - Switch for framing in a window
   * @param {boolean} [options.cloning=true] - Allow cloning of Element nodes
   * @param {boolean} [options.backClose=true] - Switch for closing on tap/click outside the content
   * @param {boolean} [options.keyboard=true] - Switch for keyboard navigation
   * @param {boolean} [options.navigation=true] - Switch for navigation
   * @param {boolean} [options.captioned=true] - Switch for captions
   * @param {boolean} [options.infinite=true] - Switch for carousel alike loop navigation
   * @param {boolean} [options.autoDiscover=true] - Switch for auto-discover type of contents
   * @param {mixed} [options.autoHide=navigation] - Switch for auto-hide "navigation" or "captions", boolean or string value, true for both
   * @param {mixed} [options.overlayed=false] - Switch for overlayed "navigation" or "captions", boolean or string value, true for both
   * @param {boolean} [options.checkOrigin=true] - Switch for a bland control of origin capted from src url
   * @param {object} [options.close] - Custom parameters for close button
   * @param {object} [options.prev] - Custom parameters for button of the previous arrow
   * @param {object} [options.next] - Custom parameters for button of the next arrow
   * @param {function} [options.onOpen] - onOpen callback, fires when open lightbox
   * @param {function} [options.onClose] - onOpen callback, fires when close lightbox
   * @param {function} [options.onShow] - onShow callback, fires when show lightbox, after it openes
   * @param {function} [options.onHide] - onHide callback, fires when hide lightbox, before it closes
   * @param {function} [options.onContent] - onContent callback, fires when a content will be shown
   * @param {function} [options.onStep] - onStep callback, fires when step between slides
   * @param {function} [options.onSlide] - onSlide callback, fires when slide
   * @param {function} [options.onCaption] - onCaption callback, fires when a caption will be shown
   */


  _exports.Modal = Modal;

  class Lightbox extends Modal {
    /**
     * Options object default properties.
     *
     * @returns {object}
     */
    _defaults() {
      return Object.assign(super._defaults(), {
        selector: '',
        contents: null,
        navigation: true,
        captioned: true,
        infinite: true,
        autoDiscover: true,
        autoHide: 'navigation',
        overlayed: false,
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
    /**
     * Methods binding.
     */


    _bindings() {
      super._bindings();

      this.add = this.binds(this.add);
      this.remove = this.binds(this.remove);
      this.prev = this.binds(this.prev);
      this.next = this.binds(this.next);
    }
    /**
     * The generator creates the container box with almost everything the component needs.
     *
     * @todo TODO
     */


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
    /**
     * In this stage the component is populated with all the content progeny.
     *
     * @param {Element} target - The element that is invoking
     * @todo TODO
     */


    populate(target) {
      console.log('ensemble.Lightbox', 'populate', target);
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
    /**
     * Processing when the component is resumed.
     *
     * @param {Element} target - The element that is invoking
     * @todo TODO
     */


    resume(target) {
      console.log('ensemble.Lightbox', 'resume', target);
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
    /**
     * The single content.
     *
     * //global window.origin
     * //global window.location
     * @param {mixed} src - A URL src -or- an ensemble.Data object
     * @param {boolean} clone - Eventually clones Element nodes
     * @returns {ensemble.Data} data - An ensemble.Data instance
     * @todo TODO
     */

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
      let mtype = data.type;
      let ctype = data.type;

      if (ctype) {
        ctype = ctype.match(/(^image|video|audio)|(pdf$)/);
        ctype = ctype ? ctype[0] : '';
      }

      const exref = /^https?:\/\//.test(csrc);
      let dhref = false;
      let xclassm;

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

      if (ctype == 'pdf') {
        ctype = 'iframe';
        xclassm = 'pdf';
      } //TODO
      // backward compatibility


      if (opts.checkOrigin && csrc && exref && !dhref) {
        const worigin = window.origin != 'null' ? window.origin : window.location.origin;
        const corigin = new URL(csrc).origin;

        if (worigin != corigin) {
          ctype = '';
        }
      }

      if (csrc && !ctype) {
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

      if (!xclassm && mtype != ctype) {
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
    /**
     * Detects and handles inner contents.
     *
     * @param {ensemble.Data} data - An ensemble.Data instance
     * @param {ref} data.ref - A reference to Element found by selector
     * @param {type} data.type - The content type
     * @param {src} data.src - The content source URL
     * @param {Element} [data.node] - A valid Element node that will be injected
     * @param {function} data.fresh - The function callback from ensemble.Data, fires when loaded
     * @param {function} data.stale - The function callback from ensemble.Data, fires when unloaded
     * @param {ensemble.Compo} data.wrap - The main composition of content
     * @param {mixed} data.inner - The inner content, Object placeholder -or- ensemble.Compo
     * @returns {object} props - Properties for composition 
     * @todo TODO
     */

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
    /**
     * The content preparation stage.
     *
     * @param {object} contents - The passed object of contents
     * @returns {array} c - An array of contents
     * @todo TODO
     */

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
    /**
     * Adds a content.
     *
     * @param {ensemble.Compo} content
     * @todo TODO
     */


    add(content) {
      this.gallery.append(content.wrap);
      this.options.navigation && this.navigation();
    }
    /**
     * Removes a content.
     *
     * @param {ensemble.Compo} content
     * @todo TODO
     */


    remove(content) {
      this.gallery.remove(content.wrap);
      this.options.navigation && this.navigation();
    }
    /**
     * Steps to previous slide.
     *
     * @param {Event} e - An Event
     * @todo TODO
     */


    prev(e) {
      this.event(e);
      this.slide(-1);
    }
    /**
     * Steps to next slide.
     *
     * @param {Event} e - An Event
     * @todo TODO
     */


    next(e) {
      this.event(e);
      this.slide(1);
    }
    /**
     * Slides to previous or next slide.
     *
     * @param {number} step - Step to previous: -1, Step to next: 1
     * @todo TODO
     */


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
    /**
     * Enable and disable the navigation.
     *
     * @param {number} way - Could step both: 0, Could step to next: -1, Could step to previous: 1
     * @todo TODO
     */


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
    /**
     * Inserts or overwrites caption text
     *
     * @param {string} text - Text content
     * @todo TODO
     */


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
    /**
     * Captures keyboard codes corresponding to functions to be triggered.
     *
     * @param {Event} e - An Event
     */


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