let Webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

let externals = require('./src/libs/externals.json'); // 扩展其他库 可以使用scrpit标签直接引入使用

const path = require('path');

module.exports = {
    entry: {
        app: __dirname + '/src/js/app.js',
        config: [__dirname + '/src/config/config.js', __dirname + '/src/config/deviceConfig.js'],
        vendor: ['react', 'react-dom', 'react-router', 'redux'],
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/www',
        // publicPath: './'
    },
    devServer: {
        contentBase: __dirname + './www',
        compress: true,
        inline: true,
        host: '127.0.0.1',
        port: 30001
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-0'],
                        "plugins": [
                            ["import", [{ libraryName: "antd-mobile", style: true }]] // `style: true` 会加载 less 文件
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css|less$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] })
            },
            {
                test: /.(png|jpe?g|gif)$/,
                loader: 'file-loader?limit=8192&name=/images/[name].[ext]'
            },
            {
                test: /.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?limit=10000&name=/fonts/[name].[ext]'
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                options: {
                    limit: 10000,
                    publicPath: path.resolve(__dirname, "src/images/")
                }
            }
        ]
    },

    //解析扩展文件，引用时可引用别名
    resolve: {
        extensions: [' ', '.js', '.jsx', '.json', '.css', '.less', 'svg'],
        alias: {
            libs: path.resolve(__dirname, "src/libs/"),
            style: path.resolve(__dirname, "src/less/"),
            component: path.resolve(__dirname, "src/js/component/"),
            page: path.resolve(__dirname, "src/js/page/"),
            config: path.resolve(__dirname, "src/config/"),
            images: path.resolve(__dirname, "src/images/"),

            action: path.resolve(__dirname, "src/redux/action/"),
            reducer: path.resolve(__dirname, "src/redux/reducer/"),
            store: path.resolve(__dirname, "src/redux/store/"),
        }
    },

    // 第三方插件引入
    externals: externals,

    //开发用，配置资源映射，打包速度从左到右加快，source-map，cheap-module-source-map，eval-source-map，cheap-module-eval-source-map
    // devtool: 'eval-source-map',

    plugins: [
        new Webpack.ProvidePlugin({
            React: 'react', // 使react变成全局变量
            ReactDom: 'react-dom'
        }),
        new Webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/src/index.html',
            minify: {                                    // 压缩 HTML 文件
                removeComments: true,                    // 移除 HTML 中的注释
                collapseWhitespace: false                 // 删除空白符与换行符
            },
            // chunks: ['app', 'commons', 'config']
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/libs', to: __dirname + '/www/libs'
            },
            {
                from: __dirname + '/src/images', to: __dirname + '/www/images'
            }
        ]),
        new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
        new Webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'config', 'vendor']
            // names: ['app', 'config'],
            // filename: '[name].chunk.js'
            // names: ['common', 'f7', 'config'],
            // names: ['common', 'manifest']
        }),
        // 打开不利于调试
        // new Webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new Webpack.HotModuleReplacementPlugin(),
    ]

}