/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import JsdomEnvironment from "jest-environment-jsdom";
import g from "@akashic/akashic-engine";

class AkashicEnvironment extends JsdomEnvironment {
  async setup() {
    await super.setup();
    this.global.g = g;
  }
  async teardown() {
    await super.teardown();
  }
}

export default AkashicEnvironment;
