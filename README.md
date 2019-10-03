# base-wechat-app

一个针对微信小程序原生开发制定的基础工程

## 特点

* 技术栈: gulp[打包]；less[样式]；蓝湖[协助获取设计稿样式]；常用代码压缩兼容；常用函数库：moment[日期], underscore[工具]；

* gulp [dev|staging|prod] 针对3个环境打包，分别采用conf下对应的config-[env].js 文件

* gulp watch:[env] 监听src文件夹，并构建对应环境代码 到`dist`

* 主题定制：通过less变量达到目的，可以直接修改src/assets/style/base/variable/下的wxss

* 蓝湖数据加工：通过蓝湖复制到的文本信息可以直接转化为基于less变量的代码段。（需开启任务`gulp lab`，监听输入文件`lab/src/style.txt`，输出到`lab/dist/style.css`）。如需修改，请改`lab/lab.js`。（gulpfile.js 从这个文件引入了一个task）

* 独立接口文件，修改接口，只修改配置，调用方式简洁

* 提供全局分页面缓存变量，全局缓存token，全局缓存用户信息

* 适配iphoneX机制。

## 开发说明

开发文档链接 [DEV.md](./DEV.md)