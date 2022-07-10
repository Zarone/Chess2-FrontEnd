const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    gamePage: path.resolve(__dirname, "./src/gamePage.jsx")
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        loader: "babel-loader",
        include: [
            path.resolve(__dirname, "./src/"),
        ],
        exclude: [/node_modules/],
        options: {
            presets: [ "@babel/preset-react" ]
        }
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    publicPath: ""
    // path: path.resolve(__dirname, "./dist"),
    // filename: "bundle.js",
  },
  plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
  devServer: {
    static: {
        directory: path.join(__dirname, '/dist'),
    },
    hot: true,
  },
  
};

