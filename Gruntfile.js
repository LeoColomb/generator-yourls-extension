module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    bump: {
      options: {
        pushTo: 'origin'
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
};
