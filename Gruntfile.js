module.exports = (grunt) => {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    template: {
      dev: {
        options: {
          data: {
            livereload: '<script src="//localhost:35729/livereload.js"></script>'
          }
        },
        files: {
          'dist/index.html': 'app/index.html'
        }
      },
      dist: {
        options: {
          data: {
            livereload: ''
          }
        },
        files: {
          'dist/index.html': 'app/index.html'
        }
      }
    },
    copy: {
      dist: {
        files: [
          {expand: true, cwd: 'app', src: ['assets/images/*'], dest: 'dist'},
        ]
      }
    },
    clean: {
      dist: {
        src: 'dist'
      }
    },
    express: {
      dist: {
        options: {
          script: 'server.js'
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/assets/styles/style.css': 'app/assets/styles/style.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['app/assets/styles/pearson-quarks.scss', 'app/assets/styles/style.scss'],
        tasks: ['sass', 'express:dist'],
        options: {
          spawn: false
        }
      },
      html: {
        files: ['app/index.html'],
        options: {
          spawn: false
        },
        tasks: ['template:dev', 'express:dist']
      }
    }
  });

  grunt.registerTask('build', ['clean:dist', 'sass:dist', 'template:dist', 'copy:dist']);
  grunt.registerTask('default', ['build', 'template:dev', 'express:dist', 'watch']);
};