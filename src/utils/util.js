const _ = require('./underscore');
const moment = require('./moment.min');
const CONFIG = require('../config');
const V = require('./v.js');

function isValidateCellphoneNumber(cellphone) {
	if (cellphone.match(/^(((13[0-9]{1})|159|153)+\d{8})$/)) {
		return true;
	} else {
		return false;
	}
}

function findObjectFromArrayByProp(arr, val, prop) {
	if (prop === undefined) prop = 'id';
	return _.find(arr, function(e) {
		return e[prop] === val;
	});
}

function findIndexInArrayByProp(arr, val, prop) {
	if (prop === undefined) prop = 'id';
	return _.findIndex(arr, function(e) {
		return e[prop] === val;
	});
}

function calLength(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		var a = str.charAt(i);
		if (a.match(/[^\x00-\xff]/ig) != null) {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len;
}
var sysInfo = wx.getSystemInfoSync();

function isIphoneX() {
	return sysInfo.model.indexOf('iPhone X') >= 0;
}

function isHighScreen() {
	return 1.0 * sysInfo.screenWidth / sysInfo.screenHeight < 1.0 * 375 / 690;
}

function getScreenHeight(cut) {
	return sysInfo.windowHeight * 750 / sysInfo.windowWidth - cut || 0;
}

function getPxToRpx(px) {
	return getPxRpxRate() * px;
}

function getPxRpxRate() {
	return 750.0 / sysInfo.windowWidth || 2;
}

function getPx(px, windowWidth) {
	// if (px == 375) return windowWidth;
	return parseInt(px * windowWidth * 1.0 / 375);
}

function getPxByRpx(rpx, windowWidth) {
	return getPx(rpx * 1.0 / 2, windowWidth);
}
/**
 * 绘制多行文本，并返回高度差
 * @param  CanvasContext ctx
 * @param  string text
 * @param  int x            [description]
 * @param  int y            [description]
 * @param  int maxWidth     [description]
 * @param  int lineHeight   [description]
 * @param  int defaultLines [description]
 * @param  boolean forceLine    固定内容行数
 * @return int              实际绘制高度-计划高度
 */
let drawText = (ctx, text, x, y, maxWidth, lineHeight, defaultLines = 1, forceLine) => {
	var lineWidth = 0;
	var lineCount = 1;
	var initHeight = y; //绘制字体距离canvas顶部初始的高度
	var lastSubStrIndex = 0; //每次开始截取的字符串的索引
	for (let i = 0; i < text.length; i++) {
		lineWidth += ctx.measureText(text[i]).width;
		if (lineWidth > maxWidth) {
			if (forceLine) {
				ctx.fillText(text.substring(lastSubStrIndex, i - 3) + '...', x, initHeight); //绘制截取部分
				return 0;
			}
			ctx.fillText(text.substring(lastSubStrIndex, i), x, initHeight); //绘制截取部分
			initHeight += lineHeight || 24; //20为字体的高度
			lineWidth = 0;
			lastSubStrIndex = i;
			lineCount += 1;
		}
		// console.log(lineCount, defaultLines, lineHeight);
		if (i == text.length - 1) { //绘制剩余部分
			ctx.fillText(text.substring(lastSubStrIndex, i + 1), x, initHeight);
		}
	}
	return (lineCount - defaultLines) * (lineHeight || 24);
}

function setData(context, data) {
	if (!context || !context.setData || typeof context.setData !== 'function') return;
	var _data = _.extend({
		isIphoneX: isIphoneX(),
		isHighScreen: isHighScreen()
	}, data);
	context.setData(_data);
}

function toFixedFloat(f, n = 2) {
	return parseFloat(parseFloat(f).toFixed(n));
}

function getPositiveIndex(index, part) {
	return (part + index % part) % part;
}

function getTextLength(str) {
	if (!str) return 0;
	return str.match(/[^ -~]/g) == null ? str.length : str.length + str.match(/[^ -~]/g).length;
}

function tipNetworkException() {
	wx.showModal({
		title: '网络异常',
		content: '请确认网络状态',
		showCancel: false,
		confirmText: '好'
	});
}

function tipSystemException() {
	wx.showModal({
		title: '系统异常',
		content: '请联系客服',
		showCancel: false,
		confirmText: '好'
	});
}

function showLoading(title) {
	wx.showLoading({
		icon: 'loading',
		mask: true,
		title: title || '...'
	});
}


function hideLoading() {
	wx.hideLoading();
}

function warning(title) {
	wx.showToast({
		icon: 'none',
		title: title
	});
}

function success(title) {
	wx.showToast({
		icon: 'success',
		title: title
	});
}

function showModal(content, yFunc, title, showCancel, nFunc, cancelText) {
	if (!content) return;
	wx.showModal({
		title: title || '提示',
		content: content,
		success: (res) => res.confirm ? yFunc && yFunc() : nFunc && nFunc(),
		showCancel: showCancel,
		cancelText: cancelText || '取消'
	})
}

function getOptions(options) {
	//scene=k1:v1;k2:v2;
	if (options.scene) {
		let scene = decodeURIComponent(options.scene) // 官方要求一定要先decodeURIComponent才能正常使用scene
		scene = scene.split(';')
		let obj = {}
		for (let i = 0; i < scene.length; i++) {
			let item = scene[i].split(':')
			obj[item[0]] = item[1]
		}
		// 将options.id 替换为scene中提取的id 以保证后续业务不受影响
		return obj;
	} else if (options.q) { //q={k1:v1,k2:v2};
		try {
			return JSON.parse(decodeURIComponent(options.q))
		} catch (e) {
			console.error(e);
			return {};
		}
	} else {
		return options;
	}
}

function toQueryString(obj) {
	return _.map(obj, (v, k) => `${k}=${v}`).join('&')
}

function encodeOptions(obj) {
	let q = encodeURIComponent(JSON.stringify(obj));
	return {
		q
	};
}

function isLastInArray(index, arr) {
	return arr && arr.length - 1 === index;
}

function downloadImage(url) {
	return new Promise((resolve, reject) => wx.downloadFile({
		url: url, //仅为示例，并非真实的资源
		success(res) {
			// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
			if (res.statusCode === 200) return resolve(res.tempFilePath);
			return reject(res);
		},
		fail: reject
	}));
}

function downloadAllImage(urls) {
	return Promise.all(_.map(urls, url => downloadImage(url)));
}


module.exports = {
	isValidateCellphoneNumber,
	findObjectFromArrayByProp,
	findIndexInArrayByProp,
	calLength,
	setData,
	isIphoneX,
	isHighScreen,
	getPositiveIndex,
	getTextLength,
	getScreenHeight,
	toFixedFloat,
	tipSystemException,
	tipNetworkException,
	showModal,
	success,
	warning,
	showLoading,
	hideLoading,
	encodeOptions,
	toQueryString,
	getOptions,
	isLastInArray,
	getPx,
	getPxByRpx,
	drawText,
	downloadImage,
	downloadAllImage
}