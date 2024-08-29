module.exports = function(grunt) {
    grunt.initConfig({
        uncss: {
            dist: {
                files: {
                    '../css/above-the-fold.css' : ['../index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-uncss');
    grunt.registerTask('default', ['uncss']);
};
