//app.js
const CONFIG = require('./config');
const V = require('./utils/v');
require('./utils/console');

App({
	onLaunch: function() {},
	setPageData: function(page, key, val, override) {
		//default override
		if (override === undefined) override = true;
		if (!this.globalData.pageData[page]) this.globalData.pageData[page] = {}
		if (override || this.globalData.pageData[page][key] === undefined) this.globalData.pageData[page][key] = val;
	},
	getPageData: function(page, key, defaultval) {
		if (defaultval === undefined) {
			defaultval = '';
		}
		if (this.globalData.pageData[page] && this.globalData.pageData[page][key] !== '') {
			return _.clone(this.globalData.pageData[page][key]);
		} else {
			return defaultval;
		}
	},
	setToken: function(token, fn) {
		let that = this;
		that.globalData.token = token;
		return wx.setStorage({
			key: V.SK.TOKEN,
			data: token,
			success: () => {
				CONFIG.debug && console.log(`app.setToken=${token} success!`);
				_.isFunction(fn) && fn();
			}
		});
	},
	getToken: function() {
		let that = this;
		if (that.globalData.token) return that.globalData.token;
		return wx.getStorageSync(V.SK.TOKEN);
	},
	setUserInfo: function(userInfo, fn) {
		let that = this;
		that.globalData.userInfo = userInfo;
		return wx.setStorage({
			key: V.SK.USER_INFO,
			data: userInfo,
			success: () => {
				CONFIG.debug && console.log(`app.setUserInfo=${userInfo} success!`)
				_.isFunction(fn) && fn();
			}
		});
	},
	getUserInfo: function() {
		let that = this;
		if (that.globalData.userInfo) return that.globalData.userInfo;
		return wx.getStorageSync(V.SK.USER_INFO);
	},
	globalData: {
		sysInfo: null,
		userInfo: null,
		openedFrom: '',
		openedPath: '',
		pageData: {}
	}
});