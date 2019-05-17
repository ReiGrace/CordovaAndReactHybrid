var Snow = {};

// window.Snow = {};



/**
     * Class
     * inherit
     * extend
     *
     * */


/**
 * Class: Snow.Class
 */
/**
 * Constructor: Snow.Class
 * 基类。
 *
 * 创建一个新的 Snow 类，如下所示:
 * (code)
 *     var TheClass = new Snow.Class(prototype);
 * (end)
 *
 * 创建一个新的有多个继承类的 Snow 类，如下所示:
 * (code)
 *     var TheClass = new Snow.Class(Class1, Class2, prototype);
 * (end)
 *
 * 使用 apply 实现子类继承父类的属性和方法。
 * 在子类的 initialize 先加入:
 * (code)
 *     [SnowClass].prototype.initialize.apply(this, arguments);    //arguments 可根据实际情况定制
 * (end)
 * 在子类的 destroy 最后加入:
 * (code)
 *     [SnowClass].prototype.destroy.apply(this, arguments);
 * (end)
 *
 * 注意： Array 型和 Object 的属性在声明时不能赋予其实际的默认值（通常指定为：null），其默认值应当在构造函数 initialize 中赋值。
 */
Snow.Class = function () {
    var len = arguments.length;
    var P = arguments[0];
    var F = arguments[len - 1];

    // 构造函数
    var C = typeof F.initialize == "function" ? F.initialize : function () { P.prototype.initialize.apply(this, arguments); };

    if (len > 1) {
        var newArgs = [C, P].concat(Array.prototype.slice.call(arguments).slice(1, len - 1), F);
        Snow.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }

    return C;
};

/**
 * Function: Snow.inherit
 *
 * Parameters:
 * C - {Object} 父类
 * P - {Object} 子类
 *
 * In addition to the mandatory C and P parameters, an arbitrary number of
 * objects can be passed, which will extend C.
 */
Snow.inherit = function (C, P) {
    var F = function () { };
    F.prototype = P.prototype;
    C.prototype = new F;

    var o;

    for (var i = 2, len = arguments.length; i < len; i++) {
        o = arguments[i];
        if (typeof o === "function") {
            o = o.prototype;
        }

        Snow.extend(C.prototype, o);
    }
};

/**
 * APIFunction: extend
 * 复制源对象的所有属性到目标对象上，源对象上的没有定义的属性在目标对象上也不会被设置。
 *
 * Parameters:
 * destination - {Object} 目标对象。
 * source - {Object} 源对象，其属性将被设置到目标对象上。
 *
 * Returns:
 * {Object} 目标对象。
 */
Snow.extend = function (destination, source) {
    destination = destination || {};

    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;

        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }

    return destination;
};





/**
 * Class: Snow.Events
 * 事件分发超类，Snow 代码库中所有需要支持事件的类均是此类的子类。
 *
 * 此类不可实例化。
 */
