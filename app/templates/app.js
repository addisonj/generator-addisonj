
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var serr = require('std-error')
var path = require('path')
var config = require('./config')

module.exports = function(overrideConfig) {
  if (overrideConfig) {
    config = overrideConfig
  }
  return config.resolve(function(NODE_ENV, logger) {
    return {
      createServer: function() {
        var app = express()
        app.use(logger)
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(cookieParser())
        app.use(express.static(path.join(__dirname, 'build')))

        app.get('/', function(req, res, next) {
          res.sendFile(path.join(__dirname, 'public/index.html'))
        })
        app.get('/health', function(req, res, next) {
          res.send({status: 'OK'})
        })

        var api = express.Router()
        // add your routes here!

        app.use('/api', api)

        if (NODE_ENV === 'development') {
          app.use(function(err, req, res, next) {
            console.log(err.message)
            console.log(err.stack.join('\n'))
            next(err)
          })
        }
        app.use(serr.defaultHandler)

        return app
      }
    }
  })
}

if (module == require.main) {
  var app = module.exports().createServer()
  var port = config.get('PORT')
  app.listen(port, function() {
    console.log('<%= name %> listening on ' + port)
  })
}
