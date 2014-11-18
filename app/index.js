'use strict'
var util = require('util')
var path = require('path')
var yeoman = require('yeoman-generator')

var AddisonjGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json')
  },

  prompting: function () {
    var done = this.async()

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default : this.appname
      },
      {
        type: 'confirm',
        name: 'demoData',
        message: 'would you like to generate a demo resource (named post)?',
        default: true
      }
    ]

    this.prompt(prompts, function (props) {
      if (props.demoData) {
        this.composeWith("addisonj:resource", {arguments: "Post"})
      }
      this.name = props.name
      this.appname = this.name

      done()
    }.bind(this))
  },
  configuring: {
    enforceFolderName: function () {
      if (this.name !== this._.last(this.destinationRoot().split(path.sep))) {
        this.destinationRoot(this.appname);
      }
      this.config.save();
    }
  },

  writing: {
    app: function() {
      this.dest.mkdir('controller')
      this.dest.mkdir('model')
      this.dest.mkdir('helpers')
      this.dest.mkdir('lib')

      this.template('_package.json', 'package.json')
      this.template('app.js', 'app.js')
      this.template('config.js', 'config.js')
      this.template('gulpfile.js', 'gulpfile.js')
    },

    webapp: function() {
      this.dest.mkdir('public')
      this.dest.mkdir('public/css')
      this.dest.mkdir('public/js')
      this.dest.mkdir('public/img')
      this.src.copy('main.styl', 'public/css/main.styl')
      this.src.copy('webapp.js', 'public/js/app.js')
      this.template('index.html', 'public/index.html')
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig')
      this.src.copy('jshintrc', '.jshintrc')
    }
  },

  end: function () {
    this.installDependencies({bower: false})
  }
})

module.exports = AddisonjGenerator
