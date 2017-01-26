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
        publicPath: "/public",
        path: BUILD_DIR,
        filename: '/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ]
    }
};