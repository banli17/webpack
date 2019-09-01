const merge = require('webpack-merge');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HappyPack = require('happypack');
const TerserPlugin = require('terser-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const smp = new SpeedMeasurePlugin();

const prodConfig = smp.wrap({
    mode: 'production',
    plugins: [
        new OptimizeCssPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerPort: 'auto',
        // }),
        new HappyPack({
            loaders: ['babel-loader'],
        }),
        // new TerserPlugin({
        //     parallel: 4,
        // }),
    ],
    optimization: {
        minimizer: [new TerserPlugin()],
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                },
            },
        },
    },
});

module.exports = merge(baseConfig, prodConfig);