Snow.Events = Snow.Class({

    /**
     * Property: _handlers
     * {Object} 事件分发器对象。此对象实际上是一个事件的仓库，
     * 管理着它的所有者（Snow.Events 对象或其子类对象）所绑定的所有事件 。
     */
    _handlers: null,

    /**
     * Constructor: Snow.Events
     * 构造函数。
     */
    initialize: function () {
        this._handlers = {};
    },

    /**
     * APIMethod: destroy
     * 销毁对象，释放资源。调用此函数后所有属性将被置为 null。
     */
    destroy: function () {
        this._handlers = null;
    },

    /**
     * APIMethod: one
     * 单次触发绑定，dispatch 后销毁。
     *
     * Parameters:
     * eventName - {String} 事件名。
     * handler - {Function} 事件响应函数。
     * context - {Object} 用于 handler 的上下文，默认为：this。
     *
     * Returns:
     * {Object} this。
     */
    one: function (eventName, handler, context) {
        var _h = this._handlers;

        if (!handler || !eventName) {
            return this;
        }

        if (!_h[eventName]) {
            _h[eventName] = [];
        }

        _h[eventName].push({
            h: handler,
            one: true,
            ctx: context || this
        });

        return this;
    },

    /**
     * APIMethod: bind
     * 绑定事件。
     *
     * Parameters:
     * eventName - {String} 事件名，必设参数。
     * handler - {Boolean} 事件处理函数，必设参数。
     * context - {Object} 用于 handler 的上下文，默认为：this。
     *
     * Returns:
     * {Object} this。
     */
    bind: function (eventName, handler, context) {
        var _h = this._handlers;

        if (!handler || !eventName) {
            return this;
        }

        if (!_h[eventName]) {
            _h[eventName] = [];
        }

        _h[eventName].push({
            h: handler,
            one: false,
            ctx: context || this
        });

        return this;
    },

    /**
     * APIMethod: unbind
     * 解绑事件。
     *
     * Parameters:
     * eventName - {String} 事件名称，必设参数。如果此参数为空，将解除此对象所有事件的绑定。
     * handler - {Boolean} 事件处理函数，必设参数。如果此参数为空，将解除此对象上的 eventName 事件。
     *
     * Returns:
     * {Object} this。
     */
    unbind: function (eventName, handler) {
        var _h = this._handlers;

        if (!eventName) {
            this._handlers = {};
            return this;
        }

        if (handler) {
            if (_h[eventName]) {
                var newList = [];
                for (var i = 0, l = _h[eventName].length; i < l; i++) {
                    if (_h[eventName][i]['h'] != handler) {
                        newList.push(_h[eventName][i]);
                    }
                }
                _h[eventName] = newList;
            }

            if (_h[eventName] && _h[eventName].length === 0) {
                delete _h[eventName];
            }
        }
        else {
            delete _h[eventName];
        }

        return this;
    },

    /**
     * APIMethod: dispatch
     * 事件分发。
     *
     * Parameters:
     * type - {String} 事件类型，必设参数。
     * args - {Array} 事件回调函数参数列表。
     *
     * Returns:
     * {Object} this。
     */
    dispatch: function (type) {
        if (this._handlers[type]) {
            var args = arguments;
            var argLen = args.length;

            if (argLen > 3) {
                args = Array.prototype.slice.call(args, 1);
            }

            var _h = this._handlers[type];
            var len = _h.length;
            for (var i = 0; i < len;) {
                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        _h[i]['h'].call(_h[i]['ctx']);
                        break;
                    case 2:
                        _h[i]['h'].call(_h[i]['ctx'], args[1]);
                        break;
                    case 3:
                        _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);
                        break;
                    default:
                        // have more than 2 given arguments
                        _h[i]['h'].apply(_h[i]['ctx'], args);
                        break;
                }

                if (_h[i]['one']) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        return this;
    },

    /**
     * APIMethod: dispatchWithContext
     * 带有 context 的事件分发, 最后一个参数是事件回调的 context。
     *
     * Parameters:
     * type - {String} 事件类型，必设参数。
     * args - {Array} 事件回调函数参数列表。
     *
     * Returns:
     * {Object} this。
     */
    dispatchWithContext: function (type) {
        if (this._handlers[type]) {
            var args = arguments;
            var argLen = args.length;

            if (argLen > 4) {
                args = Array.prototype.slice.call(args, 1, args.length - 1);
            }
            var ctx = args[args.length - 1];

            var _h = this._handlers[type];
            var len = _h.length;
            for (var i = 0; i < len;) {
                // Optimize advise from backbone
                switch (argLen) {
                    case 1:
                        _h[i]['h'].call(ctx);
                        break;
                    case 2:
                        _h[i]['h'].call(ctx, args[1]);
                        break;
                    case 3:
                        _h[i]['h'].call(ctx, args[1], args[2]);
                        break;
                    default:
                        // have more than 2 given arguments
                        _h[i]['h'].apply(ctx, args);
                        break;
                }

                if (_h[i]['one']) {
                    _h.splice(i, 1);
                    len--;
                }
                else {
                    i++;
                }
            }
        }

        return this;
    },


    // 下面是别名
    /**
     * APIMethod: trigger
     * 触发事件。
     *
     * Parameters:
     * type - {String} 事件类型。
     * args - {Array} trigger 所触发的事件回调函数参数列表。
     *
     * Returns:
     * {Object} this。
     */
    trigger: function (type/*args || [args]*/) {
        Snow.Events.prototype.dispatch.apply(this, arguments);
        return this;
    },

    /**
     * APIMethod: once
     * 单次触发绑定，trigger 后销毁。
     *
     * Parameters:
     * eventName - {String} 事件名。
     * handler - {Function} 事件响应函数。
     * context - {Object} 用于回调 context。
     *
     * Returns:
     * {Object} this。
     */
    once: function (eventName, handler, context) {
        Snow.Events.prototype.one.apply(this, arguments);
        return this;
    },

    /**
     * APIMethod: on
     * 绑定事件。
     *
     * Parameters:
     * eventName - {String} 事件名，必设参数。
     * handler - {Boolean} 事件处理函数，必设参数。
     * context - {Object} 用于 handler 的上下文，默认为：this。
     *
     * Returns:
     * {Object} this。
     */
    on: function (eventName, handler, context) {
        Snow.Events.prototype.bind.apply(this, arguments);
        return this;
    },

    /**
     * APIMethod: un
     * 解绑事件。
     *
     * Parameters:
     * eventName - {String} 事件名称，必设参数。如果此参数为空，将解除此对象对象所有事件的绑定。
     * handler - {Boolean} 事件处理函数，必设参数。如果此参数为空，将解除此对象对象上的 eventName 事件。
     *
     * Returns:
     * {Object} this。
     */
    un: function (eventName, handler) {
        Snow.Events.prototype.unbind.apply(this, arguments);
        return this;
    },


    CLASS_NAME: "Snow.Events"
});





/**
 * Header: BaseTypes
 * Snow 自定义类型扩展, 包含string, number, function and array.
 */

/**
 * Namespace: Snow.String
 * 字符串操作的一系列常用扩展函数.
 */
