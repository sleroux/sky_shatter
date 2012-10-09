module.exports = function (grunt) {
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'ts/game.js']
        },
        jasmine: {
            all: ['js/tests/unit/levels/spec/*']
        }
    });

    grunt.registerTask('wait', 'Wait forever.', function() {
      grunt.log.write('Waiting...');
      this.async();
    });

    grunt.loadNpmTasks('grunt-jasmine-task');
};