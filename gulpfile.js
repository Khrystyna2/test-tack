var gulp = require("gulp"),
	sass = require("gulp-sass"),
	browserSync = require("browser-sync"),
	concat = require("gulp-concat"),
	/*uglify       = require('gulp-uglifyjs'),*/
	/*cssnano      = require('gulp-cssnano'),*/
	rename = require("gulp-rename"),
	del = require("del"),
	imagemin = require("gulp-imagemin"),
	pngquant = require("imagemin-pngquant"),
	cache = require("gulp-cache"),
	plumber = require("gulp-plumber"),
	autoprefixer = require("gulp-autoprefixer"),
	sourcemaps = require("gulp-sourcemaps");

gulp.task("sass", function() {
	return gulp
		.src("app/scss/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({ outputStyle: "compact" }).on("error", sass.logError))
		.pipe(autoprefixer(["last 10 versions", "> 1%", "ie 9", "ie 10"], { cascade: true }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", function() {
	browserSync({
		server: {
			baseDir: "app"
		},
		notify: false
	});
});

/* если нужно обединить все скрипты в один розкоментировать и в шаблоне подключить один файл*/
/*gulp.task('scripts', function() {
	return gulp.src([*/
/*'app/js/jquery-3.0.0.min.js',
		'app/js/jquery-migrate-1.4.1.min.js',
		'app/js/components/jquery.fancybox.js',
		'app/js/components/jquery.formstyler.js',
		'app/js/components/jquery.mCustomScrollbar.js',
		'app/js/components/slick.js'*/
/*])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});*/

gulp.task("watch", ["browser-sync", "sass"], function() {
	gulp.watch("app/scss/**/*.scss", ["sass"]);
	gulp.watch("app/*.html", browserSync.reload);
	gulp.watch("app/js/**/*.js", browserSync.reload);
});

gulp.task("clean", function() {
	return del.sync("dist");
});

gulp.task("img", function() {
	return gulp
		.src("app/images/**/*")
		.pipe(
			cache(
				imagemin({
					interlaced: true,
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					use: [pngquant()]
				})
			)
		)
		.pipe(gulp.dest("dist/images"));
});

gulp.task("build", ["clean", "img", "sass"], function() {
	var buildCss = gulp.src(["app/css/style.css"]).pipe(gulp.dest("dist/css"));

	var buildFonts = gulp.src("app/scss/**/*").pipe(gulp.dest("dist/scss"));

	var buildFonts = gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));

	var buildJs = gulp.src("app/js/**/*").pipe(gulp.dest("dist/js"));

	var buildHtml = gulp.src("app/*.html").pipe(gulp.dest("dist"));
});

gulp.task("clear", function(callback) {
	return cache.clearAll();
});

gulp.task("default", ["watch"]);
