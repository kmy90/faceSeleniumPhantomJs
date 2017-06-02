var path = require('path');
var webpack = require('webpack');
var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;

module.exports = {
    context: __dirname,
    entry: {
        index: [path.resolve(__dirname, 'src/config', 'index'), 'express']
    },
    target: 'node',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
        https: true
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, ' /node_modules\/(?!(ng2-.+))/']
            },
            { include: /\.json$/, loaders: ["json-loader"] }
        ]
    },
    devtool: 'inline-source-map'
}