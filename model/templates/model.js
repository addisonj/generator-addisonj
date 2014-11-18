
var Schema = require("mongoose").Schema
module.exports = function(db) {
  var <%= _.classify(name) %>Schema = new Schema({
  })

  <%= _.classify(name) %>Schema.statics.findByName = function(name, cb) {
    this.findOne({name: name}, cb)
  }
  return db.model("<%= _.classify(name) %>", <%= _.classify(name) %>Schema)
}
