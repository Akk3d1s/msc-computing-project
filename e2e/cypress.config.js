const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    "supportFile": false,
    "video": false,
    defaultCommandTimeout: 100000,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {

        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // auto open devtools
          // below args seem to do nothing :-(
          launchOptions.args.push('--auto-open-devtools-for-tabs')
          // launchOptions.args.push('--throttle-cpu-rate=6')
          launchOptions.args.push('--force-devtools-available')
          // launchOptions.args.push('--throttle-cpu-rate=50')
          launchOptions.args.push('--incognito')
        }

        // `args` is an array of all the arguments that will
        // be passed to browsers when it launches
        console.log(launchOptions.args) // print all current args
        console.log('browser name', browser.name);

        // whatever you return here becomes the launchOptions
        return launchOptions
      })
    },
  },
});
