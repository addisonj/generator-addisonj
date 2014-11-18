
module.exports = function(<%= modelName %>) {
  return {
    getByName: function(req, res, next) {
      var name = req.param("name")
      <%= modelName %>.findByName(name, function(err, name) {
        if (err) return next(err)
        res.json(name)
      })
    }
  }
}
