'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var AddisonjGenerator = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.log('Creating model with name ' + this._.classify(this.name) + '.');
  },

  writing: function () {
    var className = this._.classify(this.name)
    this.dest.mkdir('model')
    this.template('model.js', 'model/' + className + '.js')
  }
});

module.exports = AddisonjGenerator;
