module.exports = (grunt) => {

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-writefile');

  var pc_colors = grunt.file.readJSON('color-model.json');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    writefile: {
      options: {
        data: pc_colors,
        helpers: {
            toHex: function (hexColor) {
              if (hexColor.length === 4 ) {
                hexColor =  '#' + hexColor.substr(1).repeat(2);
              }

              return hexColor.toUpperCase();
            }
        }
      },
      sass : {
        src: 'app/templates/_colorPalette.scss.hbs',
        dest: 'app/assets/scss/_colorPalette.scss'
      },
      less : {
        src: 'app/templates/_colorPalette.less.hbs',
        dest: 'app/assets/less/_colorPalette.less'
      },
      stylus : {
        src: 'app/templates/_colorPalette.styl.hbs',
        dest: 'app/assets/stylus/_colorPalette.styl'
      },
      styles4docs : {
        src: 'app/templates/colors4docs.scss.hbs',
        dest: 'app/assets/styles/colors4docs.scss'
      },
      documentation : {
        src: 'app/index.html.hbs',
        dest: 'app/index.html'
      },
    },
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
          {expand: true, cwd: 'app', src: ['assets/images/**'], dest: 'dist'},
          {expand: true, cwd: 'app', src: ['assets/less/*'], dest: 'dist'},
          {expand: true, cwd: 'app', src: ['assets/scss/*'], dest: 'dist'},
          {expand: true, cwd: 'app', src: ['assets/stylus/*'], dest: 'dist'},
          {expand: true, cwd: 'app', src: ['*.js'], dest: 'dist'}
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
        files: ['app/index.html.hbs'],
        options: {
          spawn: false
        },
        tasks: ['template:dev', 'express:dist', 'writefile:documentation']
      }
    }
  });

  grunt.registerTask('build', ['clean:dist', 'writefile:sass', 'writefile:less', 'writefile:stylus', 'writefile:styles4docs', 'writefile:documentation', 'sass:dist', 'template:dist', 'copy:dist']);
  grunt.registerTask('default', ['build', 'template:dev', 'express:dist', 'watch']);
};