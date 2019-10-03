let CONFIG = require('../config');
const BASE_URL = CONFIG.baseUrl;
module.exports = {
	"on_login": {
		desc: "用户登录",
		url: `${BASE_URL}v1/user/on_login/`,
		method: "post",
	},
	"info": {
		desc: "用户信息",
		url: `${BASE_URL}v1/user/info/`,
		method: "get",
	}
}
