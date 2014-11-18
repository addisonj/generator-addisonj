'use strict'
var util = require('util')
var yeoman = require('yeoman-generator')
var inflector = require('inflection')


var AddisonjGenerator = yeoman.generators.NamedBase.extend({
  constructor: function() {
    yeoman.generators.NamedBase.apply(this, arguments)

    this.option('modelName')
  },

  initializing: function() {
    this.modelName = this.modelName || this._.classify(inflector.singularize(this.name))
    this.log('Creating a controller with ' + this.name + ' and referencing the ' + this.modelName + ' model.')
  },

  writing: function () {
    this.template('controller.js', 'controller/' + this.name + '.js')
  }
})

module.exports = AddisonjGenerator