Snow.String = {

    /**
     * APIFunction: startsWith
     * 判断目标字符串是否以指定的子字符串开头.
     *
     * Parameters:
     * str - {String} 目标字符串.
     * sub - {String} 查找的子字符串.
     *
     * Returns:
     * {Boolean} 目标字符串以指定的子字符串开头,则返回true;否则返回false.
     */
    startsWith: function (str, sub) {
        return (str.indexOf(sub) == 0);
    },

    /**
     * APIFunction: contains
     * 判断目标字符串是否包含指定的子字符串.
     *
     * Parameters:
     * str - {String} 目标字符串.
     * sub - {String} 查找的子字符串.
     *
     * Returns:
     * {Boolean} 目标字符串中包含指定的子字符串,则返回true;否则返回false.
     */
    contains: function (str, sub) {
        return (str.indexOf(sub) != -1);
    },

    /**
     * APIFunction: trim
     * 删除一个字符串的开头和结尾处的所有空白字符.
     *
     * Parameters:
     * str - {String} (可能)存在空白字符填塞的字符串.
     *
     * Returns:
     * {String} 删除开头和结尾处空白字符后的字符串.
     */
    trim: function (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    /**
     * APIFunction: camelize
     * 骆驼式("-")连字符的字符串处理.
     * 例如: "chicken-head" becomes "chickenHead",
     *       "-chicken-head" becomes "ChickenHead".
     *
     * Parameters:
     * str - {String} 要处理的字符串,原始内容不应被修改.
     *
     * Returns:
     * {String}
     */
    camelize: function (str) {
        var oStringList = str.split('-');
        var camelizedString = oStringList[0];
        for (var i = 1, len = oStringList.length; i < len; i++) {
            var s = oStringList[i];
            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
        }
        return camelizedString;
    },

    /**
     * APIFunction: format
     * 提供带 ${token} 标记的字符串, 返回context对象属性中指定标记的属性值.
     *
     * 示例:
     * (code)
     * 1、template = "${value,getValue}";
     *         context = {value: {getValue:function(){return Math.max.apply(null,argument);}}};
     *         args = [2,23,12,36,21];
     *       返回值:36
     * (end)
     * 示例:
     * (code)
     * 2、template = "$${{value,getValue}}";
     *         context = {value: {getValue:function(){return Math.max.apply(null,argument);}}};
     *         args = [2,23,12,36,21];
     *       返回值:"${36}"
     * (end)
     * 示例:
     * (code)
     * 3、template = "${a,b}";
     *         context = {a: {b:"format"}};
     *         args = null;
     *       返回值:"format"
     * (end)
     * 示例:
     * (code)
     * 3、template = "${a,b}";
     *         context = null;
     *         args = null;
     *       返回值:"${a.b}"
     * (end)
     *
     * Parameters:
     * template - {String} 带标记的字符串将要被替换.
     *                     参数 template 格式为"${token}",此处的 token 标记会替换为 context["token"] 属性的值
     * context - {Object} 带有属性的可选对象的属性用于匹配格式化字符串中的标记.
     *                    如果该参数为空,将使用 window 对象.
     * args - {Array} 可选参数传递给在context对象上找到的函数.
     *
     * Returns:
     * {String} 从 context 对象属性中替换字符串标记位的字符串.
     */
    format: function (template, context, args) {
        if (!context) {
            context = window;
        }

        // Example matching:
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function (str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i = 0; i < subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }

                replacement = replacement[subs[i]];
            }

            if (typeof replacement === "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement;
            }
        };

        return template.replace(Snow.String.tokenRegEx, replacer);
    },

    /**
     * Property: tokenRegEx
     * Used to find tokens in a string.
     * Examples: ${a}, ${a.b.c}, ${a-b}, ${5}
     */
    tokenRegEx: /\$\{([\w.]+?)\}/g,

    /**
     * Property: numberRegEx
     * Used to test strings as numbers.
     */
    numberRegEx: /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,

    /**
     * APIFunction: isNumeric
     * 判断一个字符串是否只包含一个数值.
     *
     * 例如:
     * (code)
     * Snow.String.isNumeric("6.02e23") // true
     * Snow.String.isNumeric("12 dozen") // false
     * Snow.String.isNumeric("4") // true
     * Snow.String.isNumeric(" 4 ") // false
     * (end)
     *
     * Returns:
     * {Boolean} 字符串包含唯一的数值,返回true;否则返回false.
     */
    isNumeric: function (value) {
        return Snow.String.numberRegEx.test(value);
    },

    /**
     * APIFunction: numericIf
     * 把一个看似数值型的字符串转化为一个数值.
     *
     * Returns
     * {Number|String} 如果能转换为数值则返回数值,否则返回字符串本身.
     */
    numericIf: function (value) {
        return Snow.String.isNumeric(value) ? parseFloat(value) : value;
    }

};

/**
 * Namespace: Snow.Number
 * 数值操作的一系列常用扩展函数.
 */
