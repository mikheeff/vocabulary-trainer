import { initApp } from "./src/app";

initApp();

if (module.hot) {
  // module.hot.dispose();
  module.hot.accept();
}
