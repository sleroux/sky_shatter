module.exports = function (grunt) {
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'js/src/*.js']
        }
    });

    grunt.registerTask('wait', 'Wait forever.', function() {
      grunt.log.write('Waiting...');
      this.async();
    });
};