Snow.Number = {

    /**
     * Property: decimalSeparator
     * 格式化数字时默认的小数点分隔符.
     */
    decimalSeparator: ".",

    /**
     * Property: thousandsSeparator
     * 格式化数字时默认的千位分隔符.
     */
    thousandsSeparator: ",",

    /**
     * APIFunction: limitSigDigs
     * 限制浮点数的有效数字位数.
     *
     * Parameters:
     * num - {Float}
     * sig - {Integer}
     *
     * Returns:
     * {Float} 将数字四舍五入到指定数量的有效位数.
     */
    limitSigDigs: function (num, sig) {
        var fig = 0;
        if (sig > 0) {
            fig = parseFloat(num.toPrecision(sig));
        }
        return fig;
    },

    /**
     * APIFunction: format
     * 数字格式化输出.
     *
     * Parameters:
     * num  - {Float}
     * dec  - {Integer} 数字的小数部分四舍五入到指定的位数.
     *        默认为 0. 设置为null值时小数部分不变.
     * tsep - {String} 千位分隔符. 默认为",".
     * dsep - {String} 小数点分隔符. 默认为".".
     *
     * Returns:
     * {String} 数字格式化后的字符串.
     */
    format: function (num, dec, tsep, dsep) {
        dec = (typeof dec != "undefined") ? dec : 0;
        tsep = (typeof tsep != "undefined") ? tsep :
            Snow.Number.thousandsSeparator;
        dsep = (typeof dsep != "undefined") ? dsep :
            Snow.Number.decimalSeparator;

        if (dec != null) {
            num = parseFloat(num.toFixed(dec));
        }

        var parts = num.toString().split(".");
        if (parts.length === 1 && dec == null) {
            // integer where we do not want to touch the decimals
            dec = 0;
        }

        var integer = parts[0];
        if (tsep) {
            var thousands = /(-?[0-9]+)([0-9]{3})/;
            while (thousands.test(integer)) {
                integer = integer.replace(thousands, "$1" + tsep + "$2");
            }
        }

        var str;
        if (dec == 0) {
            str = integer;
        } else {
            var rem = parts.length > 1 ? parts[1] : "0";
            if (dec != null) {
                rem = rem + new Array(dec - rem.length + 1).join("0");
            }
            str = integer + dsep + rem;
        }
        return str;
    },

    /**
     * APIFunction: isNumber
     * 判断是否是数值.
     *
     * Parameters:
     * val - {Float} 要判断的值
     *
     * Returns:
     * {Boolean} 是否是数字.
     */
    isNumber: function (val) {
        if (val === "" || val == null) {
            return false;
        }

        if (!isNaN(val)) {
            return true;
        }
        else {
            return false;
        }
    }
};

if (!Number.prototype.limitSigDigs) {
    /**
     * APIMethod: Number.limitSigDigs
     * 限制浮点数的有效数字位数.
     *
     * Parameters:
     * sig - {Integer}
     *
     * Returns:
     * {Integer} 将数字四舍五入到指定数量的有效位数.
     *           如果传入值为 null、0、或者是负数, 返回值 0
     */
    Number.prototype.limitSigDigs = function (sig) {
        return Snow.Number.limitSigDigs(this, sig);
    };
}

/**
 * Namespace: Snow.Function
 * 函数操作的一系列常用扩展函数.
 */
Snow.Function = {
    /**
     * APIFunction: bind
     * 绑定函数到对象.方便创建this的作用域.
     *
     * Parameters:
     * func - {Function} 输入函数.
     * object - {Object} 对象绑定到输入函数(作为输入函数的this对象).
     *
     * Returns:
     * {Function} object参数作为func函数的this对象.
     */
    bind: function (func, object) {
        // create a reference to all arguments past the second one
        var args = Array.prototype.slice.apply(arguments, [2]);
        return function () {
            // Push on any additional arguments from the actual function call.
            // These will come after those sent to the bind call.
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );
            return func.apply(object, newArgs);
        };
    },

    /**
     * APIFunction: bindAsEventListener
     * 绑定函数到对象,在调用该函数时配置并使用事件对象作为第一个参数.
     *
     * Parameters:
     * func - {Function} 用于监听事件的函数.
     * object - {Object} this 对象的引用.
     *
     * Returns:
     * {Function}
     */
    bindAsEventListener: function (func, object) {
        return function (event) {
            return func.call(object, event || window.event);
        };
    },

    /**
     * APIFunction: False
     * 该函数仅仅返回false.
     * 该函数主要是避免在IE8以下浏览中DOM事件句柄的匿名函数问题.
     *
     * 用法:
     * document.onclick = Snow.Function.False;
     *
     * Returns:
     * {Boolean}
     */
    False: function () {
        return false;
    },

    /**
     * APIFunction: True
     * 该函数仅仅返回true.
     * 该函数主要是避免在IE8以下浏览中DOM事件句柄的匿名函数问题.
     *
     * 用法:
     * document.onclick = Snow.Function.True;
     *
     * Returns:
     * {Boolean}
     */
    True: function () {
        return true;
    },

    /**
     * APIFunction: Void
     * 可重用函数,仅仅返回"undefined".
     *
     * Returns:
     * {undefined}
     */
    Void: function () { }

};

