'use strict';

var cachehyperbust = require('cache-hyper-bust'),
	fs = require('graceful-fs'),
	gutil = require('gulp-util'),
	map = require('map-stream'),
	path = require('path'),
	tempWrite = require('temp-write');

module.exports = function(options) {
	if (!options) {
		options = {};
	}

	return map(function(file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(
				new gutil.PluginError(
					'gulp-cache-hyper-bust',
					'Streaming not supported'
				)
			);
		}
		if (!options.basePath) {
			options.basePath = path.dirname(path.resolve(file.path)) + '/';
		}

		tempWrite(file.contents, path.extname(file.path)).then(function(
			tempFile,
			err
		) {
			if (err) {
				return cb(new gutil.PluginError('gulp-cache-hyper-bust', err));
			}

			fs.stat(tempFile, function(err, stats) {
				if (err) {
					return cb(
						new gutil.PluginError('gulp-cache-hyper-bust', err)
					);
				}

				fs.readFile(tempFile, { encoding: 'UTF-8' }, function(
					err,
					data
				) {
					if (err) {
						return cb(
							new gutil.PluginError('gulp-cache-hyper-bust', err)
						);
					}

					// Call the Node module
					var processedContents = cachehyperbust.busted(
						data,
						options
					);

					if (options.showLog && data !== processedContents) {
						gutil.log(
							'gulp-cache-hyper-bust:',
							gutil.colors.green('✔ ') + file.relative
						);
					}

					file.contents = new Buffer(processedContents);

					cb(null, file);
				});
			});
		});
	});
};
