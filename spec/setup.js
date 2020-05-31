/* eslint-disable @typescript-eslint/no-var-requires */
const JsdomEnvironment = require("jest-environment-jsdom");
const g = require("@akashic/akashic-engine");

class AkashicEnvironment extends JsdomEnvironment {
  async setup() {
    await super.setup();
    this.global.g = g;
  }
  async teardown() {
    await super.teardown();
  }
}

module.exports = AkashicEnvironment;