/**
 * Namespace: Snow.Array
 * 数组操作的一系列常用扩展函数.
 */
Snow.Array = {

    /**
     * APIMethod: filter
     * 过滤数组.提供了ECMA-262标准中Array.prototype.filter函数的扩展.
     *
     * 基于众所周知的例子:
     * http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
     *
     * Parameters:
     * array - {Array} 要过滤的数组..
     * callback - {Function} 数组中的每一个元素调用该函数.
     *     如果函数的返回值为true,该元素将包含在返回的数组中.
     *     该函数有三个参数: 数组中的元素,元素的索引,数组自身.
     *     如果设置了可选参数caller,在调用callback时,使用可选参数caller设置为callback的参数.
     * caller - {Object} 在调用callback时,使用可选参数caller设置为callback的参数.
     *
     * Returns:
     * {Array} callback函数返回true时的元素将作为返回数组中的元素.
     */
    filter: function (array, callback, caller) {
        var selected = [];
        if (Array.prototype.filter) {
            selected = array.filter(callback, caller);
        } else {
            var len = array.length;
            if (typeof callback != "function") {
                throw new TypeError();
            }
            for (var i = 0; i < len; i++) {
                if (i in array) {
                    var val = array[i];
                    if (callback.call(caller, val, i, array)) {
                        selected.push(val);
                    }
                }
            }
        }
        return selected;
    }

};




// ------------------------- Snow Util Base -------------------------
Snow.Util = Snow.Util || {};
Snow.Util._lastUniqueIndex = 0;

/**
 * Snow.Util.unique
 * 获取唯一值
 *
 * Parameters:
 * prefix - {String} 前缀，默认值： ""
 *
 * Returns:
 * {String} 唯一值
 */
Snow.Util.unique = function (prefix) {
    prefix = prefix || "";
    Snow.Util._lastUniqueIndex++;
    return prefix + Snow.Util._lastUniqueIndex;
};

/**
 * Snow.Util.parseUrl
 * 解析 URL 参数
 *
 * Parameters:
 * url - {String} 需要解析的url
 *
 * Returns:
 * {Object} 参数对象
 */
Snow.Util.parseUrl = function (url) {
    url = url ? url : window.location.href;
    var i = url.indexOf('?');
    if (i == -1) return null;
    var querystr = url.substr(i + 1);
    var arr = querystr.split('&');
    var parameter = new Object({});
    for (var j in arr) {
        var arrparam = arr[j].split('=');
        parameter[arrparam[0]] = arrparam[1];
    }

    return parameter;
};

/**
 * Snow.Util.parseDom
 * 解析 URL 参数
 *
 * Parameters:
 * str - {String} 需要解析为 dom 的 str
 *
 * Returns:
 * {Array<Object>} Dom
 */
Snow.Util.parseDom = function (str) {
    var objE = document.createElement("div");
    objE.innerHTML = str;
    return objE.childNodes;
};

/**
 * 判断一个元素是否是数组元素，此函数使用"=="判断
 * @method public isEleInArray
 * @param {ArrayElement} 需要判断的元素
 * @param {Array} 数组
 * @returns {Boolean} 元素是否是数组元素
 */
Snow.Util.isEleInArray = function (ele, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (ele == arr[i])
            return true;
    }
    return false;
};

/**
 * 查某个元素在数组中的索引值
 * @method public indexOfArray
 * @param {ArrayElement} 需要判断的元素
 * @param {Array} 数组
 * @returns {Number} 元素在数组中的索引值
 */
Snow.Util.indexOfArray = function (ele, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == ele) {
            return i;
        }
    }
    return -1;
};


/**
 * 从数组中移除指定元素
 * @method public removeItem
 * @param {Array} 数组
 * @param {Object} 需要从数组中移除的元素
 * @param {isThanOnce} 是否允许移除多个元素。默认值： true。
 * @returns {Array} 移除指定元素后的数组。
 */
Snow.Util.removeEleInArr = function (array, item, isThanOnce) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
            array.splice(i, 1);

            if (isThanOnce === false) {
                break;
            }
        }
    }

    return array;
};

/**
 * 删除数组中的重复元素
 * @method public delRepeatInArray
 * @param {Array} 要进行重复元素删除的数组
 * @returns {Array} 无重复元素的数组。
 */
Snow.Util.delRepeatInArray = function (arr) {
    var newArray = [];
    var provisionalTable = {};
    for (var i = 0, a; (a = arr[i]) != null; i++) {
        if (!provisionalTable[a]) {
            newArray.push(a);
            provisionalTable[a] = true;
        }
    }
    return newArray;
};

/**
 * 从一个对象数组中通过对象的指定属性和值获取数组的元素
 * @method public getEleInObjArrByAttr
 * @param {Array} arr 数组
 * @param {String/Array} 属性名称。注：最多支持两个数组元素。
 * @param {String} 属性值
 * @returns 数组元素|false
 */
