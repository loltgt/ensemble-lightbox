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

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  var REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  var DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;

  var Compo = /*#__PURE__*/function () {
    //private proposal
    //TODO
    // tag, name
    function Compo(ns, tag, name, props) {
      _classCallCheck(this, Compo);

      if (!(this instanceof Compo ? this.constructor : void 0)) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      var _ns = this._ns = '_' + ns;

      var ctag = name ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(ctag)) {
        throw new Error("ensemble.Compo error: The tag name provided ('".concat(ctag, "') is not a valid name."));
      }

      var node = this[_ns] = document.createElement(ctag);
      this[_ns].__compo = this;

      if (props && _typeof(props) == 'object') {
        for (var prop in props) {
          var cprop = prop.toString();

          if (DENIED_PROPS.test(cprop)) {
            throw new Error("ensemble.Compo error: The property name provided ('".concat(cprop, "')' is not a valid name."));
          }

          if (cprop.indexOf('on') === 0 && props[cprop]) {
            node[cprop] = props[cprop].bind(this);
          } else if (_typeof(props[cprop]) != 'object') {
            node[cprop] = props[cprop];
          } else if (cprop === 'children') {
            if (_typeof(props[cprop]) == 'object' && props[cprop].length) {
              var _iterator = _createForOfIteratorHelper(props.children),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var child = _step.value;
                  var _tag = child.tag;
                  var _name2 = child.name;
                  var _props = child.props;
                  this.append(new Compo(ns, _tag, _name2, _props));
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
          }
        }
      } //TODO args coherence


      if (name != false && name != true) {
        var _name = node.className;
        node.className = ns + '-' + tag;

        if (name) {
          node.className += ' ' + ns + '-' + name;
        }

        if (_name) {
          node.className += ' ' + _name;
        }
      }
    } // return bool


    _createClass(Compo, [{
      key: "install",
      value: function install(root, cb) {
        typeof cb === 'function' && cb.call(this, this[this._ns]);
        return !!root.appendChild(this[this._ns]);
      } // return bool

    }, {
      key: "uninstall",
      value: function uninstall(root, cb) {
        typeof cb === 'function' && cb.call(this, this[this._ns]);
        return !!root.removeChild(this[this._ns]);
      } // return bool

    }, {
      key: "up",
      value: function up(pholder, cb) {
        typeof cb === 'function' && cb.call(this, this[this._ns]);
        return !!pholder.replaceWith(this[this._ns]);
      } // return bool

    }, {
      key: "append",
      value: function append(compo) {
        var _ns = this._ns;
        return !!this[_ns].appendChild(compo[_ns]);
      } // return bool

    }, {
      key: "prepend",
      value: function prepend(compo) {
        var _ns = this._ns;
        return !!this[_ns].prependChild(compo[_ns]);
      } // return bool

    }, {
      key: "remove",
      value: function remove(compo) {
        var _ns = this._ns;
        return !!this[_ns].removeChild(compo[_ns]);
      } //TODO

    }, {
      key: "replace",
      value: function replace(compo) {} //TODO

    }, {
      key: "clone",
      value: function clone() {
        var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      }
    }, {
      key: "inject",
      value: function inject(node) {
        if (node instanceof Element === false || REJECTED_TAG_NAMES.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
          throw new Error('ensemble.Compo error: The remote object could not be resolved into a valid node.');
        }

        this.empty();

        this[this._ns].appendChild(node);
      }
    }, {
      key: "empty",
      value: function empty() {
        while (this.first) {
          this.remove(this.first);
        }
      }
    }, {
      key: "hasAttr",
      value: function hasAttr(attr) {
        return this[this._ns].hasAttribute(attr);
      }
    }, {
      key: "getAttr",
      value: function getAttr(attr) {
        return this[this._ns].getAttribute(attr);
      } // return undef

    }, {
      key: "setAttr",
      value: function setAttr(attr, value) {
        this[this._ns].setAttribute(attr, value);
      } // return undef

    }, {
      key: "delAttr",
      value: function delAttr(attr) {
        this[this._ns].removeAttribute(attr);
      }
    }, {
      key: "getStyle",
      value: function getStyle(prop) {
        return window.getComputedStyle(this[this._ns])[prop];
      }
    }, {
      key: "show",
      value: function show() {
        this[this._ns].hidden = false;
      }
    }, {
      key: "hide",
      value: function hide() {
        this[this._ns].hidden = true;
      }
    }, {
      key: "enable",
      value: function enable() {
        this[this._ns].disabled = false;
      }
    }, {
      key: "disable",
      value: function disable() {
        this[this._ns].disabled = true;
      }
    }, {
      key: "node",
      get: function get() {
        console.warn('ensemble.Compo', 'Direct access to the Element node is strongly discouraged.');
        return this[this._ns];
      }
    }, {
      key: "parent",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].parentElement && '__compo' in this[_ns].parentElement ? this[_ns].parentElement.__compo : null;
      }
    }, {
      key: "children",
      get: function get() {
        return Array.prototype.map.call(this[this._ns].children, function (node) {
          return node.__compo;
        });
      }
    }, {
      key: "first",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
      }
    }, {
      key: "last",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
      }
    }, {
      key: "previous",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
      }
    }, {
      key: "next",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
      }
    }, {
      key: "classList",
      get: function get() {
        return this[this._ns].classList;
      }
    }, {
      key: Symbol.toStringTag,
      get: //TODO undef
      function get() {
        return 'ensemble.Compo';
      }
    }], [{
      key: "isCompo",
      value: function isCompo(obj) {
        return Symbol.for(obj) === Symbol.for(Compo.prototype);
      }
    }]);

    return Compo;
  }();
  /*!
   * loltgt ensemble.Data
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  var Data = /*#__PURE__*/function () {
    function Data(ns, obj) {
      _classCallCheck(this, Data);

      if (!(this instanceof Data ? this.constructor : void 0)) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      if (obj && _typeof(obj) === 'object') {
        Object.assign(this, {}, obj);
      }

      var _ns = this._ns = '_' + ns;

      this[_ns] = {
        ns: ns
      };
    }

    _createClass(Data, [{
      key: "compo",
      value: function compo(tag, name, props) {
        var defer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var fresh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var stale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var ns = this[this._ns].ns;
        var compo;

        if (defer) {
          compo = {
            ns: ns,
            tag: tag,
            name: name,
            props: props,
            fresh: fresh,
            stale: stale
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
    }, {
      key: "render",
      value: function () {
        var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(slot) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _ns = this._ns;

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

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x) {
          return _render.apply(this, arguments);
        }

        return render;
      }()
    }, {
      key: "stale",
      value: function () {
        var _stale = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(slot) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _ns = this._ns;

                  if (this[_ns][slot] && this[_ns][slot].rendered) {
                    this[_ns][slot].stale();
                  }

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function stale(_x2) {
          return _stale.apply(this, arguments);
        }

        return stale;
      }()
    }, {
      key: "reflow",
      value: function () {
        var _reflow = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(slot, force) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _ns = this._ns;

                  if (force) {
                    this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
                  } else if (this[_ns][slot] && this[_ns][slot].rendered) {
                    this[_ns][slot].fresh();
                  }

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function reflow(_x3, _x4) {
          return _reflow.apply(this, arguments);
        }

        return reflow;
      }()
    }, {
      key: Symbol.toStringTag,
      get: function get() {
        return 'ensemble.Data';
      }
    }], [{
      key: "isData",
      value: function isData(obj) {
        return Symbol.for(obj) === Symbol.for(Data.prototype);
      }
    }]);

    return Data;
  }();
  /*!
   * loltgt ensemble.Event
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  var Event = /*#__PURE__*/function () {
    function Event(ns, name, node) {
      _classCallCheck(this, Event);

      if (!(this instanceof Event ? this.constructor : void 0)) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      var _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document;
      this[_ns] = {
        name: name,
        node: node
      };
    }

    _createClass(Event, [{
      key: "add",
      value: function add(handle) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this[this._ns].node.addEventListener(this[this._ns].name, handle, options);
      }
    }, {
      key: "remove",
      value: function remove(handle) {
        this[this._ns].node.removeEventListener(this[this._ns].name, handle);
      }
    }, {
      key: Symbol.toStringTag,
      get: function get() {
        return 'ensemble.Event';
      }
    }], [{
      key: "isEvent",
      value: function isEvent(obj) {
        return Symbol.for(obj) === Symbol.for(Event.prototype);
      }
    }]);

    return Event;
  }();
  /*!
   * loltgt ensemble.base
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  var base = /*#__PURE__*/function () {
    function base() {
      _classCallCheck(this, base);

      if (!(this instanceof base ? this.constructor : void 0)) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }
    }

    _createClass(base, [{
      key: "defaults",
      value: function defaults(_defaults, options) {
        var j = {};

        for (var k in _defaults) {
          if (_defaults[k] != null && _typeof(_defaults[k]) === 'object') {
            j[k] = Object.assign(_defaults[k], options[k]);
          } else {
            j[k] = typeof options[k] != 'undefined' ? options[k] : _defaults[k];
          }
        }

        return j;
      }
    }, {
      key: "compo",
      value: function compo(tag, name, props) {
        return tag ? new Compo(this.options.ns, tag, name, props) : Compo;
      }
    }, {
      key: "data",
      value: function data(obj) {
        return obj ? new Data(this.options.ns, obj) : Data;
      }
    }, {
      key: "event",
      value: function event(_event, node) {
        var concurrency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (typeof _event === 'string') {
          return new Event(this.options.ns, _event, node);
        } else if (_event) {
          _event.preventDefault();

          _event.target.blur();
        } else {
          return Event;
        }
      }
    }, {
      key: "selector",
      value: function selector(query, node) {
        var all = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        node = node || document;
        return all ? node.querySelectorAll(query) : node.querySelector(query);
      } // return bool

    }, {
      key: "appendNode",
      value: function appendNode(root, node) {
        return !!root.appendChild(node);
      } // return bool

    }, {
      key: "prependNode",
      value: function prependNode(root, node) {
        return !!root.prependChild(node);
      } // return bool

    }, {
      key: "removeNode",
      value: function removeNode(root, node) {
        return !!root.removeChild(node);
      }
    }, {
      key: "cloneNode",
      value: function cloneNode(node) {
        var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return node.cloneNode(deep);
      }
    }, {
      key: "hasAttr",
      value: function hasAttr(node, attr) {
        return node.hasAttribute(attr);
      }
    }, {
      key: "getAttr",
      value: function getAttr(node, attr) {
        return node.getAttribute(attr);
      } // return undef

    }, {
      key: "setAttr",
      value: function setAttr(node, attr, value) {
        node.setAttribute(attr, value);
      } // return undef

    }, {
      key: "delAttr",
      value: function delAttr(node, attr) {
        node.removeAttribute(attr);
      }
    }, {
      key: "binds",
      value: function binds(method) {
        var self = this;
        return function (e) {
          method.call(self, e, this);
        };
      }
    }, {
      key: "delay",
      value: function delay(func, node, dtime) {
        var delay = node ? this.timing(node) : 0;
        setTimeout(func, delay || dtime);
      }
    }, {
      key: "timing",
      value: function timing(node) {
        var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'transitionDuration';
        var time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

        if (time) {
          time = time.indexOf('s') ? parseFloat(time) * 1e3 : parseInt(time);
        }

        return time || 0;
      }
    }]);

    return base;
  }();
  /*!
   * loltgt ensemble.Modal
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  var Modal = /*#__PURE__*/function (_base) {
    _inherits(Modal, _base);

    var _super = _createSuper(Modal);

    function Modal(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Modal);

      _this = _super.call(this);

      _this._bindings();

      _this.options = _this.defaults(_this._defaults(), options);
      Object.freeze(_this.options);
      _this.element = element;
      return _this;
    }

    _createClass(Modal, [{
      key: "_defaults",
      value: function _defaults() {
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
            innerText: "\xD7",
            ariaLabel: 'Close'
          },
          onOpen: function onOpen() {},
          onClose: function onClose() {},
          onShow: function onShow() {},
          onHide: function onHide() {},
          onContent: function onContent() {}
        };
      }
    }, {
      key: "_bindings",
      value: function _bindings() {
        this.open = this.binds(this.open);
        this.close = this.binds(this.close);
        this.backx = this.binds(this.backx);
        this.keyboard = this.binds(this.keyboard);
      }
    }, {
      key: "generator",
      value: function generator() {
        var opts = this.options;
        var box = this.box = this.compo('dialog', true, {
          className: opts.ns,
          hidden: true,
          ariaModal: true,
          role: 'dialog',
          onclick: opts.backClose ? this.backx : null
        });
        var cnt = this.cnt = this.compo('content');
        var close = this.compo('button', 'close', opts.close);
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
    }, {
      key: "populate",
      value: function populate(target) {
        var content = this.content(this.element);
        this.cnt.append(content);
      }
    }, {
      key: "resume",
      value: function resume(target) {
        console.log('resume', target);
      }
    }, {
      key: "content",
      value: function content(node, clone) {
        var opts = this.options;
        var wrap = this.compo('object');
        clone = typeof clone != 'undefined' ? clone : opts.cloning;
        var inner = clone ? this.cloneNode(node, true) : node;
        opts.onContent.call(this, this, wrap, inner);

        if (inner) {
          wrap.inject(inner);
        }

        return wrap;
      } //TODO

    }, {
      key: "destroy",
      value: function destroy() {
        this.box.remove();
        this.built = false;
      }
    }, {
      key: "open",
      value: function open(e, target) {
        this.event(e);
        if (this.opened) return;
        var opts = this.options;

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
    }, {
      key: "close",
      value: function close(e, target) {
        this.event(e);
        if (!this.opened) return;
        var opts = this.options;
        this.opened = false;
        opts.onClose.call(this, this, target, e);
        this.hide(target);

        if (opts.keyboard) {
          this.event('keydown').remove(this.keyboard);
        }

        console.log('close', this);
      }
    }, {
      key: "show",
      value: function show(target) {
        var opts = this.options;
        var root = this.root;
        var box = this.box;
        box.install(root);
        this.delay(function () {
          box.show();
          opts.onShow.call(self, self, target);
        });
      }
    }, {
      key: "hide",
      value: function hide(target) {
        var opts = this.options;
        var root = this.root;
        var box = this.box;
        box.hide();
        this.delay(function () {
          box.uninstall(root);
          opts.onHide.call(self, self, target);
        }, box, 3e2);
      } //TODO

    }, {
      key: "backx",
      value: function backx(e) {
        this.event(e);
        if (e.target != this.box && e.target != this.cnt) return;
        this.close(e);
      }
    }, {
      key: "keyboard",
      value: function keyboard(e) {
        this.event(e);
        var kcode = e.keyCode || 0; // Escape

        if (kcode === 27) this.close(e);
      }
    }]);

    return Modal;
  }(base);
  /*!
   * loltgt ensemble.Lightbox
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */


  _exports.Modal = Modal;

  var Lightbox = /*#__PURE__*/function (_Modal) {
    _inherits(Lightbox, _Modal);

    var _super2 = _createSuper(Lightbox);

    function Lightbox() {
      _classCallCheck(this, Lightbox);

      return _super2.apply(this, arguments);
    }

    _createClass(Lightbox, [{
      key: "_defaults",
      value: function _defaults() {
        return Object.assign(_get(_getPrototypeOf(Lightbox.prototype), "_defaults", this).call(this), {
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
            innerText: "<",
            ariaLabel: 'Previous'
          },
          next: {
            onclick: this.next,
            innerText: ">",
            ariaLabel: 'Next'
          },
          onStep: function onStep() {},
          onSlide: function onSlide() {},
          onCaption: function onCaption() {}
        });
      }
    }, {
      key: "_bindings",
      value: function _bindings() {
        _get(_getPrototypeOf(Lightbox.prototype), "_bindings", this).call(this);

        this.add = this.binds(this.add);
        this.remove = this.binds(this.remove);
        this.prev = this.binds(this.prev);
        this.next = this.binds(this.next);
      }
    }, {
      key: "generator",
      value: function generator() {
        var box = _get(_getPrototypeOf(Lightbox.prototype), "generator", this).call(this);

        var cnt = this.cnt;
        var opts = this.options;
        var gallery = this.gallery = this.compo('gallery');
        cnt.append(gallery);
        box.classList.add(opts.ns + '-lightbox');

        if (opts.navigation) {
          var nav = this.nav = this.data(true);
          var wrap = nav.wrap = this.compo('nav');
          var prev = nav.prev = this.compo('button', 'prev', opts.prev);
          var next = nav.next = this.compo('button', 'next', opts.next);
          wrap.append(prev);
          wrap.append(next);
        }

        if (opts.captioned) {
          var captions = this.captions = this.data(true);
          captions.wrap = this.compo('captions');
        }

        if (opts.overlayed) {
          var overlay = opts.overlayed.toString().match(/captions|navigation/);
          box.classList.add(opts.ns + '-overlayed');

          if (overlay) {
            box.classList.add(opts.ns + '-overlayed-' + overlayed[0]);
          }
        }

        if (opts.autoHide) {
          var autohide = opts.autoHide.toString().match(/captions|navigation/);
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
    }, {
      key: "populate",
      value: function populate(target) {
        console.log('populate', target);
        var opts = this.options;
        var contents;

        if (opts.contents && _typeof(opts.contents) == 'object') {
          contents = opts.contents;
        } else if (opts.selector) {
          contents = this.selector(opts.selector, this.element, true);
        }

        contents = this.contents = this.prepare(contents);

        var _iterator2 = _createForOfIteratorHelper(contents),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var obj = _step2.value;
            var content = this.content(obj);

            if (target && target === content.ref) {
              this.index = contents.indexOf(content);
              this.current = content;
            }

            this.add(content);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        this.current = this.current || contents[0];
        this.index = this.index || 0;
        this.slide(0);
        opts.navigation && this.navigation();
        opts.captioned && this.caption();
      }
    }, {
      key: "resume",
      value: function resume(target) {
        console.log('resume', target);
        var opts = this.options;
        var contents = this.contents;

        var _iterator3 = _createForOfIteratorHelper(contents),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var content = _step3.value;
            content.wrap.hide();

            if (target && target === content.ref) {
              this.index = contents.indexOf(content);
              this.current = content;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
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

    }, {
      key: "content",
      value: function content(src, clone) {
        var opts = this.options;
        var wrap = this.compo('object');
        wrap.hide();
        var data;

        if (typeof src == 'string') {
          data = this.data({
            src: src
          });
        } else {
          data = src;
        }

        var csrc = data.src;
        var ctype = data.type;

        if (ctype) {
          ctype = ctype.match(/(^image|video|audio)|(pdf$)/);
          ctype = ctype ? ctype[0] : '';
        }

        var exref = /^https?:\/\//.test(csrc);
        var dhref = false;
        var xclassn;

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
          var worigin = window.origin != 'null' ? window.origin : window.location.origin;
          var corigin = new URL(csrc).origin;

          if (worigin != corigin) {
            ctype = '';
          }
        }

        if (csrc && !ctype) {
          //TODO
          if (csrc[0] === '#') {
            var qel = this.selector(csrc);

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

        var inner = this.inner(data);

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

    }, {
      key: "inner",
      value: function inner(data) {
        var tag = data.type;
        var name = true;
        var props = {};

        for (var prop in data) {
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

              if (data.sources && _typeof(data.source) == 'object') {
                var _iterator4 = _createForOfIteratorHelper(data.sources),
                    _step4;

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var source = _step4.value;
                    props.children.push({
                      tag: 'source',
                      name: true,
                      props: source
                    });
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              } else if (data.children && data.children.length) {
                var _iterator5 = _createForOfIteratorHelper(data.children),
                    _step5;

                try {
                  for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                    var child = _step5.value;

                    var _tag2 = child.tagName.toLowerCase();

                    if (_tag2 != 'source' || _tag2 != 'img') {
                      continue;
                    }

                    props.children.push({
                      tag: _tag2,
                      name: true,
                      props: child.attributes
                    });
                  }
                } catch (err) {
                  _iterator5.e(err);
                } finally {
                  _iterator5.f();
                }
              }
            }

            break;

          case 'video':
          case 'audio':
            props.controls = data.controls ? data.controls : true;
            props.children = [];

            if (data.sources && _typeof(data.sources) == 'object') {
              var _iterator6 = _createForOfIteratorHelper(data.sources),
                  _step6;

              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  var _source = _step6.value;
                  props.children.push({
                    tag: 'source',
                    name: true,
                    props: _source
                  });
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }

              if (data.subtitles && _typeof(data.subtitles) == 'object') {
                var _iterator7 = _createForOfIteratorHelper(data.subtitles),
                    _step7;

                try {
                  for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                    var track = _step7.value;
                    props.children.push({
                      tag: 'track',
                      name: true,
                      props: track
                    });
                  }
                } catch (err) {
                  _iterator7.e(err);
                } finally {
                  _iterator7.f();
                }
              }
            } else if (data.children && data.children.length) {
              var _iterator8 = _createForOfIteratorHelper(data.children),
                  _step8;

              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  var _child = _step8.value;

                  var _tag3 = _child.tagName.toLowerCase();

                  if (_tag3 != 'source' || _tag3 != 'track') {
                    continue;
                  }

                  props.children.push({
                    tag: _tag3,
                    name: true,
                    props: _child.attributes
                  });
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
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
          tag: tag,
          name: name,
          props: props
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

    }, {
      key: "prepare",
      value: function prepare(contents) {
        var c = [];

        if (contents && _typeof(contents) == 'object' && contents.length) {
          var _iterator9 = _createForOfIteratorHelper(contents),
              _step9;

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var obj = _step9.value;

              if (_typeof(obj) == 'object' && 'nodeName' in obj) {
                var data = this.data(true);
                var sds = obj.dataset;
                Object.assign(data, sds);
                data.ref = obj;

                if (sds.sources) {
                  try {
                    data.sources = JSON.parse(sds.sources);
                  } catch (_unused) {}
                }

                if (obj.href) {
                  data.src = obj.href;
                } else if (sds.href) {
                  data.src = sds.href;
                } else if (/iframe|img|picture|video|audio/i.test(obj.nodeName)) {
                  var tag = obj.nodeName.toLowerCase();

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
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
        }

        return c;
      }
    }, {
      key: "add",
      value: function add(content) {
        this.gallery.append(content.wrap);
        this.options.navigation && this.navigation();
      }
    }, {
      key: "remove",
      value: function remove(content) {
        this.gallery.remove(content.wrap);
        this.options.navigation && this.navigation();
      }
    }, {
      key: "prev",
      value: function prev(e) {
        this.event(e);
        this.slide(-1);
      }
    }, {
      key: "next",
      value: function next(e) {
        this.event(e);
        this.slide(1);
      }
    }, {
      key: "slide",
      value: function slide(step) {
        var opts = this.options;

        if (!opts.infinite && this.way != 0 && this.way === step) {
          return;
        }

        var contents = this.contents;
        var index = this.index;
        var current = this.current;
        var adjacent = current;
        opts.onStep.call(this, this, current, step);

        if (step != 0) {
          var clenm1 = contents.length - 1;
          var sibling = step === -1 ? contents[index - 1] : contents[index + 1];
          var child = step === -1 ? contents[clenm1] : contents[0];
          adjacent = !!sibling ? sibling : child;
          index = !!sibling ? step === -1 ? index - 1 : index + 1 : step === -1 ? clenm1 : 0;
          current.stale('inner');
        }

        if (!opts.infinite) {
          var way = 0;

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
    }, {
      key: "navigation",
      value: function navigation(way) {
        var nav = this.nav;

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
    }, {
      key: "caption",
      value: function caption(text) {
        var opts = this.options;
        var captions = this.captions;
        var current = this.current;
        captions.wrap.empty();

        if (opts.onCaption(this, this, current, text)) {
          return;
        }

        if (!text) {
          if (current.caption) {
            text = current.caption;
          } else if (opts.selector) {
            var ref = current.ref;

            if (this.hasAttr(ref, 'title')) {
              text = this.getAttr(ref, 'title');
            } else if (current.type === 'image') {
              var img = this.selector('img', ref);
              text = img.alt;
            }
          }
        }

        if (text) {
          text = text.split(/\n\n|\r\n\r\n/);

          var _iterator10 = _createForOfIteratorHelper(text),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var line = _step10.value;
              var caption = this.compo('p', true, {
                innerText: line
              });
              captions.wrap.append(caption);
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        }
      }
    }, {
      key: "keyboard",
      value: function keyboard(e) {
        _get(_getPrototypeOf(Lightbox.prototype), "keyboard", this).call(this, e);

        var kcode = e.keyCode || 0;

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
    }]);

    return Lightbox;
  }(Modal);

  _exports.Lightbox = Lightbox;
});
//# sourceMappingURL=ensemble-lightbox-compat.js.map
