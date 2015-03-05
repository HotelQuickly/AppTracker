var gulp = require('gulp');
var mocha = require('gulp-mocha');

var paths = {
  js: ['./lib/*.js']
}

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('test', function() {
    gulp.src(['test/test.js'], {
        read: false
    })
        .pipe(mocha({
            reporter: 'spec'
        }).on("error", handleError));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['test']);
});
