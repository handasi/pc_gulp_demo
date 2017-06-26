var gulp=require('gulp');
concat=require('gulp-concat'),
    uglify=require('gulp-uglify'),
    less=require('gulp-less'),
    contactCss=require('gulp-concat-css'),
    minifyCss=require('gulp-minify-css'),
    minifyHtml = require("gulp-minify-html"),
    watch = require('gulp-watch'),
    include= require('gulp-file-include'),
    livereload= require('gulp-livereload'),
    imageminify=require('gulp-imagemin'),
    spriter= require('gulp-css-spriter'),
    mockServer=require('gulp-mock-server'), //mock-server
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    //es2015 = require('babel-preset-es2015'),
    babelCore=require('babel-core');
/*编译ES6*/
gulp.task('es6',function(){
    gulp.src('lib/js/es6/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib/js'));
});
/*js合并*/
gulp.task('scripts',['es6'],function(){
    return gulp.src(['./lib/js/index.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js'));
});
/*js copy*/
gulp.task('copy',function(){
    return gulp.src(['./lib/js/lib/*.js'])
    .pipe(gulp.dest('./dist/js'));
});
/*js压缩*/
gulp.task('compress',function(){
    return gulp.src('./dist/js/*.js') // 要压缩的js文件
        .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
        .pipe(gulp.dest('dist/app/js')); //压缩后的路径
});
/*less编译*/
gulp.task('less',function(){
    return gulp.src(['./lib/css/less/reset.less','./lib/css/less/index.less'])
        .pipe(less())
        .pipe(gulp.dest('./lib/css'));
});
/*css合并*/
gulp.task('css',['less'],function(){
    return gulp.src(['./lib/css/reset.css','./lib/css/index.css'])
        .pipe(contactCss('main.css'))
        .pipe(gulp.dest('./dist/css'));
});
/*css压缩*/
gulp.task('minifyCss',function() {
    gulp.src('./dist/css/*.css') // 要压缩的css文件
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest('dist/app/css'));
});

/*html头尾部件复用*/
gulp.task('fileinclude', function() {
    gulp.src('./lib/main/**.html')
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/html'));
});
/*html压缩*/
gulp.task('minifyhtml', function () {
    gulp.src('dist/html/*.html') // 要压缩的html文件
        .pipe(minifyHtml()) //压缩
        .pipe(gulp.dest('./dist/app/html'));
});

/*图片压缩*/
gulp.task('images', function() {
    gulp.src('./lib/css/images/*.*')
        .pipe(imageminify({optimizationLevel:5}))
        .pipe(gulp.dest('./dist/css/images'))
        .pipe(gulp.dest('./dist/app/css/images'));
});

/*浏览器实时刷新*/
gulp.task('watch',function(){
    livereload.listen();
    gulp.watch(['./lib/css/*.*','./lib/css/less/*.*'],['css']);
    gulp.watch('./lib/main/*.*',['fileinclude']);
    gulp.watch('./lib/js/es6/*.*',['es6']);
    gulp.watch('./lib/js/*.*',['scripts']);
    gulp.watch('./dist/**/*.*',function(e) {
        livereload.changed(e.path);
    });
});
/*雪碧图生成*/
gulp.task('sprite', function() {
    return gulp.src('./lib/css/sprite.css')
        .pipe(spriter({'spriteSheet':'./lib/css/images/spritesheet.png','pathToSpriteSheetFromCSS': './images/spritesheet.png'}))
        .pipe(gulp.dest('./dist/css'));
});
/*清楚文件夹*/
gulp.task('clean',function(){
    return gulp.src(['dist']).pipe(clean());
});

gulp.task('default',['css','copy','fileinclude','images','scripts']);
gulp.task('appDefault',['minifyhtml','images','minifyCss','compress']);

