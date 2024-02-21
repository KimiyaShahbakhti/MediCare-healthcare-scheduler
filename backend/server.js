require("dotenv").config()
global.config = require('./src/config')

const App = require('./src')
new App()