Snow.Util.getEleInObjArrByAttr = function (arr, attrname, attrvalue) {
    if (typeof attrname == "string") {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].hasOwnProperty(attrname) && typeof arr[i][attrname] != "object" && arr[i][attrname] == attrvalue) {
                return arr[i];
            }
        }
        return false;
    }

    if (attrname instanceof Array) {
        var attrname_len = attrname.length;

        if (attrname_len == 1) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].hasOwnProperty(attrname[0]) && typeof arr[i][attrname[0]] != "object" && arr[i][attrname[0]] == attrvalue) {
                    return arr[i];
                }
            }
            return false;
        }

        if (attrname_len == 2) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].hasOwnProperty(attrname[0]) && arr[i][attrname[0]].hasOwnProperty(attrname[1]) && typeof arr[i][attrname[0]][attrname[1]] != "object" && arr[i][attrname[0]][attrname[1]] == attrvalue) {
                    return arr[i];
                }
            }
            return false;
        }

        return false;
    }

    return false;
};

/**
 * 从一个对象数组中通过对象的指定属性和值获取数组的元素索引
 * @method public getEleIndexInObjArrByAttr
 * @param {Array} arr 数组
 * @param {String/Array} 属性名称。注：最多支持两个数组元素。
 * @param {String} 属性值
 * @returns {Number} 数组元素索引，未找到返回 -1.
 */
Snow.Util.getEleIndexInObjArrByAttr = function (arr, attrname, attrvalue) {
    if (typeof attrname == "string") {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].hasOwnProperty(attrname) && typeof arr[i][attrname] != "object" && arr[i][attrname] == attrvalue) {
                return i;
            }
        }
        return -1;
    }

    if (attrname instanceof Array) {
        var attrname_len = attrname.length;

        if (attrname_len == 1) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].hasOwnProperty(attrname[0]) && typeof arr[i][attrname[0]] != "object" && arr[i][attrname[0]] == attrvalue) {
                    return i;
                }
            }
            return -1;
        }

        if (attrname_len == 2) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].hasOwnProperty(attrname[0]) && arr[i][attrname[0]].hasOwnProperty(attrname[1]) && typeof arr[i][attrname[0]][attrname[1]] != "object" && arr[i][attrname[0]][attrname[1]] == attrvalue) {
                    return i;
                }
            }
            return -1;
        }

        return -1;
    }

    return -1;
};

/**
 * 对象深度克隆
 * @method public deepCloneObj
 * @param {Objct} 要被克隆的对象
 * @returns {Objct} 克隆出的新对象
 */
Snow.Util.deepCloneObj = function (obj) {
    var str;
    var newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    }
    else if (window.JSON) {
        str = JSON.stringify(obj); //系列化对象
        newobj = JSON.parse(str); //还原
    }
    else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? XYAC.Util.deepCloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};

/**
 * 克隆一份 Object 对象
 * @method public cloneObject
 * @param {Objct} 需要克隆的对象
 * @returns {Objct} 回对象的拷贝对象，注意是新的对象，不是指向。
 */
Snow.Util.cloneObject = function (obj) {
    // Handle the 3 simple types, and null or undefined
    if (null === obj || typeof obj !== "object") return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = obj.slice(0);
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = XYAC.Util.cloneObject(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

/**
 * Snow.Util.isWxInnerBrowser
 * 判断当前浏览器环境是否是微信应用
 *
 * Returns:
 * {Boolean} 是否是数组
 */
Snow.Util.isWxInnerBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
    else {
        return false;
    }
};

/**
 * Snow.Util.transformToCamelCase
 * 把字符串转为驼峰命名格式
 *
 * @param str {String} 需要转为驼峰命名的字符串
 *
 * @return {String} 驼峰命名格式字符串
 */
Snow.Util.toCamelCase = function (str) {
    str = str.toLowerCase();
    var re = /_(\w)/g;
    return str.replace(re, function ($0, $1) {
        return $1.toUpperCase();
    });
};

/**
 * Snow.Util.extend
 * 复制源对象的所有属性到目标对象上，源对象上的没有定义的属性在目标对象上也不会被设置。
 *
 * @param destination - {Object} 目标对象。
 * @param source - {Object} 源对象，其属性将被设置到目标对象上。
 *
 * @return {Object} 目标对象。
 */
Snow.Util.extend = function (destination, source) {
    destination = destination || {};

    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;

        if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }

    return destination;
};


/**
 * Snow.Util.artTemplateRender
 * 渲染 artTemplate 模板。
 *
 * @param id - {String} DOM ID
 * @param templateName - {String} 模态框内容模板名称
 * @param templateData - {String} 模态框内容模板数据，尽量使用下面的标准格式：
 *
 * Examples:
 * (code)
 *  {res: {
 *      param: {},
 *      data: {}
 *  }};
 * (end)
 * 其中 resource 模板统一的顶层资源对象，该资源对象包含 params 和 data。
 * params 为模板控制参数，用于控制模板内部使用的渲染代码
 * data 为渲染数据
 *
 * @param callback - {Function} 回调函数。
 * @param rendertype - {Number} 渲染类型：1-重新渲染；2-追加内容。默认值：1。
 *
 * @return {Object} 目标对象。
 */
