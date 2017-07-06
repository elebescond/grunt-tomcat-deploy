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
  if(tomcat === undefined) {
    return;
  }
  var archive = tomcat.dist + '.war';

  grunt.loadNpmTasks('grunt-zip');
  
  // check to see if the zip object is already in the grunt config
  var zip = grunt.config('zip');
  
  // if zip object isn't in grunt config, create
  if (!zip) {
    zip = {};
  }

  // add grunt-tomcat-deploy specific zip config that is unlikely to
  // conflict any entry that might exist
  zip.grunttomcatdeploywar = {
    cwd: tomcat.dist,
    dest: archive,
    src: [tomcat.dist + '/**']
  };

  // set zip object back on the grunt config
  grunt.config('zip', zip);
  
  grunt.registerTask('tomcat_war', ['zip:grunttomcatdeploywar']);

};
