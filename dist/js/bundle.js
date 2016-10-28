webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	
	__webpack_require__(26);
	__webpack_require__(30);
	__webpack_require__(32);
	__webpack_require__(34);
	
	//import 'babel-polyfill';

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _xRoute = __webpack_require__(2);
	
	var _aController = __webpack_require__(3);
	
	var _controller = __webpack_require__(17);
	
	//model只涉及到数据模型,而controller即要和model同时还要和view进行交互.因此这里应该是引入controller
	/*import {modelA} from './modules/pageA/a-model';
	import {modelB} from './modules/pageB/b-model';*/
	var viewA = __webpack_require__(19);
	//import {controllerB} from 'modules/pageB/b-controller';
	
	var viewB = __webpack_require__(20);
	var viewC = __webpack_require__(21);
	
	_xRoute.route.addRoute('aaa', function () {
	    //modelA.pageInit();
	    var page = document.querySelector('#container');
	    //if (!controller.getInitedStatus) {
	    page.innerHTML = viewA;
	    _aController.controller.init();
	    //}
	}, { cache: 'on' }, _aController.controller.viewDestory, viewA);
	
	_xRoute.route.addRoute('bbb', function () {
	    //modelB.pageInit();
	    __webpack_require__.e/* nsure */(1, function () {
	        var controllerB = __webpack_require__(24);
	        var page = document.querySelector('#container');
	        page.innerHTML = viewB;
	        controllerB.init();
	        //console.log(123);
	    });
	    /*let page = document.querySelector('#container');
	    page.innerHTML = viewB;
	    controllerB.init();*/
	}, { cache: 'on' });
	
	_xRoute.route.addRoute('ccc', function () {
	    /*let page = document.querySelector('#container');
	    page.innerHTML = viewC;
	    controllerC.init();*/
	    !/* require.ensure */(function () {
	        var controllerC = __webpack_require__(17);
	        var page = document.querySelector('#container');
	        page.innerHTML = viewC;
	        controllerC.init();
	    }(__webpack_require__));
	});
	
	_xRoute.route.addRoute('ccc.1', function () {
	    var page = document.querySelector('.c-container');
	    page.innerHTML = __webpack_require__(22);
	    console.log('This\'s pagec-1');
	});
	
	_xRoute.route.addRoute('ccc.2', function () {
	    var page = document.querySelector('.c-container');
	    page.innerHTML = __webpack_require__(23);
	    console.log('This\'s pagec-2');
	});
	
	_xRoute.route.bootstrap();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Router = [],
	    useHash = false,
	    pageCache = {}; //在内存中进行缓存
	
	//一开始的判断是否支持H5 API
	if (!history.pushState) useHash = true;
	
	//不管是否支持H5 API, 统一的路由格式为:
	//  #/a/b/c
	
	//如果支持H5 API
	if (!useHash) {
	    window.addEventListener('popstate', function (e) {
	        var state = e.state;
	        //路由的处理
	        if (state && state.path) {
	            handleRoute(state.path, true);
	        }
	    });
	} else {
	    //hash发生变化时监听的方式,因为hashchange事件浏览器的支持度已经比较高了,所以使用hashchange
	
	    //低级浏览器使用 轮询
	    /*
	    let oldHash = location.hash;
	    setInterval(() => {
	        
	        if(oldHash != location.hash) {
	            //TODO do something
	            
	            //存储新的hash值
	            oldHash = location.hash;
	        } 
	    }, 100);*/
	
	    //hashchange方式
	    window.addEventListener('hashchange', function (e) {
	        handleRoute(location.hash);
	    });
	}
	
	//添加路由
	var addRoute = function addRoute() {
	    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
	    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	    var viewDestory = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
	    var view = arguments[4];
	    var context = arguments[5];
	
	    path = path.split('.').join('/'); //转化嵌套的路由   'ccc.aaa'  --->>>   'ccc/aaa'
	
	    var routeObj = {
	        path: path, //路由
	        cb: cb, //页面加载回调
	        config: config,
	        context: context,
	        viewDestory: viewDestory, //页面销毁回调
	        view: view //页面视图
	    };
	
	    Router.push(routeObj);
	};
	
	//路由拦截处理.拦截后返回true, 拦截不成功返回false
	var handleRoute = function handleRoute(path, isFromHistory) {
	
	    var curContext = void 0,
	        oldPath = location.hash.slice(2);
	
	    //页面销毁
	    Router.forEach(function (route, index) {
	        if (route.path === oldPath) {
	
	            route.viewDestory && route.viewDestory();
	
	            //页面视图缓存？？？这个可以放到页面初始化的过程?  视图文件已经打包到了js文件里,是否还需要单独添加
	            route.view && localStorage.setItem('view', route.view);
	        }
	    });
	
	    for (var i = 0; i < Router.length; i++) {
	        var routeItem = Router[i];
	        if (routeItem.path === path) {
	            //如果是嵌套内的路由被匹配,那么还应该还调用外层的路由回调
	            curContext = routeItem.context ? routeItem.context : window;
	
	            routeItem.cb.apply(curContext, [path]);
	
	            if (!useHash) {
	                //如果是从popstate中获取的状态,那么不应该将其加入历史状态栈中
	                if (!isFromHistory) {
	                    history.pushState({ path: path }, null, '#/' + path);
	                }
	            } else {
	                location.hash = '/' + path;
	            }
	
	            //激活状路由样式处理
	            routeClassHandle(path);
	
	            return true;
	        }
	    }
	    return false;
	};
	
	//TODO 事件冒泡路由拦截  <a href="a.html">   <a href="#/a">  这2种写法处理起来有什么区别?
	//路由的写法统一为:   <a data-href="aaa"></a>
	document.addEventListener('click', function (e) {
	    var href = e.target.dataset.href || '',
	        oldHash = location.hash.slice(2);
	
	    //将data-href数据形式转化为路由形式
	    href = href.split('-').join('/'); //将data-href='ccc-aaa' --->>> 转化为 ccc/aaa  外部写法可能存在出入,但是在内部统一转化为a/b/c/d的形式
	
	    if (href) {
	        //添加钩子 路由进行跳转时模型model上数据的处理
	        if (href === oldHash) return;
	
	        if (handleRoute(href)) {
	            //阻止默认事件
	            e.preventDefault();
	        }
	    }
	});
	
	//路由激活状态class控制
	var routeClassHandle = function routeClassHandle(hash) {
	    hash = hash.split('/').join('-');
	    document.querySelector('.route-active') && document.querySelector('.route-active').classList.remove('route-active');
	    document.querySelector('[data-href=' + hash + ']').classList.add('route-active');
	};
	
	var bootstrap = function bootstrap() {
	    document.addEventListener('DOMContentLoaded', function (e) {
	        var router = Router[0],
	            currHash = location.hash.slice(2),
	            flag = false;
	
	        var lastArr = currHash.split('/')[0];
	
	        //TODO 代码比较龊,可以优化的地方还很多
	        Router.forEach(function (item, index) {
	            if (item.path === lastArr) {
	                flag = true;
	                return item.cb.call(item.context || window);
	            }
	        });
	
	        if (lastArr !== currHash) {
	            Router.forEach(function (item, index) {
	                if (item.path === currHash) {
	                    return item.cb.call(item.context || window);
	                }
	            });
	        }
	
	        /*hashArr.forEach(function(hash, index) {
	            Router.forEach(function(item) {
	                if(item.path === currHash) {
	                    return item.cb.call(item.context || window);
	                }
	            })
	        })*/
	
	        /*Router.forEach(function (item, index) {
	            if (item.path === currHash) {
	                flag = true;
	                return item.cb.call(item.context || window);
	            }
	        });*/
	
	        //初始化active.route样式处理
	        routeClassHandle(currHash);
	
	        !flag ? router.cb.call(router.context || window) : '';
	    });
	};
	
	//TODO 路由的销毁(根据时间来判断)
	var route = {
	    addRoute: addRoute,
	    handleRoute: handleRoute,
	    bootstrap: bootstrap
	};
	
	exports.route = route;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.controller = undefined;
	
	var _controller = __webpack_require__(4);
	
	var _aModel = __webpack_require__(5);
	
	var _aModel2 = _interopRequireDefault(_aModel);
	
	var _util = __webpack_require__(8);
	
	var _index = __webpack_require__(9);
	
	var _imgResize = __webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var controller = _aModel2.default.registerController('controlA', '#container');
	
	/*modelA.get('/api', {})
	.then(function(data) {
		console.log(data);
	})*/
	
	controller.getDomMap({
		aContainer: '.a-container',
		myName: '.myName',
		myPhone: '.myPhone'
	}).getBindEvents({
		aContainer: {
			actionName: 'click',
			action: function action() {
				_util.elementSet.css(this, { color: 'red' });
			}
		},
		myName: {
			actionName: 'input',
			action: function action(e) {
				console.log(this.value);
			}
		},
		myPhone: {
			actionName: 'input',
			action: function action(e) {
				console.log(this.value);
			}
		}
	})
	//页面状态初始化.从localstorage中获取
	.getViewInit(function () {
		var doms = this.domMap;
		doms.myName.value = _aModel2.default.submitData.name;
	
		var timeSelect = new _index.timeSelectComponent();
	
		var nameEl = document.getElementById('name');
	
		timeSelect.configModule({
			startYearArr: [1972],
			containerArr: ['#name', '#name-test'],
			callbackArr: [function (time) {
				console.log(time);
			}]
		});
		//timeSelect.initTimeModule();
		timeSelect.initAlphaModule();
	
		var json = __webpack_require__(16),
		    _cityComponent = new _index.cityComponent();
	
		_cityComponent.configModule({
			allCities: json.data,
			succCb: function succCb(data) {
				console.log(data);
			},
			failCb: function failCb() {
				console.log('请选择城市');
			}
		});
	
		var cityWrapper = document.querySelector('.city-wrapper'),
		    clickBtn = document.querySelector('.btn'),
		    dialogBtn = document.querySelector('.alert-btn');
	
		var dialog = _index.dd.dialog || {};
	
		_cityComponent.initModule(cityWrapper);
	
		//城市组件
		clickBtn.addEventListener('click', function () {
			_util.util.addClass(cityWrapper, 'city-box-show');
		});
	
		//弹窗组件
		dialogBtn.addEventListener('click', function () {
			dialog.alert('It\'s a good job');
		});
	
		var imgContainer = document.getElementById('file');
		imgContainer.addEventListener('change', function (e) {
			var file = this.files[0];
			if (!file) return;
	
			//图片压缩
			(0, _imgResize.canvasResize)(file, {
				crop: false,
				quality: 0.1,
				rotate: 0,
				callback: function callback(baseStr) {
					var img = new Image();
					img.src = baseStr;
					document.body.appendChild(img);
				}
			});
		});
	}).getViewDestory(function () {
		//console.log('PageA is leaving now');
		//console.log(modelA.submitData);
		var pickerEl = document.querySelector('.picker');
		document.body.removeChild(pickerEl);
	});
	
	exports.controller = controller;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Controller = exports.Controller = function () {
	    function Controller(name, containerName, model) {
	        _classCallCheck(this, Controller);
	
	        this.name = name;
	        this.containerName = containerName || '';
	        this.containerBox = null;
	        this.domMap = {};
	        this.domMapCache = {};
	        this.eventCache = {};
	        this.model = model || {};
	        this.viewInit = null || function () {};
	        this.viewDestory = null || function () {};
	
	        this.inited = false;
	    }
	    //init函数
	
	
	    _createClass(Controller, [{
	        key: 'init',
	        value: function init() {
	            //console.log(this);
	            this.containerBox = document.querySelector(this.containerName);
	            this.setDomMap();
	            this.bindEvents();
	            this.model.pageInit();
	            this.viewInit();
	
	            this.inited = true;
	
	            return this;
	        }
	    }, {
	        key: 'setModelCache',
	        value: function setModelCache() {
	            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            this.model = obj;
	            return this;
	        }
	    }, {
	        key: 'getDomMap',
	        value: function getDomMap() {
	            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            this.domMapCache = obj;
	            return this;
	        }
	        //dom缓存
	
	    }, {
	        key: 'setDomMap',
	        value: function setDomMap() {
	            var obj = this.domMapCache;
	            for (var key in obj) {
	                this.domMap[key] = this.containerBox.querySelector(obj[key]);
	            }
	            return this;
	        }
	    }, {
	        key: 'getBindEvents',
	        value: function getBindEvents() {
	            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	            this.eventCache = obj;
	            return this;
	        }
	        //事件绑定
	
	    }, {
	        key: 'bindEvents',
	        value: function bindEvents() {
	            var obj = this.eventCache;
	            for (var key in obj) {
	                var item = obj[key];
	                this.domMap[key].addEventListener(item.actionName, item.action);
	            }
	            return this;
	        }
	    }, {
	        key: 'unbindEvent',
	        value: function unbindEvent() {}
	
	        //页面初始化(willAppear阶段)
	
	    }, {
	        key: 'getViewInit',
	        value: function getViewInit(fn) {
	            this.viewInit = fn.bind(this) || function () {};
	            return this;
	        }
	
	        //页面销毁阶段(willDisappear阶段)
	
	    }, {
	        key: 'getViewDestory',
	        value: function getViewDestory(fn) {
	            this.viewDestory = fn.bind(this) || function () {};
	            return this;
	        }
	
	        //获取controller的初始化状态
	
	    }, {
	        key: 'getInitedStatus',
	        get: function get() {
	            return this.inited;
	        }
	    }]);

	    return Controller;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _model = __webpack_require__(6);
	
	var modelA = _model.totalModel.init();
	
	modelA.name = 'modelA';
	modelA.setLocItem(modelA.name, 'HELLO WORLD');
	modelA.submitData = {
	    name: '',
	    phone: null,
	    sex: ''
	};
	//数据模型初始化
	modelA.pageInit = function () {
	    this.submitData.name = modelA.getLocItem(this.name);
	};
	modelA.save();
	
	//console.log(totalModel);
	console.log(modelA.pageInit.valueOf());
	
	exports.default = modelA;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.totalModel = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	__webpack_require__(7);
	
	var _controller = __webpack_require__(4);
	
	var Model = {
	    records: {},
	    //model创建后的回调
	    created: function created() {
	        this.records = {}; //创建新的model后,清空records,避免records被其他的model共享而发生副作用
	    },
	    extend: function extend() {
	        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var extended = obj.extended;
	        for (var key in obj) {
	            this[key] = obj[key];
	        }
	        if (extended) extended.call(this);
	    },
	    include: function include() {
	        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        var included = obj.included;
	        for (var key in obj) {
	            this.prototype[key] = obj[key];
	        }
	        if (included) included.call(this);
	    },
	
	    prototype: {
	        init: function init() {}
	    },
	    create: function create() {
	        var object = Object.create(this);
	        object.parent = this;
	
	        object.prototype = object.fn = Object.create(this.prototype);
	
	        object.created();
	
	        return object;
	    },
	    init: function init() {
	        var instance = Object.create(this.prototype);
	        instance.parent = this;
	        instance.init.apply(instance, arguments);
	        return instance;
	    }
	};
	
	//ajax
	Model.include({
	    post: function post() {
	        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	        var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        return new Promise(function (resolve, reject) {
	            fetch(url, {
	                method: 'POST',
	                headers: {
	                    'Accept': 'application/json',
	                    'Content-Type': 'application/json'
	                },
	                body: JSON.stringify(obj)
	            }).then(function (data) {
	                //添加正确处理和错误处理的函数 reject
	                resolve(data.json());
	            });
	        });
	    },
	    get: function get() {
	        var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	        return new Promise(function (resolve, reject) {
	            fetch(url).then(function (data) {
	                //正确处理的方式
	                resolve(data.json());
	            });
	        });
	    }
	});
	
	//hash值
	Model.include({
	    getHash: function getHash() {
	        return window.location.hash.slice(2);
	    }
	});
	
	//页面初始化内容
	Model.include({
	    pageInit: function pageInit() {}
	});
	
	//Model对象记录
	Model.include({
	    newRecord: true,
	    create: function create() {
	        this.newRecord = false;
	        //parent指向Model.create()创建的model中
	        this.parent.records[this.name] = this;
	    },
	    destory: function destory() {
	        delete this.parent.records[this.name];
	    },
	    update: function update() {
	        this.parent.records[this.name] = this.name;
	    },
	    save: function save() {
	        this.newRecord ? this.create() : this.update();
	    }
	});
	
	Model.extend({
	    find: function find() {
	        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	        return this.records[name] || console.log('Unkonwn record');
	    }
	});
	
	//localstorage操作
	Model.include({
	    setLocItem: function setLocItem() {
	        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	        var value = arguments[1];
	
	        var itemValue = void 0,
	            type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        if (type === 'string' || type === 'number') {
	            itemValue = value;
	        } else if (Object.prototype.toString.call(value) === '[object Object]') {
	            itemValue = JSON.stringify(value);
	        } else {
	            itemValue = undefined;
	        }
	        localStorage.setItem(key, itemValue);
	    },
	    getLocItem: function getLocItem() {
	        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	        return localStorage.getItem(key);
	    },
	    removeLocItem: function removeLocItem() {
	        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	        return localStorage.removeItem(key);
	    }
	});
	
	//获取controller操作
	Model.include({
	    controllers: {},
	    //这里的controller不能使用容器的选择器确定
	    registerController: function registerController(name, containerName) {
	        return this.controllers[name] || (this.controllers[name] = new _controller.Controller(name, containerName, this));
	    }
	});
	
	var totalModel = Model.create();
	
	exports.totalModel = totalModel;

/***/ },
/* 7 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return
	      }
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var BinaryFile = function BinaryFile(e, t, n) {
	    var r = e,
	        o = t || 0,
	        a = 0;this.getRawData = function () {
	        return r;
	    }, "string" == typeof e ? (a = n || r.length, this.getByteAt = function (e) {
	        return 255 & r.charCodeAt(e + o);
	    }, this.getBytesAt = function (e, t) {
	        for (var n = [], a = 0; a < t; a++) {
	            n[a] = 255 & r.charCodeAt(e + a + o);
	        }return n;
	    }) : "unknown" == typeof e && (a = n || IEBinary_getLength(r), this.getByteAt = function (e) {
	        return IEBinary_getByteAt(r, e + o);
	    }, this.getBytesAt = function (e, t) {
	        return new VBArray(IEBinary_getBytesAt(r, e + o, t)).toArray();
	    }), this.getLength = function () {
	        return a;
	    }, this.getSByteAt = function (e) {
	        var t = this.getByteAt(e);return t > 127 ? t - 256 : t;
	    }, this.getShortAt = function (e, t) {
	        var n = t ? (this.getByteAt(e) << 8) + this.getByteAt(e + 1) : (this.getByteAt(e + 1) << 8) + this.getByteAt(e);return n < 0 && (n += 65536), n;
	    }, this.getSShortAt = function (e, t) {
	        var n = this.getShortAt(e, t);return n > 32767 ? n - 65536 : n;
	    }, this.getLongAt = function (e, t) {
	        var n = this.getByteAt(e),
	            r = this.getByteAt(e + 1),
	            o = this.getByteAt(e + 2),
	            a = this.getByteAt(e + 3),
	            i = t ? (((n << 8) + r << 8) + o << 8) + a : (((a << 8) + o << 8) + r << 8) + n;return i < 0 && (i += 4294967296), i;
	    }, this.getSLongAt = function (e, t) {
	        var n = this.getLongAt(e, t);return n > 2147483647 ? n - 4294967296 : n;
	    }, this.getStringAt = function (e, t) {
	        for (var n = [], r = this.getBytesAt(e, t), o = 0; o < t; o++) {
	            n[o] = String.fromCharCode(r[o]);
	        }return n.join("");
	    }, this.getCharAt = function (e) {
	        return String.fromCharCode(this.getByteAt(e));
	    }, this.toBase64 = function () {
	        return window.btoa(r);
	    }, this.fromBase64 = function (e) {
	        r = window.atob(e);
	    };
	},
	    BinaryAjax = function () {
	    function e() {
	        var e = null;return window.ActiveXObject ? e = new ActiveXObject("Microsoft.XMLHTTP") : window.XMLHttpRequest && (e = new XMLHttpRequest()), e;
	    }function t(t, n, r) {
	        var o = e();o ? (n && ("undefined" != typeof o.onload ? o.onload = function () {
	            "200" == o.status ? n(this) : r && r(), o = null;
	        } : o.onreadystatechange = function () {
	            4 == o.readyState && ("200" == o.status ? n(this) : r && r(), o = null);
	        }), o.open("HEAD", t, !0), o.send(null)) : r && r();
	    }function n(t, n, r, o, a, i) {
	        var s = e();if (s) {
	            var u = 0;o && !a && (u = o[0]);var c = 0;o && (c = o[1] - o[0] + 1), n && ("undefined" != typeof s.onload ? s.onload = function () {
	                "200" == s.status || "206" == s.status || "0" == s.status ? (s.binaryResponse = new BinaryFile(s.responseText, u, c), s.fileSize = i || s.getResponseHeader("Content-Length"), n(s)) : r && r(), s = null;
	            } : s.onreadystatechange = function () {
	                if (4 == s.readyState) {
	                    if ("200" == s.status || "206" == s.status || "0" == s.status) {
	                        var e = { status: s.status, binaryResponse: new BinaryFile("unknown" == typeof s.responseBody ? s.responseBody : s.responseText, u, c), fileSize: i || s.getResponseHeader("Content-Length") };n(e);
	                    } else r && r();s = null;
	                }
	            }), s.open("GET", t, !0), s.overrideMimeType && s.overrideMimeType("text/plain; charset=x-user-defined"), o && a && s.setRequestHeader("Range", "bytes=" + o[0] + "-" + o[1]), s.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT"), s.send(null);
	        } else r && r();
	    }return function (e, r, o, a) {
	        a ? t(e, function (t) {
	            var i,
	                s,
	                u = parseInt(t.getResponseHeader("Content-Length"), 10),
	                c = t.getResponseHeader("Accept-Ranges");i = a[0], a[0] < 0 && (i += u), s = i + a[1] - 1, n(e, r, o, [i, s], "bytes" == c, u);
	        }) : n(e, r, o);
	    };
	}();document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n\tIEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\nEnd Function\r\nFunction IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n  Dim aBytes()\r\n  ReDim aBytes(iLength - 1)\r\n  For i = 0 To iLength - 1\r\n   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n  Next\r\n  IEBinary_getBytesAt = aBytes\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n\tIEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n</script>\r\n"), function (e) {
	    e.EXIF = function () {
	        function e(e) {
	            return !!e.exifdata;
	        }function t(e, t) {
	            BinaryAjax(e.src, function (r) {
	                var o = n(r.binaryResponse);e.exifdata = o || {}, t && t.call(e);
	            });
	        }function n(e) {
	            if (255 != e.getByteAt(0) || 216 != e.getByteAt(1)) return !1;for (var t, n = 2, r = e.getLength(); n < r;) {
	                if (255 != e.getByteAt(n)) return l && console.log("Not a valid marker at offset " + n + ", found: " + e.getByteAt(n)), !1;if (t = e.getByteAt(n + 1), 22400 == t) return l && console.log("Found 0xFFE1 marker"), a(e, n + 4, e.getShortAt(n + 2, !0) - 2);if (225 == t) return l && console.log("Found 0xFFE1 marker"), a(e, n + 4, e.getShortAt(n + 2, !0) - 2);n += 2 + e.getShortAt(n + 2, !0);
	            }
	        }function r(e, t, n, r, a) {
	            var i,
	                s,
	                u,
	                c = e.getShortAt(n, a),
	                d = {};for (u = 0; u < c; u++) {
	                i = n + 12 * u + 2, s = r[e.getShortAt(i, a)], !s && l && console.log("Unknown tag: " + e.getShortAt(i, a)), d[s] = o(e, i, t, n, a);
	            }return d;
	        }function o(e, t, n, r, o) {
	            var a,
	                i,
	                s,
	                u,
	                c,
	                d,
	                l = e.getShortAt(t + 2, o),
	                g = e.getLongAt(t + 4, o),
	                h = e.getLongAt(t + 8, o) + n;switch (l) {case 1:case 7:
	                    if (1 == g) return e.getByteAt(t + 8, o);for (a = g > 4 ? h : t + 8, i = [], u = 0; u < g; u++) {
	                        i[u] = e.getByteAt(a + u);
	                    }return i;case 2:
	                    return a = g > 4 ? h : t + 8, e.getStringAt(a, g - 1);case 3:
	                    if (1 == g) return e.getShortAt(t + 8, o);for (a = g > 2 ? h : t + 8, i = [], u = 0; u < g; u++) {
	                        i[u] = e.getShortAt(a + 2 * u, o);
	                    }return i;case 4:
	                    if (1 == g) return e.getLongAt(t + 8, o);i = [];for (var u = 0; u < g; u++) {
	                        i[u] = e.getLongAt(h + 4 * u, o);
	                    }return i;case 5:
	                    if (1 == g) return c = e.getLongAt(h, o), d = e.getLongAt(h + 4, o), s = new Number(c / d), s.numerator = c, s.denominator = d, s;for (i = [], u = 0; u < g; u++) {
	                        c = e.getLongAt(h + 8 * u, o), d = e.getLongAt(h + 4 + 8 * u, o), i[u] = new Number(c / d), i[u].numerator = c, i[u].denominator = d;
	                    }return i;case 9:
	                    if (1 == g) return e.getSLongAt(t + 8, o);for (i = [], u = 0; u < g; u++) {
	                        i[u] = e.getSLongAt(h + 4 * u, o);
	                    }return i;case 10:
	                    if (1 == g) return e.getSLongAt(h, o) / e.getSLongAt(h + 4, o);for (i = [], u = 0; u < g; u++) {
	                        i[u] = e.getSLongAt(h + 8 * u, o) / e.getSLongAt(h + 4 + 8 * u, o);
	                    }return i;}
	        }function a(e, t) {
	            if ("Exif" != e.getStringAt(t, 4)) return l && console.log("Not valid EXIF data! " + e.getStringAt(t, 4)), !1;var n,
	                o,
	                a,
	                i,
	                s,
	                u = t + 6;if (18761 == e.getShortAt(u)) n = !1;else {
	                if (19789 != e.getShortAt(u)) return l && console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"), !1;n = !0;
	            }if (42 != e.getShortAt(u + 2, n)) return l && console.log("Not valid TIFF data! (no 0x002A)"), !1;if (8 != e.getLongAt(u + 4, n)) return l && console.log("Not valid TIFF data! (First offset not 8)", e.getShortAt(u + 4, n)), !1;if (o = r(e, u, u + 8, h, n), o.ExifIFDPointer) {
	                i = r(e, u, u + o.ExifIFDPointer, g, n);for (a in i) {
	                    switch (a) {case "LightSource":case "Flash":case "MeteringMode":case "ExposureProgram":case "SensingMethod":case "SceneCaptureType":case "SceneType":case "CustomRendered":case "WhiteBalance":case "GainControl":case "Contrast":case "Saturation":case "Sharpness":case "SubjectDistanceRange":case "FileSource":
	                            i[a] = p[a][i[a]];break;case "ExifVersion":case "FlashpixVersion":
	                            i[a] = String.fromCharCode(i[a][0], i[a][1], i[a][2], i[a][3]);break;case "ComponentsConfiguration":
	                            i[a] = p.Components[i[a][0]] + p.Components[i[a][1]] + p.Components[i[a][2]] + p.Components[i[a][3]];}o[a] = i[a];
	                }
	            }if (o.GPSInfoIFDPointer) {
	                s = r(e, u, u + o.GPSInfoIFDPointer, f, n);for (a in s) {
	                    switch (a) {case "GPSVersionID":
	                            s[a] = s[a][0] + "." + s[a][1] + "." + s[a][2] + "." + s[a][3];}o[a] = s[a];
	                }
	            }return o;
	        }function i(n, r) {
	            return !!n.complete && (e(n) ? r && r.call(n) : t(n, r), !0);
	        }function s(t, n) {
	            if (e(t)) return t.exifdata[n];
	        }function u(t) {
	            if (!e(t)) return {};var n,
	                r = t.exifdata,
	                o = {};for (n in r) {
	                r.hasOwnProperty(n) && (o[n] = r[n]);
	            }return o;
	        }function c(t) {
	            if (!e(t)) return "";var n,
	                r = t.exifdata,
	                o = "";for (n in r) {
	                r.hasOwnProperty(n) && (o += "object" == _typeof(r[n]) ? r[n] instanceof Number ? n + " : " + r[n] + " [" + r[n].numerator + "/" + r[n].denominator + "]\r\n" : n + " : [" + r[n].length + " values]\r\n" : n + " : " + r[n] + "\r\n");
	            }return o;
	        }function d(e) {
	            return n(e);
	        }var l = !1,
	            g = { 36864: "ExifVersion", 40960: "FlashpixVersion", 40961: "ColorSpace", 40962: "PixelXDimension", 40963: "PixelYDimension", 37121: "ComponentsConfiguration", 37122: "CompressedBitsPerPixel", 37500: "MakerNote", 37510: "UserComment", 40964: "RelatedSoundFile", 36867: "DateTimeOriginal", 36868: "DateTimeDigitized", 37520: "SubsecTime", 37521: "SubsecTimeOriginal", 37522: "SubsecTimeDigitized", 33434: "ExposureTime", 33437: "FNumber", 34850: "ExposureProgram", 34852: "SpectralSensitivity", 34855: "ISOSpeedRatings", 34856: "OECF", 37377: "ShutterSpeedValue", 37378: "ApertureValue", 37379: "BrightnessValue", 37380: "ExposureBias", 37381: "MaxApertureValue", 37382: "SubjectDistance", 37383: "MeteringMode", 37384: "LightSource", 37385: "Flash", 37396: "SubjectArea", 37386: "FocalLength", 41483: "FlashEnergy", 41484: "SpatialFrequencyResponse", 41486: "FocalPlaneXResolution", 41487: "FocalPlaneYResolution", 41488: "FocalPlaneResolutionUnit", 41492: "SubjectLocation", 41493: "ExposureIndex", 41495: "SensingMethod", 41728: "FileSource", 41729: "SceneType", 41730: "CFAPattern", 41985: "CustomRendered", 41986: "ExposureMode", 41987: "WhiteBalance", 41988: "DigitalZoomRation", 41989: "FocalLengthIn35mmFilm", 41990: "SceneCaptureType", 41991: "GainControl", 41992: "Contrast", 41993: "Saturation", 41994: "Sharpness", 41995: "DeviceSettingDescription", 41996: "SubjectDistanceRange", 40965: "InteroperabilityIFDPointer", 42016: "ImageUniqueID" },
	            h = { 256: "ImageWidth", 257: "ImageHeight", 34665: "ExifIFDPointer", 34853: "GPSInfoIFDPointer", 40965: "InteroperabilityIFDPointer", 258: "BitsPerSample", 259: "Compression", 262: "PhotometricInterpretation", 274: "Orientation", 277: "SamplesPerPixel", 284: "PlanarConfiguration", 530: "YCbCrSubSampling", 531: "YCbCrPositioning", 282: "XResolution", 283: "YResolution", 296: "ResolutionUnit", 273: "StripOffsets", 278: "RowsPerStrip", 279: "StripByteCounts", 513: "JPEGInterchangeFormat", 514: "JPEGInterchangeFormatLength", 301: "TransferFunction", 318: "WhitePoint", 319: "PrimaryChromaticities", 529: "YCbCrCoefficients", 532: "ReferenceBlackWhite", 306: "DateTime", 270: "ImageDescription", 271: "Make", 272: "Model", 305: "Software", 315: "Artist", 33432: "Copyright" },
	            f = { 0: "GPSVersionID", 1: "GPSLatitudeRef", 2: "GPSLatitude", 3: "GPSLongitudeRef", 4: "GPSLongitude", 5: "GPSAltitudeRef", 6: "GPSAltitude", 7: "GPSTimeStamp", 8: "GPSSatellites", 9: "GPSStatus", 10: "GPSMeasureMode", 11: "GPSDOP", 12: "GPSSpeedRef", 13: "GPSSpeed", 14: "GPSTrackRef", 15: "GPSTrack", 16: "GPSImgDirectionRef", 17: "GPSImgDirection", 18: "GPSMapDatum", 19: "GPSDestLatitudeRef", 20: "GPSDestLatitude", 21: "GPSDestLongitudeRef", 22: "GPSDestLongitude", 23: "GPSDestBearingRef", 24: "GPSDestBearing", 25: "GPSDestDistanceRef", 26: "GPSDestDistance", 27: "GPSProcessingMethod", 28: "GPSAreaInformation", 29: "GPSDateStamp", 30: "GPSDifferential" },
	            p = { ExposureProgram: { 0: "Not defined", 1: "Manual", 2: "Normal program", 3: "Aperture priority", 4: "Shutter priority", 5: "Creative program", 6: "Action program", 7: "Portrait mode", 8: "Landscape mode" }, MeteringMode: { 0: "Unknown", 1: "Average", 2: "CenterWeightedAverage", 3: "Spot", 4: "MultiSpot", 5: "Pattern", 6: "Partial", 255: "Other" }, LightSource: { 0: "Unknown", 1: "Daylight", 2: "Fluorescent", 3: "Tungsten (incandescent light)", 4: "Flash", 9: "Fine weather", 10: "Cloudy weather", 11: "Shade", 12: "Daylight fluorescent (D 5700 - 7100K)", 13: "Day white fluorescent (N 4600 - 5400K)", 14: "Cool white fluorescent (W 3900 - 4500K)", 15: "White fluorescent (WW 3200 - 3700K)", 17: "Standard light A", 18: "Standard light B", 19: "Standard light C", 20: "D55", 21: "D65", 22: "D75", 23: "D50", 24: "ISO studio tungsten", 255: "Other" }, Flash: { 0: "Flash did not fire", 1: "Flash fired", 5: "Strobe return light not detected", 7: "Strobe return light detected", 9: "Flash fired, compulsory flash mode", 13: "Flash fired, compulsory flash mode, return light not detected", 15: "Flash fired, compulsory flash mode, return light detected", 16: "Flash did not fire, compulsory flash mode", 24: "Flash did not fire, auto mode", 25: "Flash fired, auto mode", 29: "Flash fired, auto mode, return light not detected", 31: "Flash fired, auto mode, return light detected", 32: "No flash function", 65: "Flash fired, red-eye reduction mode", 69: "Flash fired, red-eye reduction mode, return light not detected", 71: "Flash fired, red-eye reduction mode, return light detected", 73: "Flash fired, compulsory flash mode, red-eye reduction mode", 77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected", 79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected", 89: "Flash fired, auto mode, red-eye reduction mode", 93: "Flash fired, auto mode, return light not detected, red-eye reduction mode", 95: "Flash fired, auto mode, return light detected, red-eye reduction mode" }, SensingMethod: { 1: "Not defined", 2: "One-chip color area sensor", 3: "Two-chip color area sensor", 4: "Three-chip color area sensor", 5: "Color sequential area sensor", 7: "Trilinear sensor", 8: "Color sequential linear sensor" }, SceneCaptureType: { 0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night scene" }, SceneType: { 1: "Directly photographed" }, CustomRendered: { 0: "Normal process", 1: "Custom process" }, WhiteBalance: { 0: "Auto white balance", 1: "Manual white balance" }, GainControl: { 0: "None", 1: "Low gain up", 2: "High gain up", 3: "Low gain down", 4: "High gain down" }, Contrast: { 0: "Normal", 1: "Soft", 2: "Hard" }, Saturation: { 0: "Normal", 1: "Low saturation", 2: "High saturation" }, Sharpness: { 0: "Normal", 1: "Soft", 2: "Hard" }, SubjectDistanceRange: { 0: "Unknown", 1: "Macro", 2: "Close view", 3: "Distant view" }, FileSource: { 3: "DSC" }, Components: { 0: "", 1: "Y", 2: "Cb", 3: "Cr", 4: "R", 5: "G", 6: "B" } };return { readFromBinaryFile: d, pretty: c, getTag: s, getAllTags: u, getData: i, Tags: g, TiffTags: h, GPSTags: f, StringValues: p };
	    }();
	}(window), function (e) {
	    function t(e, t) {
	        this.file = e, this.options = r.extend({}, o, t), this._defaults = o, this._name = n, this.init();
	    }var n = "canvasResize",
	        r = { newsize: function newsize(e, t, n, r, o) {
	            var a = o ? "h" : "";if (n && e > n || r && t > r) {
	                var i = e / t;(i >= 1 || 0 === r) && n && !o ? (e = n, t = n / i >> 0) : o && i <= n / r ? (e = n, t = n / i >> 0, a = "w") : (e = r * i >> 0, t = r);
	            }return { width: e, height: t, cropped: a };
	        }, dataURLtoBlob: function dataURLtoBlob(e) {
	            for (var t = e.split(",")[0].split(":")[1].split(";")[0], n = atob(e.split(",")[1]), r = new ArrayBuffer(n.length), o = new Uint8Array(r), a = 0; a < n.length; a++) {
	                o[a] = n.charCodeAt(a);
	            }var i = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;return i ? (i = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)(), i.append(r), i.getBlob(t)) : i = new Blob([r], { type: t });
	        }, detectSubsampling: function detectSubsampling(e) {
	            var t = e.width,
	                n = e.height;if (t * n > 1048576) {
	                var r = document.createElement("canvas");r.width = r.height = 1;var o = r.getContext("2d");return o.drawImage(e, -t + 1, 0), 0 === o.getImageData(0, 0, 1, 1).data[3];
	            }return !1;
	        }, rotate: function rotate(e, t) {
	            var n = { 1: { 90: 6, 180: 3, 270: 8 }, 2: { 90: 7, 180: 4, 270: 5 }, 3: { 90: 8, 180: 1, 270: 6 }, 4: { 90: 5, 180: 2, 270: 7 }, 5: { 90: 2, 180: 7, 270: 4 }, 6: { 90: 3, 180: 8, 270: 1 }, 7: { 90: 4, 180: 5, 270: 2 }, 8: { 90: 1, 180: 6, 270: 3 } };return n[e][t] ? n[e][t] : e;
	        }, transformCoordinate: function transformCoordinate(e, t, n, r) {
	            switch (r) {case 5:case 6:case 7:case 8:
	                    e.width = n, e.height = t;break;default:
	                    e.width = t, e.height = n;}var o = e.getContext("2d");switch (r) {case 1:
	                    break;case 2:
	                    o.translate(t, 0), o.scale(-1, 1);break;case 3:
	                    o.translate(t, n), o.rotate(Math.PI);break;case 4:
	                    o.translate(0, n), o.scale(1, -1);break;case 5:
	                    o.rotate(.5 * Math.PI), o.scale(1, -1);break;case 6:
	                    o.rotate(.5 * Math.PI), o.translate(0, -n);break;case 7:
	                    o.rotate(.5 * Math.PI), o.translate(t, -n), o.scale(-1, 1);break;case 8:
	                    o.rotate(-.5 * Math.PI), o.translate(-t, 0);}
	        }, detectVerticalSquash: function detectVerticalSquash(e, t, n) {
	            var r = document.createElement("canvas");r.width = 1, r.height = n;var o = r.getContext("2d");o.drawImage(e, 0, 0);for (var a = o.getImageData(0, 0, 1, n).data, i = 0, s = n, u = n; u > i;) {
	                var c = a[4 * (u - 1) + 3];0 === c ? s = u : i = u, u = s + i >> 1;
	            }var d = u / n;return 0 === d ? 1 : d;
	        }, callback: function callback(e) {
	            return e;
	        }, extend: function extend() {
	            var e = arguments[0] || {},
	                t = 1,
	                n = arguments.length,
	                o = !1;e.constructor === Boolean && (o = e, e = arguments[1] || {}), 1 === n && (e = this, t = 0);for (var a; t < n; t++) {
	                if (null !== (a = arguments[t])) for (var i in a) {
	                    e !== a[i] && (o && "object" == _typeof(a[i]) && e[i] ? r.extend(e[i], a[i]) : void 0 !== a[i] && (e[i] = a[i]));
	                }
	            }return e;
	        } },
	        o = { crop: !1, quality: 80, rotate: 0, callback: r.callback };t.prototype = { init: function init() {
	            var e = this,
	                t = this.file,
	                n = 102400,
	                o = new FileReader();o.onloadend = function (t) {
	                var o = t.target.result,
	                    a = atob(o.split(",")[1]),
	                    i = new BinaryFile(a, 0, a.length),
	                    s = EXIF.readFromBinaryFile(i),
	                    u = new Image();u.onload = function (t) {
	                    var a = s.Orientation || 1;a = r.rotate(a, e.options.rotate);var i = a >= 5 && a <= 8 ? r.newsize(u.height, u.width, e.options.width, e.options.height, e.options.crop) : r.newsize(u.width, u.height, e.options.width, e.options.height, e.options.crop),
	                        c = u.width,
	                        d = u.height,
	                        l = i.width,
	                        g = i.height,
	                        h = document.createElement("canvas"),
	                        f = h.getContext("2d");f.save(), r.transformCoordinate(h, l, g, a), r.detectSubsampling(u) && (c /= 2, d /= 2);var p = 1024,
	                        S = document.createElement("canvas");S.width = S.height = p;for (var m = S.getContext("2d"), y = r.detectVerticalSquash(u, c, d), w = 0; w < d;) {
	                        for (var A = w + p > d ? d - w : p, B = 0; B < c;) {
	                            var F = B + p > c ? c - B : p;m.clearRect(0, 0, p, p), m.drawImage(u, -B, -w);var v = Math.floor(B * l / c),
	                                P = Math.ceil(F * l / c),
	                                C = Math.floor(w * g / d / y),
	                                b = Math.ceil(A * g / d / y);f.drawImage(S, 0, 0, F, A, v, C, P, b), B += p;
	                        }w += p;
	                    }f.restore(), S = m = null;var D = document.createElement("canvas");D.width = "h" === i.cropped ? g : l, D.height = "w" === i.cropped ? l : g;var I = "h" === i.cropped ? .5 * (g - l) : 0,
	                        L = "w" === i.cropped ? .5 * (l - g) : 0;var newctx = D.getContext("2d");newctx.drawImage(h, I, L, l, g);var R = o.length > n ? D.toDataURL("image/jpeg", .1) : o;e.options.callback(R, D.width, D.height);
	                }, u.src = o;
	            }, o.readAsDataURL(t);
	        } }, window.canvasResize = function (e, n) {
	        return "string" == typeof e ? r[e](n) : void new t(e, n);
	    };
	}(window);
	
	exports.canvasResize = canvasResize;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"errno": 0,
		"errmsg": "ok",
		"data": [
			{
				"id": "110000",
				"name": "北京",
				"type": 1,
				"childs": [
					{
						"id": "110100",
						"name": "北京市",
						"childs": [
							{
								"id": "110101",
								"name": "东城区"
							},
							{
								"id": "110102",
								"name": "西城区"
							},
							{
								"id": "110105",
								"name": "朝阳区"
							},
							{
								"id": "110106",
								"name": "丰台区"
							},
							{
								"id": "110107",
								"name": "石景山区"
							},
							{
								"id": "110108",
								"name": "海淀区"
							},
							{
								"id": "110109",
								"name": "门头沟区"
							},
							{
								"id": "110111",
								"name": "房山区"
							},
							{
								"id": "110112",
								"name": "通州区"
							},
							{
								"id": "110113",
								"name": "顺义区"
							},
							{
								"id": "110114",
								"name": "昌平区"
							},
							{
								"id": "110115",
								"name": "大兴区"
							},
							{
								"id": "110116",
								"name": "怀柔区"
							},
							{
								"id": "110117",
								"name": "平谷区"
							},
							{
								"id": "110228",
								"name": "密云县"
							},
							{
								"id": "110229",
								"name": "延庆县"
							}
						]
					}
				]
			},
			{
				"id": "120000",
				"name": "天津",
				"type": 1,
				"childs": [
					{
						"id": "120100",
						"name": "天津市",
						"childs": [
							{
								"id": "120101",
								"name": "和平区"
							},
							{
								"id": "120102",
								"name": "河东区"
							},
							{
								"id": "120103",
								"name": "河西区"
							},
							{
								"id": "120104",
								"name": "南开区"
							},
							{
								"id": "120105",
								"name": "河北区"
							},
							{
								"id": "120106",
								"name": "红桥区"
							},
							{
								"id": "120110",
								"name": "东丽区"
							},
							{
								"id": "120111",
								"name": "西青区"
							},
							{
								"id": "120112",
								"name": "津南区"
							},
							{
								"id": "120113",
								"name": "北辰区"
							},
							{
								"id": "120114",
								"name": "武清区"
							},
							{
								"id": "120115",
								"name": "宝坻区"
							},
							{
								"id": "120116",
								"name": "滨海新区"
							},
							{
								"id": "120221",
								"name": "宁河县"
							},
							{
								"id": "120223",
								"name": "静海县"
							},
							{
								"id": "120225",
								"name": "蓟县"
							}
						]
					}
				]
			},
			{
				"id": "130000",
				"name": "河北省",
				"type": 0,
				"childs": [
					{
						"id": "130100",
						"name": "石家庄市",
						"childs": [
							{
								"id": "130102",
								"name": "长安区"
							},
							{
								"id": "130104",
								"name": "桥西区"
							},
							{
								"id": "130105",
								"name": "新华区"
							},
							{
								"id": "130107",
								"name": "井陉矿区"
							},
							{
								"id": "130108",
								"name": "裕华区"
							},
							{
								"id": "130109",
								"name": "藁城区"
							},
							{
								"id": "130110",
								"name": "鹿泉区"
							},
							{
								"id": "130111",
								"name": "栾城区"
							},
							{
								"id": "130121",
								"name": "井陉县"
							},
							{
								"id": "130123",
								"name": "正定县"
							},
							{
								"id": "130125",
								"name": "行唐县"
							},
							{
								"id": "130126",
								"name": "灵寿县"
							},
							{
								"id": "130127",
								"name": "高邑县"
							},
							{
								"id": "130128",
								"name": "深泽县"
							},
							{
								"id": "130129",
								"name": "赞皇县"
							},
							{
								"id": "130130",
								"name": "无极县"
							},
							{
								"id": "130131",
								"name": "平山县"
							},
							{
								"id": "130132",
								"name": "元氏县"
							},
							{
								"id": "130133",
								"name": "赵县"
							},
							{
								"id": "130181",
								"name": "辛集市"
							},
							{
								"id": "130183",
								"name": "晋州市"
							},
							{
								"id": "130184",
								"name": "新乐市"
							}
						]
					},
					{
						"id": "130200",
						"name": "唐山市",
						"childs": [
							{
								"id": "130202",
								"name": "路南区"
							},
							{
								"id": "130203",
								"name": "路北区"
							},
							{
								"id": "130204",
								"name": "古冶区"
							},
							{
								"id": "130205",
								"name": "开平区"
							},
							{
								"id": "130207",
								"name": "丰南区"
							},
							{
								"id": "130208",
								"name": "丰润区"
							},
							{
								"id": "130209",
								"name": "曹妃甸区"
							},
							{
								"id": "130223",
								"name": "滦县"
							},
							{
								"id": "130224",
								"name": "滦南县"
							},
							{
								"id": "130225",
								"name": "乐亭县"
							},
							{
								"id": "130227",
								"name": "迁西县"
							},
							{
								"id": "130229",
								"name": "玉田县"
							},
							{
								"id": "130281",
								"name": "遵化市"
							},
							{
								"id": "130283",
								"name": "迁安市"
							}
						]
					},
					{
						"id": "130300",
						"name": "秦皇岛市",
						"childs": [
							{
								"id": "130302",
								"name": "海港区"
							},
							{
								"id": "130303",
								"name": "山海关区"
							},
							{
								"id": "130304",
								"name": "北戴河区"
							},
							{
								"id": "130321",
								"name": "青龙满族自治县"
							},
							{
								"id": "130322",
								"name": "昌黎县"
							},
							{
								"id": "130323",
								"name": "抚宁县"
							},
							{
								"id": "130324",
								"name": "卢龙县"
							}
						]
					},
					{
						"id": "130400",
						"name": "邯郸市",
						"childs": [
							{
								"id": "130402",
								"name": "邯山区"
							},
							{
								"id": "130403",
								"name": "丛台区"
							},
							{
								"id": "130404",
								"name": "复兴区"
							},
							{
								"id": "130406",
								"name": "峰峰矿区"
							},
							{
								"id": "130421",
								"name": "邯郸县"
							},
							{
								"id": "130423",
								"name": "临漳县"
							},
							{
								"id": "130424",
								"name": "成安县"
							},
							{
								"id": "130425",
								"name": "大名县"
							},
							{
								"id": "130426",
								"name": "涉县"
							},
							{
								"id": "130427",
								"name": "磁县"
							},
							{
								"id": "130428",
								"name": "肥乡县"
							},
							{
								"id": "130429",
								"name": "永年县"
							},
							{
								"id": "130430",
								"name": "邱县"
							},
							{
								"id": "130431",
								"name": "鸡泽县"
							},
							{
								"id": "130432",
								"name": "广平县"
							},
							{
								"id": "130433",
								"name": "馆陶县"
							},
							{
								"id": "130434",
								"name": "魏县"
							},
							{
								"id": "130435",
								"name": "曲周县"
							},
							{
								"id": "130481",
								"name": "武安市"
							}
						]
					},
					{
						"id": "130500",
						"name": "邢台市",
						"childs": [
							{
								"id": "130502",
								"name": "桥东区"
							},
							{
								"id": "130503",
								"name": "桥西区"
							},
							{
								"id": "130521",
								"name": "邢台县"
							},
							{
								"id": "130522",
								"name": "临城县"
							},
							{
								"id": "130523",
								"name": "内丘县"
							},
							{
								"id": "130524",
								"name": "柏乡县"
							},
							{
								"id": "130525",
								"name": "隆尧县"
							},
							{
								"id": "130526",
								"name": "任县"
							},
							{
								"id": "130527",
								"name": "南和县"
							},
							{
								"id": "130528",
								"name": "宁晋县"
							},
							{
								"id": "130529",
								"name": "巨鹿县"
							},
							{
								"id": "130530",
								"name": "新河县"
							},
							{
								"id": "130531",
								"name": "广宗县"
							},
							{
								"id": "130532",
								"name": "平乡县"
							},
							{
								"id": "130533",
								"name": "威县"
							},
							{
								"id": "130534",
								"name": "清河县"
							},
							{
								"id": "130535",
								"name": "临西县"
							},
							{
								"id": "130581",
								"name": "南宫市"
							},
							{
								"id": "130582",
								"name": "沙河市"
							}
						]
					},
					{
						"id": "130600",
						"name": "保定市",
						"childs": [
							{
								"id": "130602",
								"name": "新市区"
							},
							{
								"id": "130603",
								"name": "北市区"
							},
							{
								"id": "130604",
								"name": "南市区"
							},
							{
								"id": "130621",
								"name": "满城县"
							},
							{
								"id": "130622",
								"name": "清苑县"
							},
							{
								"id": "130623",
								"name": "涞水县"
							},
							{
								"id": "130624",
								"name": "阜平县"
							},
							{
								"id": "130625",
								"name": "徐水县"
							},
							{
								"id": "130626",
								"name": "定兴县"
							},
							{
								"id": "130627",
								"name": "唐县"
							},
							{
								"id": "130628",
								"name": "高阳县"
							},
							{
								"id": "130629",
								"name": "容城县"
							},
							{
								"id": "130630",
								"name": "涞源县"
							},
							{
								"id": "130631",
								"name": "望都县"
							},
							{
								"id": "130632",
								"name": "安新县"
							},
							{
								"id": "130633",
								"name": "易县"
							},
							{
								"id": "130634",
								"name": "曲阳县"
							},
							{
								"id": "130635",
								"name": "蠡县"
							},
							{
								"id": "130636",
								"name": "顺平县"
							},
							{
								"id": "130637",
								"name": "博野县"
							},
							{
								"id": "130638",
								"name": "雄县"
							},
							{
								"id": "130681",
								"name": "涿州市"
							},
							{
								"id": "130682",
								"name": "定州市"
							},
							{
								"id": "130683",
								"name": "安国市"
							},
							{
								"id": "130684",
								"name": "高碑店市"
							}
						]
					},
					{
						"id": "130700",
						"name": "张家口市",
						"childs": [
							{
								"id": "130702",
								"name": "桥东区"
							},
							{
								"id": "130703",
								"name": "桥西区"
							},
							{
								"id": "130705",
								"name": "宣化区"
							},
							{
								"id": "130706",
								"name": "下花园区"
							},
							{
								"id": "130721",
								"name": "宣化县"
							},
							{
								"id": "130722",
								"name": "张北县"
							},
							{
								"id": "130723",
								"name": "康保县"
							},
							{
								"id": "130724",
								"name": "沽源县"
							},
							{
								"id": "130725",
								"name": "尚义县"
							},
							{
								"id": "130726",
								"name": "蔚县"
							},
							{
								"id": "130727",
								"name": "阳原县"
							},
							{
								"id": "130728",
								"name": "怀安县"
							},
							{
								"id": "130729",
								"name": "万全县"
							},
							{
								"id": "130730",
								"name": "怀来县"
							},
							{
								"id": "130731",
								"name": "涿鹿县"
							},
							{
								"id": "130732",
								"name": "赤城县"
							},
							{
								"id": "130733",
								"name": "崇礼县"
							}
						]
					},
					{
						"id": "130800",
						"name": "承德市",
						"childs": [
							{
								"id": "130802",
								"name": "双桥区"
							},
							{
								"id": "130803",
								"name": "双滦区"
							},
							{
								"id": "130804",
								"name": "鹰手营子矿区"
							},
							{
								"id": "130821",
								"name": "承德县"
							},
							{
								"id": "130822",
								"name": "兴隆县"
							},
							{
								"id": "130823",
								"name": "平泉县"
							},
							{
								"id": "130824",
								"name": "滦平县"
							},
							{
								"id": "130825",
								"name": "隆化县"
							},
							{
								"id": "130826",
								"name": "丰宁满族自治县"
							},
							{
								"id": "130827",
								"name": "宽城满族自治县"
							},
							{
								"id": "130828",
								"name": "围场满族蒙古族自治县"
							}
						]
					},
					{
						"id": "130900",
						"name": "沧州市",
						"childs": [
							{
								"id": "130902",
								"name": "新华区"
							},
							{
								"id": "130903",
								"name": "运河区"
							},
							{
								"id": "130921",
								"name": "沧县"
							},
							{
								"id": "130922",
								"name": "青县"
							},
							{
								"id": "130923",
								"name": "东光县"
							},
							{
								"id": "130924",
								"name": "海兴县"
							},
							{
								"id": "130925",
								"name": "盐山县"
							},
							{
								"id": "130926",
								"name": "肃宁县"
							},
							{
								"id": "130927",
								"name": "南皮县"
							},
							{
								"id": "130928",
								"name": "吴桥县"
							},
							{
								"id": "130929",
								"name": "献县"
							},
							{
								"id": "130930",
								"name": "孟村回族自治县"
							},
							{
								"id": "130981",
								"name": "泊头市"
							},
							{
								"id": "130982",
								"name": "任丘市"
							},
							{
								"id": "130983",
								"name": "黄骅市"
							},
							{
								"id": "130984",
								"name": "河间市"
							}
						]
					},
					{
						"id": "131000",
						"name": "廊坊市",
						"childs": [
							{
								"id": "131002",
								"name": "安次区"
							},
							{
								"id": "131003",
								"name": "广阳区"
							},
							{
								"id": "131022",
								"name": "固安县"
							},
							{
								"id": "131023",
								"name": "永清县"
							},
							{
								"id": "131024",
								"name": "香河县"
							},
							{
								"id": "131025",
								"name": "大城县"
							},
							{
								"id": "131026",
								"name": "文安县"
							},
							{
								"id": "131028",
								"name": "大厂回族自治县"
							},
							{
								"id": "131081",
								"name": "霸州市"
							},
							{
								"id": "131082",
								"name": "三河市"
							}
						]
					},
					{
						"id": "131100",
						"name": "衡水市",
						"childs": [
							{
								"id": "131102",
								"name": "桃城区"
							},
							{
								"id": "131121",
								"name": "枣强县"
							},
							{
								"id": "131122",
								"name": "武邑县"
							},
							{
								"id": "131123",
								"name": "武强县"
							},
							{
								"id": "131124",
								"name": "饶阳县"
							},
							{
								"id": "131125",
								"name": "安平县"
							},
							{
								"id": "131126",
								"name": "故城县"
							},
							{
								"id": "131127",
								"name": "景县"
							},
							{
								"id": "131128",
								"name": "阜城县"
							},
							{
								"id": "131181",
								"name": "冀州市"
							},
							{
								"id": "131182",
								"name": "深州市"
							}
						]
					}
				]
			},
			{
				"id": "140000",
				"name": "山西省",
				"type": 0,
				"childs": [
					{
						"id": "140100",
						"name": "太原市",
						"childs": [
							{
								"id": "140105",
								"name": "小店区"
							},
							{
								"id": "140106",
								"name": "迎泽区"
							},
							{
								"id": "140107",
								"name": "杏花岭区"
							},
							{
								"id": "140108",
								"name": "尖草坪区"
							},
							{
								"id": "140109",
								"name": "万柏林区"
							},
							{
								"id": "140110",
								"name": "晋源区"
							},
							{
								"id": "140121",
								"name": "清徐县"
							},
							{
								"id": "140122",
								"name": "阳曲县"
							},
							{
								"id": "140123",
								"name": "娄烦县"
							},
							{
								"id": "140181",
								"name": "古交市"
							}
						]
					},
					{
						"id": "140200",
						"name": "大同市",
						"childs": [
							{
								"id": "140202",
								"name": "城区"
							},
							{
								"id": "140203",
								"name": "矿区"
							},
							{
								"id": "140211",
								"name": "南郊区"
							},
							{
								"id": "140212",
								"name": "新荣区"
							},
							{
								"id": "140221",
								"name": "阳高县"
							},
							{
								"id": "140222",
								"name": "天镇县"
							},
							{
								"id": "140223",
								"name": "广灵县"
							},
							{
								"id": "140224",
								"name": "灵丘县"
							},
							{
								"id": "140225",
								"name": "浑源县"
							},
							{
								"id": "140226",
								"name": "左云县"
							},
							{
								"id": "140227",
								"name": "大同县"
							}
						]
					},
					{
						"id": "140300",
						"name": "阳泉市",
						"childs": [
							{
								"id": "140302",
								"name": "城区"
							},
							{
								"id": "140303",
								"name": "矿区"
							},
							{
								"id": "140311",
								"name": "郊区"
							},
							{
								"id": "140321",
								"name": "平定县"
							},
							{
								"id": "140322",
								"name": "盂县"
							}
						]
					},
					{
						"id": "140400",
						"name": "长治市",
						"childs": [
							{
								"id": "140402",
								"name": "城区"
							},
							{
								"id": "140411",
								"name": "郊区"
							},
							{
								"id": "140421",
								"name": "长治县"
							},
							{
								"id": "140423",
								"name": "襄垣县"
							},
							{
								"id": "140424",
								"name": "屯留县"
							},
							{
								"id": "140425",
								"name": "平顺县"
							},
							{
								"id": "140426",
								"name": "黎城县"
							},
							{
								"id": "140427",
								"name": "壶关县"
							},
							{
								"id": "140428",
								"name": "长子县"
							},
							{
								"id": "140429",
								"name": "武乡县"
							},
							{
								"id": "140430",
								"name": "沁县"
							},
							{
								"id": "140431",
								"name": "沁源县"
							},
							{
								"id": "140481",
								"name": "潞城市"
							}
						]
					},
					{
						"id": "140500",
						"name": "晋城市",
						"childs": [
							{
								"id": "140502",
								"name": "城区"
							},
							{
								"id": "140521",
								"name": "沁水县"
							},
							{
								"id": "140522",
								"name": "阳城县"
							},
							{
								"id": "140524",
								"name": "陵川县"
							},
							{
								"id": "140525",
								"name": "泽州县"
							},
							{
								"id": "140581",
								"name": "高平市"
							}
						]
					},
					{
						"id": "140600",
						"name": "朔州市",
						"childs": [
							{
								"id": "140602",
								"name": "朔城区"
							},
							{
								"id": "140603",
								"name": "平鲁区"
							},
							{
								"id": "140621",
								"name": "山阴县"
							},
							{
								"id": "140622",
								"name": "应县"
							},
							{
								"id": "140623",
								"name": "右玉县"
							},
							{
								"id": "140624",
								"name": "怀仁县"
							}
						]
					},
					{
						"id": "140700",
						"name": "晋中市",
						"childs": [
							{
								"id": "140702",
								"name": "榆次区"
							},
							{
								"id": "140721",
								"name": "榆社县"
							},
							{
								"id": "140722",
								"name": "左权县"
							},
							{
								"id": "140723",
								"name": "和顺县"
							},
							{
								"id": "140724",
								"name": "昔阳县"
							},
							{
								"id": "140725",
								"name": "寿阳县"
							},
							{
								"id": "140726",
								"name": "太谷县"
							},
							{
								"id": "140727",
								"name": "祁县"
							},
							{
								"id": "140728",
								"name": "平遥县"
							},
							{
								"id": "140729",
								"name": "灵石县"
							},
							{
								"id": "140781",
								"name": "介休市"
							}
						]
					},
					{
						"id": "140800",
						"name": "运城市",
						"childs": [
							{
								"id": "140802",
								"name": "盐湖区"
							},
							{
								"id": "140821",
								"name": "临猗县"
							},
							{
								"id": "140822",
								"name": "万荣县"
							},
							{
								"id": "140823",
								"name": "闻喜县"
							},
							{
								"id": "140824",
								"name": "稷山县"
							},
							{
								"id": "140825",
								"name": "新绛县"
							},
							{
								"id": "140826",
								"name": "绛县"
							},
							{
								"id": "140827",
								"name": "垣曲县"
							},
							{
								"id": "140828",
								"name": "夏县"
							},
							{
								"id": "140829",
								"name": "平陆县"
							},
							{
								"id": "140830",
								"name": "芮城县"
							},
							{
								"id": "140881",
								"name": "永济市"
							},
							{
								"id": "140882",
								"name": "河津市"
							}
						]
					},
					{
						"id": "140900",
						"name": "忻州市",
						"childs": [
							{
								"id": "140902",
								"name": "忻府区"
							},
							{
								"id": "140921",
								"name": "定襄县"
							},
							{
								"id": "140922",
								"name": "五台县"
							},
							{
								"id": "140923",
								"name": "代县"
							},
							{
								"id": "140924",
								"name": "繁峙县"
							},
							{
								"id": "140925",
								"name": "宁武县"
							},
							{
								"id": "140926",
								"name": "静乐县"
							},
							{
								"id": "140927",
								"name": "神池县"
							},
							{
								"id": "140928",
								"name": "五寨县"
							},
							{
								"id": "140929",
								"name": "岢岚县"
							},
							{
								"id": "140930",
								"name": "河曲县"
							},
							{
								"id": "140931",
								"name": "保德县"
							},
							{
								"id": "140932",
								"name": "偏关县"
							},
							{
								"id": "140981",
								"name": "原平市"
							}
						]
					},
					{
						"id": "141000",
						"name": "临汾市",
						"childs": [
							{
								"id": "141002",
								"name": "尧都区"
							},
							{
								"id": "141021",
								"name": "曲沃县"
							},
							{
								"id": "141022",
								"name": "翼城县"
							},
							{
								"id": "141023",
								"name": "襄汾县"
							},
							{
								"id": "141024",
								"name": "洪洞县"
							},
							{
								"id": "141025",
								"name": "古县"
							},
							{
								"id": "141026",
								"name": "安泽县"
							},
							{
								"id": "141027",
								"name": "浮山县"
							},
							{
								"id": "141028",
								"name": "吉县"
							},
							{
								"id": "141029",
								"name": "乡宁县"
							},
							{
								"id": "141030",
								"name": "大宁县"
							},
							{
								"id": "141031",
								"name": "隰县"
							},
							{
								"id": "141032",
								"name": "永和县"
							},
							{
								"id": "141033",
								"name": "蒲县"
							},
							{
								"id": "141034",
								"name": "汾西县"
							},
							{
								"id": "141081",
								"name": "侯马市"
							},
							{
								"id": "141082",
								"name": "霍州市"
							}
						]
					},
					{
						"id": "141100",
						"name": "吕梁市",
						"childs": [
							{
								"id": "141102",
								"name": "离石区"
							},
							{
								"id": "141121",
								"name": "文水县"
							},
							{
								"id": "141122",
								"name": "交城县"
							},
							{
								"id": "141123",
								"name": "兴县"
							},
							{
								"id": "141124",
								"name": "临县"
							},
							{
								"id": "141125",
								"name": "柳林县"
							},
							{
								"id": "141126",
								"name": "石楼县"
							},
							{
								"id": "141127",
								"name": "岚县"
							},
							{
								"id": "141128",
								"name": "方山县"
							},
							{
								"id": "141129",
								"name": "中阳县"
							},
							{
								"id": "141130",
								"name": "交口县"
							},
							{
								"id": "141181",
								"name": "孝义市"
							},
							{
								"id": "141182",
								"name": "汾阳市"
							}
						]
					}
				]
			},
			{
				"id": "150000",
				"name": "内蒙古自治区",
				"type": 0,
				"childs": [
					{
						"id": "150100",
						"name": "呼和浩特市",
						"childs": [
							{
								"id": "150102",
								"name": "新城区"
							},
							{
								"id": "150103",
								"name": "回民区"
							},
							{
								"id": "150104",
								"name": "玉泉区"
							},
							{
								"id": "150105",
								"name": "赛罕区"
							},
							{
								"id": "150121",
								"name": "土默特左旗"
							},
							{
								"id": "150122",
								"name": "托克托县"
							},
							{
								"id": "150123",
								"name": "和林格尔县"
							},
							{
								"id": "150124",
								"name": "清水河县"
							},
							{
								"id": "150125",
								"name": "武川县"
							}
						]
					},
					{
						"id": "150200",
						"name": "包头市",
						"childs": [
							{
								"id": "150202",
								"name": "东河区"
							},
							{
								"id": "150203",
								"name": "昆都仑区"
							},
							{
								"id": "150204",
								"name": "青山区"
							},
							{
								"id": "150205",
								"name": "石拐区"
							},
							{
								"id": "150206",
								"name": "白云鄂博矿区"
							},
							{
								"id": "150207",
								"name": "九原区"
							},
							{
								"id": "150221",
								"name": "土默特右旗"
							},
							{
								"id": "150222",
								"name": "固阳县"
							},
							{
								"id": "150223",
								"name": "达尔罕茂明安联合旗"
							}
						]
					},
					{
						"id": "150300",
						"name": "乌海市",
						"childs": [
							{
								"id": "150302",
								"name": "海勃湾区"
							},
							{
								"id": "150303",
								"name": "海南区"
							},
							{
								"id": "150304",
								"name": "乌达区"
							}
						]
					},
					{
						"id": "150400",
						"name": "赤峰市",
						"childs": [
							{
								"id": "150402",
								"name": "红山区"
							},
							{
								"id": "150403",
								"name": "元宝山区"
							},
							{
								"id": "150404",
								"name": "松山区"
							},
							{
								"id": "150421",
								"name": "阿鲁科尔沁旗"
							},
							{
								"id": "150422",
								"name": "巴林左旗"
							},
							{
								"id": "150423",
								"name": "巴林右旗"
							},
							{
								"id": "150424",
								"name": "林西县"
							},
							{
								"id": "150425",
								"name": "克什克腾旗"
							},
							{
								"id": "150426",
								"name": "翁牛特旗"
							},
							{
								"id": "150428",
								"name": "喀喇沁旗"
							},
							{
								"id": "150429",
								"name": "宁城县"
							},
							{
								"id": "150430",
								"name": "敖汉旗"
							}
						]
					},
					{
						"id": "150500",
						"name": "通辽市",
						"childs": [
							{
								"id": "150502",
								"name": "科尔沁区"
							},
							{
								"id": "150521",
								"name": "科尔沁左翼中旗"
							},
							{
								"id": "150522",
								"name": "科尔沁左翼后旗"
							},
							{
								"id": "150523",
								"name": "开鲁县"
							},
							{
								"id": "150524",
								"name": "库伦旗"
							},
							{
								"id": "150525",
								"name": "奈曼旗"
							},
							{
								"id": "150526",
								"name": "扎鲁特旗"
							},
							{
								"id": "150581",
								"name": "霍林郭勒市"
							}
						]
					},
					{
						"id": "150600",
						"name": "鄂尔多斯市",
						"childs": [
							{
								"id": "150602",
								"name": "东胜区"
							},
							{
								"id": "150621",
								"name": "达拉特旗"
							},
							{
								"id": "150622",
								"name": "准格尔旗"
							},
							{
								"id": "150623",
								"name": "鄂托克前旗"
							},
							{
								"id": "150624",
								"name": "鄂托克旗"
							},
							{
								"id": "150625",
								"name": "杭锦旗"
							},
							{
								"id": "150626",
								"name": "乌审旗"
							},
							{
								"id": "150627",
								"name": "伊金霍洛旗"
							}
						]
					},
					{
						"id": "150700",
						"name": "呼伦贝尔市",
						"childs": [
							{
								"id": "150702",
								"name": "海拉尔区"
							},
							{
								"id": "150703",
								"name": "扎赉诺尔区"
							},
							{
								"id": "150721",
								"name": "阿荣旗"
							},
							{
								"id": "150722",
								"name": "莫力达瓦达斡尔族自治旗"
							},
							{
								"id": "150723",
								"name": "鄂伦春自治旗"
							},
							{
								"id": "150724",
								"name": "鄂温克族自治旗"
							},
							{
								"id": "150725",
								"name": "陈巴尔虎旗"
							},
							{
								"id": "150726",
								"name": "新巴尔虎左旗"
							},
							{
								"id": "150727",
								"name": "新巴尔虎右旗"
							},
							{
								"id": "150781",
								"name": "满洲里市"
							},
							{
								"id": "150782",
								"name": "牙克石市"
							},
							{
								"id": "150783",
								"name": "扎兰屯市"
							},
							{
								"id": "150784",
								"name": "额尔古纳市"
							},
							{
								"id": "150785",
								"name": "根河市"
							}
						]
					},
					{
						"id": "150800",
						"name": "巴彦淖尔市",
						"childs": [
							{
								"id": "150802",
								"name": "临河区"
							},
							{
								"id": "150821",
								"name": "五原县"
							},
							{
								"id": "150822",
								"name": "磴口县"
							},
							{
								"id": "150823",
								"name": "乌拉特前旗"
							},
							{
								"id": "150824",
								"name": "乌拉特中旗"
							},
							{
								"id": "150825",
								"name": "乌拉特后旗"
							},
							{
								"id": "150826",
								"name": "杭锦后旗"
							}
						]
					},
					{
						"id": "150900",
						"name": "乌兰察布市",
						"childs": [
							{
								"id": "150902",
								"name": "集宁区"
							},
							{
								"id": "150921",
								"name": "卓资县"
							},
							{
								"id": "150922",
								"name": "化德县"
							},
							{
								"id": "150923",
								"name": "商都县"
							},
							{
								"id": "150924",
								"name": "兴和县"
							},
							{
								"id": "150925",
								"name": "凉城县"
							},
							{
								"id": "150926",
								"name": "察哈尔右翼前旗"
							},
							{
								"id": "150927",
								"name": "察哈尔右翼中旗"
							},
							{
								"id": "150928",
								"name": "察哈尔右翼后旗"
							},
							{
								"id": "150929",
								"name": "四子王旗"
							},
							{
								"id": "150981",
								"name": "丰镇市"
							}
						]
					},
					{
						"id": "152200",
						"name": "兴安盟",
						"childs": [
							{
								"id": "152201",
								"name": "乌兰浩特市"
							},
							{
								"id": "152202",
								"name": "阿尔山市"
							},
							{
								"id": "152221",
								"name": "科尔沁右翼前旗"
							},
							{
								"id": "152222",
								"name": "科尔沁右翼中旗"
							},
							{
								"id": "152223",
								"name": "扎赉特旗"
							},
							{
								"id": "152224",
								"name": "突泉县"
							}
						]
					},
					{
						"id": "152500",
						"name": "锡林郭勒盟",
						"childs": [
							{
								"id": "152501",
								"name": "二连浩特市"
							},
							{
								"id": "152502",
								"name": "锡林浩特市"
							},
							{
								"id": "152522",
								"name": "阿巴嘎旗"
							},
							{
								"id": "152523",
								"name": "苏尼特左旗"
							},
							{
								"id": "152524",
								"name": "苏尼特右旗"
							},
							{
								"id": "152525",
								"name": "东乌珠穆沁旗"
							},
							{
								"id": "152526",
								"name": "西乌珠穆沁旗"
							},
							{
								"id": "152527",
								"name": "太仆寺旗"
							},
							{
								"id": "152528",
								"name": "镶黄旗"
							},
							{
								"id": "152529",
								"name": "正镶白旗"
							},
							{
								"id": "152530",
								"name": "正蓝旗"
							},
							{
								"id": "152531",
								"name": "多伦县"
							}
						]
					},
					{
						"id": "152900",
						"name": "阿拉善盟",
						"childs": [
							{
								"id": "152921",
								"name": "阿拉善左旗"
							},
							{
								"id": "152922",
								"name": "阿拉善右旗"
							},
							{
								"id": "152923",
								"name": "额济纳旗"
							}
						]
					}
				]
			},
			{
				"id": "210000",
				"name": "辽宁省",
				"type": 0,
				"childs": [
					{
						"id": "210100",
						"name": "沈阳市",
						"childs": [
							{
								"id": "210102",
								"name": "和平区"
							},
							{
								"id": "210103",
								"name": "沈河区"
							},
							{
								"id": "210104",
								"name": "大东区"
							},
							{
								"id": "210105",
								"name": "皇姑区"
							},
							{
								"id": "210106",
								"name": "铁西区"
							},
							{
								"id": "210111",
								"name": "苏家屯区"
							},
							{
								"id": "210112",
								"name": "浑南区"
							},
							{
								"id": "210113",
								"name": "沈北新区"
							},
							{
								"id": "210114",
								"name": "于洪区"
							},
							{
								"id": "210122",
								"name": "辽中县"
							},
							{
								"id": "210123",
								"name": "康平县"
							},
							{
								"id": "210124",
								"name": "法库县"
							},
							{
								"id": "210181",
								"name": "新民市"
							}
						]
					},
					{
						"id": "210200",
						"name": "大连市",
						"childs": [
							{
								"id": "210202",
								"name": "中山区"
							},
							{
								"id": "210203",
								"name": "西岗区"
							},
							{
								"id": "210204",
								"name": "沙河口区"
							},
							{
								"id": "210211",
								"name": "甘井子区"
							},
							{
								"id": "210212",
								"name": "旅顺口区"
							},
							{
								"id": "210213",
								"name": "金州区"
							},
							{
								"id": "210224",
								"name": "长海县"
							},
							{
								"id": "210281",
								"name": "瓦房店市"
							},
							{
								"id": "210282",
								"name": "普兰店市"
							},
							{
								"id": "210283",
								"name": "庄河市"
							}
						]
					},
					{
						"id": "210300",
						"name": "鞍山市",
						"childs": [
							{
								"id": "210302",
								"name": "铁东区"
							},
							{
								"id": "210303",
								"name": "铁西区"
							},
							{
								"id": "210304",
								"name": "立山区"
							},
							{
								"id": "210311",
								"name": "千山区"
							},
							{
								"id": "210321",
								"name": "台安县"
							},
							{
								"id": "210323",
								"name": "岫岩满族自治县"
							},
							{
								"id": "210381",
								"name": "海城市"
							}
						]
					},
					{
						"id": "210400",
						"name": "抚顺市",
						"childs": [
							{
								"id": "210402",
								"name": "新抚区"
							},
							{
								"id": "210403",
								"name": "东洲区"
							},
							{
								"id": "210404",
								"name": "望花区"
							},
							{
								"id": "210411",
								"name": "顺城区"
							},
							{
								"id": "210421",
								"name": "抚顺县"
							},
							{
								"id": "210422",
								"name": "新宾满族自治县"
							},
							{
								"id": "210423",
								"name": "清原满族自治县"
							}
						]
					},
					{
						"id": "210500",
						"name": "本溪市",
						"childs": [
							{
								"id": "210502",
								"name": "平山区"
							},
							{
								"id": "210503",
								"name": "溪湖区"
							},
							{
								"id": "210504",
								"name": "明山区"
							},
							{
								"id": "210505",
								"name": "南芬区"
							},
							{
								"id": "210521",
								"name": "本溪满族自治县"
							},
							{
								"id": "210522",
								"name": "桓仁满族自治县"
							}
						]
					},
					{
						"id": "210600",
						"name": "丹东市",
						"childs": [
							{
								"id": "210602",
								"name": "元宝区"
							},
							{
								"id": "210603",
								"name": "振兴区"
							},
							{
								"id": "210604",
								"name": "振安区"
							},
							{
								"id": "210624",
								"name": "宽甸满族自治县"
							},
							{
								"id": "210681",
								"name": "东港市"
							},
							{
								"id": "210682",
								"name": "凤城市"
							}
						]
					},
					{
						"id": "210700",
						"name": "锦州市",
						"childs": [
							{
								"id": "210702",
								"name": "古塔区"
							},
							{
								"id": "210703",
								"name": "凌河区"
							},
							{
								"id": "210711",
								"name": "太和区"
							},
							{
								"id": "210726",
								"name": "黑山县"
							},
							{
								"id": "210727",
								"name": "义县"
							},
							{
								"id": "210781",
								"name": "凌海市"
							},
							{
								"id": "210782",
								"name": "北镇市"
							}
						]
					},
					{
						"id": "210800",
						"name": "营口市",
						"childs": [
							{
								"id": "210802",
								"name": "站前区"
							},
							{
								"id": "210803",
								"name": "西市区"
							},
							{
								"id": "210804",
								"name": "鲅鱼圈区"
							},
							{
								"id": "210811",
								"name": "老边区"
							},
							{
								"id": "210881",
								"name": "盖州市"
							},
							{
								"id": "210882",
								"name": "大石桥市"
							}
						]
					},
					{
						"id": "210900",
						"name": "阜新市",
						"childs": [
							{
								"id": "210902",
								"name": "海州区"
							},
							{
								"id": "210903",
								"name": "新邱区"
							},
							{
								"id": "210904",
								"name": "太平区"
							},
							{
								"id": "210905",
								"name": "清河门区"
							},
							{
								"id": "210911",
								"name": "细河区"
							},
							{
								"id": "210921",
								"name": "阜新蒙古族自治县"
							},
							{
								"id": "210922",
								"name": "彰武县"
							}
						]
					},
					{
						"id": "211000",
						"name": "辽阳市",
						"childs": [
							{
								"id": "211002",
								"name": "白塔区"
							},
							{
								"id": "211003",
								"name": "文圣区"
							},
							{
								"id": "211004",
								"name": "宏伟区"
							},
							{
								"id": "211005",
								"name": "弓长岭区"
							},
							{
								"id": "211011",
								"name": "太子河区"
							},
							{
								"id": "211021",
								"name": "辽阳县"
							},
							{
								"id": "211081",
								"name": "灯塔市"
							}
						]
					},
					{
						"id": "211100",
						"name": "盘锦市",
						"childs": [
							{
								"id": "211102",
								"name": "双台子区"
							},
							{
								"id": "211103",
								"name": "兴隆台区"
							},
							{
								"id": "211121",
								"name": "大洼县"
							},
							{
								"id": "211122",
								"name": "盘山县"
							}
						]
					},
					{
						"id": "211200",
						"name": "铁岭市",
						"childs": [
							{
								"id": "211202",
								"name": "银州区"
							},
							{
								"id": "211204",
								"name": "清河区"
							},
							{
								"id": "211221",
								"name": "铁岭县"
							},
							{
								"id": "211223",
								"name": "西丰县"
							},
							{
								"id": "211224",
								"name": "昌图县"
							},
							{
								"id": "211281",
								"name": "调兵山市"
							},
							{
								"id": "211282",
								"name": "开原市"
							}
						]
					},
					{
						"id": "211300",
						"name": "朝阳市",
						"childs": [
							{
								"id": "211302",
								"name": "双塔区"
							},
							{
								"id": "211303",
								"name": "龙城区"
							},
							{
								"id": "211321",
								"name": "朝阳县"
							},
							{
								"id": "211322",
								"name": "建平县"
							},
							{
								"id": "211324",
								"name": "喀喇沁左翼蒙古族自治县"
							},
							{
								"id": "211381",
								"name": "北票市"
							},
							{
								"id": "211382",
								"name": "凌源市"
							}
						]
					},
					{
						"id": "211400",
						"name": "葫芦岛市",
						"childs": [
							{
								"id": "211402",
								"name": "连山区"
							},
							{
								"id": "211403",
								"name": "龙港区"
							},
							{
								"id": "211404",
								"name": "南票区"
							},
							{
								"id": "211421",
								"name": "绥中县"
							},
							{
								"id": "211422",
								"name": "建昌县"
							},
							{
								"id": "211481",
								"name": "兴城市"
							}
						]
					},
					{
						"id": "211500",
						"name": "金普新区",
						"childs": [
							{
								"id": "211501",
								"name": "金州新区"
							},
							{
								"id": "211502",
								"name": "普湾新区"
							},
							{
								"id": "211503",
								"name": "保税区"
							}
						]
					}
				]
			},
			{
				"id": "220000",
				"name": "吉林省",
				"type": 0,
				"childs": [
					{
						"id": "220100",
						"name": "长春市",
						"childs": [
							{
								"id": "220102",
								"name": "南关区"
							},
							{
								"id": "220103",
								"name": "宽城区"
							},
							{
								"id": "220104",
								"name": "朝阳区"
							},
							{
								"id": "220105",
								"name": "二道区"
							},
							{
								"id": "220106",
								"name": "绿园区"
							},
							{
								"id": "220112",
								"name": "双阳区"
							},
							{
								"id": "220113",
								"name": "九台区"
							},
							{
								"id": "220122",
								"name": "农安县"
							},
							{
								"id": "220182",
								"name": "榆树市"
							},
							{
								"id": "220183",
								"name": "德惠市"
							}
						]
					},
					{
						"id": "220200",
						"name": "吉林市",
						"childs": [
							{
								"id": "220202",
								"name": "昌邑区"
							},
							{
								"id": "220203",
								"name": "龙潭区"
							},
							{
								"id": "220204",
								"name": "船营区"
							},
							{
								"id": "220211",
								"name": "丰满区"
							},
							{
								"id": "220221",
								"name": "永吉县"
							},
							{
								"id": "220281",
								"name": "蛟河市"
							},
							{
								"id": "220282",
								"name": "桦甸市"
							},
							{
								"id": "220283",
								"name": "舒兰市"
							},
							{
								"id": "220284",
								"name": "磐石市"
							}
						]
					},
					{
						"id": "220300",
						"name": "四平市",
						"childs": [
							{
								"id": "220302",
								"name": "铁西区"
							},
							{
								"id": "220303",
								"name": "铁东区"
							},
							{
								"id": "220322",
								"name": "梨树县"
							},
							{
								"id": "220323",
								"name": "伊通满族自治县"
							},
							{
								"id": "220381",
								"name": "公主岭市"
							},
							{
								"id": "220382",
								"name": "双辽市"
							}
						]
					},
					{
						"id": "220400",
						"name": "辽源市",
						"childs": [
							{
								"id": "220402",
								"name": "龙山区"
							},
							{
								"id": "220403",
								"name": "西安区"
							},
							{
								"id": "220421",
								"name": "东丰县"
							},
							{
								"id": "220422",
								"name": "东辽县"
							}
						]
					},
					{
						"id": "220500",
						"name": "通化市",
						"childs": [
							{
								"id": "220502",
								"name": "东昌区"
							},
							{
								"id": "220503",
								"name": "二道江区"
							},
							{
								"id": "220521",
								"name": "通化县"
							},
							{
								"id": "220523",
								"name": "辉南县"
							},
							{
								"id": "220524",
								"name": "柳河县"
							},
							{
								"id": "220581",
								"name": "梅河口市"
							},
							{
								"id": "220582",
								"name": "集安市"
							}
						]
					},
					{
						"id": "220600",
						"name": "白山市",
						"childs": [
							{
								"id": "220602",
								"name": "浑江区"
							},
							{
								"id": "220605",
								"name": "江源区"
							},
							{
								"id": "220621",
								"name": "抚松县"
							},
							{
								"id": "220622",
								"name": "靖宇县"
							},
							{
								"id": "220623",
								"name": "长白朝鲜族自治县"
							},
							{
								"id": "220681",
								"name": "临江市"
							}
						]
					},
					{
						"id": "220700",
						"name": "松原市",
						"childs": [
							{
								"id": "220702",
								"name": "宁江区"
							},
							{
								"id": "220721",
								"name": "前郭尔罗斯蒙古族自治县"
							},
							{
								"id": "220722",
								"name": "长岭县"
							},
							{
								"id": "220723",
								"name": "乾安县"
							},
							{
								"id": "220781",
								"name": "扶余市"
							}
						]
					},
					{
						"id": "220800",
						"name": "白城市",
						"childs": [
							{
								"id": "220802",
								"name": "洮北区"
							},
							{
								"id": "220821",
								"name": "镇赉县"
							},
							{
								"id": "220822",
								"name": "通榆县"
							},
							{
								"id": "220881",
								"name": "洮南市"
							},
							{
								"id": "220882",
								"name": "大安市"
							}
						]
					},
					{
						"id": "222400",
						"name": "延边朝鲜族自治州",
						"childs": [
							{
								"id": "222401",
								"name": "延吉市"
							},
							{
								"id": "222402",
								"name": "图们市"
							},
							{
								"id": "222403",
								"name": "敦化市"
							},
							{
								"id": "222404",
								"name": "珲春市"
							},
							{
								"id": "222405",
								"name": "龙井市"
							},
							{
								"id": "222406",
								"name": "和龙市"
							},
							{
								"id": "222424",
								"name": "汪清县"
							},
							{
								"id": "222426",
								"name": "安图县"
							}
						]
					}
				]
			},
			{
				"id": "230000",
				"name": "黑龙江省",
				"type": 0,
				"childs": [
					{
						"id": "230100",
						"name": "哈尔滨市",
						"childs": [
							{
								"id": "230102",
								"name": "道里区"
							},
							{
								"id": "230103",
								"name": "南岗区"
							},
							{
								"id": "230104",
								"name": "道外区"
							},
							{
								"id": "230108",
								"name": "平房区"
							},
							{
								"id": "230109",
								"name": "松北区"
							},
							{
								"id": "230110",
								"name": "香坊区"
							},
							{
								"id": "230111",
								"name": "呼兰区"
							},
							{
								"id": "230112",
								"name": "阿城区"
							},
							{
								"id": "230113",
								"name": "双城区"
							},
							{
								"id": "230123",
								"name": "依兰县"
							},
							{
								"id": "230124",
								"name": "方正县"
							},
							{
								"id": "230125",
								"name": "宾县"
							},
							{
								"id": "230126",
								"name": "巴彦县"
							},
							{
								"id": "230127",
								"name": "木兰县"
							},
							{
								"id": "230128",
								"name": "通河县"
							},
							{
								"id": "230129",
								"name": "延寿县"
							},
							{
								"id": "230183",
								"name": "尚志市"
							},
							{
								"id": "230184",
								"name": "五常市"
							}
						]
					},
					{
						"id": "230200",
						"name": "齐齐哈尔市",
						"childs": [
							{
								"id": "230202",
								"name": "龙沙区"
							},
							{
								"id": "230203",
								"name": "建华区"
							},
							{
								"id": "230204",
								"name": "铁锋区"
							},
							{
								"id": "230205",
								"name": "昂昂溪区"
							},
							{
								"id": "230206",
								"name": "富拉尔基区"
							},
							{
								"id": "230207",
								"name": "碾子山区"
							},
							{
								"id": "230208",
								"name": "梅里斯达斡尔族区"
							},
							{
								"id": "230221",
								"name": "龙江县"
							},
							{
								"id": "230223",
								"name": "依安县"
							},
							{
								"id": "230224",
								"name": "泰来县"
							},
							{
								"id": "230225",
								"name": "甘南县"
							},
							{
								"id": "230227",
								"name": "富裕县"
							},
							{
								"id": "230229",
								"name": "克山县"
							},
							{
								"id": "230230",
								"name": "克东县"
							},
							{
								"id": "230231",
								"name": "拜泉县"
							},
							{
								"id": "230281",
								"name": "讷河市"
							}
						]
					},
					{
						"id": "230300",
						"name": "鸡西市",
						"childs": [
							{
								"id": "230302",
								"name": "鸡冠区"
							},
							{
								"id": "230303",
								"name": "恒山区"
							},
							{
								"id": "230304",
								"name": "滴道区"
							},
							{
								"id": "230305",
								"name": "梨树区"
							},
							{
								"id": "230306",
								"name": "城子河区"
							},
							{
								"id": "230307",
								"name": "麻山区"
							},
							{
								"id": "230321",
								"name": "鸡东县"
							},
							{
								"id": "230381",
								"name": "虎林市"
							},
							{
								"id": "230382",
								"name": "密山市"
							}
						]
					},
					{
						"id": "230400",
						"name": "鹤岗市",
						"childs": [
							{
								"id": "230402",
								"name": "向阳区"
							},
							{
								"id": "230403",
								"name": "工农区"
							},
							{
								"id": "230404",
								"name": "南山区"
							},
							{
								"id": "230405",
								"name": "兴安区"
							},
							{
								"id": "230406",
								"name": "东山区"
							},
							{
								"id": "230407",
								"name": "兴山区"
							},
							{
								"id": "230421",
								"name": "萝北县"
							},
							{
								"id": "230422",
								"name": "绥滨县"
							}
						]
					},
					{
						"id": "230500",
						"name": "双鸭山市",
						"childs": [
							{
								"id": "230502",
								"name": "尖山区"
							},
							{
								"id": "230503",
								"name": "岭东区"
							},
							{
								"id": "230505",
								"name": "四方台区"
							},
							{
								"id": "230506",
								"name": "宝山区"
							},
							{
								"id": "230521",
								"name": "集贤县"
							},
							{
								"id": "230522",
								"name": "友谊县"
							},
							{
								"id": "230523",
								"name": "宝清县"
							},
							{
								"id": "230524",
								"name": "饶河县"
							}
						]
					},
					{
						"id": "230600",
						"name": "大庆市",
						"childs": [
							{
								"id": "230602",
								"name": "萨尔图区"
							},
							{
								"id": "230603",
								"name": "龙凤区"
							},
							{
								"id": "230604",
								"name": "让胡路区"
							},
							{
								"id": "230605",
								"name": "红岗区"
							},
							{
								"id": "230606",
								"name": "大同区"
							},
							{
								"id": "230621",
								"name": "肇州县"
							},
							{
								"id": "230622",
								"name": "肇源县"
							},
							{
								"id": "230623",
								"name": "林甸县"
							},
							{
								"id": "230624",
								"name": "杜尔伯特蒙古族自治县"
							}
						]
					},
					{
						"id": "230700",
						"name": "伊春市",
						"childs": [
							{
								"id": "230702",
								"name": "伊春区"
							},
							{
								"id": "230703",
								"name": "南岔区"
							},
							{
								"id": "230704",
								"name": "友好区"
							},
							{
								"id": "230705",
								"name": "西林区"
							},
							{
								"id": "230706",
								"name": "翠峦区"
							},
							{
								"id": "230707",
								"name": "新青区"
							},
							{
								"id": "230708",
								"name": "美溪区"
							},
							{
								"id": "230709",
								"name": "金山屯区"
							},
							{
								"id": "230710",
								"name": "五营区"
							},
							{
								"id": "230711",
								"name": "乌马河区"
							},
							{
								"id": "230712",
								"name": "汤旺河区"
							},
							{
								"id": "230713",
								"name": "带岭区"
							},
							{
								"id": "230714",
								"name": "乌伊岭区"
							},
							{
								"id": "230715",
								"name": "红星区"
							},
							{
								"id": "230716",
								"name": "上甘岭区"
							},
							{
								"id": "230722",
								"name": "嘉荫县"
							},
							{
								"id": "230781",
								"name": "铁力市"
							}
						]
					},
					{
						"id": "230800",
						"name": "佳木斯市",
						"childs": [
							{
								"id": "230803",
								"name": "向阳区"
							},
							{
								"id": "230804",
								"name": "前进区"
							},
							{
								"id": "230805",
								"name": "东风区"
							},
							{
								"id": "230811",
								"name": "郊区"
							},
							{
								"id": "230822",
								"name": "桦南县"
							},
							{
								"id": "230826",
								"name": "桦川县"
							},
							{
								"id": "230828",
								"name": "汤原县"
							},
							{
								"id": "230833",
								"name": "抚远县"
							},
							{
								"id": "230881",
								"name": "同江市"
							},
							{
								"id": "230882",
								"name": "富锦市"
							}
						]
					},
					{
						"id": "230900",
						"name": "七台河市",
						"childs": [
							{
								"id": "230902",
								"name": "新兴区"
							},
							{
								"id": "230903",
								"name": "桃山区"
							},
							{
								"id": "230904",
								"name": "茄子河区"
							},
							{
								"id": "230921",
								"name": "勃利县"
							}
						]
					},
					{
						"id": "231000",
						"name": "牡丹江市",
						"childs": [
							{
								"id": "231002",
								"name": "东安区"
							},
							{
								"id": "231003",
								"name": "阳明区"
							},
							{
								"id": "231004",
								"name": "爱民区"
							},
							{
								"id": "231005",
								"name": "西安区"
							},
							{
								"id": "231024",
								"name": "东宁县"
							},
							{
								"id": "231025",
								"name": "林口县"
							},
							{
								"id": "231081",
								"name": "绥芬河市"
							},
							{
								"id": "231083",
								"name": "海林市"
							},
							{
								"id": "231084",
								"name": "宁安市"
							},
							{
								"id": "231085",
								"name": "穆棱市"
							}
						]
					},
					{
						"id": "231100",
						"name": "黑河市",
						"childs": [
							{
								"id": "231102",
								"name": "爱辉区"
							},
							{
								"id": "231121",
								"name": "嫩江县"
							},
							{
								"id": "231123",
								"name": "逊克县"
							},
							{
								"id": "231124",
								"name": "孙吴县"
							},
							{
								"id": "231181",
								"name": "北安市"
							},
							{
								"id": "231182",
								"name": "五大连池市"
							}
						]
					},
					{
						"id": "231200",
						"name": "绥化市",
						"childs": [
							{
								"id": "231202",
								"name": "北林区"
							},
							{
								"id": "231221",
								"name": "望奎县"
							},
							{
								"id": "231222",
								"name": "兰西县"
							},
							{
								"id": "231223",
								"name": "青冈县"
							},
							{
								"id": "231224",
								"name": "庆安县"
							},
							{
								"id": "231225",
								"name": "明水县"
							},
							{
								"id": "231226",
								"name": "绥棱县"
							},
							{
								"id": "231281",
								"name": "安达市"
							},
							{
								"id": "231282",
								"name": "肇东市"
							},
							{
								"id": "231283",
								"name": "海伦市"
							}
						]
					},
					{
						"id": "232700",
						"name": "大兴安岭地区",
						"childs": [
							{
								"id": "232701",
								"name": "加格达奇区"
							},
							{
								"id": "232702",
								"name": "新林区"
							},
							{
								"id": "232703",
								"name": "松岭区"
							},
							{
								"id": "232704",
								"name": "呼中区"
							},
							{
								"id": "232721",
								"name": "呼玛县"
							},
							{
								"id": "232722",
								"name": "塔河县"
							},
							{
								"id": "232723",
								"name": "漠河县"
							}
						]
					}
				]
			},
			{
				"id": "310000",
				"name": "上海",
				"type": 1,
				"childs": [
					{
						"id": "310100",
						"name": "上海市",
						"childs": [
							{
								"id": "310101",
								"name": "黄浦区"
							},
							{
								"id": "310104",
								"name": "徐汇区"
							},
							{
								"id": "310105",
								"name": "长宁区"
							},
							{
								"id": "310106",
								"name": "静安区"
							},
							{
								"id": "310107",
								"name": "普陀区"
							},
							{
								"id": "310108",
								"name": "闸北区"
							},
							{
								"id": "310109",
								"name": "虹口区"
							},
							{
								"id": "310110",
								"name": "杨浦区"
							},
							{
								"id": "310112",
								"name": "闵行区"
							},
							{
								"id": "310113",
								"name": "宝山区"
							},
							{
								"id": "310114",
								"name": "嘉定区"
							},
							{
								"id": "310115",
								"name": "浦东新区"
							},
							{
								"id": "310116",
								"name": "金山区"
							},
							{
								"id": "310117",
								"name": "松江区"
							},
							{
								"id": "310118",
								"name": "青浦区"
							},
							{
								"id": "310120",
								"name": "奉贤区"
							},
							{
								"id": "310230",
								"name": "崇明县"
							}
						]
					}
				]
			},
			{
				"id": "320000",
				"name": "江苏省",
				"type": 0,
				"childs": [
					{
						"id": "320100",
						"name": "南京市",
						"childs": [
							{
								"id": "320102",
								"name": "玄武区"
							},
							{
								"id": "320104",
								"name": "秦淮区"
							},
							{
								"id": "320105",
								"name": "建邺区"
							},
							{
								"id": "320106",
								"name": "鼓楼区"
							},
							{
								"id": "320111",
								"name": "浦口区"
							},
							{
								"id": "320113",
								"name": "栖霞区"
							},
							{
								"id": "320114",
								"name": "雨花台区"
							},
							{
								"id": "320115",
								"name": "江宁区"
							},
							{
								"id": "320116",
								"name": "六合区"
							},
							{
								"id": "320117",
								"name": "溧水区"
							},
							{
								"id": "320118",
								"name": "高淳区"
							}
						]
					},
					{
						"id": "320200",
						"name": "无锡市",
						"childs": [
							{
								"id": "320202",
								"name": "崇安区"
							},
							{
								"id": "320203",
								"name": "南长区"
							},
							{
								"id": "320204",
								"name": "北塘区"
							},
							{
								"id": "320205",
								"name": "锡山区"
							},
							{
								"id": "320206",
								"name": "惠山区"
							},
							{
								"id": "320211",
								"name": "滨湖区"
							},
							{
								"id": "320281",
								"name": "江阴市"
							},
							{
								"id": "320282",
								"name": "宜兴市"
							}
						]
					},
					{
						"id": "320300",
						"name": "徐州市",
						"childs": [
							{
								"id": "320302",
								"name": "鼓楼区"
							},
							{
								"id": "320303",
								"name": "云龙区"
							},
							{
								"id": "320305",
								"name": "贾汪区"
							},
							{
								"id": "320311",
								"name": "泉山区"
							},
							{
								"id": "320312",
								"name": "铜山区"
							},
							{
								"id": "320321",
								"name": "丰县"
							},
							{
								"id": "320322",
								"name": "沛县"
							},
							{
								"id": "320324",
								"name": "睢宁县"
							},
							{
								"id": "320381",
								"name": "新沂市"
							},
							{
								"id": "320382",
								"name": "邳州市"
							}
						]
					},
					{
						"id": "320400",
						"name": "常州市",
						"childs": [
							{
								"id": "320402",
								"name": "天宁区"
							},
							{
								"id": "320404",
								"name": "钟楼区"
							},
							{
								"id": "320405",
								"name": "戚墅堰区"
							},
							{
								"id": "320411",
								"name": "新北区"
							},
							{
								"id": "320412",
								"name": "武进区"
							},
							{
								"id": "320481",
								"name": "溧阳市"
							},
							{
								"id": "320482",
								"name": "金坛市"
							}
						]
					},
					{
						"id": "320500",
						"name": "苏州市",
						"childs": [
							{
								"id": "320505",
								"name": "虎丘区"
							},
							{
								"id": "320506",
								"name": "吴中区"
							},
							{
								"id": "320507",
								"name": "相城区"
							},
							{
								"id": "320508",
								"name": "姑苏区"
							},
							{
								"id": "320509",
								"name": "吴江区"
							},
							{
								"id": "320581",
								"name": "常熟市"
							},
							{
								"id": "320582",
								"name": "张家港市"
							},
							{
								"id": "320583",
								"name": "昆山市"
							},
							{
								"id": "320585",
								"name": "太仓市"
							}
						]
					},
					{
						"id": "320600",
						"name": "南通市",
						"childs": [
							{
								"id": "320602",
								"name": "崇川区"
							},
							{
								"id": "320611",
								"name": "港闸区"
							},
							{
								"id": "320612",
								"name": "通州区"
							},
							{
								"id": "320621",
								"name": "海安县"
							},
							{
								"id": "320623",
								"name": "如东县"
							},
							{
								"id": "320681",
								"name": "启东市"
							},
							{
								"id": "320682",
								"name": "如皋市"
							},
							{
								"id": "320684",
								"name": "海门市"
							}
						]
					},
					{
						"id": "320700",
						"name": "连云港市",
						"childs": [
							{
								"id": "320703",
								"name": "连云区"
							},
							{
								"id": "320706",
								"name": "海州区"
							},
							{
								"id": "320707",
								"name": "赣榆区"
							},
							{
								"id": "320722",
								"name": "东海县"
							},
							{
								"id": "320723",
								"name": "灌云县"
							},
							{
								"id": "320724",
								"name": "灌南县"
							}
						]
					},
					{
						"id": "320800",
						"name": "淮安市",
						"childs": [
							{
								"id": "320802",
								"name": "清河区"
							},
							{
								"id": "320803",
								"name": "淮安区"
							},
							{
								"id": "320804",
								"name": "淮阴区"
							},
							{
								"id": "320811",
								"name": "清浦区"
							},
							{
								"id": "320826",
								"name": "涟水县"
							},
							{
								"id": "320829",
								"name": "洪泽县"
							},
							{
								"id": "320830",
								"name": "盱眙县"
							},
							{
								"id": "320831",
								"name": "金湖县"
							}
						]
					},
					{
						"id": "320900",
						"name": "盐城市",
						"childs": [
							{
								"id": "320902",
								"name": "亭湖区"
							},
							{
								"id": "320903",
								"name": "盐都区"
							},
							{
								"id": "320921",
								"name": "响水县"
							},
							{
								"id": "320922",
								"name": "滨海县"
							},
							{
								"id": "320923",
								"name": "阜宁县"
							},
							{
								"id": "320924",
								"name": "射阳县"
							},
							{
								"id": "320925",
								"name": "建湖县"
							},
							{
								"id": "320981",
								"name": "东台市"
							},
							{
								"id": "320982",
								"name": "大丰市"
							}
						]
					},
					{
						"id": "321000",
						"name": "扬州市",
						"childs": [
							{
								"id": "321002",
								"name": "广陵区"
							},
							{
								"id": "321003",
								"name": "邗江区"
							},
							{
								"id": "321012",
								"name": "江都区"
							},
							{
								"id": "321023",
								"name": "宝应县"
							},
							{
								"id": "321081",
								"name": "仪征市"
							},
							{
								"id": "321084",
								"name": "高邮市"
							}
						]
					},
					{
						"id": "321100",
						"name": "镇江市",
						"childs": [
							{
								"id": "321102",
								"name": "京口区"
							},
							{
								"id": "321111",
								"name": "润州区"
							},
							{
								"id": "321112",
								"name": "丹徒区"
							},
							{
								"id": "321181",
								"name": "丹阳市"
							},
							{
								"id": "321182",
								"name": "扬中市"
							},
							{
								"id": "321183",
								"name": "句容市"
							}
						]
					},
					{
						"id": "321200",
						"name": "泰州市",
						"childs": [
							{
								"id": "321202",
								"name": "海陵区"
							},
							{
								"id": "321203",
								"name": "高港区"
							},
							{
								"id": "321204",
								"name": "姜堰区"
							},
							{
								"id": "321281",
								"name": "兴化市"
							},
							{
								"id": "321282",
								"name": "靖江市"
							},
							{
								"id": "321283",
								"name": "泰兴市"
							}
						]
					},
					{
						"id": "321300",
						"name": "宿迁市",
						"childs": [
							{
								"id": "321302",
								"name": "宿城区"
							},
							{
								"id": "321311",
								"name": "宿豫区"
							},
							{
								"id": "321322",
								"name": "沭阳县"
							},
							{
								"id": "321323",
								"name": "泗阳县"
							},
							{
								"id": "321324",
								"name": "泗洪县"
							}
						]
					}
				]
			},
			{
				"id": "330000",
				"name": "浙江省",
				"type": 0,
				"childs": [
					{
						"id": "330100",
						"name": "杭州市",
						"childs": [
							{
								"id": "330102",
								"name": "上城区"
							},
							{
								"id": "330103",
								"name": "下城区"
							},
							{
								"id": "330104",
								"name": "江干区"
							},
							{
								"id": "330105",
								"name": "拱墅区"
							},
							{
								"id": "330106",
								"name": "西湖区"
							},
							{
								"id": "330108",
								"name": "滨江区"
							},
							{
								"id": "330109",
								"name": "萧山区"
							},
							{
								"id": "330110",
								"name": "余杭区"
							},
							{
								"id": "330122",
								"name": "桐庐县"
							},
							{
								"id": "330127",
								"name": "淳安县"
							},
							{
								"id": "330182",
								"name": "建德市"
							},
							{
								"id": "330183",
								"name": "富阳区"
							},
							{
								"id": "330185",
								"name": "临安市"
							}
						]
					},
					{
						"id": "330200",
						"name": "宁波市",
						"childs": [
							{
								"id": "330203",
								"name": "海曙区"
							},
							{
								"id": "330204",
								"name": "江东区"
							},
							{
								"id": "330205",
								"name": "江北区"
							},
							{
								"id": "330206",
								"name": "北仑区"
							},
							{
								"id": "330211",
								"name": "镇海区"
							},
							{
								"id": "330212",
								"name": "鄞州区"
							},
							{
								"id": "330225",
								"name": "象山县"
							},
							{
								"id": "330226",
								"name": "宁海县"
							},
							{
								"id": "330281",
								"name": "余姚市"
							},
							{
								"id": "330282",
								"name": "慈溪市"
							},
							{
								"id": "330283",
								"name": "奉化市"
							}
						]
					},
					{
						"id": "330300",
						"name": "温州市",
						"childs": [
							{
								"id": "330302",
								"name": "鹿城区"
							},
							{
								"id": "330303",
								"name": "龙湾区"
							},
							{
								"id": "330304",
								"name": "瓯海区"
							},
							{
								"id": "330322",
								"name": "洞头县"
							},
							{
								"id": "330324",
								"name": "永嘉县"
							},
							{
								"id": "330326",
								"name": "平阳县"
							},
							{
								"id": "330327",
								"name": "苍南县"
							},
							{
								"id": "330328",
								"name": "文成县"
							},
							{
								"id": "330329",
								"name": "泰顺县"
							},
							{
								"id": "330381",
								"name": "瑞安市"
							},
							{
								"id": "330382",
								"name": "乐清市"
							}
						]
					},
					{
						"id": "330400",
						"name": "嘉兴市",
						"childs": [
							{
								"id": "330402",
								"name": "南湖区"
							},
							{
								"id": "330411",
								"name": "秀洲区"
							},
							{
								"id": "330421",
								"name": "嘉善县"
							},
							{
								"id": "330424",
								"name": "海盐县"
							},
							{
								"id": "330481",
								"name": "海宁市"
							},
							{
								"id": "330482",
								"name": "平湖市"
							},
							{
								"id": "330483",
								"name": "桐乡市"
							}
						]
					},
					{
						"id": "330500",
						"name": "湖州市",
						"childs": [
							{
								"id": "330502",
								"name": "吴兴区"
							},
							{
								"id": "330503",
								"name": "南浔区"
							},
							{
								"id": "330521",
								"name": "德清县"
							},
							{
								"id": "330522",
								"name": "长兴县"
							},
							{
								"id": "330523",
								"name": "安吉县"
							}
						]
					},
					{
						"id": "330600",
						"name": "绍兴市",
						"childs": [
							{
								"id": "330602",
								"name": "越城区"
							},
							{
								"id": "330603",
								"name": "柯桥区"
							},
							{
								"id": "330604",
								"name": "上虞区"
							},
							{
								"id": "330624",
								"name": "新昌县"
							},
							{
								"id": "330681",
								"name": "诸暨市"
							},
							{
								"id": "330683",
								"name": "嵊州市"
							}
						]
					},
					{
						"id": "330700",
						"name": "金华市",
						"childs": [
							{
								"id": "330702",
								"name": "婺城区"
							},
							{
								"id": "330703",
								"name": "金东区"
							},
							{
								"id": "330723",
								"name": "武义县"
							},
							{
								"id": "330726",
								"name": "浦江县"
							},
							{
								"id": "330727",
								"name": "磐安县"
							},
							{
								"id": "330781",
								"name": "兰溪市"
							},
							{
								"id": "330782",
								"name": "义乌市"
							},
							{
								"id": "330783",
								"name": "东阳市"
							},
							{
								"id": "330784",
								"name": "永康市"
							}
						]
					},
					{
						"id": "330800",
						"name": "衢州市",
						"childs": [
							{
								"id": "330802",
								"name": "柯城区"
							},
							{
								"id": "330803",
								"name": "衢江区"
							},
							{
								"id": "330822",
								"name": "常山县"
							},
							{
								"id": "330824",
								"name": "开化县"
							},
							{
								"id": "330825",
								"name": "龙游县"
							},
							{
								"id": "330881",
								"name": "江山市"
							}
						]
					},
					{
						"id": "330900",
						"name": "舟山市",
						"childs": [
							{
								"id": "330902",
								"name": "定海区"
							},
							{
								"id": "330903",
								"name": "普陀区"
							},
							{
								"id": "330921",
								"name": "岱山县"
							},
							{
								"id": "330922",
								"name": "嵊泗县"
							}
						]
					},
					{
						"id": "331000",
						"name": "台州市",
						"childs": [
							{
								"id": "331002",
								"name": "椒江区"
							},
							{
								"id": "331003",
								"name": "黄岩区"
							},
							{
								"id": "331004",
								"name": "路桥区"
							},
							{
								"id": "331021",
								"name": "玉环县"
							},
							{
								"id": "331022",
								"name": "三门县"
							},
							{
								"id": "331023",
								"name": "天台县"
							},
							{
								"id": "331024",
								"name": "仙居县"
							},
							{
								"id": "331081",
								"name": "温岭市"
							},
							{
								"id": "331082",
								"name": "临海市"
							}
						]
					},
					{
						"id": "331100",
						"name": "丽水市",
						"childs": [
							{
								"id": "331102",
								"name": "莲都区"
							},
							{
								"id": "331121",
								"name": "青田县"
							},
							{
								"id": "331122",
								"name": "缙云县"
							},
							{
								"id": "331123",
								"name": "遂昌县"
							},
							{
								"id": "331124",
								"name": "松阳县"
							},
							{
								"id": "331125",
								"name": "云和县"
							},
							{
								"id": "331126",
								"name": "庆元县"
							},
							{
								"id": "331127",
								"name": "景宁畲族自治县"
							},
							{
								"id": "331181",
								"name": "龙泉市"
							}
						]
					},
					{
						"id": "331200",
						"name": "舟山群岛新区",
						"childs": [
							{
								"id": "331201",
								"name": "金塘岛"
							},
							{
								"id": "331202",
								"name": "六横岛"
							},
							{
								"id": "331203",
								"name": "衢山岛"
							},
							{
								"id": "331204",
								"name": "舟山本岛西北部"
							},
							{
								"id": "331205",
								"name": "岱山岛西南部"
							},
							{
								"id": "331206",
								"name": "泗礁岛"
							},
							{
								"id": "331207",
								"name": "朱家尖岛"
							},
							{
								"id": "331208",
								"name": "洋山岛"
							},
							{
								"id": "331209",
								"name": "长涂岛"
							},
							{
								"id": "331210",
								"name": "虾峙岛"
							}
						]
					}
				]
			},
			{
				"id": "340000",
				"name": "安徽省",
				"type": 0,
				"childs": [
					{
						"id": "340100",
						"name": "合肥市",
						"childs": [
							{
								"id": "340102",
								"name": "瑶海区"
							},
							{
								"id": "340103",
								"name": "庐阳区"
							},
							{
								"id": "340104",
								"name": "蜀山区"
							},
							{
								"id": "340111",
								"name": "包河区"
							},
							{
								"id": "340121",
								"name": "长丰县"
							},
							{
								"id": "340122",
								"name": "肥东县"
							},
							{
								"id": "340123",
								"name": "肥西县"
							},
							{
								"id": "340124",
								"name": "庐江县"
							},
							{
								"id": "340181",
								"name": "巢湖市"
							}
						]
					},
					{
						"id": "340200",
						"name": "芜湖市",
						"childs": [
							{
								"id": "340202",
								"name": "镜湖区"
							},
							{
								"id": "340203",
								"name": "弋江区"
							},
							{
								"id": "340207",
								"name": "鸠江区"
							},
							{
								"id": "340208",
								"name": "三山区"
							},
							{
								"id": "340221",
								"name": "芜湖县"
							},
							{
								"id": "340222",
								"name": "繁昌县"
							},
							{
								"id": "340223",
								"name": "南陵县"
							},
							{
								"id": "340225",
								"name": "无为县"
							}
						]
					},
					{
						"id": "340300",
						"name": "蚌埠市",
						"childs": [
							{
								"id": "340302",
								"name": "龙子湖区"
							},
							{
								"id": "340303",
								"name": "蚌山区"
							},
							{
								"id": "340304",
								"name": "禹会区"
							},
							{
								"id": "340311",
								"name": "淮上区"
							},
							{
								"id": "340321",
								"name": "怀远县"
							},
							{
								"id": "340322",
								"name": "五河县"
							},
							{
								"id": "340323",
								"name": "固镇县"
							}
						]
					},
					{
						"id": "340400",
						"name": "淮南市",
						"childs": [
							{
								"id": "340402",
								"name": "大通区"
							},
							{
								"id": "340403",
								"name": "田家庵区"
							},
							{
								"id": "340404",
								"name": "谢家集区"
							},
							{
								"id": "340405",
								"name": "八公山区"
							},
							{
								"id": "340406",
								"name": "潘集区"
							},
							{
								"id": "340421",
								"name": "凤台县"
							}
						]
					},
					{
						"id": "340500",
						"name": "马鞍山市",
						"childs": [
							{
								"id": "340503",
								"name": "花山区"
							},
							{
								"id": "340504",
								"name": "雨山区"
							},
							{
								"id": "340506",
								"name": "博望区"
							},
							{
								"id": "340521",
								"name": "当涂县"
							},
							{
								"id": "340522",
								"name": "含山县"
							},
							{
								"id": "340523",
								"name": "和县"
							}
						]
					},
					{
						"id": "340600",
						"name": "淮北市",
						"childs": [
							{
								"id": "340602",
								"name": "杜集区"
							},
							{
								"id": "340603",
								"name": "相山区"
							},
							{
								"id": "340604",
								"name": "烈山区"
							},
							{
								"id": "340621",
								"name": "濉溪县"
							}
						]
					},
					{
						"id": "340700",
						"name": "铜陵市",
						"childs": [
							{
								"id": "340702",
								"name": "铜官山区"
							},
							{
								"id": "340703",
								"name": "狮子山区"
							},
							{
								"id": "340711",
								"name": "郊区"
							},
							{
								"id": "340721",
								"name": "铜陵县"
							}
						]
					},
					{
						"id": "340800",
						"name": "安庆市",
						"childs": [
							{
								"id": "340802",
								"name": "迎江区"
							},
							{
								"id": "340803",
								"name": "大观区"
							},
							{
								"id": "340811",
								"name": "宜秀区"
							},
							{
								"id": "340822",
								"name": "怀宁县"
							},
							{
								"id": "340823",
								"name": "枞阳县"
							},
							{
								"id": "340824",
								"name": "潜山县"
							},
							{
								"id": "340825",
								"name": "太湖县"
							},
							{
								"id": "340826",
								"name": "宿松县"
							},
							{
								"id": "340827",
								"name": "望江县"
							},
							{
								"id": "340828",
								"name": "岳西县"
							},
							{
								"id": "340881",
								"name": "桐城市"
							}
						]
					},
					{
						"id": "341000",
						"name": "黄山市",
						"childs": [
							{
								"id": "341002",
								"name": "屯溪区"
							},
							{
								"id": "341003",
								"name": "黄山区"
							},
							{
								"id": "341004",
								"name": "徽州区"
							},
							{
								"id": "341021",
								"name": "歙县"
							},
							{
								"id": "341022",
								"name": "休宁县"
							},
							{
								"id": "341023",
								"name": "黟县"
							},
							{
								"id": "341024",
								"name": "祁门县"
							}
						]
					},
					{
						"id": "341100",
						"name": "滁州市",
						"childs": [
							{
								"id": "341102",
								"name": "琅琊区"
							},
							{
								"id": "341103",
								"name": "南谯区"
							},
							{
								"id": "341122",
								"name": "来安县"
							},
							{
								"id": "341124",
								"name": "全椒县"
							},
							{
								"id": "341125",
								"name": "定远县"
							},
							{
								"id": "341126",
								"name": "凤阳县"
							},
							{
								"id": "341181",
								"name": "天长市"
							},
							{
								"id": "341182",
								"name": "明光市"
							}
						]
					},
					{
						"id": "341200",
						"name": "阜阳市",
						"childs": [
							{
								"id": "341202",
								"name": "颍州区"
							},
							{
								"id": "341203",
								"name": "颍东区"
							},
							{
								"id": "341204",
								"name": "颍泉区"
							},
							{
								"id": "341221",
								"name": "临泉县"
							},
							{
								"id": "341222",
								"name": "太和县"
							},
							{
								"id": "341225",
								"name": "阜南县"
							},
							{
								"id": "341226",
								"name": "颍上县"
							},
							{
								"id": "341282",
								"name": "界首市"
							}
						]
					},
					{
						"id": "341300",
						"name": "宿州市",
						"childs": [
							{
								"id": "341302",
								"name": "埇桥区"
							},
							{
								"id": "341321",
								"name": "砀山县"
							},
							{
								"id": "341322",
								"name": "萧县"
							},
							{
								"id": "341323",
								"name": "灵璧县"
							},
							{
								"id": "341324",
								"name": "泗县"
							}
						]
					},
					{
						"id": "341500",
						"name": "六安市",
						"childs": [
							{
								"id": "341502",
								"name": "金安区"
							},
							{
								"id": "341503",
								"name": "裕安区"
							},
							{
								"id": "341521",
								"name": "寿县"
							},
							{
								"id": "341522",
								"name": "霍邱县"
							},
							{
								"id": "341523",
								"name": "舒城县"
							},
							{
								"id": "341524",
								"name": "金寨县"
							},
							{
								"id": "341525",
								"name": "霍山县"
							}
						]
					},
					{
						"id": "341600",
						"name": "亳州市",
						"childs": [
							{
								"id": "341602",
								"name": "谯城区"
							},
							{
								"id": "341621",
								"name": "涡阳县"
							},
							{
								"id": "341622",
								"name": "蒙城县"
							},
							{
								"id": "341623",
								"name": "利辛县"
							}
						]
					},
					{
						"id": "341700",
						"name": "池州市",
						"childs": [
							{
								"id": "341702",
								"name": "贵池区"
							},
							{
								"id": "341721",
								"name": "东至县"
							},
							{
								"id": "341722",
								"name": "石台县"
							},
							{
								"id": "341723",
								"name": "青阳县"
							}
						]
					},
					{
						"id": "341800",
						"name": "宣城市",
						"childs": [
							{
								"id": "341802",
								"name": "宣州区"
							},
							{
								"id": "341821",
								"name": "郎溪县"
							},
							{
								"id": "341822",
								"name": "广德县"
							},
							{
								"id": "341823",
								"name": "泾县"
							},
							{
								"id": "341824",
								"name": "绩溪县"
							},
							{
								"id": "341825",
								"name": "旌德县"
							},
							{
								"id": "341881",
								"name": "宁国市"
							}
						]
					}
				]
			},
			{
				"id": "350000",
				"name": "福建省",
				"type": 0,
				"childs": [
					{
						"id": "350100",
						"name": "福州市",
						"childs": [
							{
								"id": "350102",
								"name": "鼓楼区"
							},
							{
								"id": "350103",
								"name": "台江区"
							},
							{
								"id": "350104",
								"name": "仓山区"
							},
							{
								"id": "350105",
								"name": "马尾区"
							},
							{
								"id": "350111",
								"name": "晋安区"
							},
							{
								"id": "350121",
								"name": "闽侯县"
							},
							{
								"id": "350122",
								"name": "连江县"
							},
							{
								"id": "350123",
								"name": "罗源县"
							},
							{
								"id": "350124",
								"name": "闽清县"
							},
							{
								"id": "350125",
								"name": "永泰县"
							},
							{
								"id": "350128",
								"name": "平潭县"
							},
							{
								"id": "350181",
								"name": "福清市"
							},
							{
								"id": "350182",
								"name": "长乐市"
							}
						]
					},
					{
						"id": "350200",
						"name": "厦门市",
						"childs": [
							{
								"id": "350203",
								"name": "思明区"
							},
							{
								"id": "350205",
								"name": "海沧区"
							},
							{
								"id": "350206",
								"name": "湖里区"
							},
							{
								"id": "350211",
								"name": "集美区"
							},
							{
								"id": "350212",
								"name": "同安区"
							},
							{
								"id": "350213",
								"name": "翔安区"
							}
						]
					},
					{
						"id": "350300",
						"name": "莆田市",
						"childs": [
							{
								"id": "350302",
								"name": "城厢区"
							},
							{
								"id": "350303",
								"name": "涵江区"
							},
							{
								"id": "350304",
								"name": "荔城区"
							},
							{
								"id": "350305",
								"name": "秀屿区"
							},
							{
								"id": "350322",
								"name": "仙游县"
							}
						]
					},
					{
						"id": "350400",
						"name": "三明市",
						"childs": [
							{
								"id": "350402",
								"name": "梅列区"
							},
							{
								"id": "350403",
								"name": "三元区"
							},
							{
								"id": "350421",
								"name": "明溪县"
							},
							{
								"id": "350423",
								"name": "清流县"
							},
							{
								"id": "350424",
								"name": "宁化县"
							},
							{
								"id": "350425",
								"name": "大田县"
							},
							{
								"id": "350426",
								"name": "尤溪县"
							},
							{
								"id": "350427",
								"name": "沙县"
							},
							{
								"id": "350428",
								"name": "将乐县"
							},
							{
								"id": "350429",
								"name": "泰宁县"
							},
							{
								"id": "350430",
								"name": "建宁县"
							},
							{
								"id": "350481",
								"name": "永安市"
							}
						]
					},
					{
						"id": "350500",
						"name": "泉州市",
						"childs": [
							{
								"id": "350502",
								"name": "鲤城区"
							},
							{
								"id": "350503",
								"name": "丰泽区"
							},
							{
								"id": "350504",
								"name": "洛江区"
							},
							{
								"id": "350505",
								"name": "泉港区"
							},
							{
								"id": "350521",
								"name": "惠安县"
							},
							{
								"id": "350524",
								"name": "安溪县"
							},
							{
								"id": "350525",
								"name": "永春县"
							},
							{
								"id": "350526",
								"name": "德化县"
							},
							{
								"id": "350527",
								"name": "金门县"
							},
							{
								"id": "350581",
								"name": "石狮市"
							},
							{
								"id": "350582",
								"name": "晋江市"
							},
							{
								"id": "350583",
								"name": "南安市"
							}
						]
					},
					{
						"id": "350600",
						"name": "漳州市",
						"childs": [
							{
								"id": "350602",
								"name": "芗城区"
							},
							{
								"id": "350603",
								"name": "龙文区"
							},
							{
								"id": "350622",
								"name": "云霄县"
							},
							{
								"id": "350623",
								"name": "漳浦县"
							},
							{
								"id": "350624",
								"name": "诏安县"
							},
							{
								"id": "350625",
								"name": "长泰县"
							},
							{
								"id": "350626",
								"name": "东山县"
							},
							{
								"id": "350627",
								"name": "南靖县"
							},
							{
								"id": "350628",
								"name": "平和县"
							},
							{
								"id": "350629",
								"name": "华安县"
							},
							{
								"id": "350681",
								"name": "龙海市"
							}
						]
					},
					{
						"id": "350700",
						"name": "南平市",
						"childs": [
							{
								"id": "350702",
								"name": "延平区"
							},
							{
								"id": "350703",
								"name": "建阳区"
							},
							{
								"id": "350721",
								"name": "顺昌县"
							},
							{
								"id": "350722",
								"name": "浦城县"
							},
							{
								"id": "350723",
								"name": "光泽县"
							},
							{
								"id": "350724",
								"name": "松溪县"
							},
							{
								"id": "350725",
								"name": "政和县"
							},
							{
								"id": "350781",
								"name": "邵武市"
							},
							{
								"id": "350782",
								"name": "武夷山市"
							},
							{
								"id": "350783",
								"name": "建瓯市"
							}
						]
					},
					{
						"id": "350800",
						"name": "龙岩市",
						"childs": [
							{
								"id": "350802",
								"name": "新罗区"
							},
							{
								"id": "350821",
								"name": "长汀县"
							},
							{
								"id": "350822",
								"name": "永定区"
							},
							{
								"id": "350823",
								"name": "上杭县"
							},
							{
								"id": "350824",
								"name": "武平县"
							},
							{
								"id": "350825",
								"name": "连城县"
							},
							{
								"id": "350881",
								"name": "漳平市"
							}
						]
					},
					{
						"id": "350900",
						"name": "宁德市",
						"childs": [
							{
								"id": "350902",
								"name": "蕉城区"
							},
							{
								"id": "350921",
								"name": "霞浦县"
							},
							{
								"id": "350922",
								"name": "古田县"
							},
							{
								"id": "350923",
								"name": "屏南县"
							},
							{
								"id": "350924",
								"name": "寿宁县"
							},
							{
								"id": "350925",
								"name": "周宁县"
							},
							{
								"id": "350926",
								"name": "柘荣县"
							},
							{
								"id": "350981",
								"name": "福安市"
							},
							{
								"id": "350982",
								"name": "福鼎市"
							}
						]
					}
				]
			},
			{
				"id": "360000",
				"name": "江西省",
				"type": 0,
				"childs": [
					{
						"id": "360100",
						"name": "南昌市",
						"childs": [
							{
								"id": "360102",
								"name": "东湖区"
							},
							{
								"id": "360103",
								"name": "西湖区"
							},
							{
								"id": "360104",
								"name": "青云谱区"
							},
							{
								"id": "360105",
								"name": "湾里区"
							},
							{
								"id": "360111",
								"name": "青山湖区"
							},
							{
								"id": "360121",
								"name": "南昌县"
							},
							{
								"id": "360122",
								"name": "新建县"
							},
							{
								"id": "360123",
								"name": "安义县"
							},
							{
								"id": "360124",
								"name": "进贤县"
							}
						]
					},
					{
						"id": "360200",
						"name": "景德镇市",
						"childs": [
							{
								"id": "360202",
								"name": "昌江区"
							},
							{
								"id": "360203",
								"name": "珠山区"
							},
							{
								"id": "360222",
								"name": "浮梁县"
							},
							{
								"id": "360281",
								"name": "乐平市"
							}
						]
					},
					{
						"id": "360300",
						"name": "萍乡市",
						"childs": [
							{
								"id": "360302",
								"name": "安源区"
							},
							{
								"id": "360313",
								"name": "湘东区"
							},
							{
								"id": "360321",
								"name": "莲花县"
							},
							{
								"id": "360322",
								"name": "上栗县"
							},
							{
								"id": "360323",
								"name": "芦溪县"
							}
						]
					},
					{
						"id": "360400",
						"name": "九江市",
						"childs": [
							{
								"id": "360402",
								"name": "庐山区"
							},
							{
								"id": "360403",
								"name": "浔阳区"
							},
							{
								"id": "360421",
								"name": "九江县"
							},
							{
								"id": "360423",
								"name": "武宁县"
							},
							{
								"id": "360424",
								"name": "修水县"
							},
							{
								"id": "360425",
								"name": "永修县"
							},
							{
								"id": "360426",
								"name": "德安县"
							},
							{
								"id": "360427",
								"name": "星子县"
							},
							{
								"id": "360428",
								"name": "都昌县"
							},
							{
								"id": "360429",
								"name": "湖口县"
							},
							{
								"id": "360430",
								"name": "彭泽县"
							},
							{
								"id": "360481",
								"name": "瑞昌市"
							},
							{
								"id": "360482",
								"name": "共青城市"
							}
						]
					},
					{
						"id": "360500",
						"name": "新余市",
						"childs": [
							{
								"id": "360502",
								"name": "渝水区"
							},
							{
								"id": "360521",
								"name": "分宜县"
							}
						]
					},
					{
						"id": "360600",
						"name": "鹰潭市",
						"childs": [
							{
								"id": "360602",
								"name": "月湖区"
							},
							{
								"id": "360622",
								"name": "余江县"
							},
							{
								"id": "360681",
								"name": "贵溪市"
							}
						]
					},
					{
						"id": "360700",
						"name": "赣州市",
						"childs": [
							{
								"id": "360702",
								"name": "章贡区"
							},
							{
								"id": "360703",
								"name": "南康区"
							},
							{
								"id": "360721",
								"name": "赣县"
							},
							{
								"id": "360722",
								"name": "信丰县"
							},
							{
								"id": "360723",
								"name": "大余县"
							},
							{
								"id": "360724",
								"name": "上犹县"
							},
							{
								"id": "360725",
								"name": "崇义县"
							},
							{
								"id": "360726",
								"name": "安远县"
							},
							{
								"id": "360727",
								"name": "龙南县"
							},
							{
								"id": "360728",
								"name": "定南县"
							},
							{
								"id": "360729",
								"name": "全南县"
							},
							{
								"id": "360730",
								"name": "宁都县"
							},
							{
								"id": "360731",
								"name": "于都县"
							},
							{
								"id": "360732",
								"name": "兴国县"
							},
							{
								"id": "360733",
								"name": "会昌县"
							},
							{
								"id": "360734",
								"name": "寻乌县"
							},
							{
								"id": "360735",
								"name": "石城县"
							},
							{
								"id": "360781",
								"name": "瑞金市"
							}
						]
					},
					{
						"id": "360800",
						"name": "吉安市",
						"childs": [
							{
								"id": "360802",
								"name": "吉州区"
							},
							{
								"id": "360803",
								"name": "青原区"
							},
							{
								"id": "360821",
								"name": "吉安县"
							},
							{
								"id": "360822",
								"name": "吉水县"
							},
							{
								"id": "360823",
								"name": "峡江县"
							},
							{
								"id": "360824",
								"name": "新干县"
							},
							{
								"id": "360825",
								"name": "永丰县"
							},
							{
								"id": "360826",
								"name": "泰和县"
							},
							{
								"id": "360827",
								"name": "遂川县"
							},
							{
								"id": "360828",
								"name": "万安县"
							},
							{
								"id": "360829",
								"name": "安福县"
							},
							{
								"id": "360830",
								"name": "永新县"
							},
							{
								"id": "360881",
								"name": "井冈山市"
							}
						]
					},
					{
						"id": "360900",
						"name": "宜春市",
						"childs": [
							{
								"id": "360902",
								"name": "袁州区"
							},
							{
								"id": "360921",
								"name": "奉新县"
							},
							{
								"id": "360922",
								"name": "万载县"
							},
							{
								"id": "360923",
								"name": "上高县"
							},
							{
								"id": "360924",
								"name": "宜丰县"
							},
							{
								"id": "360925",
								"name": "靖安县"
							},
							{
								"id": "360926",
								"name": "铜鼓县"
							},
							{
								"id": "360981",
								"name": "丰城市"
							},
							{
								"id": "360982",
								"name": "樟树市"
							},
							{
								"id": "360983",
								"name": "高安市"
							}
						]
					},
					{
						"id": "361000",
						"name": "抚州市",
						"childs": [
							{
								"id": "361002",
								"name": "临川区"
							},
							{
								"id": "361021",
								"name": "南城县"
							},
							{
								"id": "361022",
								"name": "黎川县"
							},
							{
								"id": "361023",
								"name": "南丰县"
							},
							{
								"id": "361024",
								"name": "崇仁县"
							},
							{
								"id": "361025",
								"name": "乐安县"
							},
							{
								"id": "361026",
								"name": "宜黄县"
							},
							{
								"id": "361027",
								"name": "金溪县"
							},
							{
								"id": "361028",
								"name": "资溪县"
							},
							{
								"id": "361029",
								"name": "东乡县"
							},
							{
								"id": "361030",
								"name": "广昌县"
							}
						]
					},
					{
						"id": "361100",
						"name": "上饶市",
						"childs": [
							{
								"id": "361102",
								"name": "信州区"
							},
							{
								"id": "361121",
								"name": "上饶县"
							},
							{
								"id": "361122",
								"name": "广丰县"
							},
							{
								"id": "361123",
								"name": "玉山县"
							},
							{
								"id": "361124",
								"name": "铅山县"
							},
							{
								"id": "361125",
								"name": "横峰县"
							},
							{
								"id": "361126",
								"name": "弋阳县"
							},
							{
								"id": "361127",
								"name": "余干县"
							},
							{
								"id": "361128",
								"name": "鄱阳县"
							},
							{
								"id": "361129",
								"name": "万年县"
							},
							{
								"id": "361130",
								"name": "婺源县"
							},
							{
								"id": "361181",
								"name": "德兴市"
							}
						]
					}
				]
			},
			{
				"id": "370000",
				"name": "山东省",
				"type": 0,
				"childs": [
					{
						"id": "370100",
						"name": "济南市",
						"childs": [
							{
								"id": "370102",
								"name": "历下区"
							},
							{
								"id": "370103",
								"name": "市中区"
							},
							{
								"id": "370104",
								"name": "槐荫区"
							},
							{
								"id": "370105",
								"name": "天桥区"
							},
							{
								"id": "370112",
								"name": "历城区"
							},
							{
								"id": "370113",
								"name": "长清区"
							},
							{
								"id": "370124",
								"name": "平阴县"
							},
							{
								"id": "370125",
								"name": "济阳县"
							},
							{
								"id": "370126",
								"name": "商河县"
							},
							{
								"id": "370181",
								"name": "章丘市"
							}
						]
					},
					{
						"id": "370200",
						"name": "青岛市",
						"childs": [
							{
								"id": "370202",
								"name": "市南区"
							},
							{
								"id": "370203",
								"name": "市北区"
							},
							{
								"id": "370211",
								"name": "黄岛区"
							},
							{
								"id": "370212",
								"name": "崂山区"
							},
							{
								"id": "370213",
								"name": "李沧区"
							},
							{
								"id": "370214",
								"name": "城阳区"
							},
							{
								"id": "370281",
								"name": "胶州市"
							},
							{
								"id": "370282",
								"name": "即墨市"
							},
							{
								"id": "370283",
								"name": "平度市"
							},
							{
								"id": "370285",
								"name": "莱西市"
							},
							{
								"id": "370286",
								"name": "西海岸新区"
							}
						]
					},
					{
						"id": "370300",
						"name": "淄博市",
						"childs": [
							{
								"id": "370302",
								"name": "淄川区"
							},
							{
								"id": "370303",
								"name": "张店区"
							},
							{
								"id": "370304",
								"name": "博山区"
							},
							{
								"id": "370305",
								"name": "临淄区"
							},
							{
								"id": "370306",
								"name": "周村区"
							},
							{
								"id": "370321",
								"name": "桓台县"
							},
							{
								"id": "370322",
								"name": "高青县"
							},
							{
								"id": "370323",
								"name": "沂源县"
							}
						]
					},
					{
						"id": "370400",
						"name": "枣庄市",
						"childs": [
							{
								"id": "370402",
								"name": "市中区"
							},
							{
								"id": "370403",
								"name": "薛城区"
							},
							{
								"id": "370404",
								"name": "峄城区"
							},
							{
								"id": "370405",
								"name": "台儿庄区"
							},
							{
								"id": "370406",
								"name": "山亭区"
							},
							{
								"id": "370481",
								"name": "滕州市"
							}
						]
					},
					{
						"id": "370500",
						"name": "东营市",
						"childs": [
							{
								"id": "370502",
								"name": "东营区"
							},
							{
								"id": "370503",
								"name": "河口区"
							},
							{
								"id": "370521",
								"name": "垦利县"
							},
							{
								"id": "370522",
								"name": "利津县"
							},
							{
								"id": "370523",
								"name": "广饶县"
							}
						]
					},
					{
						"id": "370600",
						"name": "烟台市",
						"childs": [
							{
								"id": "370602",
								"name": "芝罘区"
							},
							{
								"id": "370611",
								"name": "福山区"
							},
							{
								"id": "370612",
								"name": "牟平区"
							},
							{
								"id": "370613",
								"name": "莱山区"
							},
							{
								"id": "370634",
								"name": "长岛县"
							},
							{
								"id": "370681",
								"name": "龙口市"
							},
							{
								"id": "370682",
								"name": "莱阳市"
							},
							{
								"id": "370683",
								"name": "莱州市"
							},
							{
								"id": "370684",
								"name": "蓬莱市"
							},
							{
								"id": "370685",
								"name": "招远市"
							},
							{
								"id": "370686",
								"name": "栖霞市"
							},
							{
								"id": "370687",
								"name": "海阳市"
							}
						]
					},
					{
						"id": "370700",
						"name": "潍坊市",
						"childs": [
							{
								"id": "370702",
								"name": "潍城区"
							},
							{
								"id": "370703",
								"name": "寒亭区"
							},
							{
								"id": "370704",
								"name": "坊子区"
							},
							{
								"id": "370705",
								"name": "奎文区"
							},
							{
								"id": "370724",
								"name": "临朐县"
							},
							{
								"id": "370725",
								"name": "昌乐县"
							},
							{
								"id": "370781",
								"name": "青州市"
							},
							{
								"id": "370782",
								"name": "诸城市"
							},
							{
								"id": "370783",
								"name": "寿光市"
							},
							{
								"id": "370784",
								"name": "安丘市"
							},
							{
								"id": "370785",
								"name": "高密市"
							},
							{
								"id": "370786",
								"name": "昌邑市"
							}
						]
					},
					{
						"id": "370800",
						"name": "济宁市",
						"childs": [
							{
								"id": "370811",
								"name": "任城区"
							},
							{
								"id": "370812",
								"name": "兖州区"
							},
							{
								"id": "370826",
								"name": "微山县"
							},
							{
								"id": "370827",
								"name": "鱼台县"
							},
							{
								"id": "370828",
								"name": "金乡县"
							},
							{
								"id": "370829",
								"name": "嘉祥县"
							},
							{
								"id": "370830",
								"name": "汶上县"
							},
							{
								"id": "370831",
								"name": "泗水县"
							},
							{
								"id": "370832",
								"name": "梁山县"
							},
							{
								"id": "370881",
								"name": "曲阜市"
							},
							{
								"id": "370883",
								"name": "邹城市"
							}
						]
					},
					{
						"id": "370900",
						"name": "泰安市",
						"childs": [
							{
								"id": "370902",
								"name": "泰山区"
							},
							{
								"id": "370911",
								"name": "岱岳区"
							},
							{
								"id": "370921",
								"name": "宁阳县"
							},
							{
								"id": "370923",
								"name": "东平县"
							},
							{
								"id": "370982",
								"name": "新泰市"
							},
							{
								"id": "370983",
								"name": "肥城市"
							}
						]
					},
					{
						"id": "371000",
						"name": "威海市",
						"childs": [
							{
								"id": "371002",
								"name": "环翠区"
							},
							{
								"id": "371003",
								"name": "文登区"
							},
							{
								"id": "371082",
								"name": "荣成市"
							},
							{
								"id": "371083",
								"name": "乳山市"
							}
						]
					},
					{
						"id": "371100",
						"name": "日照市",
						"childs": [
							{
								"id": "371102",
								"name": "东港区"
							},
							{
								"id": "371103",
								"name": "岚山区"
							},
							{
								"id": "371121",
								"name": "五莲县"
							},
							{
								"id": "371122",
								"name": "莒县"
							}
						]
					},
					{
						"id": "371200",
						"name": "莱芜市",
						"childs": [
							{
								"id": "371202",
								"name": "莱城区"
							},
							{
								"id": "371203",
								"name": "钢城区"
							}
						]
					},
					{
						"id": "371300",
						"name": "临沂市",
						"childs": [
							{
								"id": "371302",
								"name": "兰山区"
							},
							{
								"id": "371311",
								"name": "罗庄区"
							},
							{
								"id": "371312",
								"name": "河东区"
							},
							{
								"id": "371321",
								"name": "沂南县"
							},
							{
								"id": "371322",
								"name": "郯城县"
							},
							{
								"id": "371323",
								"name": "沂水县"
							},
							{
								"id": "371324",
								"name": "兰陵县"
							},
							{
								"id": "371325",
								"name": "费县"
							},
							{
								"id": "371326",
								"name": "平邑县"
							},
							{
								"id": "371327",
								"name": "莒南县"
							},
							{
								"id": "371328",
								"name": "蒙阴县"
							},
							{
								"id": "371329",
								"name": "临沭县"
							}
						]
					},
					{
						"id": "371400",
						"name": "德州市",
						"childs": [
							{
								"id": "371402",
								"name": "德城区"
							},
							{
								"id": "371403",
								"name": "陵城区"
							},
							{
								"id": "371422",
								"name": "宁津县"
							},
							{
								"id": "371423",
								"name": "庆云县"
							},
							{
								"id": "371424",
								"name": "临邑县"
							},
							{
								"id": "371425",
								"name": "齐河县"
							},
							{
								"id": "371426",
								"name": "平原县"
							},
							{
								"id": "371427",
								"name": "夏津县"
							},
							{
								"id": "371428",
								"name": "武城县"
							},
							{
								"id": "371481",
								"name": "乐陵市"
							},
							{
								"id": "371482",
								"name": "禹城市"
							}
						]
					},
					{
						"id": "371500",
						"name": "聊城市",
						"childs": [
							{
								"id": "371502",
								"name": "东昌府区"
							},
							{
								"id": "371521",
								"name": "阳谷县"
							},
							{
								"id": "371522",
								"name": "莘县"
							},
							{
								"id": "371523",
								"name": "茌平县"
							},
							{
								"id": "371524",
								"name": "东阿县"
							},
							{
								"id": "371525",
								"name": "冠县"
							},
							{
								"id": "371526",
								"name": "高唐县"
							},
							{
								"id": "371581",
								"name": "临清市"
							}
						]
					},
					{
						"id": "371600",
						"name": "滨州市",
						"childs": [
							{
								"id": "371602",
								"name": "滨城区"
							},
							{
								"id": "371603",
								"name": "沾化区"
							},
							{
								"id": "371621",
								"name": "惠民县"
							},
							{
								"id": "371622",
								"name": "阳信县"
							},
							{
								"id": "371623",
								"name": "无棣县"
							},
							{
								"id": "371625",
								"name": "博兴县"
							},
							{
								"id": "371626",
								"name": "邹平县"
							},
							{
								"id": "371627",
								"name": "北海新区"
							}
						]
					},
					{
						"id": "371700",
						"name": "菏泽市",
						"childs": [
							{
								"id": "371702",
								"name": "牡丹区"
							},
							{
								"id": "371721",
								"name": "曹县"
							},
							{
								"id": "371722",
								"name": "单县"
							},
							{
								"id": "371723",
								"name": "成武县"
							},
							{
								"id": "371724",
								"name": "巨野县"
							},
							{
								"id": "371725",
								"name": "郓城县"
							},
							{
								"id": "371726",
								"name": "鄄城县"
							},
							{
								"id": "371727",
								"name": "定陶县"
							},
							{
								"id": "371728",
								"name": "东明县"
							}
						]
					}
				]
			},
			{
				"id": "410000",
				"name": "河南省",
				"type": 0,
				"childs": [
					{
						"id": "410100",
						"name": "郑州市",
						"childs": [
							{
								"id": "410102",
								"name": "中原区"
							},
							{
								"id": "410103",
								"name": "二七区"
							},
							{
								"id": "410104",
								"name": "管城回族区"
							},
							{
								"id": "410105",
								"name": "金水区"
							},
							{
								"id": "410106",
								"name": "上街区"
							},
							{
								"id": "410108",
								"name": "惠济区"
							},
							{
								"id": "410122",
								"name": "中牟县"
							},
							{
								"id": "410181",
								"name": "巩义市"
							},
							{
								"id": "410182",
								"name": "荥阳市"
							},
							{
								"id": "410183",
								"name": "新密市"
							},
							{
								"id": "410184",
								"name": "新郑市"
							},
							{
								"id": "410185",
								"name": "登封市"
							}
						]
					},
					{
						"id": "410200",
						"name": "开封市",
						"childs": [
							{
								"id": "410202",
								"name": "龙亭区"
							},
							{
								"id": "410203",
								"name": "顺河回族区"
							},
							{
								"id": "410204",
								"name": "鼓楼区"
							},
							{
								"id": "410205",
								"name": "禹王台区"
							},
							{
								"id": "410212",
								"name": "祥符区"
							},
							{
								"id": "410221",
								"name": "杞县"
							},
							{
								"id": "410222",
								"name": "通许县"
							},
							{
								"id": "410223",
								"name": "尉氏县"
							},
							{
								"id": "410225",
								"name": "兰考县"
							}
						]
					},
					{
						"id": "410300",
						"name": "洛阳市",
						"childs": [
							{
								"id": "410302",
								"name": "老城区"
							},
							{
								"id": "410303",
								"name": "西工区"
							},
							{
								"id": "410304",
								"name": "瀍河回族区"
							},
							{
								"id": "410305",
								"name": "涧西区"
							},
							{
								"id": "410306",
								"name": "吉利区"
							},
							{
								"id": "410311",
								"name": "洛龙区"
							},
							{
								"id": "410322",
								"name": "孟津县"
							},
							{
								"id": "410323",
								"name": "新安县"
							},
							{
								"id": "410324",
								"name": "栾川县"
							},
							{
								"id": "410325",
								"name": "嵩县"
							},
							{
								"id": "410326",
								"name": "汝阳县"
							},
							{
								"id": "410327",
								"name": "宜阳县"
							},
							{
								"id": "410328",
								"name": "洛宁县"
							},
							{
								"id": "410329",
								"name": "伊川县"
							},
							{
								"id": "410381",
								"name": "偃师市"
							}
						]
					},
					{
						"id": "410400",
						"name": "平顶山市",
						"childs": [
							{
								"id": "410402",
								"name": "新华区"
							},
							{
								"id": "410403",
								"name": "卫东区"
							},
							{
								"id": "410404",
								"name": "石龙区"
							},
							{
								"id": "410411",
								"name": "湛河区"
							},
							{
								"id": "410421",
								"name": "宝丰县"
							},
							{
								"id": "410422",
								"name": "叶县"
							},
							{
								"id": "410423",
								"name": "鲁山县"
							},
							{
								"id": "410425",
								"name": "郏县"
							},
							{
								"id": "410481",
								"name": "舞钢市"
							},
							{
								"id": "410482",
								"name": "汝州市"
							}
						]
					},
					{
						"id": "410500",
						"name": "安阳市",
						"childs": [
							{
								"id": "410502",
								"name": "文峰区"
							},
							{
								"id": "410503",
								"name": "北关区"
							},
							{
								"id": "410505",
								"name": "殷都区"
							},
							{
								"id": "410506",
								"name": "龙安区"
							},
							{
								"id": "410522",
								"name": "安阳县"
							},
							{
								"id": "410523",
								"name": "汤阴县"
							},
							{
								"id": "410526",
								"name": "滑县"
							},
							{
								"id": "410527",
								"name": "内黄县"
							},
							{
								"id": "410581",
								"name": "林州市"
							}
						]
					},
					{
						"id": "410600",
						"name": "鹤壁市",
						"childs": [
							{
								"id": "410602",
								"name": "鹤山区"
							},
							{
								"id": "410603",
								"name": "山城区"
							},
							{
								"id": "410611",
								"name": "淇滨区"
							},
							{
								"id": "410621",
								"name": "浚县"
							},
							{
								"id": "410622",
								"name": "淇县"
							}
						]
					},
					{
						"id": "410700",
						"name": "新乡市",
						"childs": [
							{
								"id": "410702",
								"name": "红旗区"
							},
							{
								"id": "410703",
								"name": "卫滨区"
							},
							{
								"id": "410704",
								"name": "凤泉区"
							},
							{
								"id": "410711",
								"name": "牧野区"
							},
							{
								"id": "410721",
								"name": "新乡县"
							},
							{
								"id": "410724",
								"name": "获嘉县"
							},
							{
								"id": "410725",
								"name": "原阳县"
							},
							{
								"id": "410726",
								"name": "延津县"
							},
							{
								"id": "410727",
								"name": "封丘县"
							},
							{
								"id": "410728",
								"name": "长垣县"
							},
							{
								"id": "410781",
								"name": "卫辉市"
							},
							{
								"id": "410782",
								"name": "辉县市"
							}
						]
					},
					{
						"id": "410800",
						"name": "焦作市",
						"childs": [
							{
								"id": "410802",
								"name": "解放区"
							},
							{
								"id": "410803",
								"name": "中站区"
							},
							{
								"id": "410804",
								"name": "马村区"
							},
							{
								"id": "410811",
								"name": "山阳区"
							},
							{
								"id": "410821",
								"name": "修武县"
							},
							{
								"id": "410822",
								"name": "博爱县"
							},
							{
								"id": "410823",
								"name": "武陟县"
							},
							{
								"id": "410825",
								"name": "温县"
							},
							{
								"id": "410882",
								"name": "沁阳市"
							},
							{
								"id": "410883",
								"name": "孟州市"
							}
						]
					},
					{
						"id": "410900",
						"name": "濮阳市",
						"childs": [
							{
								"id": "410902",
								"name": "华龙区"
							},
							{
								"id": "410922",
								"name": "清丰县"
							},
							{
								"id": "410923",
								"name": "南乐县"
							},
							{
								"id": "410926",
								"name": "范县"
							},
							{
								"id": "410927",
								"name": "台前县"
							},
							{
								"id": "410928",
								"name": "濮阳县"
							}
						]
					},
					{
						"id": "411000",
						"name": "许昌市",
						"childs": [
							{
								"id": "411002",
								"name": "魏都区"
							},
							{
								"id": "411023",
								"name": "许昌县"
							},
							{
								"id": "411024",
								"name": "鄢陵县"
							},
							{
								"id": "411025",
								"name": "襄城县"
							},
							{
								"id": "411081",
								"name": "禹州市"
							},
							{
								"id": "411082",
								"name": "长葛市"
							}
						]
					},
					{
						"id": "411100",
						"name": "漯河市",
						"childs": [
							{
								"id": "411102",
								"name": "源汇区"
							},
							{
								"id": "411103",
								"name": "郾城区"
							},
							{
								"id": "411104",
								"name": "召陵区"
							},
							{
								"id": "411121",
								"name": "舞阳县"
							},
							{
								"id": "411122",
								"name": "临颍县"
							}
						]
					},
					{
						"id": "411200",
						"name": "三门峡市",
						"childs": [
							{
								"id": "411202",
								"name": "湖滨区"
							},
							{
								"id": "411221",
								"name": "渑池县"
							},
							{
								"id": "411222",
								"name": "陕县"
							},
							{
								"id": "411224",
								"name": "卢氏县"
							},
							{
								"id": "411281",
								"name": "义马市"
							},
							{
								"id": "411282",
								"name": "灵宝市"
							}
						]
					},
					{
						"id": "411300",
						"name": "南阳市",
						"childs": [
							{
								"id": "411302",
								"name": "宛城区"
							},
							{
								"id": "411303",
								"name": "卧龙区"
							},
							{
								"id": "411321",
								"name": "南召县"
							},
							{
								"id": "411322",
								"name": "方城县"
							},
							{
								"id": "411323",
								"name": "西峡县"
							},
							{
								"id": "411324",
								"name": "镇平县"
							},
							{
								"id": "411325",
								"name": "内乡县"
							},
							{
								"id": "411326",
								"name": "淅川县"
							},
							{
								"id": "411327",
								"name": "社旗县"
							},
							{
								"id": "411328",
								"name": "唐河县"
							},
							{
								"id": "411329",
								"name": "新野县"
							},
							{
								"id": "411330",
								"name": "桐柏县"
							},
							{
								"id": "411381",
								"name": "邓州市"
							}
						]
					},
					{
						"id": "411400",
						"name": "商丘市",
						"childs": [
							{
								"id": "411402",
								"name": "梁园区"
							},
							{
								"id": "411403",
								"name": "睢阳区"
							},
							{
								"id": "411421",
								"name": "民权县"
							},
							{
								"id": "411422",
								"name": "睢县"
							},
							{
								"id": "411423",
								"name": "宁陵县"
							},
							{
								"id": "411424",
								"name": "柘城县"
							},
							{
								"id": "411425",
								"name": "虞城县"
							},
							{
								"id": "411426",
								"name": "夏邑县"
							},
							{
								"id": "411481",
								"name": "永城市"
							}
						]
					},
					{
						"id": "411500",
						"name": "信阳市",
						"childs": [
							{
								"id": "411502",
								"name": "浉河区"
							},
							{
								"id": "411503",
								"name": "平桥区"
							},
							{
								"id": "411521",
								"name": "罗山县"
							},
							{
								"id": "411522",
								"name": "光山县"
							},
							{
								"id": "411523",
								"name": "新县"
							},
							{
								"id": "411524",
								"name": "商城县"
							},
							{
								"id": "411525",
								"name": "固始县"
							},
							{
								"id": "411526",
								"name": "潢川县"
							},
							{
								"id": "411527",
								"name": "淮滨县"
							},
							{
								"id": "411528",
								"name": "息县"
							}
						]
					},
					{
						"id": "411600",
						"name": "周口市",
						"childs": [
							{
								"id": "411602",
								"name": "川汇区"
							},
							{
								"id": "411621",
								"name": "扶沟县"
							},
							{
								"id": "411622",
								"name": "西华县"
							},
							{
								"id": "411623",
								"name": "商水县"
							},
							{
								"id": "411624",
								"name": "沈丘县"
							},
							{
								"id": "411625",
								"name": "郸城县"
							},
							{
								"id": "411626",
								"name": "淮阳县"
							},
							{
								"id": "411627",
								"name": "太康县"
							},
							{
								"id": "411628",
								"name": "鹿邑县"
							},
							{
								"id": "411681",
								"name": "项城市"
							}
						]
					},
					{
						"id": "411700",
						"name": "驻马店市",
						"childs": [
							{
								"id": "411702",
								"name": "驿城区"
							},
							{
								"id": "411721",
								"name": "西平县"
							},
							{
								"id": "411722",
								"name": "上蔡县"
							},
							{
								"id": "411723",
								"name": "平舆县"
							},
							{
								"id": "411724",
								"name": "正阳县"
							},
							{
								"id": "411725",
								"name": "确山县"
							},
							{
								"id": "411726",
								"name": "泌阳县"
							},
							{
								"id": "411727",
								"name": "汝南县"
							},
							{
								"id": "411728",
								"name": "遂平县"
							},
							{
								"id": "411729",
								"name": "新蔡县"
							}
						]
					},
					{
						"id": "419000",
						"name": "直辖县级",
						"childs": [
							{
								"id": "419001",
								"name": "济源市"
							}
						]
					}
				]
			},
			{
				"id": "420000",
				"name": "湖北省",
				"type": 0,
				"childs": [
					{
						"id": "420100",
						"name": "武汉市",
						"childs": [
							{
								"id": "420102",
								"name": "江岸区"
							},
							{
								"id": "420103",
								"name": "江汉区"
							},
							{
								"id": "420104",
								"name": "硚口区"
							},
							{
								"id": "420105",
								"name": "汉阳区"
							},
							{
								"id": "420106",
								"name": "武昌区"
							},
							{
								"id": "420107",
								"name": "青山区"
							},
							{
								"id": "420111",
								"name": "洪山区"
							},
							{
								"id": "420112",
								"name": "东西湖区"
							},
							{
								"id": "420113",
								"name": "汉南区"
							},
							{
								"id": "420114",
								"name": "蔡甸区"
							},
							{
								"id": "420115",
								"name": "江夏区"
							},
							{
								"id": "420116",
								"name": "黄陂区"
							},
							{
								"id": "420117",
								"name": "新洲区"
							}
						]
					},
					{
						"id": "420200",
						"name": "黄石市",
						"childs": [
							{
								"id": "420202",
								"name": "黄石港区"
							},
							{
								"id": "420203",
								"name": "西塞山区"
							},
							{
								"id": "420204",
								"name": "下陆区"
							},
							{
								"id": "420205",
								"name": "铁山区"
							},
							{
								"id": "420222",
								"name": "阳新县"
							},
							{
								"id": "420281",
								"name": "大冶市"
							}
						]
					},
					{
						"id": "420300",
						"name": "十堰市",
						"childs": [
							{
								"id": "420302",
								"name": "茅箭区"
							},
							{
								"id": "420303",
								"name": "张湾区"
							},
							{
								"id": "420304",
								"name": "郧阳区"
							},
							{
								"id": "420322",
								"name": "郧西县"
							},
							{
								"id": "420323",
								"name": "竹山县"
							},
							{
								"id": "420324",
								"name": "竹溪县"
							},
							{
								"id": "420325",
								"name": "房县"
							},
							{
								"id": "420381",
								"name": "丹江口市"
							}
						]
					},
					{
						"id": "420500",
						"name": "宜昌市",
						"childs": [
							{
								"id": "420502",
								"name": "西陵区"
							},
							{
								"id": "420503",
								"name": "伍家岗区"
							},
							{
								"id": "420504",
								"name": "点军区"
							},
							{
								"id": "420505",
								"name": "猇亭区"
							},
							{
								"id": "420506",
								"name": "夷陵区"
							},
							{
								"id": "420525",
								"name": "远安县"
							},
							{
								"id": "420526",
								"name": "兴山县"
							},
							{
								"id": "420527",
								"name": "秭归县"
							},
							{
								"id": "420528",
								"name": "长阳土家族自治县"
							},
							{
								"id": "420529",
								"name": "五峰土家族自治县"
							},
							{
								"id": "420581",
								"name": "宜都市"
							},
							{
								"id": "420582",
								"name": "当阳市"
							},
							{
								"id": "420583",
								"name": "枝江市"
							}
						]
					},
					{
						"id": "420600",
						"name": "襄阳市",
						"childs": [
							{
								"id": "420602",
								"name": "襄城区"
							},
							{
								"id": "420606",
								"name": "樊城区"
							},
							{
								"id": "420607",
								"name": "襄州区"
							},
							{
								"id": "420624",
								"name": "南漳县"
							},
							{
								"id": "420625",
								"name": "谷城县"
							},
							{
								"id": "420626",
								"name": "保康县"
							},
							{
								"id": "420682",
								"name": "老河口市"
							},
							{
								"id": "420683",
								"name": "枣阳市"
							},
							{
								"id": "420684",
								"name": "宜城市"
							}
						]
					},
					{
						"id": "420700",
						"name": "鄂州市",
						"childs": [
							{
								"id": "420702",
								"name": "梁子湖区"
							},
							{
								"id": "420703",
								"name": "华容区"
							},
							{
								"id": "420704",
								"name": "鄂城区"
							}
						]
					},
					{
						"id": "420800",
						"name": "荆门市",
						"childs": [
							{
								"id": "420802",
								"name": "东宝区"
							},
							{
								"id": "420804",
								"name": "掇刀区"
							},
							{
								"id": "420821",
								"name": "京山县"
							},
							{
								"id": "420822",
								"name": "沙洋县"
							},
							{
								"id": "420881",
								"name": "钟祥市"
							}
						]
					},
					{
						"id": "420900",
						"name": "孝感市",
						"childs": [
							{
								"id": "420902",
								"name": "孝南区"
							},
							{
								"id": "420921",
								"name": "孝昌县"
							},
							{
								"id": "420922",
								"name": "大悟县"
							},
							{
								"id": "420923",
								"name": "云梦县"
							},
							{
								"id": "420981",
								"name": "应城市"
							},
							{
								"id": "420982",
								"name": "安陆市"
							},
							{
								"id": "420984",
								"name": "汉川市"
							}
						]
					},
					{
						"id": "421000",
						"name": "荆州市",
						"childs": [
							{
								"id": "421002",
								"name": "沙市区"
							},
							{
								"id": "421003",
								"name": "荆州区"
							},
							{
								"id": "421022",
								"name": "公安县"
							},
							{
								"id": "421023",
								"name": "监利县"
							},
							{
								"id": "421024",
								"name": "江陵县"
							},
							{
								"id": "421081",
								"name": "石首市"
							},
							{
								"id": "421083",
								"name": "洪湖市"
							},
							{
								"id": "421087",
								"name": "松滋市"
							}
						]
					},
					{
						"id": "421100",
						"name": "黄冈市",
						"childs": [
							{
								"id": "421102",
								"name": "黄州区"
							},
							{
								"id": "421121",
								"name": "团风县"
							},
							{
								"id": "421122",
								"name": "红安县"
							},
							{
								"id": "421123",
								"name": "罗田县"
							},
							{
								"id": "421124",
								"name": "英山县"
							},
							{
								"id": "421125",
								"name": "浠水县"
							},
							{
								"id": "421126",
								"name": "蕲春县"
							},
							{
								"id": "421127",
								"name": "黄梅县"
							},
							{
								"id": "421181",
								"name": "麻城市"
							},
							{
								"id": "421182",
								"name": "武穴市"
							}
						]
					},
					{
						"id": "421200",
						"name": "咸宁市",
						"childs": [
							{
								"id": "421202",
								"name": "咸安区"
							},
							{
								"id": "421221",
								"name": "嘉鱼县"
							},
							{
								"id": "421222",
								"name": "通城县"
							},
							{
								"id": "421223",
								"name": "崇阳县"
							},
							{
								"id": "421224",
								"name": "通山县"
							},
							{
								"id": "421281",
								"name": "赤壁市"
							}
						]
					},
					{
						"id": "421300",
						"name": "随州市",
						"childs": [
							{
								"id": "421303",
								"name": "曾都区"
							},
							{
								"id": "421321",
								"name": "随县"
							},
							{
								"id": "421381",
								"name": "广水市"
							}
						]
					},
					{
						"id": "422800",
						"name": "恩施土家族苗族自治州",
						"childs": [
							{
								"id": "422801",
								"name": "恩施市"
							},
							{
								"id": "422802",
								"name": "利川市"
							},
							{
								"id": "422822",
								"name": "建始县"
							},
							{
								"id": "422823",
								"name": "巴东县"
							},
							{
								"id": "422825",
								"name": "宣恩县"
							},
							{
								"id": "422826",
								"name": "咸丰县"
							},
							{
								"id": "422827",
								"name": "来凤县"
							},
							{
								"id": "422828",
								"name": "鹤峰县"
							}
						]
					},
					{
						"id": "429000",
						"name": "直辖县级",
						"childs": [
							{
								"id": "429004",
								"name": "仙桃市"
							},
							{
								"id": "429005",
								"name": "潜江市"
							},
							{
								"id": "429006",
								"name": "天门市"
							},
							{
								"id": "429021",
								"name": "神农架林区"
							}
						]
					}
				]
			},
			{
				"id": "430000",
				"name": "湖南省",
				"type": 0,
				"childs": [
					{
						"id": "430100",
						"name": "长沙市",
						"childs": [
							{
								"id": "430102",
								"name": "芙蓉区"
							},
							{
								"id": "430103",
								"name": "天心区"
							},
							{
								"id": "430104",
								"name": "岳麓区"
							},
							{
								"id": "430105",
								"name": "开福区"
							},
							{
								"id": "430111",
								"name": "雨花区"
							},
							{
								"id": "430112",
								"name": "望城区"
							},
							{
								"id": "430121",
								"name": "长沙县"
							},
							{
								"id": "430124",
								"name": "宁乡县"
							},
							{
								"id": "430181",
								"name": "浏阳市"
							}
						]
					},
					{
						"id": "430200",
						"name": "株洲市",
						"childs": [
							{
								"id": "430202",
								"name": "荷塘区"
							},
							{
								"id": "430203",
								"name": "芦淞区"
							},
							{
								"id": "430204",
								"name": "石峰区"
							},
							{
								"id": "430211",
								"name": "天元区"
							},
							{
								"id": "430221",
								"name": "株洲县"
							},
							{
								"id": "430223",
								"name": "攸县"
							},
							{
								"id": "430224",
								"name": "茶陵县"
							},
							{
								"id": "430225",
								"name": "炎陵县"
							},
							{
								"id": "430281",
								"name": "醴陵市"
							}
						]
					},
					{
						"id": "430300",
						"name": "湘潭市",
						"childs": [
							{
								"id": "430302",
								"name": "雨湖区"
							},
							{
								"id": "430304",
								"name": "岳塘区"
							},
							{
								"id": "430321",
								"name": "湘潭县"
							},
							{
								"id": "430381",
								"name": "湘乡市"
							},
							{
								"id": "430382",
								"name": "韶山市"
							}
						]
					},
					{
						"id": "430400",
						"name": "衡阳市",
						"childs": [
							{
								"id": "430405",
								"name": "珠晖区"
							},
							{
								"id": "430406",
								"name": "雁峰区"
							},
							{
								"id": "430407",
								"name": "石鼓区"
							},
							{
								"id": "430408",
								"name": "蒸湘区"
							},
							{
								"id": "430412",
								"name": "南岳区"
							},
							{
								"id": "430421",
								"name": "衡阳县"
							},
							{
								"id": "430422",
								"name": "衡南县"
							},
							{
								"id": "430423",
								"name": "衡山县"
							},
							{
								"id": "430424",
								"name": "衡东县"
							},
							{
								"id": "430426",
								"name": "祁东县"
							},
							{
								"id": "430481",
								"name": "耒阳市"
							},
							{
								"id": "430482",
								"name": "常宁市"
							}
						]
					},
					{
						"id": "430500",
						"name": "邵阳市",
						"childs": [
							{
								"id": "430502",
								"name": "双清区"
							},
							{
								"id": "430503",
								"name": "大祥区"
							},
							{
								"id": "430511",
								"name": "北塔区"
							},
							{
								"id": "430521",
								"name": "邵东县"
							},
							{
								"id": "430522",
								"name": "新邵县"
							},
							{
								"id": "430523",
								"name": "邵阳县"
							},
							{
								"id": "430524",
								"name": "隆回县"
							},
							{
								"id": "430525",
								"name": "洞口县"
							},
							{
								"id": "430527",
								"name": "绥宁县"
							},
							{
								"id": "430528",
								"name": "新宁县"
							},
							{
								"id": "430529",
								"name": "城步苗族自治县"
							},
							{
								"id": "430581",
								"name": "武冈市"
							}
						]
					},
					{
						"id": "430600",
						"name": "岳阳市",
						"childs": [
							{
								"id": "430602",
								"name": "岳阳楼区"
							},
							{
								"id": "430603",
								"name": "云溪区"
							},
							{
								"id": "430611",
								"name": "君山区"
							},
							{
								"id": "430621",
								"name": "岳阳县"
							},
							{
								"id": "430623",
								"name": "华容县"
							},
							{
								"id": "430624",
								"name": "湘阴县"
							},
							{
								"id": "430626",
								"name": "平江县"
							},
							{
								"id": "430681",
								"name": "汨罗市"
							},
							{
								"id": "430682",
								"name": "临湘市"
							}
						]
					},
					{
						"id": "430700",
						"name": "常德市",
						"childs": [
							{
								"id": "430702",
								"name": "武陵区"
							},
							{
								"id": "430703",
								"name": "鼎城区"
							},
							{
								"id": "430721",
								"name": "安乡县"
							},
							{
								"id": "430722",
								"name": "汉寿县"
							},
							{
								"id": "430723",
								"name": "澧县"
							},
							{
								"id": "430724",
								"name": "临澧县"
							},
							{
								"id": "430725",
								"name": "桃源县"
							},
							{
								"id": "430726",
								"name": "石门县"
							},
							{
								"id": "430781",
								"name": "津市市"
							}
						]
					},
					{
						"id": "430800",
						"name": "张家界市",
						"childs": [
							{
								"id": "430802",
								"name": "永定区"
							},
							{
								"id": "430811",
								"name": "武陵源区"
							},
							{
								"id": "430821",
								"name": "慈利县"
							},
							{
								"id": "430822",
								"name": "桑植县"
							}
						]
					},
					{
						"id": "430900",
						"name": "益阳市",
						"childs": [
							{
								"id": "430902",
								"name": "资阳区"
							},
							{
								"id": "430903",
								"name": "赫山区"
							},
							{
								"id": "430921",
								"name": "南县"
							},
							{
								"id": "430922",
								"name": "桃江县"
							},
							{
								"id": "430923",
								"name": "安化县"
							},
							{
								"id": "430981",
								"name": "沅江市"
							}
						]
					},
					{
						"id": "431000",
						"name": "郴州市",
						"childs": [
							{
								"id": "431002",
								"name": "北湖区"
							},
							{
								"id": "431003",
								"name": "苏仙区"
							},
							{
								"id": "431021",
								"name": "桂阳县"
							},
							{
								"id": "431022",
								"name": "宜章县"
							},
							{
								"id": "431023",
								"name": "永兴县"
							},
							{
								"id": "431024",
								"name": "嘉禾县"
							},
							{
								"id": "431025",
								"name": "临武县"
							},
							{
								"id": "431026",
								"name": "汝城县"
							},
							{
								"id": "431027",
								"name": "桂东县"
							},
							{
								"id": "431028",
								"name": "安仁县"
							},
							{
								"id": "431081",
								"name": "资兴市"
							}
						]
					},
					{
						"id": "431100",
						"name": "永州市",
						"childs": [
							{
								"id": "431102",
								"name": "零陵区"
							},
							{
								"id": "431103",
								"name": "冷水滩区"
							},
							{
								"id": "431121",
								"name": "祁阳县"
							},
							{
								"id": "431122",
								"name": "东安县"
							},
							{
								"id": "431123",
								"name": "双牌县"
							},
							{
								"id": "431124",
								"name": "道县"
							},
							{
								"id": "431125",
								"name": "江永县"
							},
							{
								"id": "431126",
								"name": "宁远县"
							},
							{
								"id": "431127",
								"name": "蓝山县"
							},
							{
								"id": "431128",
								"name": "新田县"
							},
							{
								"id": "431129",
								"name": "江华瑶族自治县"
							}
						]
					},
					{
						"id": "431200",
						"name": "怀化市",
						"childs": [
							{
								"id": "431202",
								"name": "鹤城区"
							},
							{
								"id": "431221",
								"name": "中方县"
							},
							{
								"id": "431222",
								"name": "沅陵县"
							},
							{
								"id": "431223",
								"name": "辰溪县"
							},
							{
								"id": "431224",
								"name": "溆浦县"
							},
							{
								"id": "431225",
								"name": "会同县"
							},
							{
								"id": "431226",
								"name": "麻阳苗族自治县"
							},
							{
								"id": "431227",
								"name": "新晃侗族自治县"
							},
							{
								"id": "431228",
								"name": "芷江侗族自治县"
							},
							{
								"id": "431229",
								"name": "靖州苗族侗族自治县"
							},
							{
								"id": "431230",
								"name": "通道侗族自治县"
							},
							{
								"id": "431281",
								"name": "洪江市"
							}
						]
					},
					{
						"id": "431300",
						"name": "娄底市",
						"childs": [
							{
								"id": "431302",
								"name": "娄星区"
							},
							{
								"id": "431321",
								"name": "双峰县"
							},
							{
								"id": "431322",
								"name": "新化县"
							},
							{
								"id": "431381",
								"name": "冷水江市"
							},
							{
								"id": "431382",
								"name": "涟源市"
							}
						]
					},
					{
						"id": "433100",
						"name": "湘西土家族苗族自治州",
						"childs": [
							{
								"id": "433101",
								"name": "吉首市"
							},
							{
								"id": "433122",
								"name": "泸溪县"
							},
							{
								"id": "433123",
								"name": "凤凰县"
							},
							{
								"id": "433124",
								"name": "花垣县"
							},
							{
								"id": "433125",
								"name": "保靖县"
							},
							{
								"id": "433126",
								"name": "古丈县"
							},
							{
								"id": "433127",
								"name": "永顺县"
							},
							{
								"id": "433130",
								"name": "龙山县"
							}
						]
					}
				]
			},
			{
				"id": "440000",
				"name": "广东省",
				"type": 0,
				"childs": [
					{
						"id": "440100",
						"name": "广州市",
						"childs": [
							{
								"id": "440103",
								"name": "荔湾区"
							},
							{
								"id": "440104",
								"name": "越秀区"
							},
							{
								"id": "440105",
								"name": "海珠区"
							},
							{
								"id": "440106",
								"name": "天河区"
							},
							{
								"id": "440111",
								"name": "白云区"
							},
							{
								"id": "440112",
								"name": "黄埔区"
							},
							{
								"id": "440113",
								"name": "番禺区"
							},
							{
								"id": "440114",
								"name": "花都区"
							},
							{
								"id": "440115",
								"name": "南沙区"
							},
							{
								"id": "440117",
								"name": "从化区"
							},
							{
								"id": "440118",
								"name": "增城区"
							}
						]
					},
					{
						"id": "440200",
						"name": "韶关市",
						"childs": [
							{
								"id": "440203",
								"name": "武江区"
							},
							{
								"id": "440204",
								"name": "浈江区"
							},
							{
								"id": "440205",
								"name": "曲江区"
							},
							{
								"id": "440222",
								"name": "始兴县"
							},
							{
								"id": "440224",
								"name": "仁化县"
							},
							{
								"id": "440229",
								"name": "翁源县"
							},
							{
								"id": "440232",
								"name": "乳源瑶族自治县"
							},
							{
								"id": "440233",
								"name": "新丰县"
							},
							{
								"id": "440281",
								"name": "乐昌市"
							},
							{
								"id": "440282",
								"name": "南雄市"
							}
						]
					},
					{
						"id": "440300",
						"name": "深圳市",
						"childs": [
							{
								"id": "440303",
								"name": "罗湖区"
							},
							{
								"id": "440304",
								"name": "福田区"
							},
							{
								"id": "440305",
								"name": "南山区"
							},
							{
								"id": "440306",
								"name": "宝安区"
							},
							{
								"id": "440307",
								"name": "龙岗区"
							},
							{
								"id": "440308",
								"name": "盐田区"
							},
							{
								"id": "440309",
								"name": "光明新区"
							},
							{
								"id": "440310",
								"name": "坪山新区"
							},
							{
								"id": "440311",
								"name": "大鹏新区"
							},
							{
								"id": "440312",
								"name": "龙华新区"
							}
						]
					},
					{
						"id": "440400",
						"name": "珠海市",
						"childs": [
							{
								"id": "440402",
								"name": "香洲区"
							},
							{
								"id": "440403",
								"name": "斗门区"
							},
							{
								"id": "440404",
								"name": "金湾区"
							}
						]
					},
					{
						"id": "440500",
						"name": "汕头市",
						"childs": [
							{
								"id": "440507",
								"name": "龙湖区"
							},
							{
								"id": "440511",
								"name": "金平区"
							},
							{
								"id": "440512",
								"name": "濠江区"
							},
							{
								"id": "440513",
								"name": "潮阳区"
							},
							{
								"id": "440514",
								"name": "潮南区"
							},
							{
								"id": "440515",
								"name": "澄海区"
							},
							{
								"id": "440523",
								"name": "南澳县"
							}
						]
					},
					{
						"id": "440600",
						"name": "佛山市",
						"childs": [
							{
								"id": "440604",
								"name": "禅城区"
							},
							{
								"id": "440605",
								"name": "南海区"
							},
							{
								"id": "440606",
								"name": "顺德区"
							},
							{
								"id": "440607",
								"name": "三水区"
							},
							{
								"id": "440608",
								"name": "高明区"
							}
						]
					},
					{
						"id": "440700",
						"name": "江门市",
						"childs": [
							{
								"id": "440703",
								"name": "蓬江区"
							},
							{
								"id": "440704",
								"name": "江海区"
							},
							{
								"id": "440705",
								"name": "新会区"
							},
							{
								"id": "440781",
								"name": "台山市"
							},
							{
								"id": "440783",
								"name": "开平市"
							},
							{
								"id": "440784",
								"name": "鹤山市"
							},
							{
								"id": "440785",
								"name": "恩平市"
							}
						]
					},
					{
						"id": "440800",
						"name": "湛江市",
						"childs": [
							{
								"id": "440802",
								"name": "赤坎区"
							},
							{
								"id": "440803",
								"name": "霞山区"
							},
							{
								"id": "440804",
								"name": "坡头区"
							},
							{
								"id": "440811",
								"name": "麻章区"
							},
							{
								"id": "440823",
								"name": "遂溪县"
							},
							{
								"id": "440825",
								"name": "徐闻县"
							},
							{
								"id": "440881",
								"name": "廉江市"
							},
							{
								"id": "440882",
								"name": "雷州市"
							},
							{
								"id": "440883",
								"name": "吴川市"
							}
						]
					},
					{
						"id": "440900",
						"name": "茂名市",
						"childs": [
							{
								"id": "440902",
								"name": "茂南区"
							},
							{
								"id": "440904",
								"name": "电白区"
							},
							{
								"id": "440981",
								"name": "高州市"
							},
							{
								"id": "440982",
								"name": "化州市"
							},
							{
								"id": "440983",
								"name": "信宜市"
							}
						]
					},
					{
						"id": "441200",
						"name": "肇庆市",
						"childs": [
							{
								"id": "441202",
								"name": "端州区"
							},
							{
								"id": "441203",
								"name": "鼎湖区"
							},
							{
								"id": "441223",
								"name": "广宁县"
							},
							{
								"id": "441224",
								"name": "怀集县"
							},
							{
								"id": "441225",
								"name": "封开县"
							},
							{
								"id": "441226",
								"name": "德庆县"
							},
							{
								"id": "441283",
								"name": "高要市"
							},
							{
								"id": "441284",
								"name": "四会市"
							}
						]
					},
					{
						"id": "441300",
						"name": "惠州市",
						"childs": [
							{
								"id": "441302",
								"name": "惠城区"
							},
							{
								"id": "441303",
								"name": "惠阳区"
							},
							{
								"id": "441322",
								"name": "博罗县"
							},
							{
								"id": "441323",
								"name": "惠东县"
							},
							{
								"id": "441324",
								"name": "龙门县"
							}
						]
					},
					{
						"id": "441400",
						"name": "梅州市",
						"childs": [
							{
								"id": "441402",
								"name": "梅江区"
							},
							{
								"id": "441403",
								"name": "梅县区"
							},
							{
								"id": "441422",
								"name": "大埔县"
							},
							{
								"id": "441423",
								"name": "丰顺县"
							},
							{
								"id": "441424",
								"name": "五华县"
							},
							{
								"id": "441426",
								"name": "平远县"
							},
							{
								"id": "441427",
								"name": "蕉岭县"
							},
							{
								"id": "441481",
								"name": "兴宁市"
							}
						]
					},
					{
						"id": "441500",
						"name": "汕尾市",
						"childs": [
							{
								"id": "441502",
								"name": "城区"
							},
							{
								"id": "441521",
								"name": "海丰县"
							},
							{
								"id": "441523",
								"name": "陆河县"
							},
							{
								"id": "441581",
								"name": "陆丰市"
							}
						]
					},
					{
						"id": "441600",
						"name": "河源市",
						"childs": [
							{
								"id": "441602",
								"name": "源城区"
							},
							{
								"id": "441621",
								"name": "紫金县"
							},
							{
								"id": "441622",
								"name": "龙川县"
							},
							{
								"id": "441623",
								"name": "连平县"
							},
							{
								"id": "441624",
								"name": "和平县"
							},
							{
								"id": "441625",
								"name": "东源县"
							}
						]
					},
					{
						"id": "441700",
						"name": "阳江市",
						"childs": [
							{
								"id": "441702",
								"name": "江城区"
							},
							{
								"id": "441704",
								"name": "阳东区"
							},
							{
								"id": "441721",
								"name": "阳西县"
							},
							{
								"id": "441781",
								"name": "阳春市"
							}
						]
					},
					{
						"id": "441800",
						"name": "清远市",
						"childs": [
							{
								"id": "441802",
								"name": "清城区"
							},
							{
								"id": "441803",
								"name": "清新区"
							},
							{
								"id": "441821",
								"name": "佛冈县"
							},
							{
								"id": "441823",
								"name": "阳山县"
							},
							{
								"id": "441825",
								"name": "连山壮族瑶族自治县"
							},
							{
								"id": "441826",
								"name": "连南瑶族自治县"
							},
							{
								"id": "441881",
								"name": "英德市"
							},
							{
								"id": "441882",
								"name": "连州市"
							}
						]
					},
					{
						"id": "441900",
						"name": "东莞市",
						"childs": [
							{
								"id": "441901",
								"name": "莞城区"
							},
							{
								"id": "441902",
								"name": "南城区"
							},
							{
								"id": "441904",
								"name": "万江区"
							},
							{
								"id": "441905",
								"name": "石碣镇"
							},
							{
								"id": "441906",
								"name": "石龙镇"
							},
							{
								"id": "441907",
								"name": "茶山镇"
							},
							{
								"id": "441908",
								"name": "石排镇"
							},
							{
								"id": "441909",
								"name": "企石镇"
							},
							{
								"id": "441910",
								"name": "横沥镇"
							},
							{
								"id": "441911",
								"name": "桥头镇"
							},
							{
								"id": "441912",
								"name": "谢岗镇"
							},
							{
								"id": "441913",
								"name": "东坑镇"
							},
							{
								"id": "441914",
								"name": "常平镇"
							},
							{
								"id": "441915",
								"name": "寮步镇"
							},
							{
								"id": "441916",
								"name": "大朗镇"
							},
							{
								"id": "441917",
								"name": "麻涌镇"
							},
							{
								"id": "441918",
								"name": "中堂镇"
							},
							{
								"id": "441919",
								"name": "高埗镇"
							},
							{
								"id": "441920",
								"name": "樟木头镇"
							},
							{
								"id": "441921",
								"name": "大岭山镇"
							},
							{
								"id": "441922",
								"name": "望牛墩镇"
							},
							{
								"id": "441923",
								"name": "黄江镇"
							},
							{
								"id": "441924",
								"name": "洪梅镇"
							},
							{
								"id": "441925",
								"name": "清溪镇"
							},
							{
								"id": "441926",
								"name": "沙田镇"
							},
							{
								"id": "441927",
								"name": "道滘镇"
							},
							{
								"id": "441928",
								"name": "塘厦镇"
							},
							{
								"id": "441929",
								"name": "虎门镇"
							},
							{
								"id": "441930",
								"name": "厚街镇"
							},
							{
								"id": "441931",
								"name": "凤岗镇"
							},
							{
								"id": "441932",
								"name": "长安镇"
							}
						]
					},
					{
						"id": "442000",
						"name": "中山市",
						"childs": [
							{
								"id": "442001",
								"name": "石岐区"
							},
							{
								"id": "442004",
								"name": "南区"
							},
							{
								"id": "442005",
								"name": "五桂山区"
							},
							{
								"id": "442006",
								"name": "火炬开发区"
							},
							{
								"id": "442007",
								"name": "黄圃镇"
							},
							{
								"id": "442008",
								"name": "南头镇"
							},
							{
								"id": "442009",
								"name": "东凤镇"
							},
							{
								"id": "442010",
								"name": "阜沙镇"
							},
							{
								"id": "442011",
								"name": "小榄镇"
							},
							{
								"id": "442012",
								"name": "东升镇"
							},
							{
								"id": "442013",
								"name": "古镇镇"
							},
							{
								"id": "442014",
								"name": "横栏镇"
							},
							{
								"id": "442015",
								"name": "三角镇"
							},
							{
								"id": "442016",
								"name": "民众镇"
							},
							{
								"id": "442017",
								"name": "南朗镇"
							},
							{
								"id": "442018",
								"name": "港口镇"
							},
							{
								"id": "442019",
								"name": "大涌镇"
							},
							{
								"id": "442020",
								"name": "沙溪镇"
							},
							{
								"id": "442021",
								"name": "三乡镇"
							},
							{
								"id": "442022",
								"name": "板芙镇"
							},
							{
								"id": "442023",
								"name": "神湾镇"
							},
							{
								"id": "442024",
								"name": "坦洲镇"
							}
						]
					},
					{
						"id": "445100",
						"name": "潮州市",
						"childs": [
							{
								"id": "445102",
								"name": "湘桥区"
							},
							{
								"id": "445103",
								"name": "潮安区"
							},
							{
								"id": "445122",
								"name": "饶平县"
							}
						]
					},
					{
						"id": "445200",
						"name": "揭阳市",
						"childs": [
							{
								"id": "445202",
								"name": "榕城区"
							},
							{
								"id": "445203",
								"name": "揭东区"
							},
							{
								"id": "445222",
								"name": "揭西县"
							},
							{
								"id": "445224",
								"name": "惠来县"
							},
							{
								"id": "445281",
								"name": "普宁市"
							}
						]
					},
					{
						"id": "445300",
						"name": "云浮市",
						"childs": [
							{
								"id": "445302",
								"name": "云城区"
							},
							{
								"id": "445303",
								"name": "云安区"
							},
							{
								"id": "445321",
								"name": "新兴县"
							},
							{
								"id": "445322",
								"name": "郁南县"
							},
							{
								"id": "445381",
								"name": "罗定市"
							}
						]
					}
				]
			},
			{
				"id": "450000",
				"name": "广西壮族自治区",
				"type": 0,
				"childs": [
					{
						"id": "450100",
						"name": "南宁市",
						"childs": [
							{
								"id": "450102",
								"name": "兴宁区"
							},
							{
								"id": "450103",
								"name": "青秀区"
							},
							{
								"id": "450105",
								"name": "江南区"
							},
							{
								"id": "450107",
								"name": "西乡塘区"
							},
							{
								"id": "450108",
								"name": "良庆区"
							},
							{
								"id": "450109",
								"name": "邕宁区"
							},
							{
								"id": "450122",
								"name": "武鸣县"
							},
							{
								"id": "450123",
								"name": "隆安县"
							},
							{
								"id": "450124",
								"name": "马山县"
							},
							{
								"id": "450125",
								"name": "上林县"
							},
							{
								"id": "450126",
								"name": "宾阳县"
							},
							{
								"id": "450127",
								"name": "横县"
							},
							{
								"id": "450128",
								"name": "埌东新区"
							}
						]
					},
					{
						"id": "450200",
						"name": "柳州市",
						"childs": [
							{
								"id": "450202",
								"name": "城中区"
							},
							{
								"id": "450203",
								"name": "鱼峰区"
							},
							{
								"id": "450204",
								"name": "柳南区"
							},
							{
								"id": "450205",
								"name": "柳北区"
							},
							{
								"id": "450221",
								"name": "柳江县"
							},
							{
								"id": "450222",
								"name": "柳城县"
							},
							{
								"id": "450223",
								"name": "鹿寨县"
							},
							{
								"id": "450224",
								"name": "融安县"
							},
							{
								"id": "450225",
								"name": "融水苗族自治县"
							},
							{
								"id": "450226",
								"name": "三江侗族自治县"
							},
							{
								"id": "450227",
								"name": "柳东新区"
							}
						]
					},
					{
						"id": "450300",
						"name": "桂林市",
						"childs": [
							{
								"id": "450302",
								"name": "秀峰区"
							},
							{
								"id": "450303",
								"name": "叠彩区"
							},
							{
								"id": "450304",
								"name": "象山区"
							},
							{
								"id": "450305",
								"name": "七星区"
							},
							{
								"id": "450311",
								"name": "雁山区"
							},
							{
								"id": "450312",
								"name": "临桂区"
							},
							{
								"id": "450321",
								"name": "阳朔县"
							},
							{
								"id": "450323",
								"name": "灵川县"
							},
							{
								"id": "450324",
								"name": "全州县"
							},
							{
								"id": "450325",
								"name": "兴安县"
							},
							{
								"id": "450326",
								"name": "永福县"
							},
							{
								"id": "450327",
								"name": "灌阳县"
							},
							{
								"id": "450328",
								"name": "龙胜各族自治县"
							},
							{
								"id": "450329",
								"name": "资源县"
							},
							{
								"id": "450330",
								"name": "平乐县"
							},
							{
								"id": "450331",
								"name": "荔浦县"
							},
							{
								"id": "450332",
								"name": "恭城瑶族自治县"
							}
						]
					},
					{
						"id": "450400",
						"name": "梧州市",
						"childs": [
							{
								"id": "450403",
								"name": "万秀区"
							},
							{
								"id": "450405",
								"name": "长洲区"
							},
							{
								"id": "450406",
								"name": "龙圩区"
							},
							{
								"id": "450421",
								"name": "苍梧县"
							},
							{
								"id": "450422",
								"name": "藤县"
							},
							{
								"id": "450423",
								"name": "蒙山县"
							},
							{
								"id": "450481",
								"name": "岑溪市"
							}
						]
					},
					{
						"id": "450500",
						"name": "北海市",
						"childs": [
							{
								"id": "450502",
								"name": "海城区"
							},
							{
								"id": "450503",
								"name": "银海区"
							},
							{
								"id": "450512",
								"name": "铁山港区"
							},
							{
								"id": "450521",
								"name": "合浦县"
							}
						]
					},
					{
						"id": "450600",
						"name": "防城港市",
						"childs": [
							{
								"id": "450602",
								"name": "港口区"
							},
							{
								"id": "450603",
								"name": "防城区"
							},
							{
								"id": "450621",
								"name": "上思县"
							},
							{
								"id": "450681",
								"name": "东兴市"
							}
						]
					},
					{
						"id": "450700",
						"name": "钦州市",
						"childs": [
							{
								"id": "450702",
								"name": "钦南区"
							},
							{
								"id": "450703",
								"name": "钦北区"
							},
							{
								"id": "450721",
								"name": "灵山县"
							},
							{
								"id": "450722",
								"name": "浦北县"
							}
						]
					},
					{
						"id": "450800",
						"name": "贵港市",
						"childs": [
							{
								"id": "450802",
								"name": "港北区"
							},
							{
								"id": "450803",
								"name": "港南区"
							},
							{
								"id": "450804",
								"name": "覃塘区"
							},
							{
								"id": "450821",
								"name": "平南县"
							},
							{
								"id": "450881",
								"name": "桂平市"
							}
						]
					},
					{
						"id": "450900",
						"name": "玉林市",
						"childs": [
							{
								"id": "450902",
								"name": "玉州区"
							},
							{
								"id": "450903",
								"name": "福绵区"
							},
							{
								"id": "450904",
								"name": "玉东新区"
							},
							{
								"id": "450921",
								"name": "容县"
							},
							{
								"id": "450922",
								"name": "陆川县"
							},
							{
								"id": "450923",
								"name": "博白县"
							},
							{
								"id": "450924",
								"name": "兴业县"
							},
							{
								"id": "450981",
								"name": "北流市"
							}
						]
					},
					{
						"id": "451000",
						"name": "百色市",
						"childs": [
							{
								"id": "451002",
								"name": "右江区"
							},
							{
								"id": "451021",
								"name": "田阳县"
							},
							{
								"id": "451022",
								"name": "田东县"
							},
							{
								"id": "451023",
								"name": "平果县"
							},
							{
								"id": "451024",
								"name": "德保县"
							},
							{
								"id": "451025",
								"name": "靖西县"
							},
							{
								"id": "451026",
								"name": "那坡县"
							},
							{
								"id": "451027",
								"name": "凌云县"
							},
							{
								"id": "451028",
								"name": "乐业县"
							},
							{
								"id": "451029",
								"name": "田林县"
							},
							{
								"id": "451030",
								"name": "西林县"
							},
							{
								"id": "451031",
								"name": "隆林各族自治县"
							}
						]
					},
					{
						"id": "451100",
						"name": "贺州市",
						"childs": [
							{
								"id": "451102",
								"name": "八步区"
							},
							{
								"id": "451121",
								"name": "昭平县"
							},
							{
								"id": "451122",
								"name": "钟山县"
							},
							{
								"id": "451123",
								"name": "富川瑶族自治县"
							},
							{
								"id": "451124",
								"name": "平桂管理区"
							}
						]
					},
					{
						"id": "451200",
						"name": "河池市",
						"childs": [
							{
								"id": "451202",
								"name": "金城江区"
							},
							{
								"id": "451221",
								"name": "南丹县"
							},
							{
								"id": "451222",
								"name": "天峨县"
							},
							{
								"id": "451223",
								"name": "凤山县"
							},
							{
								"id": "451224",
								"name": "东兰县"
							},
							{
								"id": "451225",
								"name": "罗城仫佬族自治县"
							},
							{
								"id": "451226",
								"name": "环江毛南族自治县"
							},
							{
								"id": "451227",
								"name": "巴马瑶族自治县"
							},
							{
								"id": "451228",
								"name": "都安瑶族自治县"
							},
							{
								"id": "451229",
								"name": "大化瑶族自治县"
							},
							{
								"id": "451281",
								"name": "宜州市"
							}
						]
					},
					{
						"id": "451300",
						"name": "来宾市",
						"childs": [
							{
								"id": "451302",
								"name": "兴宾区"
							},
							{
								"id": "451321",
								"name": "忻城县"
							},
							{
								"id": "451322",
								"name": "象州县"
							},
							{
								"id": "451323",
								"name": "武宣县"
							},
							{
								"id": "451324",
								"name": "金秀瑶族自治县"
							},
							{
								"id": "451381",
								"name": "合山市"
							}
						]
					},
					{
						"id": "451400",
						"name": "崇左市",
						"childs": [
							{
								"id": "451402",
								"name": "江州区"
							},
							{
								"id": "451421",
								"name": "扶绥县"
							},
							{
								"id": "451422",
								"name": "宁明县"
							},
							{
								"id": "451423",
								"name": "龙州县"
							},
							{
								"id": "451424",
								"name": "大新县"
							},
							{
								"id": "451425",
								"name": "天等县"
							},
							{
								"id": "451481",
								"name": "凭祥市"
							}
						]
					}
				]
			},
			{
				"id": "460000",
				"name": "海南省",
				"type": 0,
				"childs": [
					{
						"id": "460100",
						"name": "海口市",
						"childs": [
							{
								"id": "460105",
								"name": "秀英区"
							},
							{
								"id": "460106",
								"name": "龙华区"
							},
							{
								"id": "460107",
								"name": "琼山区"
							},
							{
								"id": "460108",
								"name": "美兰区"
							}
						]
					},
					{
						"id": "460200",
						"name": "三亚市",
						"childs": [
							{
								"id": "460202",
								"name": "海棠区"
							},
							{
								"id": "460203",
								"name": "吉阳区"
							},
							{
								"id": "460204",
								"name": "天涯区"
							},
							{
								"id": "460205",
								"name": "崖州区"
							}
						]
					},
					{
						"id": "460300",
						"name": "三沙市",
						"childs": [
							{
								"id": "460321",
								"name": "西沙群岛"
							},
							{
								"id": "460322",
								"name": "南沙群岛"
							},
							{
								"id": "460323",
								"name": "中沙群岛"
							}
						]
					},
					{
						"id": "469000",
						"name": "直辖县级",
						"childs": [
							{
								"id": "469001",
								"name": "五指山市"
							},
							{
								"id": "469002",
								"name": "琼海市"
							},
							{
								"id": "469003",
								"name": "儋州市"
							},
							{
								"id": "469005",
								"name": "文昌市"
							},
							{
								"id": "469006",
								"name": "万宁市"
							},
							{
								"id": "469007",
								"name": "东方市"
							},
							{
								"id": "469021",
								"name": "定安县"
							},
							{
								"id": "469022",
								"name": "屯昌县"
							},
							{
								"id": "469023",
								"name": "澄迈县"
							},
							{
								"id": "469024",
								"name": "临高县"
							},
							{
								"id": "469025",
								"name": "白沙黎族自治县"
							},
							{
								"id": "469026",
								"name": "昌江黎族自治县"
							},
							{
								"id": "469027",
								"name": "乐东黎族自治县"
							},
							{
								"id": "469028",
								"name": "陵水黎族自治县"
							},
							{
								"id": "469029",
								"name": "保亭黎族苗族自治县"
							},
							{
								"id": "469030",
								"name": "琼中黎族苗族自治县"
							}
						]
					}
				]
			},
			{
				"id": "500000",
				"name": "重庆",
				"type": 1,
				"childs": [
					{
						"id": "500100",
						"name": "重庆市",
						"childs": [
							{
								"id": "500101",
								"name": "万州区"
							},
							{
								"id": "500102",
								"name": "涪陵区"
							},
							{
								"id": "500103",
								"name": "渝中区"
							},
							{
								"id": "500104",
								"name": "大渡口区"
							},
							{
								"id": "500105",
								"name": "江北区"
							},
							{
								"id": "500106",
								"name": "沙坪坝区"
							},
							{
								"id": "500107",
								"name": "九龙坡区"
							},
							{
								"id": "500108",
								"name": "南岸区"
							},
							{
								"id": "500109",
								"name": "北碚区"
							},
							{
								"id": "500110",
								"name": "綦江区"
							},
							{
								"id": "500111",
								"name": "大足区"
							},
							{
								"id": "500112",
								"name": "渝北区"
							},
							{
								"id": "500113",
								"name": "巴南区"
							},
							{
								"id": "500114",
								"name": "黔江区"
							},
							{
								"id": "500115",
								"name": "长寿区"
							},
							{
								"id": "500116",
								"name": "江津区"
							},
							{
								"id": "500117",
								"name": "合川区"
							},
							{
								"id": "500118",
								"name": "永川区"
							},
							{
								"id": "500119",
								"name": "南川区"
							},
							{
								"id": "500120",
								"name": "璧山区"
							},
							{
								"id": "500151",
								"name": "铜梁区"
							},
							{
								"id": "500223",
								"name": "潼南县"
							},
							{
								"id": "500226",
								"name": "荣昌县"
							},
							{
								"id": "500228",
								"name": "梁平县"
							},
							{
								"id": "500229",
								"name": "城口县"
							},
							{
								"id": "500230",
								"name": "丰都县"
							},
							{
								"id": "500231",
								"name": "垫江县"
							},
							{
								"id": "500232",
								"name": "武隆县"
							},
							{
								"id": "500233",
								"name": "忠县"
							},
							{
								"id": "500234",
								"name": "开县"
							},
							{
								"id": "500235",
								"name": "云阳县"
							},
							{
								"id": "500236",
								"name": "奉节县"
							},
							{
								"id": "500237",
								"name": "巫山县"
							},
							{
								"id": "500238",
								"name": "巫溪县"
							},
							{
								"id": "500240",
								"name": "石柱土家族自治县"
							},
							{
								"id": "500241",
								"name": "秀山土家族苗族自治县"
							},
							{
								"id": "500242",
								"name": "酉阳土家族苗族自治县"
							},
							{
								"id": "500243",
								"name": "彭水苗族土家族自治县"
							}
						]
					},
					{
						"id": "500300",
						"name": "两江新区",
						"childs": [
							{
								"id": "500301",
								"name": "北部新区"
							},
							{
								"id": "500302",
								"name": "保税港区"
							},
							{
								"id": "500303",
								"name": "工业园区"
							}
						]
					}
				]
			},
			{
				"id": "510000",
				"name": "四川省",
				"type": 0,
				"childs": [
					{
						"id": "510100",
						"name": "成都市",
						"childs": [
							{
								"id": "510104",
								"name": "锦江区"
							},
							{
								"id": "510105",
								"name": "青羊区"
							},
							{
								"id": "510106",
								"name": "金牛区"
							},
							{
								"id": "510107",
								"name": "武侯区"
							},
							{
								"id": "510108",
								"name": "成华区"
							},
							{
								"id": "510112",
								"name": "龙泉驿区"
							},
							{
								"id": "510113",
								"name": "青白江区"
							},
							{
								"id": "510114",
								"name": "新都区"
							},
							{
								"id": "510115",
								"name": "温江区"
							},
							{
								"id": "510121",
								"name": "金堂县"
							},
							{
								"id": "510122",
								"name": "双流县"
							},
							{
								"id": "510124",
								"name": "郫县"
							},
							{
								"id": "510129",
								"name": "大邑县"
							},
							{
								"id": "510131",
								"name": "蒲江县"
							},
							{
								"id": "510132",
								"name": "新津县"
							},
							{
								"id": "510181",
								"name": "都江堰市"
							},
							{
								"id": "510182",
								"name": "彭州市"
							},
							{
								"id": "510183",
								"name": "邛崃市"
							},
							{
								"id": "510184",
								"name": "崇州市"
							}
						]
					},
					{
						"id": "510300",
						"name": "自贡市",
						"childs": [
							{
								"id": "510302",
								"name": "自流井区"
							},
							{
								"id": "510303",
								"name": "贡井区"
							},
							{
								"id": "510304",
								"name": "大安区"
							},
							{
								"id": "510311",
								"name": "沿滩区"
							},
							{
								"id": "510321",
								"name": "荣县"
							},
							{
								"id": "510322",
								"name": "富顺县"
							}
						]
					},
					{
						"id": "510400",
						"name": "攀枝花市",
						"childs": [
							{
								"id": "510402",
								"name": "东区"
							},
							{
								"id": "510403",
								"name": "西区"
							},
							{
								"id": "510411",
								"name": "仁和区"
							},
							{
								"id": "510421",
								"name": "米易县"
							},
							{
								"id": "510422",
								"name": "盐边县"
							}
						]
					},
					{
						"id": "510500",
						"name": "泸州市",
						"childs": [
							{
								"id": "510502",
								"name": "江阳区"
							},
							{
								"id": "510503",
								"name": "纳溪区"
							},
							{
								"id": "510504",
								"name": "龙马潭区"
							},
							{
								"id": "510521",
								"name": "泸县"
							},
							{
								"id": "510522",
								"name": "合江县"
							},
							{
								"id": "510524",
								"name": "叙永县"
							},
							{
								"id": "510525",
								"name": "古蔺县"
							}
						]
					},
					{
						"id": "510600",
						"name": "德阳市",
						"childs": [
							{
								"id": "510603",
								"name": "旌阳区"
							},
							{
								"id": "510623",
								"name": "中江县"
							},
							{
								"id": "510626",
								"name": "罗江县"
							},
							{
								"id": "510681",
								"name": "广汉市"
							},
							{
								"id": "510682",
								"name": "什邡市"
							},
							{
								"id": "510683",
								"name": "绵竹市"
							}
						]
					},
					{
						"id": "510700",
						"name": "绵阳市",
						"childs": [
							{
								"id": "510703",
								"name": "涪城区"
							},
							{
								"id": "510704",
								"name": "游仙区"
							},
							{
								"id": "510722",
								"name": "三台县"
							},
							{
								"id": "510723",
								"name": "盐亭县"
							},
							{
								"id": "510724",
								"name": "安县"
							},
							{
								"id": "510725",
								"name": "梓潼县"
							},
							{
								"id": "510726",
								"name": "北川羌族自治县"
							},
							{
								"id": "510727",
								"name": "平武县"
							},
							{
								"id": "510781",
								"name": "江油市"
							}
						]
					},
					{
						"id": "510800",
						"name": "广元市",
						"childs": [
							{
								"id": "510802",
								"name": "利州区"
							},
							{
								"id": "510811",
								"name": "昭化区"
							},
							{
								"id": "510812",
								"name": "朝天区"
							},
							{
								"id": "510821",
								"name": "旺苍县"
							},
							{
								"id": "510822",
								"name": "青川县"
							},
							{
								"id": "510823",
								"name": "剑阁县"
							},
							{
								"id": "510824",
								"name": "苍溪县"
							}
						]
					},
					{
						"id": "510900",
						"name": "遂宁市",
						"childs": [
							{
								"id": "510903",
								"name": "船山区"
							},
							{
								"id": "510904",
								"name": "安居区"
							},
							{
								"id": "510921",
								"name": "蓬溪县"
							},
							{
								"id": "510922",
								"name": "射洪县"
							},
							{
								"id": "510923",
								"name": "大英县"
							}
						]
					},
					{
						"id": "511000",
						"name": "内江市",
						"childs": [
							{
								"id": "511002",
								"name": "市中区"
							},
							{
								"id": "511011",
								"name": "东兴区"
							},
							{
								"id": "511024",
								"name": "威远县"
							},
							{
								"id": "511025",
								"name": "资中县"
							},
							{
								"id": "511028",
								"name": "隆昌县"
							}
						]
					},
					{
						"id": "511100",
						"name": "乐山市",
						"childs": [
							{
								"id": "511102",
								"name": "市中区"
							},
							{
								"id": "511111",
								"name": "沙湾区"
							},
							{
								"id": "511112",
								"name": "五通桥区"
							},
							{
								"id": "511113",
								"name": "金口河区"
							},
							{
								"id": "511123",
								"name": "犍为县"
							},
							{
								"id": "511124",
								"name": "井研县"
							},
							{
								"id": "511126",
								"name": "夹江县"
							},
							{
								"id": "511129",
								"name": "沐川县"
							},
							{
								"id": "511132",
								"name": "峨边彝族自治县"
							},
							{
								"id": "511133",
								"name": "马边彝族自治县"
							},
							{
								"id": "511181",
								"name": "峨眉山市"
							}
						]
					},
					{
						"id": "511300",
						"name": "南充市",
						"childs": [
							{
								"id": "511302",
								"name": "顺庆区"
							},
							{
								"id": "511303",
								"name": "高坪区"
							},
							{
								"id": "511304",
								"name": "嘉陵区"
							},
							{
								"id": "511321",
								"name": "南部县"
							},
							{
								"id": "511322",
								"name": "营山县"
							},
							{
								"id": "511323",
								"name": "蓬安县"
							},
							{
								"id": "511324",
								"name": "仪陇县"
							},
							{
								"id": "511325",
								"name": "西充县"
							},
							{
								"id": "511381",
								"name": "阆中市"
							}
						]
					},
					{
						"id": "511400",
						"name": "眉山市",
						"childs": [
							{
								"id": "511402",
								"name": "东坡区"
							},
							{
								"id": "511403",
								"name": "彭山区"
							},
							{
								"id": "511421",
								"name": "仁寿县"
							},
							{
								"id": "511423",
								"name": "洪雅县"
							},
							{
								"id": "511424",
								"name": "丹棱县"
							},
							{
								"id": "511425",
								"name": "青神县"
							}
						]
					},
					{
						"id": "511500",
						"name": "宜宾市",
						"childs": [
							{
								"id": "511502",
								"name": "翠屏区"
							},
							{
								"id": "511503",
								"name": "南溪区"
							},
							{
								"id": "511521",
								"name": "宜宾县"
							},
							{
								"id": "511523",
								"name": "江安县"
							},
							{
								"id": "511524",
								"name": "长宁县"
							},
							{
								"id": "511525",
								"name": "高县"
							},
							{
								"id": "511526",
								"name": "珙县"
							},
							{
								"id": "511527",
								"name": "筠连县"
							},
							{
								"id": "511528",
								"name": "兴文县"
							},
							{
								"id": "511529",
								"name": "屏山县"
							}
						]
					},
					{
						"id": "511600",
						"name": "广安市",
						"childs": [
							{
								"id": "511602",
								"name": "广安区"
							},
							{
								"id": "511603",
								"name": "前锋区"
							},
							{
								"id": "511621",
								"name": "岳池县"
							},
							{
								"id": "511622",
								"name": "武胜县"
							},
							{
								"id": "511623",
								"name": "邻水县"
							},
							{
								"id": "511681",
								"name": "华蓥市"
							}
						]
					},
					{
						"id": "511700",
						"name": "达州市",
						"childs": [
							{
								"id": "511702",
								"name": "通川区"
							},
							{
								"id": "511703",
								"name": "达川区"
							},
							{
								"id": "511722",
								"name": "宣汉县"
							},
							{
								"id": "511723",
								"name": "开江县"
							},
							{
								"id": "511724",
								"name": "大竹县"
							},
							{
								"id": "511725",
								"name": "渠县"
							},
							{
								"id": "511781",
								"name": "万源市"
							}
						]
					},
					{
						"id": "511800",
						"name": "雅安市",
						"childs": [
							{
								"id": "511802",
								"name": "雨城区"
							},
							{
								"id": "511803",
								"name": "名山区"
							},
							{
								"id": "511822",
								"name": "荥经县"
							},
							{
								"id": "511823",
								"name": "汉源县"
							},
							{
								"id": "511824",
								"name": "石棉县"
							},
							{
								"id": "511825",
								"name": "天全县"
							},
							{
								"id": "511826",
								"name": "芦山县"
							},
							{
								"id": "511827",
								"name": "宝兴县"
							}
						]
					},
					{
						"id": "511900",
						"name": "巴中市",
						"childs": [
							{
								"id": "511902",
								"name": "巴州区"
							},
							{
								"id": "511903",
								"name": "恩阳区"
							},
							{
								"id": "511921",
								"name": "通江县"
							},
							{
								"id": "511922",
								"name": "南江县"
							},
							{
								"id": "511923",
								"name": "平昌县"
							}
						]
					},
					{
						"id": "512000",
						"name": "资阳市",
						"childs": [
							{
								"id": "512002",
								"name": "雁江区"
							},
							{
								"id": "512021",
								"name": "安岳县"
							},
							{
								"id": "512022",
								"name": "乐至县"
							},
							{
								"id": "512081",
								"name": "简阳市"
							}
						]
					},
					{
						"id": "513200",
						"name": "阿坝藏族羌族自治州",
						"childs": [
							{
								"id": "513221",
								"name": "汶川县"
							},
							{
								"id": "513222",
								"name": "理县"
							},
							{
								"id": "513223",
								"name": "茂县"
							},
							{
								"id": "513224",
								"name": "松潘县"
							},
							{
								"id": "513225",
								"name": "九寨沟县"
							},
							{
								"id": "513226",
								"name": "金川县"
							},
							{
								"id": "513227",
								"name": "小金县"
							},
							{
								"id": "513228",
								"name": "黑水县"
							},
							{
								"id": "513229",
								"name": "马尔康县"
							},
							{
								"id": "513230",
								"name": "壤塘县"
							},
							{
								"id": "513231",
								"name": "阿坝县"
							},
							{
								"id": "513232",
								"name": "若尔盖县"
							},
							{
								"id": "513233",
								"name": "红原县"
							}
						]
					},
					{
						"id": "513300",
						"name": "甘孜藏族自治州",
						"childs": [
							{
								"id": "513321",
								"name": "康定县"
							},
							{
								"id": "513322",
								"name": "泸定县"
							},
							{
								"id": "513323",
								"name": "丹巴县"
							},
							{
								"id": "513324",
								"name": "九龙县"
							},
							{
								"id": "513325",
								"name": "雅江县"
							},
							{
								"id": "513326",
								"name": "道孚县"
							},
							{
								"id": "513327",
								"name": "炉霍县"
							},
							{
								"id": "513328",
								"name": "甘孜县"
							},
							{
								"id": "513329",
								"name": "新龙县"
							},
							{
								"id": "513330",
								"name": "德格县"
							},
							{
								"id": "513331",
								"name": "白玉县"
							},
							{
								"id": "513332",
								"name": "石渠县"
							},
							{
								"id": "513333",
								"name": "色达县"
							},
							{
								"id": "513334",
								"name": "理塘县"
							},
							{
								"id": "513335",
								"name": "巴塘县"
							},
							{
								"id": "513336",
								"name": "乡城县"
							},
							{
								"id": "513337",
								"name": "稻城县"
							},
							{
								"id": "513338",
								"name": "得荣县"
							}
						]
					},
					{
						"id": "513400",
						"name": "凉山彝族自治州",
						"childs": [
							{
								"id": "513401",
								"name": "西昌市"
							},
							{
								"id": "513422",
								"name": "木里藏族自治县"
							},
							{
								"id": "513423",
								"name": "盐源县"
							},
							{
								"id": "513424",
								"name": "德昌县"
							},
							{
								"id": "513425",
								"name": "会理县"
							},
							{
								"id": "513426",
								"name": "会东县"
							},
							{
								"id": "513427",
								"name": "宁南县"
							},
							{
								"id": "513428",
								"name": "普格县"
							},
							{
								"id": "513429",
								"name": "布拖县"
							},
							{
								"id": "513430",
								"name": "金阳县"
							},
							{
								"id": "513431",
								"name": "昭觉县"
							},
							{
								"id": "513432",
								"name": "喜德县"
							},
							{
								"id": "513433",
								"name": "冕宁县"
							},
							{
								"id": "513434",
								"name": "越西县"
							},
							{
								"id": "513435",
								"name": "甘洛县"
							},
							{
								"id": "513436",
								"name": "美姑县"
							},
							{
								"id": "513437",
								"name": "雷波县"
							}
						]
					}
				]
			},
			{
				"id": "520000",
				"name": "贵州省",
				"type": 0,
				"childs": [
					{
						"id": "520100",
						"name": "贵阳市",
						"childs": [
							{
								"id": "520102",
								"name": "南明区"
							},
							{
								"id": "520103",
								"name": "云岩区"
							},
							{
								"id": "520111",
								"name": "花溪区"
							},
							{
								"id": "520112",
								"name": "乌当区"
							},
							{
								"id": "520113",
								"name": "白云区"
							},
							{
								"id": "520115",
								"name": "观山湖区"
							},
							{
								"id": "520121",
								"name": "开阳县"
							},
							{
								"id": "520122",
								"name": "息烽县"
							},
							{
								"id": "520123",
								"name": "修文县"
							},
							{
								"id": "520181",
								"name": "清镇市"
							}
						]
					},
					{
						"id": "520200",
						"name": "六盘水市",
						"childs": [
							{
								"id": "520201",
								"name": "钟山区"
							},
							{
								"id": "520203",
								"name": "六枝特区"
							},
							{
								"id": "520221",
								"name": "水城县"
							},
							{
								"id": "520222",
								"name": "盘县"
							}
						]
					},
					{
						"id": "520300",
						"name": "遵义市",
						"childs": [
							{
								"id": "520302",
								"name": "红花岗区"
							},
							{
								"id": "520303",
								"name": "汇川区"
							},
							{
								"id": "520321",
								"name": "遵义县"
							},
							{
								"id": "520322",
								"name": "桐梓县"
							},
							{
								"id": "520323",
								"name": "绥阳县"
							},
							{
								"id": "520324",
								"name": "正安县"
							},
							{
								"id": "520325",
								"name": "道真仡佬族苗族自治县"
							},
							{
								"id": "520326",
								"name": "务川仡佬族苗族自治县"
							},
							{
								"id": "520327",
								"name": "凤冈县"
							},
							{
								"id": "520328",
								"name": "湄潭县"
							},
							{
								"id": "520329",
								"name": "余庆县"
							},
							{
								"id": "520330",
								"name": "习水县"
							},
							{
								"id": "520381",
								"name": "赤水市"
							},
							{
								"id": "520382",
								"name": "仁怀市"
							}
						]
					},
					{
						"id": "520400",
						"name": "安顺市",
						"childs": [
							{
								"id": "520402",
								"name": "西秀区"
							},
							{
								"id": "520421",
								"name": "平坝区"
							},
							{
								"id": "520422",
								"name": "普定县"
							},
							{
								"id": "520423",
								"name": "镇宁布依族苗族自治县"
							},
							{
								"id": "520424",
								"name": "关岭布依族苗族自治县"
							},
							{
								"id": "520425",
								"name": "紫云苗族布依族自治县"
							}
						]
					},
					{
						"id": "520500",
						"name": "毕节市",
						"childs": [
							{
								"id": "520502",
								"name": "七星关区"
							},
							{
								"id": "520521",
								"name": "大方县"
							},
							{
								"id": "520522",
								"name": "黔西县"
							},
							{
								"id": "520523",
								"name": "金沙县"
							},
							{
								"id": "520524",
								"name": "织金县"
							},
							{
								"id": "520525",
								"name": "纳雍县"
							},
							{
								"id": "520526",
								"name": "威宁彝族回族苗族自治县"
							},
							{
								"id": "520527",
								"name": "赫章县"
							}
						]
					},
					{
						"id": "520600",
						"name": "铜仁市",
						"childs": [
							{
								"id": "520602",
								"name": "碧江区"
							},
							{
								"id": "520603",
								"name": "万山区"
							},
							{
								"id": "520621",
								"name": "江口县"
							},
							{
								"id": "520622",
								"name": "玉屏侗族自治县"
							},
							{
								"id": "520623",
								"name": "石阡县"
							},
							{
								"id": "520624",
								"name": "思南县"
							},
							{
								"id": "520625",
								"name": "印江土家族苗族自治县"
							},
							{
								"id": "520626",
								"name": "德江县"
							},
							{
								"id": "520627",
								"name": "沿河土家族自治县"
							},
							{
								"id": "520628",
								"name": "松桃苗族自治县"
							}
						]
					},
					{
						"id": "522300",
						"name": "黔西南布依族苗族自治州",
						"childs": [
							{
								"id": "522301",
								"name": "兴义市 "
							},
							{
								"id": "522322",
								"name": "兴仁县"
							},
							{
								"id": "522323",
								"name": "普安县"
							},
							{
								"id": "522324",
								"name": "晴隆县"
							},
							{
								"id": "522325",
								"name": "贞丰县"
							},
							{
								"id": "522326",
								"name": "望谟县"
							},
							{
								"id": "522327",
								"name": "册亨县"
							},
							{
								"id": "522328",
								"name": "安龙县"
							}
						]
					},
					{
						"id": "522600",
						"name": "黔东南苗族侗族自治州",
						"childs": [
							{
								"id": "522601",
								"name": "凯里市"
							},
							{
								"id": "522622",
								"name": "黄平县"
							},
							{
								"id": "522623",
								"name": "施秉县"
							},
							{
								"id": "522624",
								"name": "三穗县"
							},
							{
								"id": "522625",
								"name": "镇远县"
							},
							{
								"id": "522626",
								"name": "岑巩县"
							},
							{
								"id": "522627",
								"name": "天柱县"
							},
							{
								"id": "522628",
								"name": "锦屏县"
							},
							{
								"id": "522629",
								"name": "剑河县"
							},
							{
								"id": "522630",
								"name": "台江县"
							},
							{
								"id": "522631",
								"name": "黎平县"
							},
							{
								"id": "522632",
								"name": "榕江县"
							},
							{
								"id": "522633",
								"name": "从江县"
							},
							{
								"id": "522634",
								"name": "雷山县"
							},
							{
								"id": "522635",
								"name": "麻江县"
							},
							{
								"id": "522636",
								"name": "丹寨县"
							}
						]
					},
					{
						"id": "522700",
						"name": "黔南布依族苗族自治州",
						"childs": [
							{
								"id": "522701",
								"name": "都匀市"
							},
							{
								"id": "522702",
								"name": "福泉市"
							},
							{
								"id": "522722",
								"name": "荔波县"
							},
							{
								"id": "522723",
								"name": "贵定县"
							},
							{
								"id": "522725",
								"name": "瓮安县"
							},
							{
								"id": "522726",
								"name": "独山县"
							},
							{
								"id": "522727",
								"name": "平塘县"
							},
							{
								"id": "522728",
								"name": "罗甸县"
							},
							{
								"id": "522729",
								"name": "长顺县"
							},
							{
								"id": "522730",
								"name": "龙里县"
							},
							{
								"id": "522731",
								"name": "惠水县"
							},
							{
								"id": "522732",
								"name": "三都水族自治县"
							}
						]
					}
				]
			},
			{
				"id": "530000",
				"name": "云南省",
				"type": 0,
				"childs": [
					{
						"id": "530100",
						"name": "昆明市",
						"childs": [
							{
								"id": "530102",
								"name": "五华区"
							},
							{
								"id": "530103",
								"name": "盘龙区"
							},
							{
								"id": "530111",
								"name": "官渡区"
							},
							{
								"id": "530112",
								"name": "西山区"
							},
							{
								"id": "530113",
								"name": "东川区"
							},
							{
								"id": "530114",
								"name": "呈贡区"
							},
							{
								"id": "530122",
								"name": "晋宁县"
							},
							{
								"id": "530124",
								"name": "富民县"
							},
							{
								"id": "530125",
								"name": "宜良县"
							},
							{
								"id": "530126",
								"name": "石林彝族自治县"
							},
							{
								"id": "530127",
								"name": "嵩明县"
							},
							{
								"id": "530128",
								"name": "禄劝彝族苗族自治县"
							},
							{
								"id": "530129",
								"name": "寻甸回族彝族自治县 "
							},
							{
								"id": "530181",
								"name": "安宁市"
							}
						]
					},
					{
						"id": "530300",
						"name": "曲靖市",
						"childs": [
							{
								"id": "530302",
								"name": "麒麟区"
							},
							{
								"id": "530321",
								"name": "马龙县"
							},
							{
								"id": "530322",
								"name": "陆良县"
							},
							{
								"id": "530323",
								"name": "师宗县"
							},
							{
								"id": "530324",
								"name": "罗平县"
							},
							{
								"id": "530325",
								"name": "富源县"
							},
							{
								"id": "530326",
								"name": "会泽县"
							},
							{
								"id": "530328",
								"name": "沾益县"
							},
							{
								"id": "530381",
								"name": "宣威市"
							}
						]
					},
					{
						"id": "530400",
						"name": "玉溪市",
						"childs": [
							{
								"id": "530402",
								"name": "红塔区"
							},
							{
								"id": "530421",
								"name": "江川县"
							},
							{
								"id": "530422",
								"name": "澄江县"
							},
							{
								"id": "530423",
								"name": "通海县"
							},
							{
								"id": "530424",
								"name": "华宁县"
							},
							{
								"id": "530425",
								"name": "易门县"
							},
							{
								"id": "530426",
								"name": "峨山彝族自治县"
							},
							{
								"id": "530427",
								"name": "新平彝族傣族自治县"
							},
							{
								"id": "530428",
								"name": "元江哈尼族彝族傣族自治县"
							}
						]
					},
					{
						"id": "530500",
						"name": "保山市",
						"childs": [
							{
								"id": "530502",
								"name": "隆阳区"
							},
							{
								"id": "530521",
								"name": "施甸县"
							},
							{
								"id": "530522",
								"name": "腾冲县"
							},
							{
								"id": "530523",
								"name": "龙陵县"
							},
							{
								"id": "530524",
								"name": "昌宁县"
							}
						]
					},
					{
						"id": "530600",
						"name": "昭通市",
						"childs": [
							{
								"id": "530602",
								"name": "昭阳区"
							},
							{
								"id": "530621",
								"name": "鲁甸县"
							},
							{
								"id": "530622",
								"name": "巧家县"
							},
							{
								"id": "530623",
								"name": "盐津县"
							},
							{
								"id": "530624",
								"name": "大关县"
							},
							{
								"id": "530625",
								"name": "永善县"
							},
							{
								"id": "530626",
								"name": "绥江县"
							},
							{
								"id": "530627",
								"name": "镇雄县"
							},
							{
								"id": "530628",
								"name": "彝良县"
							},
							{
								"id": "530629",
								"name": "威信县"
							},
							{
								"id": "530630",
								"name": "水富县"
							}
						]
					},
					{
						"id": "530700",
						"name": "丽江市",
						"childs": [
							{
								"id": "530702",
								"name": "古城区"
							},
							{
								"id": "530721",
								"name": "玉龙纳西族自治县"
							},
							{
								"id": "530722",
								"name": "永胜县"
							},
							{
								"id": "530723",
								"name": "华坪县"
							},
							{
								"id": "530724",
								"name": "宁蒗彝族自治县"
							}
						]
					},
					{
						"id": "530800",
						"name": "普洱市",
						"childs": [
							{
								"id": "530802",
								"name": "思茅区"
							},
							{
								"id": "530821",
								"name": "宁洱哈尼族彝族自治县"
							},
							{
								"id": "530822",
								"name": "墨江哈尼族自治县"
							},
							{
								"id": "530823",
								"name": "景东彝族自治县"
							},
							{
								"id": "530824",
								"name": "景谷傣族彝族自治县"
							},
							{
								"id": "530825",
								"name": "镇沅彝族哈尼族拉祜族自治县"
							},
							{
								"id": "530826",
								"name": "江城哈尼族彝族自治县"
							},
							{
								"id": "530827",
								"name": "孟连傣族拉祜族佤族自治县"
							},
							{
								"id": "530828",
								"name": "澜沧拉祜族自治县"
							},
							{
								"id": "530829",
								"name": "西盟佤族自治县"
							}
						]
					},
					{
						"id": "530900",
						"name": "临沧市",
						"childs": [
							{
								"id": "530902",
								"name": "临翔区"
							},
							{
								"id": "530921",
								"name": "凤庆县"
							},
							{
								"id": "530922",
								"name": "云县"
							},
							{
								"id": "530923",
								"name": "永德县"
							},
							{
								"id": "530924",
								"name": "镇康县"
							},
							{
								"id": "530925",
								"name": "双江拉祜族佤族布朗族傣族自治县"
							},
							{
								"id": "530926",
								"name": "耿马傣族佤族自治县"
							},
							{
								"id": "530927",
								"name": "沧源佤族自治县"
							}
						]
					},
					{
						"id": "532300",
						"name": "楚雄彝族自治州",
						"childs": [
							{
								"id": "532301",
								"name": "楚雄市"
							},
							{
								"id": "532322",
								"name": "双柏县"
							},
							{
								"id": "532323",
								"name": "牟定县"
							},
							{
								"id": "532324",
								"name": "南华县"
							},
							{
								"id": "532325",
								"name": "姚安县"
							},
							{
								"id": "532326",
								"name": "大姚县"
							},
							{
								"id": "532327",
								"name": "永仁县"
							},
							{
								"id": "532328",
								"name": "元谋县"
							},
							{
								"id": "532329",
								"name": "武定县"
							},
							{
								"id": "532331",
								"name": "禄丰县"
							}
						]
					},
					{
						"id": "532500",
						"name": "红河哈尼族彝族自治州",
						"childs": [
							{
								"id": "532501",
								"name": "个旧市"
							},
							{
								"id": "532502",
								"name": "开远市"
							},
							{
								"id": "532503",
								"name": "蒙自市"
							},
							{
								"id": "532504",
								"name": "弥勒市"
							},
							{
								"id": "532523",
								"name": "屏边苗族自治县"
							},
							{
								"id": "532524",
								"name": "建水县"
							},
							{
								"id": "532525",
								"name": "石屏县"
							},
							{
								"id": "532527",
								"name": "泸西县"
							},
							{
								"id": "532528",
								"name": "元阳县"
							},
							{
								"id": "532529",
								"name": "红河县"
							},
							{
								"id": "532530",
								"name": "金平苗族瑶族傣族自治县"
							},
							{
								"id": "532531",
								"name": "绿春县"
							},
							{
								"id": "532532",
								"name": "河口瑶族自治县"
							}
						]
					},
					{
						"id": "532600",
						"name": "文山壮族苗族自治州",
						"childs": [
							{
								"id": "532601",
								"name": "文山市"
							},
							{
								"id": "532622",
								"name": "砚山县"
							},
							{
								"id": "532623",
								"name": "西畴县"
							},
							{
								"id": "532624",
								"name": "麻栗坡县"
							},
							{
								"id": "532625",
								"name": "马关县"
							},
							{
								"id": "532626",
								"name": "丘北县"
							},
							{
								"id": "532627",
								"name": "广南县"
							},
							{
								"id": "532628",
								"name": "富宁县"
							}
						]
					},
					{
						"id": "532800",
						"name": "西双版纳傣族自治州",
						"childs": [
							{
								"id": "532801",
								"name": "景洪市"
							},
							{
								"id": "532822",
								"name": "勐海县"
							},
							{
								"id": "532823",
								"name": "勐腊县"
							}
						]
					},
					{
						"id": "532900",
						"name": "大理白族自治州",
						"childs": [
							{
								"id": "532901",
								"name": "大理市"
							},
							{
								"id": "532922",
								"name": "漾濞彝族自治县"
							},
							{
								"id": "532923",
								"name": "祥云县"
							},
							{
								"id": "532924",
								"name": "宾川县"
							},
							{
								"id": "532925",
								"name": "弥渡县"
							},
							{
								"id": "532926",
								"name": "南涧彝族自治县"
							},
							{
								"id": "532927",
								"name": "巍山彝族回族自治县"
							},
							{
								"id": "532928",
								"name": "永平县"
							},
							{
								"id": "532929",
								"name": "云龙县"
							},
							{
								"id": "532930",
								"name": "洱源县"
							},
							{
								"id": "532931",
								"name": "剑川县"
							},
							{
								"id": "532932",
								"name": "鹤庆县"
							}
						]
					},
					{
						"id": "533100",
						"name": "德宏傣族景颇族自治州",
						"childs": [
							{
								"id": "533102",
								"name": "瑞丽市"
							},
							{
								"id": "533103",
								"name": "芒市"
							},
							{
								"id": "533122",
								"name": "梁河县"
							},
							{
								"id": "533123",
								"name": "盈江县"
							},
							{
								"id": "533124",
								"name": "陇川县"
							}
						]
					},
					{
						"id": "533300",
						"name": "怒江傈僳族自治州",
						"childs": [
							{
								"id": "533321",
								"name": "泸水县"
							},
							{
								"id": "533323",
								"name": "福贡县"
							},
							{
								"id": "533324",
								"name": "贡山独龙族怒族自治县"
							},
							{
								"id": "533325",
								"name": "兰坪白族普米族自治县"
							}
						]
					},
					{
						"id": "533400",
						"name": "迪庆藏族自治州",
						"childs": [
							{
								"id": "533421",
								"name": "香格里拉市"
							},
							{
								"id": "533422",
								"name": "德钦县"
							},
							{
								"id": "533423",
								"name": "维西傈僳族自治县"
							}
						]
					}
				]
			},
			{
				"id": "540000",
				"name": "西藏自治区",
				"type": 0,
				"childs": [
					{
						"id": "540100",
						"name": "拉萨市",
						"childs": [
							{
								"id": "540102",
								"name": "城关区"
							},
							{
								"id": "540121",
								"name": "林周县"
							},
							{
								"id": "540122",
								"name": "当雄县"
							},
							{
								"id": "540123",
								"name": "尼木县"
							},
							{
								"id": "540124",
								"name": "曲水县"
							},
							{
								"id": "540125",
								"name": "堆龙德庆县"
							},
							{
								"id": "540126",
								"name": "达孜县"
							},
							{
								"id": "540127",
								"name": "墨竹工卡县"
							}
						]
					},
					{
						"id": "540200",
						"name": "日喀则市",
						"childs": [
							{
								"id": "540202",
								"name": "桑珠孜区"
							},
							{
								"id": "540221",
								"name": "南木林县"
							},
							{
								"id": "540222",
								"name": "江孜县"
							},
							{
								"id": "540223",
								"name": "定日县"
							},
							{
								"id": "540224",
								"name": "萨迦县"
							},
							{
								"id": "540225",
								"name": "拉孜县"
							},
							{
								"id": "540226",
								"name": "昂仁县"
							},
							{
								"id": "540227",
								"name": "谢通门县"
							},
							{
								"id": "540228",
								"name": "白朗县"
							},
							{
								"id": "540229",
								"name": "仁布县"
							},
							{
								"id": "540230",
								"name": "康马县"
							},
							{
								"id": "540231",
								"name": "定结县"
							},
							{
								"id": "540232",
								"name": "仲巴县"
							},
							{
								"id": "540233",
								"name": "亚东县"
							},
							{
								"id": "540234",
								"name": "吉隆县"
							},
							{
								"id": "540235",
								"name": "聂拉木县"
							},
							{
								"id": "540236",
								"name": "萨嘎县"
							},
							{
								"id": "540237",
								"name": "岗巴县"
							}
						]
					},
					{
						"id": "540300",
						"name": "昌都市",
						"childs": [
							{
								"id": "540302",
								"name": "卡若区"
							},
							{
								"id": "540321",
								"name": "江达县"
							},
							{
								"id": "540322",
								"name": "贡觉县"
							},
							{
								"id": "540323",
								"name": "类乌齐县"
							},
							{
								"id": "540324",
								"name": "丁青县"
							},
							{
								"id": "540325",
								"name": "察雅县"
							},
							{
								"id": "540326",
								"name": "八宿县"
							},
							{
								"id": "540327",
								"name": "左贡县"
							},
							{
								"id": "540328",
								"name": "芒康县"
							},
							{
								"id": "540329",
								"name": "洛隆县"
							},
							{
								"id": "540330",
								"name": "边坝县"
							}
						]
					},
					{
						"id": "542200",
						"name": "山南地区",
						"childs": [
							{
								"id": "542221",
								"name": "乃东县"
							},
							{
								"id": "542222",
								"name": "扎囊县"
							},
							{
								"id": "542223",
								"name": "贡嘎县"
							},
							{
								"id": "542224",
								"name": "桑日县"
							},
							{
								"id": "542225",
								"name": "琼结县"
							},
							{
								"id": "542226",
								"name": "曲松县"
							},
							{
								"id": "542227",
								"name": "措美县"
							},
							{
								"id": "542228",
								"name": "洛扎县"
							},
							{
								"id": "542229",
								"name": "加查县"
							},
							{
								"id": "542231",
								"name": "隆子县"
							},
							{
								"id": "542232",
								"name": "错那县"
							},
							{
								"id": "542233",
								"name": "浪卡子县"
							}
						]
					},
					{
						"id": "542400",
						"name": "那曲地区",
						"childs": [
							{
								"id": "542421",
								"name": "那曲县"
							},
							{
								"id": "542422",
								"name": "嘉黎县"
							},
							{
								"id": "542423",
								"name": "比如县"
							},
							{
								"id": "542424",
								"name": "聂荣县"
							},
							{
								"id": "542425",
								"name": "安多县"
							},
							{
								"id": "542426",
								"name": "申扎县"
							},
							{
								"id": "542427",
								"name": "索县"
							},
							{
								"id": "542428",
								"name": "班戈县"
							},
							{
								"id": "542429",
								"name": "巴青县"
							},
							{
								"id": "542430",
								"name": "尼玛县"
							},
							{
								"id": "542431",
								"name": "双湖县"
							}
						]
					},
					{
						"id": "542500",
						"name": "阿里地区",
						"childs": [
							{
								"id": "542521",
								"name": "普兰县"
							},
							{
								"id": "542522",
								"name": "札达县"
							},
							{
								"id": "542523",
								"name": "噶尔县"
							},
							{
								"id": "542524",
								"name": "日土县"
							},
							{
								"id": "542525",
								"name": "革吉县"
							},
							{
								"id": "542526",
								"name": "改则县"
							},
							{
								"id": "542527",
								"name": "措勤县"
							}
						]
					},
					{
						"id": "542600",
						"name": "林芝地区",
						"childs": [
							{
								"id": "542621",
								"name": "林芝县"
							},
							{
								"id": "542622",
								"name": "工布江达县"
							},
							{
								"id": "542623",
								"name": "米林县"
							},
							{
								"id": "542624",
								"name": "墨脱县"
							},
							{
								"id": "542625",
								"name": "波密县"
							},
							{
								"id": "542626",
								"name": "察隅县"
							},
							{
								"id": "542627",
								"name": "朗县"
							}
						]
					}
				]
			},
			{
				"id": "610000",
				"name": "陕西省",
				"type": 0,
				"childs": [
					{
						"id": "610100",
						"name": "西安市",
						"childs": [
							{
								"id": "610102",
								"name": "新城区"
							},
							{
								"id": "610103",
								"name": "碑林区"
							},
							{
								"id": "610104",
								"name": "莲湖区"
							},
							{
								"id": "610111",
								"name": "灞桥区"
							},
							{
								"id": "610112",
								"name": "未央区"
							},
							{
								"id": "610113",
								"name": "雁塔区"
							},
							{
								"id": "610114",
								"name": "阎良区"
							},
							{
								"id": "610115",
								"name": "临潼区"
							},
							{
								"id": "610116",
								"name": "长安区"
							},
							{
								"id": "610122",
								"name": "蓝田县"
							},
							{
								"id": "610124",
								"name": "周至县"
							},
							{
								"id": "610125",
								"name": "户县"
							},
							{
								"id": "610126",
								"name": "高陵区"
							}
						]
					},
					{
						"id": "610200",
						"name": "铜川市",
						"childs": [
							{
								"id": "610202",
								"name": "王益区"
							},
							{
								"id": "610203",
								"name": "印台区"
							},
							{
								"id": "610204",
								"name": "耀州区"
							},
							{
								"id": "610222",
								"name": "宜君县"
							}
						]
					},
					{
						"id": "610300",
						"name": "宝鸡市",
						"childs": [
							{
								"id": "610302",
								"name": "渭滨区"
							},
							{
								"id": "610303",
								"name": "金台区"
							},
							{
								"id": "610304",
								"name": "陈仓区"
							},
							{
								"id": "610322",
								"name": "凤翔县"
							},
							{
								"id": "610323",
								"name": "岐山县"
							},
							{
								"id": "610324",
								"name": "扶风县"
							},
							{
								"id": "610326",
								"name": "眉县"
							},
							{
								"id": "610327",
								"name": "陇县"
							},
							{
								"id": "610328",
								"name": "千阳县"
							},
							{
								"id": "610329",
								"name": "麟游县"
							},
							{
								"id": "610330",
								"name": "凤县"
							},
							{
								"id": "610331",
								"name": "太白县"
							}
						]
					},
					{
						"id": "610400",
						"name": "咸阳市",
						"childs": [
							{
								"id": "610402",
								"name": "秦都区"
							},
							{
								"id": "610403",
								"name": "杨陵区"
							},
							{
								"id": "610404",
								"name": "渭城区"
							},
							{
								"id": "610422",
								"name": "三原县"
							},
							{
								"id": "610423",
								"name": "泾阳县"
							},
							{
								"id": "610424",
								"name": "乾县"
							},
							{
								"id": "610425",
								"name": "礼泉县"
							},
							{
								"id": "610426",
								"name": "永寿县"
							},
							{
								"id": "610427",
								"name": "彬县"
							},
							{
								"id": "610428",
								"name": "长武县"
							},
							{
								"id": "610429",
								"name": "旬邑县"
							},
							{
								"id": "610430",
								"name": "淳化县"
							},
							{
								"id": "610431",
								"name": "武功县"
							},
							{
								"id": "610481",
								"name": "兴平市"
							}
						]
					},
					{
						"id": "610500",
						"name": "渭南市",
						"childs": [
							{
								"id": "610502",
								"name": "临渭区"
							},
							{
								"id": "610521",
								"name": "华县"
							},
							{
								"id": "610522",
								"name": "潼关县"
							},
							{
								"id": "610523",
								"name": "大荔县"
							},
							{
								"id": "610524",
								"name": "合阳县"
							},
							{
								"id": "610525",
								"name": "澄城县"
							},
							{
								"id": "610526",
								"name": "蒲城县"
							},
							{
								"id": "610527",
								"name": "白水县"
							},
							{
								"id": "610528",
								"name": "富平县"
							},
							{
								"id": "610581",
								"name": "韩城市"
							},
							{
								"id": "610582",
								"name": "华阴市"
							}
						]
					},
					{
						"id": "610600",
						"name": "延安市",
						"childs": [
							{
								"id": "610602",
								"name": "宝塔区"
							},
							{
								"id": "610621",
								"name": "延长县"
							},
							{
								"id": "610622",
								"name": "延川县"
							},
							{
								"id": "610623",
								"name": "子长县"
							},
							{
								"id": "610624",
								"name": "安塞县"
							},
							{
								"id": "610625",
								"name": "志丹县"
							},
							{
								"id": "610626",
								"name": "吴起县"
							},
							{
								"id": "610627",
								"name": "甘泉县"
							},
							{
								"id": "610628",
								"name": "富县"
							},
							{
								"id": "610629",
								"name": "洛川县"
							},
							{
								"id": "610630",
								"name": "宜川县"
							},
							{
								"id": "610631",
								"name": "黄龙县"
							},
							{
								"id": "610632",
								"name": "黄陵县"
							}
						]
					},
					{
						"id": "610700",
						"name": "汉中市",
						"childs": [
							{
								"id": "610702",
								"name": "汉台区"
							},
							{
								"id": "610721",
								"name": "南郑县"
							},
							{
								"id": "610722",
								"name": "城固县"
							},
							{
								"id": "610723",
								"name": "洋县"
							},
							{
								"id": "610724",
								"name": "西乡县"
							},
							{
								"id": "610725",
								"name": "勉县"
							},
							{
								"id": "610726",
								"name": "宁强县"
							},
							{
								"id": "610727",
								"name": "略阳县"
							},
							{
								"id": "610728",
								"name": "镇巴县"
							},
							{
								"id": "610729",
								"name": "留坝县"
							},
							{
								"id": "610730",
								"name": "佛坪县"
							}
						]
					},
					{
						"id": "610800",
						"name": "榆林市",
						"childs": [
							{
								"id": "610802",
								"name": "榆阳区"
							},
							{
								"id": "610821",
								"name": "神木县"
							},
							{
								"id": "610822",
								"name": "府谷县"
							},
							{
								"id": "610823",
								"name": "横山县"
							},
							{
								"id": "610824",
								"name": "靖边县"
							},
							{
								"id": "610825",
								"name": "定边县"
							},
							{
								"id": "610826",
								"name": "绥德县"
							},
							{
								"id": "610827",
								"name": "米脂县"
							},
							{
								"id": "610828",
								"name": "佳县"
							},
							{
								"id": "610829",
								"name": "吴堡县"
							},
							{
								"id": "610830",
								"name": "清涧县"
							},
							{
								"id": "610831",
								"name": "子洲县"
							}
						]
					},
					{
						"id": "610900",
						"name": "安康市",
						"childs": [
							{
								"id": "610902",
								"name": "汉滨区"
							},
							{
								"id": "610921",
								"name": "汉阴县"
							},
							{
								"id": "610922",
								"name": "石泉县"
							},
							{
								"id": "610923",
								"name": "宁陕县"
							},
							{
								"id": "610924",
								"name": "紫阳县"
							},
							{
								"id": "610925",
								"name": "岚皋县"
							},
							{
								"id": "610926",
								"name": "平利县"
							},
							{
								"id": "610927",
								"name": "镇坪县"
							},
							{
								"id": "610928",
								"name": "旬阳县"
							},
							{
								"id": "610929",
								"name": "白河县"
							}
						]
					},
					{
						"id": "611000",
						"name": "商洛市",
						"childs": [
							{
								"id": "611002",
								"name": "商州区"
							},
							{
								"id": "611021",
								"name": "洛南县"
							},
							{
								"id": "611022",
								"name": "丹凤县"
							},
							{
								"id": "611023",
								"name": "商南县"
							},
							{
								"id": "611024",
								"name": "山阳县"
							},
							{
								"id": "611025",
								"name": "镇安县"
							},
							{
								"id": "611026",
								"name": "柞水县"
							}
						]
					},
					{
						"id": "611100",
						"name": "西咸新区",
						"childs": [
							{
								"id": "611101",
								"name": "空港新城"
							},
							{
								"id": "611102",
								"name": "沣东新城"
							},
							{
								"id": "611103",
								"name": "秦汉新城"
							},
							{
								"id": "611104",
								"name": "沣西新城"
							},
							{
								"id": "611105",
								"name": "泾河新城"
							}
						]
					}
				]
			},
			{
				"id": "620000",
				"name": "甘肃省",
				"type": 0,
				"childs": [
					{
						"id": "620100",
						"name": "兰州市",
						"childs": [
							{
								"id": "620102",
								"name": "城关区"
							},
							{
								"id": "620103",
								"name": "七里河区"
							},
							{
								"id": "620104",
								"name": "西固区"
							},
							{
								"id": "620105",
								"name": "安宁区"
							},
							{
								"id": "620111",
								"name": "红古区"
							},
							{
								"id": "620121",
								"name": "永登县"
							},
							{
								"id": "620122",
								"name": "皋兰县"
							},
							{
								"id": "620123",
								"name": "榆中县"
							}
						]
					},
					{
						"id": "620200",
						"name": "嘉峪关市",
						"childs": [
							{
								"id": "620201",
								"name": "雄关区"
							},
							{
								"id": "620202",
								"name": "长城区"
							},
							{
								"id": "620203",
								"name": "镜铁区"
							}
						]
					},
					{
						"id": "620300",
						"name": "金昌市",
						"childs": [
							{
								"id": "620302",
								"name": "金川区"
							},
							{
								"id": "620321",
								"name": "永昌县"
							}
						]
					},
					{
						"id": "620400",
						"name": "白银市",
						"childs": [
							{
								"id": "620402",
								"name": "白银区"
							},
							{
								"id": "620403",
								"name": "平川区"
							},
							{
								"id": "620421",
								"name": "靖远县"
							},
							{
								"id": "620422",
								"name": "会宁县"
							},
							{
								"id": "620423",
								"name": "景泰县"
							}
						]
					},
					{
						"id": "620500",
						"name": "天水市",
						"childs": [
							{
								"id": "620502",
								"name": "秦州区"
							},
							{
								"id": "620503",
								"name": "麦积区"
							},
							{
								"id": "620521",
								"name": "清水县"
							},
							{
								"id": "620522",
								"name": "秦安县"
							},
							{
								"id": "620523",
								"name": "甘谷县"
							},
							{
								"id": "620524",
								"name": "武山县"
							},
							{
								"id": "620525",
								"name": "张家川回族自治县"
							}
						]
					},
					{
						"id": "620600",
						"name": "武威市",
						"childs": [
							{
								"id": "620602",
								"name": "凉州区"
							},
							{
								"id": "620621",
								"name": "民勤县"
							},
							{
								"id": "620622",
								"name": "古浪县"
							},
							{
								"id": "620623",
								"name": "天祝藏族自治县"
							}
						]
					},
					{
						"id": "620700",
						"name": "张掖市",
						"childs": [
							{
								"id": "620702",
								"name": "甘州区"
							},
							{
								"id": "620721",
								"name": "肃南裕固族自治县"
							},
							{
								"id": "620722",
								"name": "民乐县"
							},
							{
								"id": "620723",
								"name": "临泽县"
							},
							{
								"id": "620724",
								"name": "高台县"
							},
							{
								"id": "620725",
								"name": "山丹县"
							}
						]
					},
					{
						"id": "620800",
						"name": "平凉市",
						"childs": [
							{
								"id": "620802",
								"name": "崆峒区"
							},
							{
								"id": "620821",
								"name": "泾川县"
							},
							{
								"id": "620822",
								"name": "灵台县"
							},
							{
								"id": "620823",
								"name": "崇信县"
							},
							{
								"id": "620824",
								"name": "华亭县"
							},
							{
								"id": "620825",
								"name": "庄浪县"
							},
							{
								"id": "620826",
								"name": "静宁县"
							}
						]
					},
					{
						"id": "620900",
						"name": "酒泉市",
						"childs": [
							{
								"id": "620902",
								"name": "肃州区"
							},
							{
								"id": "620921",
								"name": "金塔县"
							},
							{
								"id": "620922",
								"name": "瓜州县"
							},
							{
								"id": "620923",
								"name": "肃北蒙古族自治县"
							},
							{
								"id": "620924",
								"name": "阿克塞哈萨克族自治县"
							},
							{
								"id": "620981",
								"name": "玉门市"
							},
							{
								"id": "620982",
								"name": "敦煌市"
							}
						]
					},
					{
						"id": "621000",
						"name": "庆阳市",
						"childs": [
							{
								"id": "621002",
								"name": "西峰区"
							},
							{
								"id": "621021",
								"name": "庆城县"
							},
							{
								"id": "621022",
								"name": "环县"
							},
							{
								"id": "621023",
								"name": "华池县"
							},
							{
								"id": "621024",
								"name": "合水县"
							},
							{
								"id": "621025",
								"name": "正宁县"
							},
							{
								"id": "621026",
								"name": "宁县"
							},
							{
								"id": "621027",
								"name": "镇原县"
							}
						]
					},
					{
						"id": "621100",
						"name": "定西市",
						"childs": [
							{
								"id": "621102",
								"name": "安定区"
							},
							{
								"id": "621121",
								"name": "通渭县"
							},
							{
								"id": "621122",
								"name": "陇西县"
							},
							{
								"id": "621123",
								"name": "渭源县"
							},
							{
								"id": "621124",
								"name": "临洮县"
							},
							{
								"id": "621125",
								"name": "漳县"
							},
							{
								"id": "621126",
								"name": "岷县"
							}
						]
					},
					{
						"id": "621200",
						"name": "陇南市",
						"childs": [
							{
								"id": "621202",
								"name": "武都区"
							},
							{
								"id": "621221",
								"name": "成县"
							},
							{
								"id": "621222",
								"name": "文县"
							},
							{
								"id": "621223",
								"name": "宕昌县"
							},
							{
								"id": "621224",
								"name": "康县"
							},
							{
								"id": "621225",
								"name": "西和县"
							},
							{
								"id": "621226",
								"name": "礼县"
							},
							{
								"id": "621227",
								"name": "徽县"
							},
							{
								"id": "621228",
								"name": "两当县"
							}
						]
					},
					{
						"id": "622900",
						"name": "临夏回族自治州",
						"childs": [
							{
								"id": "622901",
								"name": "临夏市"
							},
							{
								"id": "622921",
								"name": "临夏县"
							},
							{
								"id": "622922",
								"name": "康乐县"
							},
							{
								"id": "622923",
								"name": "永靖县"
							},
							{
								"id": "622924",
								"name": "广河县"
							},
							{
								"id": "622925",
								"name": "和政县"
							},
							{
								"id": "622926",
								"name": "东乡族自治县"
							},
							{
								"id": "622927",
								"name": "积石山保安族东乡族撒拉族自治县"
							}
						]
					},
					{
						"id": "623000",
						"name": "甘南藏族自治州",
						"childs": [
							{
								"id": "623001",
								"name": "合作市"
							},
							{
								"id": "623021",
								"name": "临潭县"
							},
							{
								"id": "623022",
								"name": "卓尼县"
							},
							{
								"id": "623023",
								"name": "舟曲县"
							},
							{
								"id": "623024",
								"name": "迭部县"
							},
							{
								"id": "623025",
								"name": "玛曲县"
							},
							{
								"id": "623026",
								"name": "碌曲县"
							},
							{
								"id": "623027",
								"name": "夏河县"
							}
						]
					}
				]
			},
			{
				"id": "630000",
				"name": "青海省",
				"type": 0,
				"childs": [
					{
						"id": "630100",
						"name": "西宁市",
						"childs": [
							{
								"id": "630102",
								"name": "城东区"
							},
							{
								"id": "630103",
								"name": "城中区"
							},
							{
								"id": "630104",
								"name": "城西区"
							},
							{
								"id": "630105",
								"name": "城北区"
							},
							{
								"id": "630121",
								"name": "大通回族土族自治县"
							},
							{
								"id": "630122",
								"name": "湟中县"
							},
							{
								"id": "630123",
								"name": "湟源县"
							}
						]
					},
					{
						"id": "630200",
						"name": "海东市",
						"childs": [
							{
								"id": "630202",
								"name": "乐都区"
							},
							{
								"id": "630221",
								"name": "平安县"
							},
							{
								"id": "630222",
								"name": "民和回族土族自治县"
							},
							{
								"id": "630223",
								"name": "互助土族自治县"
							},
							{
								"id": "630224",
								"name": "化隆回族自治县"
							},
							{
								"id": "630225",
								"name": "循化撒拉族自治县"
							}
						]
					},
					{
						"id": "632200",
						"name": "海北藏族自治州",
						"childs": [
							{
								"id": "632221",
								"name": "门源回族自治县"
							},
							{
								"id": "632222",
								"name": "祁连县"
							},
							{
								"id": "632223",
								"name": "海晏县"
							},
							{
								"id": "632224",
								"name": "刚察县"
							}
						]
					},
					{
						"id": "632300",
						"name": "黄南藏族自治州",
						"childs": [
							{
								"id": "632321",
								"name": "同仁县"
							},
							{
								"id": "632322",
								"name": "尖扎县"
							},
							{
								"id": "632323",
								"name": "泽库县"
							},
							{
								"id": "632324",
								"name": "河南蒙古族自治县"
							}
						]
					},
					{
						"id": "632500",
						"name": "海南藏族自治州",
						"childs": [
							{
								"id": "632521",
								"name": "共和县"
							},
							{
								"id": "632522",
								"name": "同德县"
							},
							{
								"id": "632523",
								"name": "贵德县"
							},
							{
								"id": "632524",
								"name": "兴海县"
							},
							{
								"id": "632525",
								"name": "贵南县"
							}
						]
					},
					{
						"id": "632600",
						"name": "果洛藏族自治州",
						"childs": [
							{
								"id": "632621",
								"name": "玛沁县"
							},
							{
								"id": "632622",
								"name": "班玛县"
							},
							{
								"id": "632623",
								"name": "甘德县"
							},
							{
								"id": "632624",
								"name": "达日县"
							},
							{
								"id": "632625",
								"name": "久治县"
							},
							{
								"id": "632626",
								"name": "玛多县"
							}
						]
					},
					{
						"id": "632700",
						"name": "玉树藏族自治州",
						"childs": [
							{
								"id": "632701",
								"name": "玉树市"
							},
							{
								"id": "632722",
								"name": "杂多县"
							},
							{
								"id": "632723",
								"name": "称多县"
							},
							{
								"id": "632724",
								"name": "治多县"
							},
							{
								"id": "632725",
								"name": "囊谦县"
							},
							{
								"id": "632726",
								"name": "曲麻莱县"
							}
						]
					},
					{
						"id": "632800",
						"name": "海西蒙古族藏族自治州",
						"childs": [
							{
								"id": "632801",
								"name": "格尔木市"
							},
							{
								"id": "632802",
								"name": "德令哈市"
							},
							{
								"id": "632821",
								"name": "乌兰县"
							},
							{
								"id": "632822",
								"name": "都兰县"
							},
							{
								"id": "632823",
								"name": "天峻县"
							}
						]
					}
				]
			},
			{
				"id": "640000",
				"name": "宁夏回族自治区",
				"type": 0,
				"childs": [
					{
						"id": "640100",
						"name": "银川市",
						"childs": [
							{
								"id": "640104",
								"name": "兴庆区"
							},
							{
								"id": "640105",
								"name": "西夏区"
							},
							{
								"id": "640106",
								"name": "金凤区"
							},
							{
								"id": "640121",
								"name": "永宁县"
							},
							{
								"id": "640122",
								"name": "贺兰县"
							},
							{
								"id": "640181",
								"name": "灵武市"
							}
						]
					},
					{
						"id": "640200",
						"name": "石嘴山市",
						"childs": [
							{
								"id": "640202",
								"name": "大武口区"
							},
							{
								"id": "640205",
								"name": "惠农区"
							},
							{
								"id": "640221",
								"name": "平罗县"
							}
						]
					},
					{
						"id": "640300",
						"name": "吴忠市",
						"childs": [
							{
								"id": "640302",
								"name": "利通区"
							},
							{
								"id": "640303",
								"name": "红寺堡区"
							},
							{
								"id": "640323",
								"name": "盐池县"
							},
							{
								"id": "640324",
								"name": "同心县"
							},
							{
								"id": "640381",
								"name": "青铜峡市"
							}
						]
					},
					{
						"id": "640400",
						"name": "固原市",
						"childs": [
							{
								"id": "640402",
								"name": "原州区"
							},
							{
								"id": "640422",
								"name": "西吉县"
							},
							{
								"id": "640423",
								"name": "隆德县"
							},
							{
								"id": "640424",
								"name": "泾源县"
							},
							{
								"id": "640425",
								"name": "彭阳县"
							}
						]
					},
					{
						"id": "640500",
						"name": "中卫市",
						"childs": [
							{
								"id": "640502",
								"name": "沙坡头区"
							},
							{
								"id": "640521",
								"name": "中宁县"
							},
							{
								"id": "640522",
								"name": "海原县"
							}
						]
					}
				]
			},
			{
				"id": "650000",
				"name": "新疆维吾尔自治区",
				"type": 0,
				"childs": [
					{
						"id": "650100",
						"name": "乌鲁木齐市",
						"childs": [
							{
								"id": "650102",
								"name": "天山区"
							},
							{
								"id": "650103",
								"name": "沙依巴克区"
							},
							{
								"id": "650104",
								"name": "新市区"
							},
							{
								"id": "650105",
								"name": "水磨沟区"
							},
							{
								"id": "650106",
								"name": "头屯河区"
							},
							{
								"id": "650107",
								"name": "达坂城区"
							},
							{
								"id": "650109",
								"name": "米东区"
							},
							{
								"id": "650121",
								"name": "乌鲁木齐县"
							}
						]
					},
					{
						"id": "650200",
						"name": "克拉玛依市",
						"childs": [
							{
								"id": "650202",
								"name": "独山子区"
							},
							{
								"id": "650203",
								"name": "克拉玛依区"
							},
							{
								"id": "650204",
								"name": "白碱滩区"
							},
							{
								"id": "650205",
								"name": "乌尔禾区"
							}
						]
					},
					{
						"id": "652100",
						"name": "吐鲁番地区",
						"childs": [
							{
								"id": "652101",
								"name": "吐鲁番市"
							},
							{
								"id": "652122",
								"name": "鄯善县"
							},
							{
								"id": "652123",
								"name": "托克逊县"
							}
						]
					},
					{
						"id": "652200",
						"name": "哈密地区",
						"childs": [
							{
								"id": "652201",
								"name": "哈密市"
							},
							{
								"id": "652222",
								"name": "巴里坤哈萨克自治县"
							},
							{
								"id": "652223",
								"name": "伊吾县"
							}
						]
					},
					{
						"id": "652300",
						"name": "昌吉回族自治州",
						"childs": [
							{
								"id": "652301",
								"name": "昌吉市"
							},
							{
								"id": "652302",
								"name": "阜康市"
							},
							{
								"id": "652323",
								"name": "呼图壁县"
							},
							{
								"id": "652324",
								"name": "玛纳斯县"
							},
							{
								"id": "652325",
								"name": "奇台县"
							},
							{
								"id": "652327",
								"name": "吉木萨尔县"
							},
							{
								"id": "652328",
								"name": "木垒哈萨克自治县"
							}
						]
					},
					{
						"id": "652700",
						"name": "博尔塔拉蒙古自治州",
						"childs": [
							{
								"id": "652701",
								"name": "博乐市"
							},
							{
								"id": "652702",
								"name": "阿拉山口市"
							},
							{
								"id": "652722",
								"name": "精河县"
							},
							{
								"id": "652723",
								"name": "温泉县"
							}
						]
					},
					{
						"id": "652800",
						"name": "巴音郭楞蒙古自治州",
						"childs": [
							{
								"id": "652801",
								"name": "库尔勒市"
							},
							{
								"id": "652822",
								"name": "轮台县"
							},
							{
								"id": "652823",
								"name": "尉犁县"
							},
							{
								"id": "652824",
								"name": "若羌县"
							},
							{
								"id": "652825",
								"name": "且末县"
							},
							{
								"id": "652826",
								"name": "焉耆回族自治县"
							},
							{
								"id": "652827",
								"name": "和静县"
							},
							{
								"id": "652828",
								"name": "和硕县"
							},
							{
								"id": "652829",
								"name": "博湖县"
							}
						]
					},
					{
						"id": "652900",
						"name": "阿克苏地区",
						"childs": [
							{
								"id": "652901",
								"name": "阿克苏市"
							},
							{
								"id": "652922",
								"name": "温宿县"
							},
							{
								"id": "652923",
								"name": "库车县"
							},
							{
								"id": "652924",
								"name": "沙雅县"
							},
							{
								"id": "652925",
								"name": "新和县"
							},
							{
								"id": "652926",
								"name": "拜城县"
							},
							{
								"id": "652927",
								"name": "乌什县"
							},
							{
								"id": "652928",
								"name": "阿瓦提县"
							},
							{
								"id": "652929",
								"name": "柯坪县"
							}
						]
					},
					{
						"id": "653000",
						"name": "克孜勒苏柯尔克孜自治州",
						"childs": [
							{
								"id": "653001",
								"name": "阿图什市"
							},
							{
								"id": "653022",
								"name": "阿克陶县"
							},
							{
								"id": "653023",
								"name": "阿合奇县"
							},
							{
								"id": "653024",
								"name": "乌恰县"
							}
						]
					},
					{
						"id": "653100",
						"name": "喀什地区",
						"childs": [
							{
								"id": "653101",
								"name": "喀什市"
							},
							{
								"id": "653121",
								"name": "疏附县"
							},
							{
								"id": "653122",
								"name": "疏勒县"
							},
							{
								"id": "653123",
								"name": "英吉沙县"
							},
							{
								"id": "653124",
								"name": "泽普县"
							},
							{
								"id": "653125",
								"name": "莎车县"
							},
							{
								"id": "653126",
								"name": "叶城县"
							},
							{
								"id": "653127",
								"name": "麦盖提县"
							},
							{
								"id": "653128",
								"name": "岳普湖县"
							},
							{
								"id": "653129",
								"name": "伽师县"
							},
							{
								"id": "653130",
								"name": "巴楚县"
							},
							{
								"id": "653131",
								"name": "塔什库尔干塔吉克自治县"
							}
						]
					},
					{
						"id": "653200",
						"name": "和田地区",
						"childs": [
							{
								"id": "653201",
								"name": "和田市"
							},
							{
								"id": "653221",
								"name": "和田县"
							},
							{
								"id": "653222",
								"name": "墨玉县"
							},
							{
								"id": "653223",
								"name": "皮山县"
							},
							{
								"id": "653224",
								"name": "洛浦县"
							},
							{
								"id": "653225",
								"name": "策勒县"
							},
							{
								"id": "653226",
								"name": "于田县"
							},
							{
								"id": "653227",
								"name": "民丰县"
							}
						]
					},
					{
						"id": "654000",
						"name": "伊犁哈萨克自治州",
						"childs": [
							{
								"id": "654002",
								"name": "伊宁市"
							},
							{
								"id": "654003",
								"name": "奎屯市"
							},
							{
								"id": "654004",
								"name": "霍尔果斯市"
							},
							{
								"id": "654021",
								"name": "伊宁县"
							},
							{
								"id": "654022",
								"name": "察布查尔锡伯自治县"
							},
							{
								"id": "654023",
								"name": "霍城县"
							},
							{
								"id": "654024",
								"name": "巩留县"
							},
							{
								"id": "654025",
								"name": "新源县"
							},
							{
								"id": "654026",
								"name": "昭苏县"
							},
							{
								"id": "654027",
								"name": "特克斯县"
							},
							{
								"id": "654028",
								"name": "尼勒克县"
							}
						]
					},
					{
						"id": "654200",
						"name": "塔城地区",
						"childs": [
							{
								"id": "654201",
								"name": "塔城市"
							},
							{
								"id": "654202",
								"name": "乌苏市"
							},
							{
								"id": "654221",
								"name": "额敏县"
							},
							{
								"id": "654223",
								"name": "沙湾县"
							},
							{
								"id": "654224",
								"name": "托里县"
							},
							{
								"id": "654225",
								"name": "裕民县"
							},
							{
								"id": "654226",
								"name": "和布克赛尔蒙古自治县"
							}
						]
					},
					{
						"id": "654300",
						"name": "阿勒泰地区",
						"childs": [
							{
								"id": "654301",
								"name": "阿勒泰市"
							},
							{
								"id": "654321",
								"name": "布尔津县"
							},
							{
								"id": "654322",
								"name": "富蕴县"
							},
							{
								"id": "654323",
								"name": "福海县"
							},
							{
								"id": "654324",
								"name": "哈巴河县"
							},
							{
								"id": "654325",
								"name": "青河县"
							},
							{
								"id": "654326",
								"name": "吉木乃县"
							}
						]
					},
					{
						"id": "659000",
						"name": "直辖县级",
						"childs": [
							{
								"id": "659001",
								"name": "石河子市"
							},
							{
								"id": "659002",
								"name": "阿拉尔市"
							},
							{
								"id": "659003",
								"name": "图木舒克市"
							},
							{
								"id": "659004",
								"name": "五家渠市"
							},
							{
								"id": "659005",
								"name": "北屯市"
							},
							{
								"id": "659006",
								"name": "铁门关市"
							},
							{
								"id": "659007",
								"name": "双河市"
							}
						]
					}
				]
			},
			{
				"id": "710000",
				"name": "台湾",
				"type": 0,
				"childs": [
					{
						"id": "710100",
						"name": "台北市",
						"childs": [
							{
								"id": "710101",
								"name": "松山区"
							},
							{
								"id": "710102",
								"name": "信义区"
							},
							{
								"id": "710103",
								"name": "大安区"
							},
							{
								"id": "710104",
								"name": "中山区"
							},
							{
								"id": "710105",
								"name": "中正区"
							},
							{
								"id": "710106",
								"name": "大同区"
							},
							{
								"id": "710107",
								"name": "万华区"
							},
							{
								"id": "710108",
								"name": "文山区"
							},
							{
								"id": "710109",
								"name": "南港区"
							},
							{
								"id": "710110",
								"name": "内湖区"
							},
							{
								"id": "710111",
								"name": "士林区"
							},
							{
								"id": "710112",
								"name": "北投区"
							}
						]
					},
					{
						"id": "710200",
						"name": "高雄市",
						"childs": [
							{
								"id": "710201",
								"name": "盐埕区"
							},
							{
								"id": "710202",
								"name": "鼓山区"
							},
							{
								"id": "710203",
								"name": "左营区"
							},
							{
								"id": "710204",
								"name": "楠梓区"
							},
							{
								"id": "710205",
								"name": "三民区"
							},
							{
								"id": "710206",
								"name": "新兴区"
							},
							{
								"id": "710207",
								"name": "前金区"
							},
							{
								"id": "710208",
								"name": "苓雅区"
							},
							{
								"id": "710209",
								"name": "前镇区"
							},
							{
								"id": "710210",
								"name": "旗津区"
							},
							{
								"id": "710211",
								"name": "小港区"
							},
							{
								"id": "710212",
								"name": "凤山区"
							},
							{
								"id": "710213",
								"name": "林园区"
							},
							{
								"id": "710214",
								"name": "大寮区"
							},
							{
								"id": "710215",
								"name": "大树区"
							},
							{
								"id": "710216",
								"name": "大社区"
							},
							{
								"id": "710217",
								"name": "仁武区"
							},
							{
								"id": "710218",
								"name": "鸟松区"
							},
							{
								"id": "710219",
								"name": "冈山区"
							},
							{
								"id": "710220",
								"name": "桥头区"
							},
							{
								"id": "710221",
								"name": "燕巢区"
							},
							{
								"id": "710222",
								"name": "田寮区"
							},
							{
								"id": "710223",
								"name": "阿莲区"
							},
							{
								"id": "710224",
								"name": "路竹区"
							},
							{
								"id": "710225",
								"name": "湖内区"
							},
							{
								"id": "710226",
								"name": "茄萣区"
							},
							{
								"id": "710227",
								"name": "永安区"
							},
							{
								"id": "710228",
								"name": "弥陀区"
							},
							{
								"id": "710229",
								"name": "梓官区"
							},
							{
								"id": "710230",
								"name": "旗山区"
							},
							{
								"id": "710231",
								"name": "美浓区"
							},
							{
								"id": "710232",
								"name": "六龟区"
							},
							{
								"id": "710233",
								"name": "甲仙区"
							},
							{
								"id": "710234",
								"name": "杉林区"
							},
							{
								"id": "710235",
								"name": "内门区"
							},
							{
								"id": "710236",
								"name": "茂林区"
							},
							{
								"id": "710237",
								"name": "桃源区"
							},
							{
								"id": "710238",
								"name": "那玛夏区"
							}
						]
					},
					{
						"id": "710300",
						"name": "基隆市",
						"childs": [
							{
								"id": "710301",
								"name": "中正区"
							},
							{
								"id": "710302",
								"name": "七堵区"
							},
							{
								"id": "710303",
								"name": "暖暖区"
							},
							{
								"id": "710304",
								"name": "仁爱区"
							},
							{
								"id": "710305",
								"name": "中山区"
							},
							{
								"id": "710306",
								"name": "安乐区"
							},
							{
								"id": "710307",
								"name": "信义区"
							}
						]
					},
					{
						"id": "710400",
						"name": "台中市",
						"childs": [
							{
								"id": "710401",
								"name": "中区"
							},
							{
								"id": "710402",
								"name": "东区"
							},
							{
								"id": "710403",
								"name": "南区"
							},
							{
								"id": "710404",
								"name": "西区"
							},
							{
								"id": "710405",
								"name": "北区"
							},
							{
								"id": "710406",
								"name": "西屯区"
							},
							{
								"id": "710407",
								"name": "南屯区"
							},
							{
								"id": "710408",
								"name": "北屯区"
							},
							{
								"id": "710409",
								"name": "丰原区"
							},
							{
								"id": "710410",
								"name": "东势区"
							},
							{
								"id": "710411",
								"name": "大甲区"
							},
							{
								"id": "710412",
								"name": "清水区"
							},
							{
								"id": "710413",
								"name": "沙鹿区"
							},
							{
								"id": "710414",
								"name": "梧栖区"
							},
							{
								"id": "710415",
								"name": "后里区"
							},
							{
								"id": "710416",
								"name": "神冈区"
							},
							{
								"id": "710417",
								"name": "潭子区"
							},
							{
								"id": "710418",
								"name": "大雅区"
							},
							{
								"id": "710419",
								"name": "新社区"
							},
							{
								"id": "710420",
								"name": "石冈区"
							},
							{
								"id": "710421",
								"name": "外埔区"
							},
							{
								"id": "710422",
								"name": "大安区"
							},
							{
								"id": "710423",
								"name": "乌日区"
							},
							{
								"id": "710424",
								"name": "大肚区"
							},
							{
								"id": "710425",
								"name": "龙井区"
							},
							{
								"id": "710426",
								"name": "雾峰区"
							},
							{
								"id": "710427",
								"name": "太平区"
							},
							{
								"id": "710428",
								"name": "大里区"
							},
							{
								"id": "710429",
								"name": "和平区"
							}
						]
					},
					{
						"id": "710500",
						"name": "台南市",
						"childs": [
							{
								"id": "710501",
								"name": "东区"
							},
							{
								"id": "710502",
								"name": "南区"
							},
							{
								"id": "710504",
								"name": "北区"
							},
							{
								"id": "710506",
								"name": "安南区"
							},
							{
								"id": "710507",
								"name": "安平区"
							},
							{
								"id": "710508",
								"name": "中西区"
							},
							{
								"id": "710509",
								"name": "新营区"
							},
							{
								"id": "710510",
								"name": "盐水区"
							},
							{
								"id": "710511",
								"name": "白河区"
							},
							{
								"id": "710512",
								"name": "柳营区"
							},
							{
								"id": "710513",
								"name": "后壁区"
							},
							{
								"id": "710514",
								"name": "东山区"
							},
							{
								"id": "710515",
								"name": "麻豆区"
							},
							{
								"id": "710516",
								"name": "下营区"
							},
							{
								"id": "710517",
								"name": "六甲区"
							},
							{
								"id": "710518",
								"name": "官田区"
							},
							{
								"id": "710519",
								"name": "大内区"
							},
							{
								"id": "710520",
								"name": "佳里区"
							},
							{
								"id": "710521",
								"name": "学甲区"
							},
							{
								"id": "710522",
								"name": "西港区"
							},
							{
								"id": "710523",
								"name": "七股区"
							},
							{
								"id": "710524",
								"name": "将军区"
							},
							{
								"id": "710525",
								"name": "北门区"
							},
							{
								"id": "710526",
								"name": "新化区"
							},
							{
								"id": "710527",
								"name": "善化区"
							},
							{
								"id": "710528",
								"name": "新市区"
							},
							{
								"id": "710529",
								"name": "安定区"
							},
							{
								"id": "710530",
								"name": "山上区"
							},
							{
								"id": "710531",
								"name": "玉井区"
							},
							{
								"id": "710532",
								"name": "楠西区"
							},
							{
								"id": "710533",
								"name": "南化区"
							},
							{
								"id": "710534",
								"name": "左镇区"
							},
							{
								"id": "710535",
								"name": "仁德区"
							},
							{
								"id": "710536",
								"name": "归仁区"
							},
							{
								"id": "710537",
								"name": "关庙区"
							},
							{
								"id": "710538",
								"name": "龙崎区"
							},
							{
								"id": "710539",
								"name": "永康区"
							}
						]
					},
					{
						"id": "710600",
						"name": "新竹市",
						"childs": [
							{
								"id": "710601",
								"name": "东区"
							},
							{
								"id": "710602",
								"name": "北区"
							},
							{
								"id": "710603",
								"name": "香山区"
							}
						]
					},
					{
						"id": "710700",
						"name": "嘉义市",
						"childs": [
							{
								"id": "710701",
								"name": "东区"
							},
							{
								"id": "710702",
								"name": "西区"
							}
						]
					},
					{
						"id": "710800",
						"name": "新北市",
						"childs": [
							{
								"id": "710801",
								"name": "板桥区"
							},
							{
								"id": "710802",
								"name": "三重区"
							},
							{
								"id": "710803",
								"name": "中和区"
							},
							{
								"id": "710804",
								"name": "永和区"
							},
							{
								"id": "710805",
								"name": "新庄区"
							},
							{
								"id": "710806",
								"name": "新店区"
							},
							{
								"id": "710807",
								"name": "树林区"
							},
							{
								"id": "710808",
								"name": "莺歌区"
							},
							{
								"id": "710809",
								"name": "三峡区"
							},
							{
								"id": "710810",
								"name": "淡水区"
							},
							{
								"id": "710811",
								"name": "汐止区"
							},
							{
								"id": "710812",
								"name": "瑞芳区"
							},
							{
								"id": "710813",
								"name": "土城区"
							},
							{
								"id": "710814",
								"name": "芦洲区"
							},
							{
								"id": "710815",
								"name": "五股区"
							},
							{
								"id": "710816",
								"name": "泰山区"
							},
							{
								"id": "710817",
								"name": "林口区"
							},
							{
								"id": "710818",
								"name": "深坑区"
							},
							{
								"id": "710819",
								"name": "石碇区"
							},
							{
								"id": "710820",
								"name": "坪林区"
							},
							{
								"id": "710821",
								"name": "三芝区"
							},
							{
								"id": "710822",
								"name": "石门区"
							},
							{
								"id": "710823",
								"name": "八里区"
							},
							{
								"id": "710824",
								"name": "平溪区"
							},
							{
								"id": "710825",
								"name": "双溪区"
							},
							{
								"id": "710826",
								"name": "贡寮区"
							},
							{
								"id": "710827",
								"name": "金山区"
							},
							{
								"id": "710828",
								"name": "万里区"
							},
							{
								"id": "710829",
								"name": "乌来区"
							}
						]
					},
					{
						"id": "712200",
						"name": "宜兰县",
						"childs": [
							{
								"id": "712201",
								"name": "宜兰市"
							},
							{
								"id": "712221",
								"name": "罗东镇"
							},
							{
								"id": "712222",
								"name": "苏澳镇"
							},
							{
								"id": "712223",
								"name": "头城镇"
							},
							{
								"id": "712224",
								"name": "礁溪乡"
							},
							{
								"id": "712225",
								"name": "壮围乡"
							},
							{
								"id": "712226",
								"name": "员山乡"
							},
							{
								"id": "712227",
								"name": "冬山乡"
							},
							{
								"id": "712228",
								"name": "五结乡"
							},
							{
								"id": "712229",
								"name": "三星乡"
							},
							{
								"id": "712230",
								"name": "大同乡"
							},
							{
								"id": "712231",
								"name": "南澳乡"
							}
						]
					},
					{
						"id": "712300",
						"name": "桃园县",
						"childs": [
							{
								"id": "712301",
								"name": "桃园市"
							},
							{
								"id": "712302",
								"name": "中坜市"
							},
							{
								"id": "712303",
								"name": "平镇市"
							},
							{
								"id": "712304",
								"name": "八德市"
							},
							{
								"id": "712305",
								"name": "杨梅市"
							},
							{
								"id": "712306",
								"name": "芦竹市"
							},
							{
								"id": "712321",
								"name": "大溪镇"
							},
							{
								"id": "712324",
								"name": "大园乡"
							},
							{
								"id": "712325",
								"name": "龟山乡"
							},
							{
								"id": "712327",
								"name": "龙潭乡"
							},
							{
								"id": "712329",
								"name": "新屋乡"
							},
							{
								"id": "712330",
								"name": "观音乡"
							},
							{
								"id": "712331",
								"name": "复兴乡"
							}
						]
					},
					{
						"id": "712400",
						"name": "新竹县",
						"childs": [
							{
								"id": "712401",
								"name": "竹北市"
							},
							{
								"id": "712421",
								"name": "竹东镇"
							},
							{
								"id": "712422",
								"name": "新埔镇"
							},
							{
								"id": "712423",
								"name": "关西镇"
							},
							{
								"id": "712424",
								"name": "湖口乡"
							},
							{
								"id": "712425",
								"name": "新丰乡"
							},
							{
								"id": "712426",
								"name": "芎林乡"
							},
							{
								"id": "712427",
								"name": "横山乡"
							},
							{
								"id": "712428",
								"name": "北埔乡"
							},
							{
								"id": "712429",
								"name": "宝山乡"
							},
							{
								"id": "712430",
								"name": "峨眉乡"
							},
							{
								"id": "712431",
								"name": "尖石乡"
							},
							{
								"id": "712432",
								"name": "五峰乡"
							}
						]
					},
					{
						"id": "712500",
						"name": "苗栗县",
						"childs": [
							{
								"id": "712501",
								"name": "苗栗市"
							},
							{
								"id": "712521",
								"name": "苑里镇"
							},
							{
								"id": "712522",
								"name": "通霄镇"
							},
							{
								"id": "712523",
								"name": "竹南镇"
							},
							{
								"id": "712524",
								"name": "头份镇"
							},
							{
								"id": "712525",
								"name": "后龙镇"
							},
							{
								"id": "712526",
								"name": "卓兰镇"
							},
							{
								"id": "712527",
								"name": "大湖乡"
							},
							{
								"id": "712528",
								"name": "公馆乡"
							},
							{
								"id": "712529",
								"name": "铜锣乡"
							},
							{
								"id": "712530",
								"name": "南庄乡"
							},
							{
								"id": "712531",
								"name": "头屋乡"
							},
							{
								"id": "712532",
								"name": "三义乡"
							},
							{
								"id": "712533",
								"name": "西湖乡"
							},
							{
								"id": "712534",
								"name": "造桥乡"
							},
							{
								"id": "712535",
								"name": "三湾乡"
							},
							{
								"id": "712536",
								"name": "狮潭乡"
							},
							{
								"id": "712537",
								"name": "泰安乡"
							}
						]
					},
					{
						"id": "712700",
						"name": "彰化县",
						"childs": [
							{
								"id": "712701",
								"name": "彰化市"
							},
							{
								"id": "712721",
								"name": "鹿港镇"
							},
							{
								"id": "712722",
								"name": "和美镇"
							},
							{
								"id": "712723",
								"name": "线西乡"
							},
							{
								"id": "712724",
								"name": "伸港乡"
							},
							{
								"id": "712725",
								"name": "福兴乡"
							},
							{
								"id": "712726",
								"name": "秀水乡"
							},
							{
								"id": "712727",
								"name": "花坛乡"
							},
							{
								"id": "712728",
								"name": "芬园乡"
							},
							{
								"id": "712729",
								"name": "员林镇"
							},
							{
								"id": "712730",
								"name": "溪湖镇"
							},
							{
								"id": "712731",
								"name": "田中镇"
							},
							{
								"id": "712732",
								"name": "大村乡"
							},
							{
								"id": "712733",
								"name": "埔盐乡"
							},
							{
								"id": "712734",
								"name": "埔心乡"
							},
							{
								"id": "712735",
								"name": "永靖乡"
							},
							{
								"id": "712736",
								"name": "社头乡"
							},
							{
								"id": "712737",
								"name": "二水乡"
							},
							{
								"id": "712738",
								"name": "北斗镇"
							},
							{
								"id": "712739",
								"name": "二林镇"
							},
							{
								"id": "712740",
								"name": "田尾乡"
							},
							{
								"id": "712741",
								"name": "埤头乡"
							},
							{
								"id": "712742",
								"name": "芳苑乡"
							},
							{
								"id": "712743",
								"name": "大城乡"
							},
							{
								"id": "712744",
								"name": "竹塘乡"
							},
							{
								"id": "712745",
								"name": "溪州乡"
							}
						]
					},
					{
						"id": "712800",
						"name": "南投县",
						"childs": [
							{
								"id": "712801",
								"name": "南投市"
							},
							{
								"id": "712821",
								"name": "埔里镇"
							},
							{
								"id": "712822",
								"name": "草屯镇"
							},
							{
								"id": "712823",
								"name": "竹山镇"
							},
							{
								"id": "712824",
								"name": "集集镇"
							},
							{
								"id": "712825",
								"name": "名间乡"
							},
							{
								"id": "712826",
								"name": "鹿谷乡"
							},
							{
								"id": "712827",
								"name": "中寮乡"
							},
							{
								"id": "712828",
								"name": "鱼池乡"
							},
							{
								"id": "712829",
								"name": "国姓乡"
							},
							{
								"id": "712830",
								"name": "水里乡"
							},
							{
								"id": "712831",
								"name": "信义乡"
							},
							{
								"id": "712832",
								"name": "仁爱乡"
							}
						]
					},
					{
						"id": "712900",
						"name": "云林县",
						"childs": [
							{
								"id": "712901",
								"name": "斗六市"
							},
							{
								"id": "712921",
								"name": "斗南镇"
							},
							{
								"id": "712922",
								"name": "虎尾镇"
							},
							{
								"id": "712923",
								"name": "西螺镇"
							},
							{
								"id": "712924",
								"name": "土库镇"
							},
							{
								"id": "712925",
								"name": "北港镇"
							},
							{
								"id": "712926",
								"name": "古坑乡"
							},
							{
								"id": "712927",
								"name": "大埤乡"
							},
							{
								"id": "712928",
								"name": "莿桐乡"
							},
							{
								"id": "712929",
								"name": "林内乡"
							},
							{
								"id": "712930",
								"name": "二仑乡"
							},
							{
								"id": "712931",
								"name": "仑背乡"
							},
							{
								"id": "712932",
								"name": "麦寮乡"
							},
							{
								"id": "712933",
								"name": "东势乡"
							},
							{
								"id": "712934",
								"name": "褒忠乡"
							},
							{
								"id": "712935",
								"name": "台西乡"
							},
							{
								"id": "712936",
								"name": "元长乡"
							},
							{
								"id": "712937",
								"name": "四湖乡"
							},
							{
								"id": "712938",
								"name": "口湖乡"
							},
							{
								"id": "712939",
								"name": "水林乡"
							}
						]
					},
					{
						"id": "713000",
						"name": "嘉义县",
						"childs": [
							{
								"id": "713001",
								"name": "太保市"
							},
							{
								"id": "713002",
								"name": "朴子市"
							},
							{
								"id": "713023",
								"name": "布袋镇"
							},
							{
								"id": "713024",
								"name": "大林镇"
							},
							{
								"id": "713025",
								"name": "民雄乡"
							},
							{
								"id": "713026",
								"name": "溪口乡"
							},
							{
								"id": "713027",
								"name": "新港乡"
							},
							{
								"id": "713028",
								"name": "六脚乡"
							},
							{
								"id": "713029",
								"name": "东石乡"
							},
							{
								"id": "713030",
								"name": "义竹乡"
							},
							{
								"id": "713031",
								"name": "鹿草乡"
							},
							{
								"id": "713032",
								"name": "水上乡"
							},
							{
								"id": "713033",
								"name": "中埔乡"
							},
							{
								"id": "713034",
								"name": "竹崎乡"
							},
							{
								"id": "713035",
								"name": "梅山乡"
							},
							{
								"id": "713036",
								"name": "番路乡"
							},
							{
								"id": "713037",
								"name": "大埔乡"
							},
							{
								"id": "713038",
								"name": "阿里山乡"
							}
						]
					},
					{
						"id": "713300",
						"name": "屏东县",
						"childs": [
							{
								"id": "713301",
								"name": "屏东市"
							},
							{
								"id": "713321",
								"name": "潮州镇"
							},
							{
								"id": "713322",
								"name": "东港镇"
							},
							{
								"id": "713323",
								"name": "恒春镇"
							},
							{
								"id": "713324",
								"name": "万丹乡"
							},
							{
								"id": "713325",
								"name": "长治乡"
							},
							{
								"id": "713326",
								"name": "麟洛乡"
							},
							{
								"id": "713327",
								"name": "九如乡"
							},
							{
								"id": "713328",
								"name": "里港乡"
							},
							{
								"id": "713329",
								"name": "盐埔乡"
							},
							{
								"id": "713330",
								"name": "高树乡"
							},
							{
								"id": "713331",
								"name": "万峦乡"
							},
							{
								"id": "713332",
								"name": "内埔乡"
							},
							{
								"id": "713333",
								"name": "竹田乡"
							},
							{
								"id": "713334",
								"name": "新埤乡"
							},
							{
								"id": "713335",
								"name": "枋寮乡"
							},
							{
								"id": "713336",
								"name": "新园乡"
							},
							{
								"id": "713337",
								"name": "崁顶乡"
							},
							{
								"id": "713338",
								"name": "林边乡"
							},
							{
								"id": "713339",
								"name": "南州乡"
							},
							{
								"id": "713340",
								"name": "佳冬乡"
							},
							{
								"id": "713341",
								"name": "琉球乡"
							},
							{
								"id": "713342",
								"name": "车城乡"
							},
							{
								"id": "713343",
								"name": "满州乡"
							},
							{
								"id": "713344",
								"name": "枋山乡"
							},
							{
								"id": "713345",
								"name": "三地门乡"
							},
							{
								"id": "713346",
								"name": "雾台乡"
							},
							{
								"id": "713347",
								"name": "玛家乡"
							},
							{
								"id": "713348",
								"name": "泰武乡"
							},
							{
								"id": "713349",
								"name": "来义乡"
							},
							{
								"id": "713350",
								"name": "春日乡"
							},
							{
								"id": "713351",
								"name": "狮子乡"
							},
							{
								"id": "713352",
								"name": "牡丹乡"
							}
						]
					},
					{
						"id": "713400",
						"name": "台东县",
						"childs": [
							{
								"id": "713401",
								"name": "台东市"
							},
							{
								"id": "713421",
								"name": "成功镇"
							},
							{
								"id": "713422",
								"name": "关山镇"
							},
							{
								"id": "713423",
								"name": "卑南乡"
							},
							{
								"id": "713424",
								"name": "鹿野乡"
							},
							{
								"id": "713425",
								"name": "池上乡"
							},
							{
								"id": "713426",
								"name": "东河乡"
							},
							{
								"id": "713427",
								"name": "长滨乡"
							},
							{
								"id": "713428",
								"name": "太麻里乡"
							},
							{
								"id": "713429",
								"name": "大武乡"
							},
							{
								"id": "713430",
								"name": "绿岛乡"
							},
							{
								"id": "713431",
								"name": "海端乡"
							},
							{
								"id": "713432",
								"name": "延平乡"
							},
							{
								"id": "713433",
								"name": "金峰乡"
							},
							{
								"id": "713434",
								"name": "达仁乡"
							},
							{
								"id": "713435",
								"name": "兰屿乡"
							}
						]
					},
					{
						"id": "713500",
						"name": "花莲县",
						"childs": [
							{
								"id": "713501",
								"name": "花莲市"
							},
							{
								"id": "713521",
								"name": "凤林镇"
							},
							{
								"id": "713522",
								"name": "玉里镇"
							},
							{
								"id": "713523",
								"name": "新城乡"
							},
							{
								"id": "713524",
								"name": "吉安乡"
							},
							{
								"id": "713525",
								"name": "寿丰乡"
							},
							{
								"id": "713526",
								"name": "光复乡"
							},
							{
								"id": "713527",
								"name": "丰滨乡"
							},
							{
								"id": "713528",
								"name": "瑞穗乡"
							},
							{
								"id": "713529",
								"name": "富里乡"
							},
							{
								"id": "713530",
								"name": "秀林乡"
							},
							{
								"id": "713531",
								"name": "万荣乡"
							},
							{
								"id": "713532",
								"name": "卓溪乡"
							}
						]
					},
					{
						"id": "713600",
						"name": "澎湖县",
						"childs": [
							{
								"id": "713601",
								"name": "马公市"
							},
							{
								"id": "713621",
								"name": "湖西乡"
							},
							{
								"id": "713622",
								"name": "白沙乡"
							},
							{
								"id": "713623",
								"name": "西屿乡"
							},
							{
								"id": "713624",
								"name": "望安乡"
							},
							{
								"id": "713625",
								"name": "七美乡"
							}
						]
					},
					{
						"id": "713700",
						"name": "金门县",
						"childs": [
							{
								"id": "713701",
								"name": "金城镇"
							},
							{
								"id": "713702",
								"name": "金湖镇"
							},
							{
								"id": "713703",
								"name": "金沙镇"
							},
							{
								"id": "713704",
								"name": "金宁乡"
							},
							{
								"id": "713705",
								"name": "烈屿乡"
							},
							{
								"id": "713706",
								"name": "乌丘乡"
							}
						]
					},
					{
						"id": "713800",
						"name": "连江县",
						"childs": [
							{
								"id": "713801",
								"name": "南竿乡"
							},
							{
								"id": "713802",
								"name": "北竿乡"
							},
							{
								"id": "713803",
								"name": "莒光乡"
							},
							{
								"id": "713804",
								"name": "东引乡"
							}
						]
					}
				]
			},
			{
				"id": "810000",
				"name": "香港特别行政区",
				"type": 0,
				"childs": [
					{
						"id": "810100",
						"name": "香港岛",
						"childs": [
							{
								"id": "810101",
								"name": "中西区"
							},
							{
								"id": "810102",
								"name": "湾仔区"
							},
							{
								"id": "810103",
								"name": "东区"
							},
							{
								"id": "810104",
								"name": "南区"
							}
						]
					},
					{
						"id": "810200",
						"name": "九龙",
						"childs": [
							{
								"id": "810201",
								"name": "油尖旺区"
							},
							{
								"id": "810202",
								"name": "深水埗区"
							},
							{
								"id": "810203",
								"name": "九龙城区"
							},
							{
								"id": "810204",
								"name": "黄大仙区"
							},
							{
								"id": "810205",
								"name": "观塘区"
							}
						]
					},
					{
						"id": "810300",
						"name": "新界",
						"childs": [
							{
								"id": "810301",
								"name": "荃湾区"
							},
							{
								"id": "810302",
								"name": "屯门区"
							},
							{
								"id": "810303",
								"name": "元朗区"
							},
							{
								"id": "810304",
								"name": "北区"
							},
							{
								"id": "810305",
								"name": "大埔区"
							},
							{
								"id": "810306",
								"name": "西贡区"
							},
							{
								"id": "810307",
								"name": "沙田区"
							},
							{
								"id": "810308",
								"name": "葵青区"
							},
							{
								"id": "810309",
								"name": "离岛区"
							}
						]
					}
				]
			},
			{
				"id": "820000",
				"name": "澳门特别行政区",
				"type": 0,
				"childs": [
					{
						"id": "820100",
						"name": "澳门半岛",
						"childs": [
							{
								"id": "820101",
								"name": "花地玛堂区"
							},
							{
								"id": "820102",
								"name": "圣安多尼堂区"
							},
							{
								"id": "820103",
								"name": "大堂区"
							},
							{
								"id": "820104",
								"name": "望德堂区"
							},
							{
								"id": "820105",
								"name": "风顺堂区"
							}
						]
					},
					{
						"id": "820200",
						"name": "凼仔岛",
						"childs": [
							{
								"id": "820201",
								"name": "嘉模堂区"
							}
						]
					},
					{
						"id": "820300",
						"name": "路环岛",
						"childs": [
							{
								"id": "820301",
								"name": "圣方济各堂区"
							}
						]
					}
				]
			}
		],
		"version": "1521883063"
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _controller = __webpack_require__(4);
	
	var _model = __webpack_require__(18);
	
	var _model2 = _interopRequireDefault(_model);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var controllerC = _model2.default.registerController('controlC', "#container");
	
	controllerC.getDomMap({
	    btn: '#btnc'
	}).getBindEvents({
	    btn: {
	        actionName: 'click',
	        action: function action() {
	            console.log('C按钮点击');
	        }
	    }
	});
	
	module.exports = controllerC;
	
	//export {controllerC};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _controller = __webpack_require__(4);
	
	var _model = __webpack_require__(6);
	
	var modelC = _model.totalModel.init();
	
	modelC.name = 'modelC';
	
	modelC.pageInit = function () {
	    console.log('This\'s is page c');
	};
	
	modelC.save();
	
	exports.default = modelC;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = "<div>This is pageA</div>\n\n<div class=\"a-container\" style=\"margin-top: 50px; height: 40px;line-height: 40px;\">\n    姓名: <input type=\"text\" class=\"myName\">\n    电话: <input type=\"number\" class=\"myPhone\">\n</div>\n\n\n<button id=\"name\">name</button>\n<button id=\"name-test\">name test</button>\n<button id=\"age\">点我</button>\n\n\n\n<div class=\"btn\" style=\"margin-top: 50px;\">\n    点击显示城市选择\n</div>\n\n\n<input type=\"file\" id=\"file\" style=\"margin-top: 20px;\"/>\n\n\n<div class=\"alert-btn\" style=\"margin-top: 30px;\">弹窗实验</div>\n\n\n\n<div class=\"city-wrapper\">\n</div>\n"

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div>This is b.html</div>\n\n<button id=\"btn\">\n    点击我吧\n</button>"

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = "<ul table class=\"pagec-route\">\n    <li table=\"cell v-m h-c\">\n        <a data-href=\"ccc-1\">c-route-1</a>\n    </li>\n    <li table=\"cell v-m h-c\">\n        <a data-href=\"ccc-2\">c-route-2</a>\n    </li>\n</ul>\n\n<button id=\"btnc\">\n    按钮C\n</button>\n\n\n<div class=\"c-container\">\n\n</div>"

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<p>This is c-1 index.html</p>"

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<p>This is c-route-2</p>"

/***/ },
/* 24 */,
/* 25 */,
/* 26 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 31 */,
/* 32 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 33 */,
/* 34 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=bundle.js.map