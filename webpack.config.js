var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const SRC = path.resolve("./src");
const DEST = path.resolve("./build");
const NAME = "maptoberfest.js";

module.exports = {
  entry: [
    `${SRC}/index.tsx`,
  ],
  output: {
    path: DEST,
    filename: NAME,
  },
  resolve: {
    extensions: ["", ".js", ".ts", ".tsx"],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ["react-hot", "ts-loader"],
        include: SRC,
      }, {
        test: /\.s[ac]ss$/,
        loader: ExtractTextPlugin.extract("style", "css!autoprefixer!sass"),
        include: SRC,
      }, {
        test: /\.css$/,
        loaders: ["style", "css"],
      }, {
        test: /\.png$/,
        loader: "file?name=images/[name].[ext]",
      }, {
        test: /\.(geo)?json$/,
        loader: "json",
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      "Promise": "es6-promise",
      "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch",
    }),
    new ExtractTextPlugin(NAME.replace(/\.js$/, ".css")),
    new webpack.NoErrorsPlugin(),
  ],
  stats: {
    assets: true,
    chunks: false,
    errorDetails: true,
    hash: false,
    source: false,
    timings: true,
    version: false,
  },
};
