// load jquery
require('jquery');
// load the code
require("../src/frontend/App/Boot");

// load the mocks
require("angular-mocks");

// Load the tests
const contextApp = require.context("../src/frontend/App", true, /\.spec.ts$/);
contextApp.keys().map(contextApp);

