/*global module, require*/

module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp'
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/**/*'
          ]
        }]
      }
    },

    // A multi-task to validate your JavaScript files with JSLint.
    jslint: {
      scripts: {
        src: ['<%= config.src %>/ng-rateit.js'],
        directives: {
          predef: ['angular','document','window','console'],
          white: true,
          regexp: true,
          newcap: true,
          todo: true
        }
      }
    },

    removelogging: {
      dist: {
        src: "<%= config.src %>/ng-rateit.js",
        dest: "<%= config.dist %>/ng-rateit.js"
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          src: '<%= config.dist %>/ng-rateit.js',
          dest: ''
        }]
      }
    },

    // Minify files with UglifyJS.
    uglify: {
      build: {
        files: {
          '<%= config.dist %>/ng-rateit.min.js': ['<%= config.dist %>/ng-rateit.js']
        }
      }
    },

    // This task converts all data found within a stylesheet (those within a url( ... ) declaration) 
    // into base64-encoded data URI strings. This includes images and fonts.
    imageEmbed: {
      dist: {
        src: [ "<%= config.src %>/style/ng-rateit.css" ],
        dest: "<%= config.dist %>/ng-rateit.css",
        options: {
          deleteAfterEncoding : false
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      dist: {
        files: {
          '<%= config.dist %>/ng-rateit.css': [
            '<%= config.dist %>/ng-rateit.css'
          ]
        }
      }
    }


  });

  grunt.registerTask('build', [
    'clean',
    'jslint',
    'removelogging',
    'ngAnnotate',
    'uglify',
    'imageEmbed',
    'cssmin'
  ]);

};
