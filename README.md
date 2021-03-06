[![GitHub version](https://badge.fury.io/gh/elycruz%2Fgulpw.svg)](http://badge.fury.io/gh/elycruz%2Fgulpw)
[![NPM version](https://badge.fury.io/js/gulpw.svg)](http://badge.fury.io/js/gulpw)
[![Dependencies](https://david-dm.org/elycruz/gulpw.png)](https://david-dm.org/elycruz/gulpw)

gulpw (gulp wrangler) 
====================

## Deprecated
This project is deprecated (and broken! (you've been warned!)) until new version is scripted.
Also if anyone is interested in taking this project over
let me know.  Thanks.

## Original ReadMe follows:
Allows the management of a website or web application via bundle configuration files from the
command line (uses gulp in the background) and makes feature based development easier.

## Basic Idea
So the idea is as follows:
    We have a `bundles` directory (could be named anything via the `gulpw-config.*` file).
That directory should contain "bundle-configuration" files which are used by "task adapters" to run a
task via the command line;  E.g., `$ gulpw build:global deploy:global deploy:other-bundle`.
The bundle files will then hold the user's configurations in the *.yaml, *.json, or *.js format.

## Quick Nav
- [Install](#install)
- [Setup](#setup)
- [Bundle config](#bundle-config)
- [Running tasks](#running-tasks)
- [Available tasks](#available-tasks)
- [Caveats](#caveats)
- [Resources](#resources)
- [Available flags](#available-flags)
- [Todos](https://github.com/elycruz/gulpw/blob/master/TODOS.md)

### Install
1.  Install gulpw globally `npm install gulpw -g` then
2.  Install gulpw locally `npm install gulpw`.

### Setup
1. Create your project's bundle configs folder;  E.g., './gulpw-bundle-configs' etc.
2. Create empty `gulpw-config.*` config file or run `gulpw config` in your projects root to generate one.
3. Tell your `gulpw-config.*` file where your bundle configs folder is (set `bundlesPath` to your bundles config path inside config file).
5. Configure your global tasks within your `gulpw-config.*` file.
6. (Optional) Execute `gulpw deploy-config` to configure servers to deploy your work to.
7. Reap the benefits of using gulpw.

### Bundle config
A bundle config:
- is made of either a *.yaml, *.json, or *.js file with one or more properties listed in it.
- can have many config sections used by tasks.
- can be created by calling `gulpw bundle-config`.  Note this task will not overwrite existing bundles but will let
you know when they already exists and will prompt you to enter a new name/alias.

##### Valid Bundle Config file:
```
# some-other-bundle.yaml
alias: some-other-bundle
```

##### Another Valid Bundle Config file:
```
# some-bunde.yaml
alias: some-bundle
files:
  js:
    - some/file/path.js
    - some/other/file/path.js
  css:
    - some/other/file/path1.css
    - some/other/file/path2.css
requirejs:
	options:
		# requirejs options here ...
		...
```

See the listed tasks below for ideas on what other sections you can use in your bundle files.
Also when running `gulpw config` you will be asked about the tasks you want to include which will
then be included in your bundle file consequently depending on your answers.

### Running tasks
- `gulpw {task-name}:{bundle-name} [flags]` to run task for one bundle.
- `gulpw {task-name} [flags]` to run tasks for all bundles.

where `{task-alias}` is the task you want to run ('build', 'minify' etc.)
and `{bundle-alias}` is the bundle you want to run the task for (for './bundle-configs/hello-world.yaml'
 the bundle alias would be `hello-world`.

`[flags]` are any flags you would like to pass in with the task that you're calling;  E.g.,
`gulpw deploy:global --file-types js`

Also, e.g., `gulpw build:global build:some-other-bundle deploy:global deploy:some-other-bundle --dev`
The above example builds (see [build](#build) task for more info) some bundles (in development mode
(unminified due to `--dev` flag)) and deploys them to
 the users selected server (see [deploy](#deploy) task section for more info).

## Available Tasks
- [browserify](#browserify)
- [build](#build)
- [bundle](#bundle)
- [clean](#clean)
- [compass](#compass)
- [config](#config)
- [copy](#copy)
- [copytoclipboard](#copytoclipboard)
- [csslint](#csslint)
- [deploy](#deploy)
- [deploy-config](#deploy-config)
- [eslint](#eslint)
- [findandreplace](#findandreplace)
- [help](#help)
- [jasmine](#jasmine)
- [jshint](#jshint)
- [minify](#minify)
- [mocha](#mocha)
- [requirejs](#requirejs)
- [vulcan](#vulcan)
- [watch](#watch)

### browserify

### build
The 'build' task calls every sub task listed in a {bundle-name}.yaml config file except (by default can be
 altered in local wrangler config file):
		- clean (we could have this run via a flag in the future but is ignored for now to speed up performance)
		- deploy
		- jshint (called by the minify task so is ignored as standalone task)
		- csslint (called by the minify task so is ignored as a standalone task)

**Note:** The minify task runs 'jshint' and 'csslint' (along with other tasks) so that
is why they are being ignored as standalone tests.

'build' also adds the 'minify' task to it's list of tasks 'to' run for a particular bundle or bundles
depending on if an `html`, `css` or `js` section is found with the `files` section.

##### Options:
- **ignoredTasks {Array}:**  List of standalone tasks to ignore when calling build (*note some tasks are
 included as conglomerate tasks).

##### Flags:
`--skip-linting`, `--skip-csslint`, `--skip-jshint`, `--dev`,
`--skip-testing`, `--skip-mocha-test`, `--skip-jasmine-tests`

##### In 'gulpw-config.*':
```
tasks:
  # Build Task (Looks through {bundle-alias}.yaml file and runs
  # all tasks that are not in the `ignoreTasks`
  build:
    ignoredTasks:
      - clean
      - deploy
      - jshint
      - csslint
```

##### In {bundle}.*:
None.


### bundle
Creates a bundle config file in the designated 'bundlesPath' property
described in your gulpw-config.* file.

##### In gulpw-config.*:
```
static-tasks:
  bundle:
    allowedTasks:
      - browserify
      - compass
      - copy
      - csslint
      - deploy
      - jasmine
      - jshint
      - mocha
      - requirejs
      - watch
```

##### Options:
- **allowedTasks:**  List of tasks that the user is allowed to choose
from when generating a new bundle config.

##### In {bundle}.*:
None.

##### Flags:
- **bundle:** Sets the default bundle name to use for the new bundle
config file for the current bundle generation session.  Default 'bundle'.
Optional (will ask the user for the name of the bundle to generate
 but will have the passed in --bundle value as the default).


### clean
The 'clean' task cleans out any artifact files outputted by a bundle;  E.g., if a bundle has a `files` key or
`requirejs` key then the artifacts outputted by these sections are cleaned up (deleted) when clean is called.
'clean' also cleans/deletes any files listed in a `clean` section;  E.g.,

```
 clean:
   - some/file/path.js
   - some/file/path.css
   - etc.
```

*The `files` section can have many different sections that output artifact files for
 example a `js`, `css`, or `html` section(s).
*See the ['minify'](#minify) section for more info on the possible sections supported by the `files` section.

##### Options:
- **allowedFileTypes: {Array}:** A list of file types to allow for cleaning.

##### In 'gulpw-config.*':
```
tasks:
  clean:
    allowedFileTypes:
      - js
      - css
      - html
```

##### In {bundle}.*:
```
 clean:
   - some/file/path.js
   - some/file/path.css
   - etc.
```

### compass
The 'compass' task calls 'compass compile' at compass project root location (config.rb home).

##### In gulpw-config.*:
```
tasks:
  compass:
  	# Compass project root dir
    configrb: null # config.rb home
```

##### In {bundle}.*:
```
  compass:
  	# Compass project root dir
    configrb: null # config.rb home
```

##### Options:
None.

##### Flags:
None.


### config
The config task backs up an existing gulpw-config.* (file could be empty) and creates a new
gulpw-config file in the chosen format.  The task also allows you to choose which sections
(with defaults) to include in the file.

##### Options:
None.

##### Flags:
None.

##### In 'gulpw-config.*':
None.

##### In {bundle}.*:
None.

### copy
The 'copy' task copies any files listed in a `copy` section's `files` hash within in a {bundle-name}.* config file.
E.g.,
```
copy:
  files:
    ./fe-dev/bower_components/requirejs/require.js: ./public/js/vendors/require.js
```

'copy' copies the 'key' to the 'value' location for every entry in the `files` hash.

##### Options:
None.

##### In gulpw-config.*:
None.

##### In {bundle}.*:
```
copy:
  files:
    ./this/path/gets/copied/to: ./this/path
```

##### Flags:
None.


### copytoclipboard
Copies files to clipboard.

##### In gulpw-config.*:
```
tasks:
  copytoclipboard:
    alternateAlias: clipboard
    constructorLocation: ./src/bundle-tasks-adapters/CopyToClipboardTaskAdapter.js
    priority: -100

```

##### In {bundle}.*:
```
copytoclipboard:
    # The following two attributes are optional but at least one must declared inorder to use this task:
    #file: {String} - Optional.
    #files: {String|Array} - Optional.
```

##### Flags:
None.


### csslint
The 'csslint' task runs csslint on a bundle or all bundles using the listed '.csslintrc' file or runs with
 default options if no '.csslintrc' file is listed (default options are listed in `gulpw-config.*` file
 and also `wrangler.config.yaml` also has a default definition set up for it).

##### In gulpw-config.*:
```
tasks:
  csslint:
      csslintrc: null
```

##### Options:
- **csslintrc:**  Location of '.csslintrc' file.

##### In {bundle}.*:
None.

##### Flags:
None.

### deploy
The `deploy` task deploys files using the deploy section in a user's local 'gulpw-config.*' and also uses a user level deploy configuration generated by
the 'deploy-config' task.  See notes in config section below.

##### In gulpw-config.*:
```
tasks:
 # Deploy Task
  deploy:

    # Use unix style paths for deployment
    deployUsingUnixStylePaths: true

    # Options written by `deploy-config` to `.gulpw/deploy.yaml`
    developingDomain: null
    hostnamePrefix: null
    hostname: null
    port: 22
    username: null
    password: null
    publickeyPassphrase: null
    privatekeyLocation: null

    # File types that are allowed for deployment
    allowedFileTypes: # This will change to `ingoredFileTypes`
      - js
      - css
      - html
      - json
      - yaml
      - jpg
      - png
      - gif
      - md
      - mkd

    # Domains to develop
    domainsToDevelop:

      # Hostname to develop for
      somedomain.com:

        # Servers where user can deploy to `domainToDevelopFor`
        # (in this case `domainToDevelopFor` is `somedomain.com`)
        hostnames: # slots/hosts
          - -devslot1.somedomain.com
          - -devslot2.somedomain.com
          - -devslot3.somedomain.com

        # All website instance prefixes represent the same website just different
        # instances of the website.

        # An array of hostname prefixes (if any)
        hostnamePrefixes:
          - web1
          - web2
          - web3

        # If set a `hostnamePrefixFolder` value becomes available
        # to any templates within this `domainToDevelopConfig[x]` config.
        hostnamePrefixFolders: null
          #web1: website1
          #web2: website2
          #web3: website3

        # Root folder on the server to use for deployments (prefix
        # path for file paths being deployed that don't have
        # `deployRootFoldersByFileType` defined for their typ)))
        # example: /home/some-user/sites/<%= hostnamePrefix %><%= hostname %>
        # (recieves the `deploy` has from this config)
        deployRootFolder: null

        # Deploy roots by file type. If defined, file types that are keys in
        # it's hash will have the deploy root for said key
        # prepend as a deploy root to the file being deployed instead of the
        # `deployRootFolder` root path.
        deployRootFoldersByFileType:
          md: /home/some-user/docroot/md-files.<%= hostnamePrefix %><%= hostname %>/

        # A map used to replace parts or all of paths found that match the pattern on the left with the value on the right
        # Used for complex setups where the paths in your development environment don't have a one-to-one counterpart on the
        # Server;  E.g., One of my setups has ./jsp/some/file.jsp locally but on the server it is ./some-other-folder/some/file.jsp
        # So this isn't something that can be acheived with a root folder prefix because the local path ./jsp/... is in the root development directory
        # and when deploying we deploy ./jsp/... => /{some-deploy-root}/jsp/...
        localPathsToServerPathsRegexMap:
          '^(?:\.\/)?jsp\/': 'some-necessarily-differently-named-dir-on-the-server/'

```

### deploy-config
Launches an interactive questionnaire for generating a local 'deploy.yaml' file with deployment details
 for current development environment.
****Note**** This task must be run before the `deploy` task in order for it to function.
****Note**** File is put in the directory specified by `localConfigPath` of the
 'gulpw-config.*' file or the default is used ('./.gulpw').

##### In 'gulpw-config.*':
None.


### eslint
The `eslint` task expects `gulp-eslint` options (link to gulp-eslint: https://github.com/adametry/gulp-eslint)
along with a couple of custom optional attributes:

##### In gulpw-config.*:
```
tasks:
    eslint:
        options:
            useEslintrc: true // Whether to use .eslintrc file
        failAfterError: false
        failOnError: false
        eslintrc: ./.eslintrc // deprecated.  Use options hash map instead
```

##### Options:
- **options:**  `gulp-eslint` options (https://github.com/adametry/gulp-eslint)
    - **useEslintrc:** {Boolean} - Whether to use .eslintrc files found in the directories checked.  Default 'true'.
- **failAfterError:** {Boolean} - Whether to fail the task after an error or not.  Default 'false'.
- **failOnError:** {Boolean} - Whether to fail the task on an error or not.  Default 'false'.

##### In {bundle}.*:
None.

##### Flags:
- **skip-lint{ing}**
- **skip-jshint{ing}**
- **skip-jslint{int}**

### findandreplace
Finds and replaces strings in files.

##### In gulpw-config.*:
```
tasks:
  findandreplace:
    constructorLocation: ./src/bundle-tasks-adapters/FindAndReplaceAdapter.js
    priority: -98
    # 'gulp-replace' module options
    # @see for available options: https://www.npmjs.com/package/gulp-replace
    #options:

```

##### In {bundle}.*:
```
findandreplace:
    # Files to find and replace on.
    #files: {Array}
    
    # Key value hash of things to search for (regex|string) and values (string) to replace them with.
    # ** Note ** This feature is not supported yet.
    #findandreplace: {Object}
```
### help
##### Help task usage:
- `gulpw help`
- `gulpw help --section {section-name-here}`
- E.g., `gulpw help --section build`

### jasmine
Jasmine tests task runs the jasmine module on your test 'files' array or string using `options` if any.

##### Options:
Jasmine options (see jasmine module for available options).

##### Flags:
- Skip Testing:
  - `--skip-tests`, `--skip-testing`, `--skip-jasmine-tests`, `--skip-jasmine-testing`

##### In 'gulpw-config.*':
```
tasks:
  jasmine:
    files:
      - some/tests/folder/with/tests/**/*.js
      - some/tests/file.js
    options: null # - {Object} - Jasmine options if any.  Default `null`
```

##### In {bundle}.*:
```
jasmine:
  files:
    - some/tests/folder/with/tests/**/*.js
    - some/tests/file.js
```

### jshint
JsHint task.  If `jshintrc` is specified those options are used instead (maybe we'll merge these options
 in the future?).

##### Options:
See jshint module for options.

##### Flags:
`--skip-jshint`, `skip-jslint`, `skip-linting`

##### In 'gulpw-config.*':
```
tasks:
  jshint:
    jshintrc: ./configs/.jshintrc
    ignoreFiles: null
    options:
      predef:
        - $
        - _
        - amplify
        - Backbone
        - browserify
        - define
        - jQuery
        - Modernizr
        - Mustache
        - Marionette
        - require
        - sjl
```

##### In {bundle}.*:
```
jshint:
    jshintrc: ./.jshintrc
    options:
        ... # see jshint module for options
```



### minify
The 'minify' task is a big composite task due to the many subtasks it handles.
The minify task launches the following tasks per file in it's sources array (task only launch for
corresponding file types):
- gulp-csslint
- gulp-minify-css
- gulp-jshint
- gulp-uglify
- gulp-minify-html

The `template` hash in the options for this task takes care of importing templates using a lodash template
into your javascript file (appended to the bottom of the javascript file)(read notes in config description).

##### Flags:
`--skip-linting`, `--skip-csslint`, `--skip-jshint`, `--skip-jslint`, `--dev`

##### In 'gulpw-config.yaml':
```
tasks:
  minify:
    # Header for top of file (lodash template)
    header: |
      /*! Company Name http://www.company-website.com <%= bundle.options.alias %>.js <%= bundle.options.version %> */
    cssBuildPath: some/css/build/path
    htmlBuildPath: some/html/build/path
    jsBuildPath: some/js/build/path
    allowedFileTypes: # allowed files types to process for the main tasks (css, js, and html)
      - js
      - css
      - html
    htmlTaskOptions:
      spare: true
      comments: false
    jsTaskOptions: {}
    useMinPreSuffix: false
    useVersionNumInFileName: false
    template:
      templatePartial: null # lodash template
      compressWhitespace: true
      templateTypeKeys: # template keys to look for in `files` hash of a bundle
        - mustache
        - handlebars
        - ejs
```

##### In {bundle}.*:
```
files:
    js: # {Array} of file paths
        ...
    css: # {Array} of file paths
        ...
    html: # {Array} of file paths
        ...
    mustache: # {Array} of file paths
        ...
    handlbars: # {Array} of file paths
        ...
    ejs: # {Array} of file paths
        ...
```


### mocha
Mocha tests task runs the mocha module on your test 'files' array or string using `options` if any.

##### Flags
- Skip Testing:
  - `--skip-tests`, `--skip-testing`, `--skip-mocha-tests`, `--skip-mocha-testing`

##### Options:
Mocha options.  See Mocha module for options.

##### In 'gulpw-config.yaml':
```
tasks:
  mocha:
    # {String|Array} of files.  Default `null`
    files: # or ./some/tests/**/*.js
      - some/tests/folder/with/tests/**/*.js
      - some/tests/file.js
    options: null # - {Object} - Options if any.  Default `null`
```

##### In {bundle}.*:
```
mocha:
  files:
    - some/tests/folder/with/tests/**/*.js
    - some/tests/file.js
```

### requirejs
RequireJs task.

#####In 'gulpw-config.yaml':
```
tasks:
  requirejs: null # requirejs options here
    #options:
      ...
```

##### In {bundle}.*:
```
requirejs:
  options:
    ...
```

### vulcan
Vulcan + crisper task

#####In 'gulpw-config.yaml':
```
tasks:
  # Runs vulcanize and crisper on a file and alternately the file hash as a prefix or suffix
  # to the file's basename.
  vulcan:
    constructorLocation: ./src/bundle-tasks-adapters/VulcanTaskAdapter
    priority: 92

    # Files to vulcanize
    # files: // Populated from bundle.{json,js,yaml} file

    # Destination directory for resulting files
    # destDir: // Populated from bundle ""

    # Crisper options
    # @see for available options see: https://www.npmjs.com/package/crisper
    #crisperOptions:
      #jsFileName: # populated from bundle.  Optional.  Default `bundle.alias`
      #scriptInHead: false.  Puts script in head with 'defer' attribute.
      #onlySplit: false.  If false, omits script include of outputted javascript file

    # Vulcanize options (options for `gulp-vulcanize`)
    # @see for available options: https://github.com/Polymer/vulcanize#using-vulcanize-programmatically
    vulcanizeOptions:
      inlineScripts: true
      inlineCss: true

    # Remove generated 'html>head+body' elements and just keep the body's contents
    # @see for more options: https://www.npmjs.com/package/gulp-dom
    #noDomWrapper: false # Best used from bundle config level

```

##### In {bundle}.*:
```
  "Same as in 'gulp-config.yaml' file except `constructorLocation` and `priority` options."
```

##### Flags:
--show-file-sizes
### watch
The 'watch' task watches any files listed in the `requirejs`, `files.*`, and `watch.otherFiles`
keys (this will be dynamic in upcoming version so that you can say what keys should be watched by
default.

##### Options:
- **ignoredTasks {Array}:** Tasks to ignore by default.
- **tasks {Array}:** Tasks to run sequentially when a watched file change is detected.
- Not implemented yet ~~**otherFiles {Array}:** Other files to watch globally.  Default `null`.~~

##### Flags:
- Not yet implement ~~`--file-type` (`--ext`, `-t`) - A list of comma separated file types to watch explicitly (ignores all other file types).~~

##### In 'gulpw-config.*':
```
tasks:
  watch:
    ignoredTasks:
      - clean
      - deploy
    tasks:
      - build
      - deploy
    otherFiles: null
```

##### In {bundle}.*:
```
watch:
  # Boolean for also watching files in `deploy.otherFiles` hash
  watchDeployOtherFilesToo: false
  otherFiles:
    - path/to/some/file.js
    - path/to/some/file.file
    - ...
```

### Available Flags:
**Note** All long forms of these flags use the `--{flag-name}` format.  Short forms use `-{flag-one-letter-alias}`.
All flag default values are `null`/`false`.
- **bundle:** Reserved but not yet used.
- **file-types:**  Used to pass a comma separated list of file extensions to the defined tasks.
    - **Affected tasks:**
        - `deploy` - Uses `--file-types` string to only deploy files of the types you passed in via `--file-types` or one of it's aliases.
    - **Aliases:**
        - `--filetypes`
        - `--filetype`
        - `--ext`
        - `-t`
        - `-x`
- **force:** Used to force the task runner to continue despite any errors.
    - **Aliases:** -f
- **debug:** Used for developing gulpw and allows you to keep your more pertinent debug logging declarations.
    - **Aliases:** None.
- **dev:** Used to ignore minification (at this time).
    - **Affected tasks:**
        - `minify` Minification is skipped when used with this flag.
- **verbose:** Used to print verbose mode logs.
    - **Aliases:** `-v`
- **async:** Runs all tasks asynchronously.  **Note** This may cause race condition errors between certain tasks;  E.g.,
    ``` gulpw build deploy ``` // If you have many bundles deploy may fire before all build sub-tasks are done cause a failure (deploy task will timeout while waiting for files to become available for deploy if they are being used). 
    - **Aliases:** `-a`
- **out:**  Used for sending a path to a task to use to output file(s).  Used by 'csslint' task to output all reporting (optionally).
    - **Alias:**
        - `-o`
- **section:** Used by static help task to show help for a given readme.md section.
- **skip-artifacts:** Causes artifacts to be skipped on deploy task.
- **skip-css-linting:** Causes any css linting/hinting to be skipped from the `minify` task.
- **skip-jasmine-testing:** Causes Jasmine tests to be skipped.
- **skip-js-linting:** Causes js linting tasks to be skipped (jshint/eslint).
- **skip-linting:** Causes css and js linting/hinting to be skipped via 'minify' task.
    - **Aliases:** --skip-jshint --skip-jslint --skip-linting
- **skip-mocha-testing:** Causes mocha tests to be skipped.
- **skip-tests:** Causes `mocha` and `jasmine` tests to not run.
    - **Aliases:** 
        - `--no-tests`
        - `--skip-testing`
- **skip-related-bundles:** Used within build task (skips building of related bundles).
- **show-file-sizes:** Shows file sizes for 'vulcan' task.

### Caveats:
- ~~Be able to pass in multiple flags from the command line (some with values some without values).  Running
 multiple tasks and passing in multiple flags and flags with values are allowed  (flags and values need to
  be passed in last for this to work (cli doesn't differentiate between task names and param/flag values));
    E.g., `gulp task1 --flag1 flag-value --flag2 --flag3 task2 --flag4` will only run `task1` and will parse
    task2 as a value of --flag2 unless you explicitely pass a value to --flag3~~
- Build files cannot be shared amongst bundles when wanting to use the 'watch' task cause they cause a
 cyclic dependency when running global
 watch tasks;  I.e., `gulpw watch`
- Inorder to run tests you must have run `gulpw deploy-config` since the deploy task will expect local deploy options to be
setup for the gulpw-sample-app.

### Resources
- [Initial Idea UML Diagram](http://www.gliffy.com/go/publish/6312461) (http://www.gliffy.com/go/publish/6312461)
- [gulp site](http://gulpjs.com/) (http://gulpjs.com/)
- [gulp docs](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) (https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- [gulp plugins](http://gulpjs.com/plugins/) (http://gulpjs.com/plugins/)
- [gulpw sample app](https://github.com/elycruz/gulpw-sample-app) (https://github.com/elycruz/gulpw-sample-app) (used by gulpw when running it's tests)

### License(s):
- MIT (http://opensource.org/licenses/MIT)
- GNU v2+ (http://www.gnu.org/licenses/gpl-2.0.html)
- GNU v3 (http://www.gnu.org/licenses/gpl.html)
