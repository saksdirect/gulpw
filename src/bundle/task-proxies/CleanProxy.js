/**
 * Created by edelacruz on 10/8/2014.
 */

require('sjljs');

var path = require('path'),
    del = require('del'),
    TaskProxy = require('../TaskProxy.js');

module.exports = TaskProxy.extend('CleanProxy', {

    /**
     * Registers the clean gulp task for a `taskSuffix`.
     * @param taskSuffix {String} - Required
     * @param targets {Array|String} - Required
     * @param wrangler {Wrangler} - Required
     * @return {void}
     */
    registerGulpTask: function (taskSuffix, targets, gulp, wrangler) {
        gulp.task('clean' + taskSuffix, function (cb) {
            del(targets, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return cb;
        });
    },

    /**
     * Registers bundle with the `clean` task.
     * @param gulp {gulp} - Required
     * @param wrangler {Wrangler} - Required
     * @param bundle {Bundle} - Required
     * @returns {void}
     */
    registerBundle: function (bundle, gulp, wrangler) {

        if (!bundle) {
            return;
        }

        var self = this,
            bundleName = bundle.options.name,
            allowedFileTypes = wrangler.tasks.clean.allowedFileTypes || ['js', 'html',  'css'],
            separator = wrangler.taskStrSeparator,
            targets = [];

        // Register separate `clean` tasks for each section in `files` key
        allowedFileTypes.forEach(function (ext) {
            var section = bundle.options.files[ext],
                singularTaskTargets = [];

            // Check if `key` in `files` is buildable (concatable/minifiable)
            if (bundle.hasFiles() && self.isValidTaskSrc(section)) {

                // Get file path for `key` in `files`
                singularTaskTargets.push(path.join(wrangler.tasks.concat[ext + 'BuildPath'], bundleName + '.' + ext));
                singularTaskTargets.push(path.join(wrangler.tasks.minify[ext + 'BuildPath'], bundleName + '.' + ext));

                // Pass off the `filePath` to `targets` for later use
                targets = targets.concat(singularTaskTargets);

                // Register task for `key`
                self.registerGulpTask(separator + bundleName + separator + ext, singularTaskTargets, gulp, wrangler);
            }
        });

        // If clean key is set with a valid buildable src
        if (self.isValidTaskSrc(bundle.options.clean)) {
            self.registerGulpTask(separator + bundleName, bundle.options.clean, gulp, wrangler);
        }

        // Register overall clean task
        if (targets.length > 0) {
            self.registerGulpTask(separator + bundleName, targets, gulp, wrangler);
        }
    },

    registerBundles: function (bundles, gulp, wrangler) {
        var self = this,
            targets = [],
            allowedFileTypes = wrangler.tasks.clean.allowedFileTypes || ['js', 'html',  'css'];

        bundles.forEach(function (bundle) {
            var bundleName = bundle.options.name;

            // Compile targets array
            allowedFileTypes.forEach(function (ext) {
                var section = bundle.options.files[ext];

                // Check if `key` in `files` is buildable (concatable/minifiable)
                if (bundle.hasFiles() && self.isValidTaskSrc(section)) {

                    // Get file path for `key` in `files`
                    targets.push(path.join(wrangler.tasks.concat[ext + 'BuildPath'], bundleName + '.' + ext));
                    targets.push(path.join(wrangler.tasks.minify[ext + 'BuildPath'], bundleName + '.' + ext));
                }
            });

            // If clean key is set with a valid buildable src
            if (self.isValidTaskSrc(bundle.options.clean)) {
                targets = targets.concat(bundle.options.clean);
            }

        }); // end of bundles loop

        // Register overall clean task
        if (targets.length > 0) {
            self.registerGulpTask("", targets, gulp, wrangler);
        }

    },

    isValidTaskSrc: function (src) {
        return (sjl.classOfIs(src, 'String') || sjl.classOfIs(src, 'Array')) && !sjl.empty(src);
    }

});