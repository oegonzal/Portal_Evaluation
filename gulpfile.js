var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function () {
    
});

gulp.task('inject', function () {
    
});

gulp.task('serve', function () {
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            'PORT': 5000
        },
        watch: jsFiles
    };
    
    return nodemon(options)
        .on('restart', function(ev) {
            console.log('Restarting...');
        });
});