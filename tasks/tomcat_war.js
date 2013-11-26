/*
 * grunt-tomcat-deploy
 * https://github.com/elebescond/grunt-tomcat-deploy
 *
 * Copyright (c) 2013 Erwan Le Bescond
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var tomcat = grunt.config('tomcat_deploy');

  var archive = tomcat.dist + '.war';

  grunt.loadNpmTasks('grunt-zip');
  
  grunt.config('clean', { build: [archive] });
  grunt.config('zip', {
    war: {
      cwd: tomcat.dist,
      dest: archive,
      src: [tomcat.dist + '/**']
    }
  });
  
  grunt.registerTask('tomcat_war', ['clean', 'zip:war']);

};
