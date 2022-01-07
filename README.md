# u-Helper

> 目前仅支持Mac OS 使用

## Feature

- [x] 启动微信开发工具：使用 vue-cli 搭建的 uniapp 项目执行 `yarn dev:mp-weixin` 后会自动拉起微信开发工具（丢掉Hbuild X 吧 [黑脸]）
- [ ] 依赖预检查
- [ ] 上传微信小程序体验版
- [ ] 集成钉钉机器人

## Usage

### install

```bash
npm install u-helper -D
```

### Configuration

```js
// vue.config.js
const wechatPlugin = require("u-helper")
module.exports = {
    configureWebpack: {
        plugins: [
            new wechatPlugin()
        ]
    }
}
```
