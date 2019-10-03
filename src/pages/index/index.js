// index.js
var util = require('../../utils/util.js');
const CONFIG = require('../../config');
var CLIENT = require('../../utils/client.js');
var app = getApp();
const _ = require('../../utils/underscore');
Page({

	data: {
		isLoaded: true,
		text: "default text"
	},
	login: function() {
		console.log('login')
		// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
		let shared_by_user_id = 1;
		let shared_time = new Date()
		wx.login({
			success(res) {
				if (res.code) {
					// 发起网络请求
					let code = res.code;
					wx.getSetting({
						success(res) {
							if (!res.authSetting['scope.userInfo']) {
								wx.authorize({
									scope: 'scope.userInfo',
									success() {
										console.log('授权成功！')
										wx.getUserInfo({
											success(get_user_info_res) {
												CLIENT.do.on_login({
														shared_by_user_id,
														shared_time,
														code,
														get_user_info_res
													})
													.then(console.log)
													.catch(console.error);
											}
										})
									}
								})
							} else {
								wx.getUserInfo({
									success(get_user_info_res) {
										CLIENT.do.on_login({
												shared_by_user_id,
												shared_time,
												code,
												get_user_info_res
											})
											.then(console.log)
											.catch(console.error);
									}
								})
							}
						}
					})

				} else {
					console.log('登录失败！' + res.errMsg)
				}
			}
		})
	},
	onLoad: function(options) {
		let that = this;

		CLIENT.do.on_login({})
			.then(console.log)
			.catch(console.error);

		// CLIENT.do.info({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.survey_info({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.survey_submit({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.get_coupon_for_subscribe({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.subscribe_pay({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.order_box({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.order_post_back({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.order_post_back_cancel({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.order_pay({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.order_feedback({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.coupon_list({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.coupon_exchange({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.address_list({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.address_create({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.address_update({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.phone_send_sm({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.phone_bind({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// CLIENT.do.phone_unbind({})
		// 	.then(console.log)
		// 	.catch(console.error);

		// util.showLoading('wait 3000 ms...');
		// setTimeout(() => {
		// 	util.setData(that, {
		// 		text: 'new text',
		// 		isLoaded: true
		// 	});
		// 	util.hideLoading();
		// }, 3000);
	},

	onReady: function() {

	},


	onShow: function() {

	},

	onHide: function() {

	},

	onUnload: function() {

	},
	imageLoaded: function() {},


	onPullDownRefresh: function() {},


	onReachBottom: function() {

	},
	onGotUserInfo: function(e) {
		let that = this;
		console.log(e.detail);
		if (!e.detail.userInfo) {
			return wx.showToast({
				title: '授权失败!',
				icon: 'none',
				duration: 2000
			});
		} else {
			wx.showToast({
				icon: 'loading',
				duration: 1000
			});
		}
		let userInfo = e.detail.userInfo;
		let tip = (info = '授权成功！') => {
			return wx.showToast({
				title: info
			});
		}
		wx.getStorage({
			key: "userinfo",
			success: function(res) {
				if (res.data) userInfo = _.extend(res.data, userInfo);
				wx.setStorage({
					key: "userinfo",
					data: userInfo
				});
				tip();
			},
			fail: function(res) {
				wx.setStorage({
					key: "userinfo",
					data: userInfo
				});
				tip();
			}
		});
	},

	onShareAppMessage: function() {
		var that = this;
		return {
			title: CONFIG.shareTitle,
			path: `/pages/index/index?isFromShare=true`
		}
	}

})
