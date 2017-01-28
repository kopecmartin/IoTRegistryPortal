var webpack = require('webpack');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src');


function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }
    return sources;
}

module.exports = {
    entry: {
        app: getEntrySources([
            APP_DIR + '/index.jsx'
        ])
    },
    output: {
        // Public path refers to the location from the browser's perspective
        publicPath: "/public/",
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.svg$/
                ],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.(less|css)$/,
                loader: 'style!css!less'
            },
            {
                test: /\.png$|\.gif$/,
                loader: "url-loader?mimetype=image/png"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
};