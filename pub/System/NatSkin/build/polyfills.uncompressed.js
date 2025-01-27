/**
 * Polyfills for Array methods defined in ECMA-262, 5th edition (ES5).
 *
 * All implementations taken from the Mozilla Developer Network, with
 * inline annotations removed and shit indentation corrected (dear world:
 * stop using 2-space tabs, SERIOUSLY.)
 */


/** Every */
if(!Array.prototype.every){
        
        Array.prototype.every = function(fn, thisArg){
                "use strict";
                var T, k;
                
                if(this == null)
                        throw new TypeError("'this' is null or not defined");
                
                var O = Object(this);
                var l = O.length >>> 0;
                if("function" !== typeof fn)
                        throw new TypeError();
                
                if(arguments.length > 1)
                        T = thisArg;
                
                k = 0;
                while (k < l){
                        var kValue;
                        if(k in O){
                                kValue = O[k];
                                var testResult = fn.call(T, kValue, k, O);
                                if(!testResult) return false;
                        }
                        k++;
                }
                return true;
        };
}




/** Filter */
if(!Array.prototype.filter){    
        Array.prototype.filter = function(fn){
                "use strict";
                
                if(this === void 0 || this === null)
                        throw new TypeError();
                
                var t      = Object(this);
                var length = t.length >>> 0;
                if("function" !== typeof fn)
                        throw new TypeError();
                
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for(var val, i = 0; i < length; i++){
                        if(i in t){
                                if(fn.call(thisArg, val = t[i], i, t))
                                        res.push(val);
                        }
                }
                
                return res;
        };
}



/** forEach */
if(!Array.prototype.forEach){

        Array.prototype.forEach = function(callback, thisArg){
                var T, k;
                
                if(this === null)
                        throw new TypeError(" this is null or not defined");
                
                var O = Object(this);
                var l = O.length >>> 0;
                
                if("function" !== typeof callback)
                        throw new TypeError(callback + " is not a function");
                
                if(arguments.length > 1)
                        T = thisArg;
                
                k = 0;
                while(k < l){
                        var kValue;
                        if(k in O){
                                kValue = O[k];
                                callback.call(T, kValue, k, O);
                        }
                        k++;
                }
        };
}



/** indexOf */
if(!Array.prototype.indexOf){
        
        Array.prototype.indexOf = function(searchElement, fromIndex){
                var k;
                
                if(this == null)
                        throw new TypeError('"this" is null or not defined');
                
                var o = Object(this);
                var l = o.length >>> 0;
                if(l === 0)
                        return -1;
                
                var n = +fromIndex || 0;
                if(Math.abs(n) === Infinity)
                        n = 0;
                
                if(n >= l)
                        return -1;
                k = Math.max(n >= 0 ? n : l - Math.abs(n), 0);
                
                while(k < l){
                        if(k in o && o[k] === searchElement)
                                return k;
                        k++;
                }
                return -1;
        };
}



