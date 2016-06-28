/*
 * grunt-tomcat-deploy
 * https://github.com/elebescond/grunt-tomcat-deploy
 *
 * Copyright (c) 2013 Erwan Le Bescond
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    tomcat_deploy: {
      host: 'localhost',
      login: 'tomcat',
      password: 'tomcat',
      path: '/myapp',
      port: 8080,
      dist: 'dist',
      deploy: '/manager/text/deploy',
      undeploy: '/manager/text/undeploy',
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    // zip config to ensure things are overwritten
    zip: {
      war: {
        cwd: 'testFolder',
        dest: 'testWar.war',
        src: ['testFolder/**']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // log statement to ensure the zip config object hasn't been
  // modified after the tomcat is loaded
  grunt.log.writeln('zip: ' + JSON.stringify(grunt.config('zip')));

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'tomcat_deploy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
