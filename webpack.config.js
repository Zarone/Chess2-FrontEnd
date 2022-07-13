const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    homePage: path.resolve(__dirname, "./src/homePage.jsx"),
    gamePage: path.resolve(__dirname, "./src/gamePage.jsx"),
    faqPage: path.resolve(__dirname, "./src/faqPage.jsx"),
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
      { test: /\.css$/, use: ["style-loader","css-loader"] }
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css"],
  },
  output: {
    publicPath: "",
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