Snow.Util.artTemplateRender = function (id, templateName, templateData, callback, rendertype) {
    if (!template) {
        throw new Error("template is required!");
    }
    if (!id) throw new Error("id is required!");
    var viewdom = document.getElementById(id);
    if (!viewdom) {
        throw new Error("id is required!");
    }

    if (!templateName) return null;
    templateData = templateData ? templateData : {};
    rendertype = (rendertype == 2) ? 2 : 1;

    if (rendertype == 1) {
        document.getElementById(id).innerHTML = template(templateName, templateData);
    }
    else {
        document.getElementById(id).innerHTML += template(templateName, templateData);
    }


    if (callback && (callback instanceof Function)) {
        var callbackdata = templateData.res ? templateData.res : templateData;
        callback(callbackdata);//回调
    }
};

// ------------------------- Snow Util For Layui -------------------------
/**
 * Snow.Util.createLayuiTableCols
 * 创建 layui table 列
 *
 * @param options {String} 参数对象
 * tableName - 表名，必填
 *
 * Returns:
 * {Array{Array}}cols
 */
Snow.Util.createLayuiTableCols = function (options) {
    if (!options || !options.tableName) throw new Error("tableName is required！");
    if (!options || !options.jQuery) throw new Error("jQuery is required！");

    options.field = options.field ? options.field : null;
    options.title = options.title ? options.title : null;
    options.width = options.width ? options.width : null;
    options.autoFieldFilter = (options.autoFieldFilter && options.autoFieldFilter.length > 0) ? options.autoFieldFilter : [];

    options.checkbox = options.checkbox == true ? true : false;
    options.defaultWidth = (options.defaultWidth && options.defaultWidth > 50) ? options.defaultWidth : 100;

    if (!window.SnowAccessToken) throw Error("SnowAccessToken is required!");

    var $ = options.jQuery;
    $.ajax({
        url: Snow.Config.api + '/score/sql/execute',
        headers: {
            "AccessToken": window.SnowAccessToken
        },
        type: 'POST',
        async: true,    // 或 false, 是否异步
        data: {
            sqlCode: "getTableColumn",
            tableName: options.tableName,
            noPaging: true
        },
        timeout: 5000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        // beforeSend:function(xhr){},
        success: function (result, textStatus, jqXHR) {
            if (result && result.code != 0) throw new Error("获取数据发生错误");

            var data = result.data;
            for (var k = 0, lenk = data.length; k < lenk; k++) {
                data[k].columnName = Snow.Util.toCamelCase(data[k].columnName);
            }

            if (options.success && (options.success instanceof Function)) {
                if (!options.field || options.field.length == 0) {
                    options.field = [];
                    for (var i = 0, leni = data.length; i < leni; i++) {
                        var dataTmp = data[i];
                        //options.field.push(Snow.Util.toCamelCase(dataTmp.columnName));
                        if (!Snow.Util.isEleInArray(dataTmp.columnName, options.autoFieldFilter)) {
                            options.field.push(dataTmp.columnName);
                        }
                    }
                }

                var cols = [];
                options.checkbox ? cols.push({ checkbox: true }) : null;
                (options.toolbar && options.toolbar.fixed == true) ? cols.push(options.toolbar) : null;

                for (var j = 0, lenj = options.field.length; j < lenj; j++) {
                    var fieldTmp = options.field[j];

                    var col = {};
                    col.field = fieldTmp;

                    var columndata = Snow.Util.getEleInObjArrByAttr(data, "columnName", fieldTmp);
                    //if(!columndata) continue;

                    col.title = (options.title && options.title.length && options.title.length > j && options.title[j]) ? options.title[j] : columndata.columnComment;

                    col.width = (options.width && options.width.length && options.width.length > j && options.width[j]) ? options.width[j] : options.defaultWidth;

                    if (options.templet && options.templet.length && options.templet.length >= j && options.templet[j]) {
                        col.templet = options.templet[j];
                    }

                    cols.push(col);
                }

                (options.toolbar && options.toolbar.fixed == 'right') ? cols.push(options.toolbar) : null;

                options.success([cols]);//回调
            }
        },
        error: function (xhr, textStatus) {
            throw new Error("获取表列信息失败");
        }
        //,complete:function(){}
    })
};

/**
 * Snow.Util.toTreeTableData
 * 将数据转为树结构
 * [重要] 数据必须已按照 fieldTreeDepth 升序排列
 *
 * @param options {String} 参数对象
 * data - [必须]数据
 * fieldName - [必须] 作为树节点 name 的字段
 * fieldId - [必须]ID 字段名
 * fieldPid - [必须]PID 字段名
 * fieldTreeDepth - [必须]树深度字段
 *
 * Returns:
 * {Object{Object}} 数据树形格式
 */
