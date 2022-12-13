var toString = Object.prototype.toString;
function isDate(val) {
    return toString.call(val) === '[object Date]';
}
// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }
function isPlainObject(val) {
    return toString.call(val) === '[object Object]';
}
function deepMerge() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objs.forEach(function (obj) {
        if (obj) {
            Object.entries(obj).forEach(function (_a) {
                var k = _a[0], v = _a[1];
                if (isPlainObject(v)) {
                    if (isPlainObject(result[k])) {
                        result[k] = deepMerge(result[k], v);
                    }
                    else {
                        result[k] = deepMerge(v);
                    }
                }
                else {
                    result[k] = v;
                }
            });
        }
    });
    return result;
}

function normalizeHeaderName(headers, normalizedName) {
    if (!headers)
        return;
    Object.keys(headers).forEach(function (name) {
        if (name !== normalizedName &&
            name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            Reflect.deleteProperty(headers, name);
        }
    });
}
function processHeaders(headers, data) {
    normalizeHeaderName(headers, 'Content-Type');
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}
function parseHeaders(headers) {
    var parsed = {};
    if (!headers)
        return parsed;
    headers.split('\r\n').forEach(function (line) {
        var _a = line.split(':'), k = _a[0], v = _a[1];
        k = k.trim().toLowerCase();
        if (!k)
            return;
        if (v) {
            v = v.trim();
        }
        Reflect.set(parsed, k, v);
    });
    return parsed;
}
function flattenHeaders(headers, method) {
    if (!headers) {
        return headers;
    }
    headers = deepMerge(headers.common, headers[method], headers);
    var methodsToDelete = [
        'delete',
        'get',
        'head',
        'options',
        'post',
        'put',
        'patch',
        'common'
    ];
    methodsToDelete.forEach(function (method) {
        Reflect.deleteProperty(headers, method);
    });
    return headers;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var AxiosError = /** @class */ (function (_super) {
    __extends(AxiosError, _super);
    function AxiosError(message, config, code, request, response) {
        var _this = _super.call(this, message) || this;
        _this.config = config;
        _this.code = code;
        _this.request = request;
        _this.response = response;
        _this.isAxiosError = true;
        return _this;
    }
    return AxiosError;
}(Error));
function createError(message, config, code, request, response) {
    return new AxiosError(message, config, code, request, response);
}

function xhr (config) {
    return new Promise(function (resolve, reject) {
        var url = config.url, _a = config.data, data = _a === void 0 ? null : _a, _b = config.method, method = _b === void 0 ? 'get' : _b, _c = config.headers, headers = _c === void 0 ? {} : _c, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken;
        var request = new XMLHttpRequest();
        if (responseType) {
            request.responseType = responseType;
        }
        if (timeout) {
            request.timeout = timeout;
        }
        request.open(method.toUpperCase(), url, true);
        Object.keys(headers).forEach(function (name) {
            if (data === null && name.toLowerCase() === 'content-type') {
                Reflect.deleteProperty(headers, name);
            }
            else {
                request.setRequestHeader(name, headers[name]);
            }
        });
        request.onreadystatechange = function () {
            if (request.readyState !== 4)
                return;
            if (request.status === 0)
                return;
            var responseHeaders = parseHeaders(request.getAllResponseHeaders());
            var responseData = responseType !== 'text' ? request.response : request.responseText;
            var response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config: config,
                request: request
            };
            handleResponse(response);
        };
        request.onerror = function () {
            reject(createError('Network Error', config, null, request));
        };
        request.ontimeout = function () {
            reject(createError("Timeout of ".concat(timeout, " ms exceeded"), config, 'ECONNABORTED', request));
        };
        if (cancelToken) {
            void cancelToken.promise.then(function (reason) {
                request.abort();
                reject(reason);
            });
        }
        request.send(data);
        function handleResponse(response) {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            }
            else {
                reject(createError("Request failed with status code ".concat(response.status), config, null, request, response));
            }
        }
    });
}

function encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}
function buildUrl(url, params) {
    if (!params)
        return url;
    var parts = [];
    Object.entries(params).forEach(function (_a) {
        var k = _a[0], v = _a[1];
        if (v === null || typeof v === 'undefined') {
            return;
        }
        var values = [];
        if (Array.isArray(v)) {
            values = v;
            k += '[]';
        }
        else {
            values = [v];
        }
        values.forEach(function (v2) {
            if (isDate(v2)) {
                v2 = v2.toISOString();
            }
            else if (isPlainObject(v2)) {
                v2 = JSON.stringify(v2);
            }
            parts.push("".concat(encode(k), "=").concat(encode(v2)));
        });
    });
    var serializedParams = parts.join('&');
    if (serializedParams) {
        var markIndex = url.indexOf('#');
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        url += (!url.includes('?') ? '?' : '&') + serializedParams;
    }
    return url;
}

function transform (data, headers, fns) {
    if (!fns) {
        return data;
    }
    if (!Array.isArray(fns)) {
        fns = [fns];
    }
    fns.forEach(function (fn) {
        data = fn(data, headers);
    });
    return data;
}

function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(function (res) { return transformResponseData(res); });
}
function processConfig(config) {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method);
}
function transformURL(config) {
    var url = config.url, params = config.params;
    return buildUrl(url, params);
}
function transformResponseData(res) {
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}

