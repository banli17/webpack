const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');
const glob = require('glob');

const projectRoot = process.cwd();
console.log(projectRoot)
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

    Object.keys(entryFiles).forEach((index) => {
        const entryFile = entryFiles[index];

        const match = entryFile.match(/src\/(.*)\/index.js/);
        const pageName = match && match[1];

        entry[pageName] = entryFile;

        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(projectRoot, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true,
                },
            }),
        );
    });

    return { entry, htmlWebpackPlugins };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    output: {
        path: path.resolve(projectRoot, 'dist'),
        filename: '[name]_[chunkhash:8].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                'babel-loader',
                // 'eslint-loader',
            ],
        }, {
            test: /\.css$/,
            use: [
                // 'style-loader',
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [
                            autoprefixer({
                                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                            }),
                        ],
                    },
                },
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,
                        remPrecision: 8,
                    },
                },
            ],
        }, {
            test: /\.(jpg|jpeg|png|gif)/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]',
                    },
                },
            ],
        }],
    },
    plugins: [
        function errorPlugin() {
            // webpack 3  this.hooks.done.tap 改成 this.plugins
            // this.hooks.done.tap('done', (stats) => {
            //     if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
            //         console.error('build error'); // eslint-disable-line
            //         process.exit(1);
            //     }
            // });
        },
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash].css',
        }),
        ...htmlWebpackPlugins,
        new FriendlyErrorsPlugin(),
    ],
    stats: 'errors-only',
};
