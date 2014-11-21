/**
 * Created by ElyDeLaCruz on 10/5/2014.
 */
require('sjljs');

// Import base task proxy to extend
var TaskProxy = require('../TaskProxy'),
<<<<<<< HEAD:src/bundle/task-proxies/ConcatProxy.js
    fs = require('fs'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    gulpif = require('gulp-if'),
    path = require('path');
=======
    path = require('path'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    gulpif = require('gulp-if'),
    crypto = require('crypto');
>>>>>>> f3abf7d75f4d0619ea9471fc1ca4844292f1d0f3:src/task-proxies/ConcatProxy.js

module.exports = TaskProxy.extend("ConcatProxy", {

    /**
     * Regsiters bundle with concat gulp task.
     * @param bundle {Bundle}
     * @param gulp {gulp}
     * @param wrangler {GulpBundleWrangler}
     */
    registerBundle: function (bundle, gulp, wrangler) {

        // Task string separator
        var separator = wrangler.getTaskStrSeparator();

        bundle.hasFiles();

        // Create task for bundle
        gulp.task('concat' + separator + bundle.options.name, function () {

            // Check for sections on bundle that can be concatenated
            ['js', 'css', 'html'].forEach(function (ext) {
                var section = bundle.options.files[ext];

                // If section is empty or not an array exit the function
                if (sjl.empty(section) || !Array.isArray(section)) {
                    return;
                }

                // Give gulp the list of sources to process
                gulp.src(section)

                    // Concatenate current source in the {artifacts}/ext directory
                    .pipe(concat(path.join(wrangler.cwd, wrangler.tasks.concat[ext + 'BuildPath'], bundle.options.name + '.' + ext)))

                    // Add file header
<<<<<<< HEAD:src/bundle/task-proxies/ConcatProxy.js
                    .pipe(gulpif(ext !== 'html', header(wrangler.tasks.concat.header, {
                            bundle: bundle, fileExt: ext, fileHash: '{{file hash here}}'} )))
=======
                    .pipe(gulpif(ext !== 'html', header(wrangler.tasks.concat.header, {bundle: bundle, fileExt: ext, fileHash: "{{hash goes here}}"})))
>>>>>>> f3abf7d75f4d0619ea9471fc1ca4844292f1d0f3:src/task-proxies/ConcatProxy.js

                    // Dump to the directory specified in the `concat` call above
                    .pipe(gulp.dest('./'));

            }); // end of loop

        }); // end of concat task

    } // end of `registerBundle`

}); // end of export
