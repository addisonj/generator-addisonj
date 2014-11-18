var gulp = require('gulp')
var source = require('vinyl-source-stream')
var gutil = require('gulp-util')
var stylus = require('gulp-stylus')
var imagemin = require('gulp-imagemin')
var del = require('del')
var nib = require('nib')
var nodemon = require('gulp-nodemon')
var reactify = require('reactify')
var browserify = require('browserify')
var watchify = require('watchify')
var uglify = require('uglifyify')
var argv = require('yargs').argv

var NODE_ENV = process.env.NODE_ENV || "development"
function isProd() {
  if (argv.production || NODE_ENV === "production") {
    console.log("Creating production build")
    return true
  }
  return false
}
var paths = {
  base: 'public/js',
  scripts: 'app.js',
  images: 'public/img/**/*',
  styles: 'public/css/main.styl'
}

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb)
})

function buildScript(watch) {
  var props = {
    entries: ['./' + paths.scripts],
    basedir: paths.base,
    debug: true
  }
  var bundler = null
  if (watch) {
    bundler = watchify(browserify(watchify.args, props))
  } else {
    bundler = browserify(props)
  }
  bundler.transform(reactify)
  if (isProd()) {
    bundler.transform({global: true}, uglify)
  }
  function rebundle() {
    var stream = bundler.bundle()
    return stream.on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'))
  }
  bundler.on('update', function() {
    rebundle()
    gutil.log('Rebundle...')
  })
  bundler.on('log', function() {

  })
  return rebundle()
}

gulp.on('err', function(e) {
  gutil.log(e.err.stack);
})

gulp.task('styles', ['clean'], function() {
  return gulp.src(paths.styles)
    .pipe(stylus({
      use: nib(),
      compress: isProd()
    }))
    .pipe(gulp.dest('./build/css'))
})

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'))
})

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.images, ['images'])
  gulp.watch(paths.styles, ['styles'])
  return buildScript(true)
})

gulp.task('server', ['build'], function() {
  return nodemon({script: 'app.js', ext: 'js', ignore: ['public/**', 'build/**', 'gulpfile.js']})
    .on('restart', function() {
      console.log('Restarted Server')
    })
})

gulp.task('build', ['images', 'styles'], function() {
  return buildScript(false)
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'server'])