var InterceptorManager = /** @class */ (function () {
    function InterceptorManager() {
        this.interceptors = [];
    }
    InterceptorManager.prototype.use = function (resolved, rejected) {
        this.interceptors.push({
            resolved: resolved,
            rejected: rejected
        });
        return this.interceptors.length - 1;
    };
    InterceptorManager.prototype.forEach = function (fn) {
        this.interceptors.forEach(function (interceptor) {
            if (interceptor !== null) {
                fn(interceptor);
            }
        });
    };
    InterceptorManager.prototype.eject = function (id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    };
    return InterceptorManager;
}());

var strats = Object.create(null);
function defaultStrat(val1, val2) {
    return typeof val2 !== 'undefined' ? val2 : val1;
}
function fromVal2Strat(val1, val2) {
    if (typeof val2 !== 'undefined') {
        return val2;
    }
}
function deepMergeStrat(val1, val2) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2);
    }
    else if (typeof val2 !== 'undefined') {
        return val2;
    }
    else if (isPlainObject(val1)) {
        return deepMerge(val1);
    }
    else if (typeof val1 !== 'undefined') {
        return val1;
    }
}
var stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach(function (key) {
    strats[key] = deepMergeStrat;
});
var stratKeysDeepMerge = ['headers'];
stratKeysDeepMerge.forEach(function (key) {
    strats[key] = fromVal2Strat;
});
function mergeConfig (config1, config2) {
    if (!config2) {
        config2 = {};
    }
    var config = Object.create(null);
    for (var key in config2) {
        mergeField(key);
    }
    for (var key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        var strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2[key]);
    }
    return config;
}

var Axios = /** @class */ (function () {
    function Axios(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }
    Axios.prototype.request = function (url, config) {
        if (typeof url === 'string') {
            if (!config) {
                config = {};
            }
            config.url = url;
        }
        else {
            config = url;
        }
        config = mergeConfig(this.defaults, config);
        var chain = [
            {
                resolved: dispatchRequest,
                rejected: undefined
            }
        ];
        this.interceptors.request.forEach(function (interceptor) {
            chain.unshift(interceptor);
        });
        this.interceptors.response.forEach(function (interceptor) {
            chain.push(interceptor);
        });
        var promise = Promise.resolve(config);
        while (chain.length) {
            var _a = chain.shift(), resolved = _a.resolved, rejected = _a.rejected;
            promise = promise.then(resolved, rejected);
        }
        return promise;
    };
    Axios.prototype.options = function (url, config) {
        return this._requestMethodWithoutData('options', url, config);
    };
    Axios.prototype.head = function (url, config) {
        return this._requestMethodWithoutData('head', url, config);
    };
    Axios.prototype.get = function (url, config) {
        return this._requestMethodWithoutData('get', url, config);
    };
    Axios.prototype.delete = function (url, config) {
        return this._requestMethodWithoutData('delete', url, config);
    };
    Axios.prototype.post = function (url, data, config) {
        return this._requestMethodWithData('post', url, data, config);
    };
    Axios.prototype.put = function (url, data, config) {
        return this._requestMethodWithData('put', url, data, config);
    };
    Axios.prototype.patch = function (url, data, config) {
        return this._requestMethodWithData('patch', url, data, config);
    };
    Axios.prototype._requestMethodWithoutData = function (method, url, config) {
        return this.request(Object.assign(config !== null && config !== void 0 ? config : {}, {
            method: method,
            url: url
        }));
    };
    Axios.prototype._requestMethodWithData = function (method, url, data, config) {
        return this.request(Object.assign(config !== null && config !== void 0 ? config : {}, {
            method: method,
            url: url,
            data: data
        }));
    };
    return Axios;
}());

function transformRequest(data) {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}
function transformResponse(data) {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch (error) { }
    }
    return data;
}

var defaults = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'appliacation/json, text/plain, */*'
        }
    },
    transformRequest: [
        function (data, headers) {
            processHeaders(headers, data);
            return transformRequest(data);
        }
    ],
    transformResponse: [
        function (data) {
            return transformResponse(data);
        }
    ]
};
var methodsNoData = ['delete', 'get', 'head', 'options'];
methodsNoData.forEach(function (method) {
    defaults.headers[method] = {};
});
var methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(function (method) {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
});

var Cancel = /** @class */ (function (_super) {
    __extends(Cancel, _super);
    function Cancel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cancel;
}(Error));
function isCancel(val) {
    return val instanceof Cancel;
}

var CancelToken = /** @class */ (function () {
    function CancelToken(executor) {
        var _this = this;
        var resolvePromise;
        this.promise = new Promise(function (resolve) {
            resolvePromise = resolve;
        });
        executor(function (message) {
            if (_this.reason) {
                return;
            }
            _this.reason = new Cancel(message);
            resolvePromise(_this.reason);
        });
    }
    CancelToken.prototype.throwIfRequested = function () {
        if (this.reason) {
            throw this.reason;
        }
    };
    CancelToken.source = function () {
        var cancel;
        var token = new CancelToken(function (c) {
            cancel = c;
        });
        return {
            cancel: cancel,
            token: token
        };
    };
    return CancelToken;
}());

function createInstance(config) {
    var context = new Axios(config);
    var instance = Axios.prototype.request.bind(context);
    Object.assign(instance, context);
    Object.assign(instance, Object.getPrototypeOf(context));
    return instance;
}
var axios = createInstance(defaults);
axios.create = function (config) {
    return createInstance(mergeConfig(defaults, config));
};
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

export { axios as default };
