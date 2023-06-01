import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { WebpackConfiguration } from "webpack-cli";
import merge from "webpack-merge";
import common from './webpack.common'

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge(common, {
  mode: 'production'
})

export default config;
