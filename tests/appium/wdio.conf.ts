/**
 * WebDriverIO + Appium 2.x Configuration
 *
 * Prerequisites:
 *   1. Install Appium 2.x globally: npm install -g appium
 *   2. Install drivers:
 *      - appium driver install uiautomator2  (Android)
 *      - appium driver install xcuitest       (iOS)
 *   3. Set APP_PATH env var to point to your .apk / .app / .ipa
 *   4. Start Appium server: appium --use-drivers=uiautomator2,xcuitest
 *
 * Run tests:
 *   npx wdio tests/appium/wdio.conf.ts
 */

export const config: WebdriverIO.Config = {
  runner: "local",
  port: 4723,
  specs: ["./tests/appium/specs/**/*.spec.ts"],
  maxInstances: 1,
  capabilities: [
    {
      // Switch between Android and iOS by toggling these blocks
      platformName: process.env.PLATFORM || "Android",
      "appium:deviceName": process.env.DEVICE_NAME || "Pixel_7_API_34",
      "appium:app": process.env.APP_PATH || "./app-debug.apk",
      "appium:automationName":
        (process.env.PLATFORM || "Android") === "iOS"
          ? "XCUITest"
          : "UiAutomator2",
      "appium:noReset": false,
      "appium:newCommandTimeout": 120,
    },
  ],
  logLevel: "info",
  waitforTimeout: 10000,
  connectionRetryTimeout: 30000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
