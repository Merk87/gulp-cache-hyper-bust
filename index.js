'use strict';

var path = require('path'),
fs = require('graceful-fs'),
gutil = require('gulp-util'),
map = require('map-stream'),
tempWrite = require('temp-write'),
cachehyperbust = require('cachehyperbust');

module.exports = function (options) {
	if(!options){
		options = {};
	}
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-cachehyperbust', 'Streaming not supported'));
		}
		if(!options.basePath){
			options.basePath = path.dirname(path.resolve(file.path))+'/';
		}

		tempWrite(file.contents, path.extname(file.path))
		.then(function (tempFile, err) {
			if (err) {
				return cb(new gutil.PluginError('gulp-cachehyperbust', err));
			}

			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new gutil.PluginError('gulp-cachehyperbust', err));
				}
				options = options || {};

				fs.readFile(tempFile, { encoding : 'UTF-8'}, function(err, data) {
					if (err) {
						return cb(new gutil.PluginError('gulp-cachehyperbust', err));
					}

					// Call the Node module
					var processedContents = cachehyperbust.busted(data, options);

					if (options.showLog) {
						gutil.log('gulp-cachehyperbust:', gutil.colors.green('✔ ') + file.relative);
					}

					file.contents = new Buffer(processedContents);

					cb(null, file);
				});

			});
		});
	});
};

