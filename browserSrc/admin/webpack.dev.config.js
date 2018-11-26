const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
// const fs = require("fs");
// const jsonmini = require("jsonminify");
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HotScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';
var TransformModulesPlugin = require('webpack-transform-modules-plugin')
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const config = require("./compile.confog");
const projectName = config.name
console.log("hahhah wepbakv", path.resolve(__dirname, `../../out/dist/${projectName}.html`));

module.exports = {
    entry: [HotScript,`../browserSrc/${projectName}/main.js` ],
    output: {
        filename: `${projectName}.bundle.js`,
        path: path.resolve(__dirname, '../../out/dist'),
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            js: 'babel-loader?{"presets":["es2015"],"plugins": ["transform-object-rest-spread"]}',
                            css: 'vue-style-loader!css-loader'
                        }
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015'],
                            plugins: ['transform-object-rest-spread']
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.(svg|ttf|eot|woff)\??.*$/,
                loader: "url-loader?limit=10000"
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['file-loader']
            },
            // {
            //     test: /\.styl/,
            //     loader: "style-loader!css-loader!stylus-loader"
            //   }
            // {
            //   test: /\.json$/,
            //   loader: 'json-loader'
            // }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.vue'
        ],
        alias: {
            //配置vue文件路径，使用vue devtools调试故引入开发版本
            vue: path.resolve(__dirname, 'node_modules', 'vue', 'dist', 'vue.min.js'),
            '@': "../",
            'cube-ui': 'cube-ui/lib',
            //'$common':"../components/common/"
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: `${projectName}.html`,
            inject: false,
            template: path.resolve(__dirname, `../../out/dist/${projectName}.html`),
            hash: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new TransformModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
};
