var util = require('../utils/util.js');
const CONFIG = require('../config');
const V = require('../utils/v.js');
var CLIENT = require('../utils/client.js');
const _ = require('../utils/underscore');

let test = () => {
	// CLIENT.do.get_group_list({
	// 	lang: V.LANG.CN_ZH,
	// 	page_no: 1
	// }).then(res => {}).catch(error => util.tipNetworkException());

	// CLIENT.do.get_group({
	// 	group_id: 1
	// }).then(res => {}).catch(error => util.tipNetworkException());

	// CLIENT.do.post_group_result({
	// 	group_id: 1,
	// 	choices: '113'
	// }).then(res => {}).catch(error => util.tipNetworkException());

	// CLIENT.do.post_auth_login({
	// 	payload: '1',
	// 	social_network: V.SN.WECHAT_APP
	// }).then(res => {}).catch(error => util.tipNetworkException());

	// CLIENT.do.get_group_result({
	// 	group_id: 1
	// }).then(res => {}).catch(error => util.tipNetworkException());

}
let resData = {
	get_group_result: {
		"data": {
			"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
			"group": 1,
			"id": 16,
			"result": {
				"id": 1,
				"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
				"description": "你是一个呆萌且魅力满满，充满正义的超级英雄，虽然有点纠结，但是不会阻碍你成为矫健的蜘蛛侠。你是一个呆萌且魅力满满，充满正义的超级英满满，充满正义的超级英雄，虽然有点纠结，但是不会阻碍你成为矫健的蜘蛛侠。你是一个呆萌且魅力满满，充满正义的超级英雄，虽然有点纠结，但是不会阻碍你成为矫健的蜘蛛侠。",
				"personas": [{
					"description": "Persona 1",
					"id": 1,
					"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
					"title": "Persona 1"
				}, {
					"description": "Persona 2",
					"id": 2,
					"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
					"title": "Persona 2"
				}, {
					"description": "Persona 1",
					"id": 1,
					"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
					"title": "Persona 1"
				}, {
					"description": "Persona 2",
					"id": 2,
					"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
					"title": "Persona 2"
				}],
				"title": "宁做废柴回归本我的蝙蝠侠"
			},
			"user": 2
		},
		"status": 200
	},
	group: {
		"data": {
			"group": {
				"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
				"share_footer_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
				"cases": [{
					"choices": [{
						"case": 1,
						"description": "Choice 1 - 1",
						"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"id": 1,
						"rank": 0
					}, {
						"case": 1,
						"description": "Choice 1 - 2",
						"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"id": 2,
						"rank": 1
					}],
					"description": "Chinese case 1",
					"group": 1,
					"id": 1,
					"images": [{
						"case": 1,
						"description": "case 1 image 1",
						"id": 1,
						"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"rank": 0
					}],
					"rank": 0,
					"title": "Chinese case 1"
				}, {
					"choices": [{
						"case": 2,
						"description": "Choice 2 - 1",
						"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"id": 3,
						"rank": 0
					}, {
						"case": 2,
						"description": "Choice 2 - 2",
						"background_image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"id": 4,
						"rank": 1
					}],
					"description": "Chinese case 2",
					"group": 1,
					"id": 2,
					"images": [{
						"case": 2,
						"description": "case 2 image 1",
						"id": 2,
						"image": "http://bsset.q0studio.com/media/82bb4d3c-4519-41a8-8363-a2aa2d9ca55d.png",
						"rank": 0
					}],
					"rank": 1,
					"title": "Chinese case 2"
				}],
				"description": "Chinese group 1",
				"id": 1,
				"lang": 0,
				"rank": 0,
				"title": "Chinese group 1"
			}
		},
		"status": 200
	}
}

module.exports = {
	test,
	resData
}