Snow.Util.toTreeTableData = function (options) {
    if (!options || !options.data) throw new Error("data is required！");
    if (!options || !options.fieldName) throw new Error("fieldName is required！");
    if (!options || !options.fieldId) throw new Error("fieldId is required！");
    if (!options || !options.fieldPid) throw new Error("fieldPid is required！");
    if (!options || !options.fieldTreeDepth) throw new Error("fieldTreeDepth is required！");

    var data = options.data;
    var fieldName = options.fieldName;
    var fieldId = options.fieldId;
    var fieldPid = options.fieldPid;
    var fieldTreeDepth = options.fieldTreeDepth;
    var currTreeDepth = null;

    var nodes = [];
    var preLevelNodes = [];
    var currLevelNodes = [];
    var isLevelOne = true;

    for (var i = 0, leni = data.length; i < leni; i++) {
        var d = data[i];
        if (typeof (d[fieldName]) == "undefined" || typeof (!d[fieldId]) == "undefined" || typeof (!d[fieldPid]) == "undefined" || typeof (!d[fieldTreeDepth]) == "undefined") {
            throw new Error("Options Field Error！")
        }
        i == 0 ? currTreeDepth = d[fieldTreeDepth] : null;

        if (currTreeDepth != d[fieldTreeDepth]) {
            isLevelOne = false;
            preLevelNodes = currLevelNodes;
            currLevelNodes = [];
            currTreeDepth = d[fieldTreeDepth];
        }

        if (isLevelOne) {
            var node = {};
            node = Snow.Util.extend(node, d);
            node["name"] = d[fieldName];
            nodes.push(node);
            preLevelNodes.push(node);
            currLevelNodes.push(node);
        }
        else {
            var node = {};
            node = Snow.Util.extend(node, d);
            node["name"] = d[fieldName];

            var pnode = Snow.Util.getEleInObjArrByAttr(preLevelNodes, fieldId, node[fieldPid]);
            if (pnode) {
                pnode["children"] = pnode["children"] ? pnode["children"] : [];
                pnode["children"].push(node);
                currLevelNodes.push(node);
            }
        }
    }

    return nodes;
};

/**
 * Snow.Util.getDataByFromTree
 * 通过递归遍历树获取表格式数据
 *
 * @param treeData {Array{Object}} 参数对象
 * @param fieldName {String} 参数对象
 * @param fieldChildren {String} 参数对象
 *
 * Returns:
 * {Array{Object}} options.resultData。
 */
Snow.Util.getDataByFromTree = function (treeData, fieldName, fieldChildren) {
    if (!treeData) throw new Error("treeData is required！");

    var fieldName = fieldName ? fieldName : "name";
    var fieldChildren = fieldChildren ? fieldChildren : "children";

    var resultData = [];

    function recurrenceTreeData(treeData) {
        for (var i = 0, leni = treeData.length; i < leni; i++) {
            var data = treeData[i];

            var rdata = Snow.Util.deepCloneObj(data);
            delete rdata[fieldName];
            delete rdata[fieldChildren];
            resultData.push(rdata);

            for (var attr in data) {
                if (attr == fieldChildren) {
                    recurrenceTreeData(data[fieldChildren], name);
                }
            }
        }
    }

    recurrenceTreeData(treeData);

    return resultData;
};

// ------------------------- Snow Util Base -------------------------

/* Snow.Util.Event - 事件工具函数 - start */
Snow.Util.Event = {};


/**
 * Snow.Util.Event.stopBubble
 * 阻止事件冒泡
 */
Snow.Util.Event.stopBubble = function (e) {
    //如果提供了事件对象，则这是一个非IE浏览器
    if (e && e.stopPropagation)
        //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    else {
        //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
    }
};


/**
 * Snow.Util.Event.stopBubble
 * 阻止浏览器的默认行为
 */
Snow.Util.Event.stopDefault = function (e) {
    //阻止默认浏览器动作(W3C)
    if (e && e.preventDefault)
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
};
/* Snow.Util.Event - 事件工具函数 - end */





/* Snow.Util.HtmlUtil - Html 工具函数 - start */
Snow.Util.HtmlUtil = {};

/**
 * Snow.Util.HtmlUtil.htmlEncode
 * 用浏览器内部转换器实现html转码
 */
Snow.Util.HtmlUtil.htmlEncode = function (html) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
    (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
    //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
    var output = temp.innerHTML;
    temp = null;
    return output;
};

/**
 * Snow.Util.HtmlUtil.htmlDecode
 * 用浏览器内部转换器实现html解码
 */
Snow.Util.HtmlUtil.htmlDecode = function (text) {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
    temp.innerHTML = text;
    //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
};

/**
 * Snow.Util.HtmlUtil.htmlEncodeByRegExp
 * 用正则表达式实现html转码
 */
Snow.Util.HtmlUtil.htmlEncodeByRegExp = function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
};

/**
 * Snow.Util.HtmlUtil.htmlDecodeByRegExp
 * 用正则表达式实现html解码
 */
Snow.Util.HtmlUtil.htmlDecodeByRegExp = function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
};
/* Snow.Util.HtmlUtil - Html 工具函数 - end */

if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function () {
        return Snow;
    });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Snow;
} else {
    window.Snow = Snow;
}