const webpack = require("webpack");
const path = require("path");
const glob = require("glob");

module.exports = {

  devtool: 'inline-source-map',

//   entry: {
//     homePage: path.resolve(__dirname, "./src/homePage.jsx"),
//     gamePage: path.resolve(__dirname, "./src/gamePage.jsx"),
//     faqPage: path.resolve(__dirname, "./src/faqPage.jsx"),
//   },
  entry: {  
    homePage: path.resolve(__dirname, "./src/homePage.jsx"),
    gamePage: path.resolve(__dirname, "./src/gamePage.jsx"),
    faqPage: path.resolve(__dirname, "./src/faqPage.jsx"),
    ...(() => {
        let val=glob.sync("./src/**/*.ts").reduce((acc, file) => {
            acc[file.split("/src/")[1].split(".")[0]] = file;
            return acc;
        }, {})
        // console.log(glob.sync("./src/**/*.ts"))
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
    //   {
    //     test: /\.js$/,
    //     use: ["source-map-loader"],
    //     enforce: "pre"
    //   },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css", ".ts"],
  },
  output: {
    publicPath: "",
    // path: path.resolve(__dirname, "./dist"),
    // filename: "bundle.js",
  },
//   output: {
//     filename: "[name].js",
//     chunkFilename: "[name]-[id].js",
//     path: __dirname + "/dist"
//   },
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

