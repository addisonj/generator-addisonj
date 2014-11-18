var path = require("path")
var dependable = require("dependable")
var mongoose = require("mongoose")
var logger = require('morgan')

var container = dependable.container()

container.register("NODE_ENV", (process.env.NODE_ENV || "development"))
container.register("PORT", (process.env.PORT || 3000))
container.register("MONGO_URL", (process.env.MONGO_URL || "mongodb://localhost/<%= name %>"))
container.register("db", function(MONGO_URL) {
  return mongoose.createConnection(MONGO_URL)
})
container.register("logger", function(NODE_ENV) {
  if (NODE_ENV === "development") {
    return logger("dev")
  } else {
    return logger("combined")
  }
})

container.load(path.join(__dirname, "./model"))
container.load(path.join(__dirname, "./controller"))
module.exports = container
