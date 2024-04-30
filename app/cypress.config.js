const { defineConfig } = require("cypress");

require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    "fixturesFolder": "./api-mocks/mocks"
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack"
    }
  },
  env: {
    userEmail: process.env.USER_EMAIL_CYPRESS,
    userPassword: process.env.USER_PASSWORD_CYPRESS
  }
})
