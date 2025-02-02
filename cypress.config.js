const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'mochawesome',
  video: false,
  reporterOptions: {
    reportDir: 'mochawesome-report',
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/',
  },
})
