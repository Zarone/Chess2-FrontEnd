const webpack = require("webpack");
const path = require("path");
const glob = require("glob");

module.exports = {

  devtool: 'inline-source-map',

  entry: {
    test: "./test/bin/test.js"
  },


  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        include: [
            path.resolve(__dirname, "./src/"),
            path.resolve(__dirname, "./test/"),
            path.resolve(__dirname, "./dist/"),
        ],
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css", ".ts"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "test/bin/bundle"),
  },
//   mode: 'development',
  devtool: 'eval-source-map',
};


