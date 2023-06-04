import App from "./src/app";

const app = new App();

app.init();

if (module.hot) {
  module.hot.dispose(() => {
    // remove global listeners
    document.removeEventListener("keypress", window.trainerKeypressHandler);
    document.removeEventListener("hashchange", window.trainerHashchangeHandler);
  });

  module.hot.accept();
}
