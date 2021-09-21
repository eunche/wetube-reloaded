const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

const JS_BASE_PATH = "/src/client/js/";

module.exports = {
  entry: {
    main: JS_BASE_PATH + "main.js",
    getFirstAlphabet: JS_BASE_PATH + "getFirstAlphabet.js",
    videoPlayer: JS_BASE_PATH + "videoPlayer.js",
    recorder: JS_BASE_PATH + "recorder.js",
    commentSection: JS_BASE_PATH + "commentSection.js",
    watch: JS_BASE_PATH + "watch.js",
    watchModule: JS_BASE_PATH + "watchModule.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  watch: true,
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
