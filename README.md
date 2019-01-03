## Gulp version of cache-hyper-bust

_gulpfile.js_

```js
const cacheBreaker = require('gulp-cache-hyper-bust');

[...]

gulp.task('cache-breaker', function(callback) {
    const timestamp = new Date().getTime();

    pump(
        [
            gulp.src(['path/to/scan/*.php', '!**/path/not/to/scan/**']),
            cacheBreaker({
                images: false,
                showLog: true,
                staticTimestamp: timestamp,
                type: 'timestamp',
            }),
            gulp.dest(
                // to overrite source file
                function(file) {
                    return file.base;
                }
            ),
        ],
        callback
    );
});

gulp.task('build', [
    'some',
    'other',
    'tasks',
    'cache-breaker',
);

[...]
```
