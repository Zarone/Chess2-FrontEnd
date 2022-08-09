const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const { ESBuildMinifyPlugin } = require("esbuild-loader")

module.exports = {

  devtool: 'inline-source-map',

  entry: {  
    homePage: path.resolve(__dirname, "./src/homePage.jsx"),
    gamePage: path.resolve(__dirname, "./src/gamePage.jsx"),
    faqPage: path.resolve(__dirname, "./src/faqPage.jsx"),
    ...(() => {
        let val=glob.sync("./src/**/*.ts").reduce((acc, file) => {
            acc[file.split("/src/")[1].split(".")[0]] = file;
            return acc;
        }, {})
        return val 
    }
    )() },


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
            presets: [ "@babel/preset-react" ],
            presets: [ "@babel/preset-typescript" ]
        }
      },
      { test: /\.css$/, use: ["style-loader","css-loader"], exclude: [/node_modules/], },
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        include: [
            path.resolve(__dirname, "./src/"),
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
    publicPath: "",
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
  optimization: {
    minimizer: [
        new ESBuildMinifyPlugin({
            keepNames: true,
        })
    ],
  },
};

