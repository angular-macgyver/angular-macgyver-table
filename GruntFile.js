'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
 
    browserify: {
      example: {
        files: {
          './example/main.js': ['./example.js']
        }
      }
    },
    watch: {
      scripts: {
        files: [
          './classes/**/*.js',
          './controllers/**/*.js',
          './directives/**/*.js',
          './factory/**/*.js',
          './services/**/*.js'
        ],
        tasks: ['browserify'],
        options: {
          spawn: false,
          debounceDelay: 250
        },
      },
    },
  });
 
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  grunt.registerTask('default', ['browserify', 'watch']);
};
