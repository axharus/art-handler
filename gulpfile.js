const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

function pack() {
    return gulp
        .src(['src/public/debuger.js'])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minify())
        .pipe(gulp.dest('src/public/build'));
}

exports.default = pack;
