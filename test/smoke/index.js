const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({ timeout: '10000ms' });

try {
    process.chdir(path.join(__dirname, 'template')); // 要先变更，再引入webpack配置
    console.log(`New directory: ${process.cwd()}`);
} catch (err) {
    console.error(`chdir: ${err}`);
}

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod');
    webpack(prodConfig, (err, stats) => {
        if (err) {
            console.error(err);
            process.exit(2);
        }
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false,
        }));

        // 冒烟测试
        mocha.addFile(path.resolve(__dirname, 'html-test.js'))
        mocha.addFile(path.resolve(__dirname, 'css-js-test.js'));

        mocha.run();
    });
});
