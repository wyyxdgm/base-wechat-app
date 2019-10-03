# 开发文档

## 初始化

1. 安装依赖: `npm i` 或 `yarn`

2. 生成测试环境到`dist`: `gulp dev`

3. 开发者工具打开 `dist`


## 环境切换

### 生成dev环境代码

```bash
gulp dev
```

### 生成staging环境代码

```bash
gulp staging
```

### 生成生产环境代码

```bash
gulp prod
```

### 开发是自动生成

```bash
# 等同 gulp watch:dev
# 等同 gulp default
gulp
```

### 开发必读【结构说明】

```
├── DEV.md                             --本文件
├── README.md                          --本文件
├── conf                               --配置各环境，gulp [dev|staging|prod] 后，会将对应文件拷贝到 dist/utils/config.js
│   ├── config-dev.js
│   ├── config-prod.js
│   └── config-staging.js
├── dist                               --编译后的目标目录，用小程序开发者工具打开此目录
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── assets
│   ├── config.js
│   ├── pages
│   ├── project.config.json
│   ├── sitemap.json
│   └── utils
├── gulpfile.js
├── lab                                --含gulp的task脚本目录
│   └── lab.js                         --定义了一个任务，可以把蓝湖上的css代码，转成项目中需要的less支持的格式,同时会把存在的颜色转成 `src/assets/style/base/variable/color.wxss`中定义的变量
├── project.ex.json                    --暂时没用
└── src                                --源代码编写路径
    ├── app.js
    ├── app.json
    ├── app.wxss                       --会引入assets/style下fn.wxss和mui.wxss的样式
    ├── assets
    │   └── style                      --所有底层样式定制都可以在对应的地方编码，结构参考官方demo样式结构。
    │       ├── base
    │       │   ├── fn.wxss
    │       │   ├── mixin
    │       │   ├── reset.wxss
    │       │   └── variable
    │       ├── fn.wxss
    │       ├── mui.wxss
    │       └── widget
    ├── pages                           --页面文件
    ├── test                            --测试文件
    └── utils                           --所有核心非页面js
		├── api.js                      --定制后端接口，随后，直接用`CLIENT.do.function_name({})`,调用对应接口
		├── client.js                   --定制封装了request的http客户端，暴露LIENT.do.*作为后端接口直接调用
		├── console.js                  --重写console,根据config中的debug值确定是否输出log
		├── moment.min.js               --日期常用库
		├── underscore.js               --纯函数库
		├── util.js                     --本地工具函数
		├── v.js                        --定义全局常量
		└── wx-promise-request.js       --client.js中使用这个request代替wx.request
```

### 开发定制

app.js全局缓存页面变量函数，可用于页面传参

	```js
	// 同步
	getApp().setPageData('pagename_1', 'key', <值>, <是否强制覆盖>);
	getApp().getPageData('pagename_1', 'key');
	// 异步
	getApp().setToken('token_1', <callback>);
	let token = getApp().getToken(); // token = token_1
	// 异步
	getApp().setUserInfo({...userInfo}, <callback>); // 异步
	let userInfo = getApp().getUserInfo();
	```

接口文件独立

	所有接口都集中到单个文件（`src/utils/api.js`）配置，调用方式简洁，如下：(`on_login`是`api.js`中导出的一个键)

	`src/utils/api.js` 中
	```
	module.exports = {
		"on_login": {
			desc: "用户登录",
			url: `${BASE_URL}v1/user/on_login/`,
			method: "post",
		}
	}
	```
	调用接口的js中
	```
	CLIENT.do.on_login({...params})
	.then(console.log)
	.catch(console.error);
	```

适配iphone-x机制。使用util.setData()替代pageContext.setData()，可以默认设置一些参数到页面中（`{isIphoneX,isHighScreen}`），具体参考`src/util.js`

	```js
	util.setData(pageContext,{data1});
	```


### 注意

* 样式文件只能检测直接被引入该样式的页面，二级import的样式文件修改不会触发页面更新。  
* background-image 得使用Base64数据，gulp中启用了样式中的图片直接转base64引入。

### 快速生成样式代码

执行 `gulp lab` 监听 `lab/src/style.txt`(直接从蓝湖网页复制样式文本) 变化。自动生成到 `lab/dist/style.txt`

```
gulp lab
```

## 常规操作

### pages页面常用引用样式函数

```
@import "../../assets/style/fn.wxss";
```

### 模拟直接打开特定页面

```js
wx.reLaunch({url:'/pages/page_name/index?p=s'});
```


### gulp 总任务

```bash
gulp -T # 输出如下，具体请看源码gulpfile.js
```

```bash
[22:33:46] Tasks for base-wechat-app/gulpfile.js
[22:33:46] ├── lab
[22:33:46] ├── watch
[22:33:46] ├── clean
[22:33:46] ├── compress
[22:33:46] ├── htmlminify
[22:33:46] ├── build:style
[22:33:46] ├── build:style:dev
[22:33:46] ├── cp:common
[22:33:46] ├── cp:common:dev
[22:33:46] ├─┬ build:common
[22:33:46] │ ├── build:style
[22:33:46] │ ├── cp:common
[22:33:46] │ ├── compress
[22:33:46] │ └── htmlminify
[22:33:46] ├─┬ build:common:dev
[22:33:46] │ ├── build:style:dev
[22:33:46] │ └── cp:common:dev
[22:33:46] ├── build:env:dev
[22:33:46] ├─┬ dev
[22:33:46] │ ├─┬ build:common:dev
[22:33:46] │ │ ├── build:style:dev
[22:33:46] │ │ └── cp:common:dev
[22:33:46] │ └── build:env:dev
[22:33:46] ├── watch:dev
[22:33:46] ├── build:env:staging
[22:33:46] ├─┬ staging
[22:33:46] │ ├─┬ build:common
[22:33:46] │ │ ├── build:style
[22:33:46] │ │ ├── cp:common
[22:33:46] │ │ ├── compress
[22:33:46] │ │ └── htmlminify
[22:33:46] │ └── build:env:staging
[22:33:46] ├── watch:staging
[22:33:46] ├── build:env:prod
[22:33:46] ├─┬ prod
[22:33:46] │ ├─┬ build:common
[22:33:46] │ │ ├── build:style
[22:33:46] │ │ ├── cp:common
[22:33:46] │ │ ├── compress
[22:33:46] │ │ └── htmlminify
[22:33:46] │ └── build:env:prod
[22:33:46] ├── watch:prod
[22:33:46] ├── test
[22:33:46] └─┬ default
[22:33:46]   └── watch:dev
```

