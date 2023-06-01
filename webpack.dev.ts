import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { WebpackConfiguration } from "webpack-cli";
import merge from "webpack-merge";
import common from './webpack.common'
import webpack = require("webpack");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge(common, {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    hot: true,
    client: {
      logging: "none",
    },
  },
})

export default config;
