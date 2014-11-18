'use strict'
var util = require('util')
var yeoman = require('yeoman-generator')
var inflector = require('inflection')

var AddisonjGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.modelName = this._.classify(this.name)
    this.controllerName = inflector.pluralize(this.name.toLowerCase())
    this.log('Creating a model named ' + this.modelName + ' and controller with name ' + this.controllerName + '.')
    this.composeWith("addisonj:model", {arguments: this.modelName})
    this.composeWith("addisonj:controller", {arguments: this.controllerName, options: {modelName: this.modelName}})
  }

})

module.exports = AddisonjGenerator
