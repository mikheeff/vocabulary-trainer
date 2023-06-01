import HtmlWebpackPlugin = require("html-webpack-plugin");
import FileManagerPlugin from "filemanager-webpack-plugin";
import { Configuration } from "webpack";
import * as path from "path";

const config: Configuration = {
  entry: path.join(__dirname, "index.ts"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: "index.html",
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"],
        },
      },
    }),
  ],
};

export default config;
