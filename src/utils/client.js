const CONFIG = require('../config');
const _ = require('./underscore');
const proReq = require('./wx-promise-request');
const api = require('./api');
const V = require('./v.js');
const util = require('./util.js');

proReq.setConfig({
	concurrency: CONFIG.requestConcurrency || 10
});

/**
 * 参数名	类型	必填	默认值	说明	最低版本
 * url	String	是		开发者服务器接口地址
 * data	Object/String/ArrayBuffer	否		请求的参数
 * header	Object	否		设置请求的 header，header 中不能设置 Referer。
 * method	String	否	GET	（需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
 * dataType	String	否	json	如果设为json，会尝试对返回的数据做一次 JSON.parse
 * responseType	String	否	text	设置响应的数据类型。合法值：text、arraybuffer	1.7.0
 * success	Function	否		收到开发者服务成功返回的回调函数
 * fail	Function	否		接口调用失败的回调函数
 * complete	Function	否		接口调用结束的回调函数（调用成功、失败都会执行） *
 *
 */
var request = (options = {}) => {
	//url can be path relative to baseUrl
	if (options.url && options.url.indexOf(CONFIG.baseUrl) < 0) options.url = CONFIG.baseUrl + options.url;
	if (!options.header) options.header = {};

	// default [content-type] = 'application/x-www-form-urlencoded'
	// ## 'application/json'
	if (!options.header['content-type']) options.header['content-type'] = 'application/json'; // x-www-form-urlencoded
	//default cookie = token
	if (!options.header[V.HEADER_AUTH_KEY]) options.header[V.HEADER_AUTH_KEY] = getApp().getToken();
	// other options
	var complete = (err, re) => {
		if (_.isFunction(options.complete)) options.complete(err, res);
		console.log(`Finish ${options.method} ${options.url}`);
	}
	let _promise = proReq.request(options);
	_promise._time = new Date();

	var _then = _promise.then;
	var _catch = _promise.catch;
	_promise.then = (cb) => {
		var _cb = cb;
		cb = (res) => {
			console.log(`SUCCESS ==>${options.method} ${options.url} ${new Date() - _promise._time}ms ${res.data.status}`, res)
			if (res.data.status !== V.RS.SUCCESS || _.isEmpty(res.data.data)) {
				// util.tipSystemException();
			} else {
				_.isFunction(_cb) && _cb(res.data);
			}

			complete(null, res.data);
		}
		return _then.call(_promise, cb);
	};
	_promise.catch = (cb) => {
		var _cb = cb;
		cb = (error) => {
			console.log(`ERROR ==>${options.method} ${options.url} ${new Date() - _promise._time}ms`, error)
			_.isFunction(_cb) && _cb(error);
			// util.tipNetworkException();
			complete(error);
		}
		return _catch.call(_promise, cb);
	};
	if (options.success) _promise = _promise.then(options.success);
	if (options.fail) _promise = _promise.catch(options.fail);
	return _promise;
}

let apis = {};
let _do = {};
_.each(api, (v, k) => {
	// module.exports.do[k] = () => request(v);
	_do[k] = (data) => {
		let opt = data ? _.extend(v, {
			data
		}) : v;
		//check post params
		if (opt.body) {
			for (let key in opt.body) {
				if (opt.body && !opt.data) return console.error('!!!!!!!!![Error - Lack of parameters]\n', 'url:', opt.url, '\ndata:', key)
			}
		}
		//check get params
		let pReg;
		while (pReg = /\/:([^\/]+)/.exec(opt.url)) {
			if (!data || undefined === data[pReg[1]]) return console.error('!!!!!!!!![Error - Lack of parameters]\n', 'url:', opt.url, '\nparameter:', pReg[1])
			opt.url = opt.url.replace(`:${pReg[1]}`, data[pReg[1]]);
			delete opt.data[pReg[1]];
		}
		return request(opt);
	};
	console.log(v.desc, '\n', `register: client.do.${k} =>\n ${v.method} ${v.url}`);
});

module.exports.do = _do;

module.exports.request = request;

function login(cb) {
	wx.login({
		success: res => wx.setStorage({
			key: V.SK.LOGIN_CODE,
			data: res.code,
			success: () => {
				CONFIG.debug && console.log(`setStorage ${V.SK.LOGIN_CODE}=${res.code} success!`)
				return _.isFunction(cb) && cb(null, res.code)
			}
		}),
		fail: (err) => {
			util.tipNetworkException();
			return _.isFunction(cb) && cb(err);
		},
		complete: () => {}
	});
}
module.exports.login = login;

function authLogin(cb) {
	return login((err, code) => {
		if (err) return cb && typeof cb === 'function' && cb(err);
		_do.post_auth_login({
			payload: JSON.stringify({
				code
			}),
			social_network: V.SN.WECHAT_APP
		}).then(res => {
			if (!res.data.token) {
				warning('登录失败')
				return cb && typeof cb === 'function' && cb('未获得token');
			};
			getApp().setToken(res.data.token, function() {
				cb && typeof cb === 'function' && cb(null, res.data.token);
			});
		}).catch();
	});
}
module.exports.authLogin = authLogin;
