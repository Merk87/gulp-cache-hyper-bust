 // Require Gulp
 var gulp = require('gulp'),
 gutil = require('gulp-util');

 // Require tasks
 var cachehyperbust = require('./index');

 // This plugin's task
 gulp.task('cachehyperbust', function () {
 	return gulp.src('test/fixtures/**/*.html')
 	.pipe(cachehyperbust({
 		type: 'MD5'
 	}))
 	.pipe(gulp.dest('./tmp'));
 });

// Default task does all of the things
gulp.task('default', [
	'cachehyperbust'
]);
