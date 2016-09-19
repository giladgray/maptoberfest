const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

module.exports = Object.assign({}, webpackConfig, {
  devServer: {
    contentBase: webpackConfig.output.path,
    historyApiFallback: true,
    port: 9000,
    proxy: {
      "/api/*": "http://localhost:9001",
    },
  },
  // inject react hot loader entries into base config
  entry: [
    "webpack-dev-server/client?http://localhost:9000",
    "webpack/hot/only-dev-server", // "only" prefix prevents reload on syntax errors
    ...webpackConfig.entry,
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ...webpackConfig.plugins,
  ],
});