/** lastIndexOf */
if(!Array.prototype.lastIndexOf){
        
        Array.prototype.lastIndexOf = function(searchElement){
                "use strict";
                
                if(this === void 0 || this === null)
                        throw new TypeError();
                
                var n, k,
                t   = Object(this),
                len = t.length >>> 0;
                
                if(len === 0)
                        return -1;
                
                n = len - 1;
                if(arguments.length > 1){
                        n = Number(arguments[1]);
                        if(n != n) n = 0;
                        else if(n != 0 && n != (1 / 0) && n != -(1 / 0))
                                n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
                
                for(k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--)
                        if(k in t && t[k] === searchElement) return k;
                return -1;
        };
}



/** Map */
if(!Array.prototype.map){
        
        Array.prototype.map = function(fn, thisArg){
                var T, A, k;
                
                if(this == null)
                        throw new TypeError('"this" is null or not defined');
                
                var O = Object(this);
                var l = O.length >>> 0;
                
                if("function" !== typeof fn)
                        throw new TypeError(fn + " is not a function");
                
                if(arguments.length > 1)
                        T = thisArg;
                
                A = new Array(l);
                k = 0;
                while (k < l){
                        var kValue, mappedValue;
                        if(k in O){
                                kValue = O[k];
                                mappedValue = fn.call(T, kValue, k, O);
                                A[k] = mappedValue;
                        }
                        k++;
                }
                
                return A;
        };
}



/** Reduce */
if(!Array.prototype.reduce){
        Array.prototype.reduce = function(fn){
                "use strict";
                
                if(this == null)
                        throw new TypeError("Array.prototype.reduce called on null or undefined");
                
                if("function" !== typeof fn)
                        throw new TypeError(fn + " is not a function");
                
                var t = Object(this), len = t.length >>> 0, k = 0, value;
                if(2 === arguments.length)
                        value = arguments[1];
                
                else{
                        while(k < len && !(k in t)) k++;
                        if(k >= len)
                                throw new TypeError("Reduce of empty array with no initial value");
                        value = t[k++];
                }
                
                for(; k < len; k++)
                        if(k in t) value = fn(value, t[k], k, t);
                
                return value;
        };
}



/** reduceRight */
if(!Array.prototype.reduceRight){
        
        Array.prototype.reduceRight = function(fn){
                "use strict";
                
                if(null == this)
                        throw new TypeError("Array.prototype.reduce called on null or undefined");
                
                if("function" !== typeof fn)
                        throw new TypeError(fn + " is not a function");
                
                var t = Object(this), len = t.length >>> 0, k = len - 1, value;
                if(arguments.length >= 2)
                        value = arguments[1];
                
                else{
                        while(k >= 0 && !(k in t)) k--;
                        if(k < 0)
                                throw new TypeError("Reduce of empty array with no initial value");
                        value = t[k--];
                }
                
                for(; k >= 0; k--)
                        if(k in t) value = fn(value, t[k], k, t);
                return value;
        };
}



/** Some */
if(!Array.prototype.some){
        
        Array.prototype.some = function(fn){
                "use strict";
                
                if(this == null)
                        throw new TypeError("Array.prototype.some called on null or undefined");
                
                if(typeof fn !== "function")
                        throw new TypeError();
                
                var t = Object(this);
                var l = t.length >>> 0;
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for(var i = 0; i < l; i++)
                        if(i in t && fn.call(thisArg, t[i], i, t)) return true;
                return false;
        };
}
if (!String.fromCodePoint) {
        (function() {
                var defineProperty = (function() {
                        // IE 8 only supports `Object.defineProperty` on DOM elements
                        try {
                                var object = {};
                                var $defineProperty = Object.defineProperty;
                                var result = $defineProperty(object, object, object) && $defineProperty;
                        } catch(error) {}
                        return result;
                }());
                var stringFromCharCode = String.fromCharCode;
                var floor = Math.floor;
                var fromCodePoint = function(_) {
                        var MAX_SIZE = 0x4000;
                        var codeUnits = [];
                        var highSurrogate;
                        var lowSurrogate;
                        var index = -1;
                        var length = arguments.length;
                        if (!length) {
                                return '';
                        }
                        var result = '';
                        while (++index < length) {
                                var codePoint = Number(arguments[index]);
                                if (
                                        !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                                        codePoint < 0 || // not a valid Unicode code point
                                        codePoint > 0x10FFFF || // not a valid Unicode code point
                                        floor(codePoint) != codePoint // not an integer
                                ) {
                                        throw RangeError('Invalid code point: ' + codePoint);
                                }
                                if (codePoint <= 0xFFFF) { // BMP code point
                                        codeUnits.push(codePoint);
                                } else { // Astral code point; split in surrogate halves
                                        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                                        codePoint -= 0x10000;
                                        highSurrogate = (codePoint >> 10) + 0xD800;
                                        lowSurrogate = (codePoint % 0x400) + 0xDC00;
                                        codeUnits.push(highSurrogate, lowSurrogate);
                                }
                                if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                                        result += stringFromCharCode.apply(null, codeUnits);
                                        codeUnits.length = 0;
                                }
                        }
                        return result;
                };
                if (defineProperty) {
                        defineProperty(String, 'fromCodePoint', {
                                'value': fromCodePoint,
                                'configurable': true,
                                'writable': true
                        });
                } else {
                        String.fromCodePoint = fromCodePoint;
                }
        }());
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith */
if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(search, this_len) {
                if (this_len === undefined || this_len > this.length) {
                        this_len = this.length;
                }
                return this.substring(this_len - search.length, this_len) === search;
        };
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes */
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat */
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  }
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith */
if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(search, pos) {
                return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        };
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr */
// only run when the substr() function is broken
if ('ab'.substr(-1) != 'b') {
  /**
   *  Get the substring of a string
   *  @param  {integer}  start   where to start the substring
   *  @param  {integer}  length  how many characters to return
   *  @return {string}
   */
  String.prototype.substr = function(substr) {
    return function(start, length) {
      // call the original method
      return substr.call(this,
        // did we get a negative start, calculate how much it is from the beginning of the string
        // adjust the start parameter for negative value
        start < 0 ? this.length + start : start,
        length)
    }
  }(String.prototype.substr);
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
