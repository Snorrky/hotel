const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default; 
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const CleanCSS = require('gulp-clean-css');
const image = require('gulp-image');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const del = require('del');


function browsersync() {
    browserSync.init({
        server: { baseDir: 'dist/'},
        notify: false,
        online: true
    })
}

function scripts() {
    return src([
        "node_modules/jquery/dist/jquery.min.js",
        'src/js/main.js',
        ])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src("./src/css/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoPrefixer())
        .pipe(CleanCSS({compatibility: 'ie8'}))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}

function html() {
    return src('src/index.html')
    .pipe(dest('dist/'))
}

function images () {
    return src([
        'src/img/**/*.*'
    ])
    .pipe(newer('dist/img/'))
    .pipe(image())
    .pipe(dest('dist/img/'))
}


function startWatch() {
    watch(['src/img/**/*.*'], images);
    watch(['src/css/**/*.scss', '!src/**/*.min.css'], styles);
    watch(['src/js/**/*.js', '!src/**/*.min.js'], scripts);
    watch(['src/**/*.html', 'dist/**/*.min.js', 'dist/**/*.min.css'], html).on("change", browserSync.reload);
}



exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.html = html;

exports.default = parallel(styles, scripts, images, html, browsersync, startWatch);