const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin    = require('webpack-manifest-plugin');
const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        vendor: [
          'jquery',
          'vue',
          'vue-router',
          'vuex',
          'gsap',
          'axios',
          'es6-promise'
        ],
        index: 'index',
        logon: 'login',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js?[hash:8]',
        publicPath: "/"
    },
    devServer: {
        compress: true,
        port: 3000,
        stats: {
            assets: true,
            cached: false,
            chunkModules: false,
            chunkOrigins: false,
            chunks: false,
            colors: true,
            hash: false,
            modules: false,
            reasons: false,
            source: false,
            version: false,
            warnings: false
        },
        proxy: {
            // '/api/*': {
            //     target: 'http://XXX.com.tw',
            //     changeOrigin: true,
            // },
        },
    },  
    resolve: {
        alias: {
            vue: 'vue/dist/vue.min.js'
        },
        modules: [
            path.resolve('src'),
            path.resolve('src/html'),
            path.resolve('src/js'),
            path.resolve('src/js/pages'),
            path.resolve('src/vue'),
            path.resolve('src/vue/component'),
            path.resolve('src/api'),
            path.resolve('src/images'),
            path.resolve('node_modules')
        ],
        extensions: ['.js', '.styl', '.vue']
    },
    module:{
        rules:[
            {
                test: /\.(html)$/,
                use: 'file-loader?name=[name].[ext]',
                include: path.resolve('src')
            },
            {
                test: /\.(js)$/,
                use: 'file-loader?name=[path][name].[ext]',
                include: path.resolve('src/file')
            },
            {
                test: /\.(json)$/,
                use: 'file-loader?name=[path][name].[ext]',
                include: path.resolve('src/api')
            },
            {
                test: /\.(json|ttf)$/,
                use: 'file-loader?name=[path][name].[ext]',
                include: path.resolve('src/fonts')
            },
            {
                test: /\.(3ds|fbx|mtl|obj)$/,
                use: 'file-loader?name=[path][name].[ext]',
                include: path.resolve('src/model')
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                include: path.resolve('src/css'),
            },
            {
                test: /\.(pug)$/,
                use: ['file-loader?name=[name].html', 'pug-html-loader?exports=false&pretty'],
                include: path.resolve('src')
            },
            {
                test: /\.(vue)$/,
                use: 'vue-loader',
                include: path.resolve('src')
            },
            {
                test: /\.(js)$/,
                use: 'babel-loader',
                include: path.resolve('src')
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: 'url-loader?limit=100&name=[path][name].[ext]?[hash:8]',
                include: path.resolve('src')
            },
            {
                test: /\.(styl)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader'
                ],
                include: path.resolve('src')
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
                include: path.resolve('src')
            }
        ]
    },
    resolveLoader: {
        alias: {
            'scss-loader': 'sass-loader',
        },
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ 
            name: 'vendor', 
            filename: 'js/vendor.js?v=[hash:8]' 
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        }),
        new ManifestPlugin({
            fileName: 'client_manifest.json'
        }),
       new webpack.LoaderOptionsPlugin({
            vue: {
                postcss: [require('autoprefixer')(
                    {
                        browsers: ['> 1%', 'last 5 versions', 'Firefox >= 45', 'iOS >=8', 'Safari >=8','ie >= 10']
                    }
                )]
            }
       })
    ]
};

module.exports = config;
