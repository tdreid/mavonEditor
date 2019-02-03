/**
 * @Author: HuaChao Chen <CHC>
 * @Date:   2017-05-07T20:11:11+08:00
 * @Email:  chenhuachaoxyz@gmail.com
 * @Filename: webpack.base.js
 * @Last modified by:   chc
 * @Last modified time: 2017-11-26T22:25:40+08:00
 * @License: MIT
 * @Copyright: 2017
 */

var VueLoader = require("vue-loader");

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var WebpackMd5Hash = require('webpack-md5-hash');
// 该插件是对“webpack-md5-hash”的改进：在主文件中获取到各异步模块的hash值，然后将这些hash值与主文件的代码内容一同作为计算hash的参数，这样就能保证主文件的hash值会跟随异步模块的修改而修改。
// var WebpackSplitHash = require('webpack-split-hash');
// 压缩css
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require("fs");
// var postcss = require('postcss-loader')

const extractCSS = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
});
module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8']
                        })
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // exclude: /.*node_modules((?!auto-textarea).)*$/
                // exclude: /node_modules/
                include: [
                    path.resolve(__dirname, '../src'),
                    fs.realpathSync('node_modules/auto-textarea')
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: { name: '[name].[ext]?[hash]' }
            },
            { test: /\.(woff|ttf|eot|svg)/, loader: 'file-loader?name=font/[name].[ext]&publicPath=../' },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    'stylus-loader',
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', "sass-loader"],
            },
            {
                test: /\.md$/,
                loader: 'raw-loader'
            },{
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new VueLoader.VueLoaderPlugin(),
        // 分离css
        extractCSS,
        // 分离js可能引入的css的chunkhash计算
        new WebpackMd5Hash(),
        // 对css文件进行压缩
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../resources/highlight.js-9.12.0'),
            to: path.resolve(__dirname, '../dist/highlightjs')
        }, {
            from: path.resolve(__dirname, '../resources/markdown'),
            to: path.resolve(__dirname, '../dist/markdown')
        }, {
            from: path.resolve(__dirname, '../node_modules/katex/dist'),
            to: path.resolve(__dirname, '../dist/katex')
        }])
    ]
}
