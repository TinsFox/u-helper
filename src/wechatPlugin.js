var shell = require('shelljs');
const path = require('path')
class wechatPlugin {
    constructor(options) {}
    isFirst = false;
    apply(compiler) {
        compiler.hooks.done.tapAsync("MyPlugin",async (params, callback) => {
            const targetDir = path.join(process.cwd(),'dist/dev/mp-weixin')
            if(!this.isFirst){
                shell.exec(`/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project ${targetDir}`);
                this.isFirst=true
            }
            callback();
        });
    }
}
module.exports= wechatPlugin;
