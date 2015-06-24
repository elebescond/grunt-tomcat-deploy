/*
 * grunt-tomcat-deploy
 * https://github.com/elebescond/grunt-tomcat-deploy
 *
 * Copyright (c) 2013 Erwan Le Bescond
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var isDist = typeof(grunt.config('tomcat_deploy')) !== 'undefined' ? !grunt.config('tomcat_deploy').war : false;
  grunt.registerTask('tomcat_deploy_only', 'Deploy your files to a tomcat server.', function() {

    var done = this.async();
    
    grunt.config.requires('tomcat_deploy.login');
    grunt.config.requires('tomcat_deploy.password');
    grunt.config.requires('tomcat_deploy.host');
    grunt.config.requires('tomcat_deploy.port');
    grunt.config.requires('tomcat_deploy.deploy');
    grunt.config.requires('tomcat_deploy.path');

    var archive, tomcat;
    tomcat = grunt.config('tomcat_deploy');
    //check to see if getting a war instead of a dist
    if (isDist) {
      this.requires(['tomcat_war']);
      archive = tomcat.dist + '.war';
    }
    else {
      archive = tomcat.war;
    }
    
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
  var redeploy = function (done ) {
    var tomcat = grunt.config('tomcat_deploy');
    var http = require('http'),
      options = {
        host: tomcat.host,
        port: tomcat.port,
        path: tomcat.path
      };

    var thing = http.get(options, function(res) {
      if( res.statusCode === 404) {
        grunt.log.ok("tomcat_undeploy: Nothing to undeploy");
        grunt.task.run('tomcat_deploy');
        done();
      }
      else {
        grunt.task.run('tomcat_undeploy');
        grunt.task.run('tomcat_deploy');
        done();
      }
    });
  };

  //no need for war task if a war exists
  if (isDist) {
    grunt.registerTask('tomcat_deploy', ['tomcat_war', 'tomcat_deploy_only']);
  }
  else {
    grunt.registerTask('tomcat_deploy', ['tomcat_deploy_only']);
  }

  grunt.registerTask('tomcat_redeploy', function() {
    var async= require('async');
    var gruntDone = this.async();
        async.parallel([
          redeploy
        ], function(){
          gruntDone();
        });
  });


};
