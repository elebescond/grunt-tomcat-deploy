/*
 * grunt-tomcat-deploy
 * https://github.com/elebescond/grunt-tomcat-deploy
 *
 * Copyright (c) 2013 Erwan Le Bescond
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerTask('tomcat_deploy_only', 'Deploy your files to a tomcat server.', function() {

    var done = this.async();

    grunt.config.requires('tomcat_deploy.login');
    grunt.config.requires('tomcat_deploy.password');
    grunt.config.requires('tomcat_deploy.host');
    grunt.config.requires('tomcat_deploy.port');
    grunt.config.requires('tomcat_deploy.deploy');
    grunt.config.requires('tomcat_deploy.path');

    this.requires(['tomcat_war']);

    var tomcat = grunt.config('tomcat_deploy');

    var archive = tomcat.dist + '.war'
    
    var options = {
      auth: tomcat.login + ':' + tomcat.password,
      hostname: tomcat.host,
      port: tomcat.port,
      path: tomcat.deploy + '?path=' + tomcat.path + '&update=false',
      method: 'PUT'
    };

    var content = '';

    var req = require('http').request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        content += chunk;

      });
      res.on('err', function (chunk) {
        grunt.log.error(chunk);
        done(false);
      });
      res.on('end', function (chunk) {
        if(/^OK.*$/m.test(content)) {
          grunt.log.writeln(content);
          done();
        }
        else {
          grunt.log.error(content);
          done(false);
        }
      });
    });

    var fs = require('fs');
    var stream = fs.createReadStream('./' + archive);

    stream.on('data', function(data) {
        req.write(data);
    });

    stream.on('end', function() {
        req.end();
    });

    
  });

  grunt.registerTask('tomcat_deploy', ['tomcat_war', 'tomcat_deploy_only']);

  grunt.registerTask('tomcat_redeploy', ['tomcat_undeploy', 'tomcat_war', 'tomcat_deploy']);

};
