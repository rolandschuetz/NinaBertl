"use strict";
// Gulp module imports
import {src, dest, watch, parallel, series} from "gulp";
import babel from "gulp-babel";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import webpackConfig from "./webpack.config.js";
import sourcemaps from "gulp-sourcemaps";
import fileinclude from "gulp-file-include";
import image from "gulp-image";
import webp from "gulp-webp";
import del from "del";
import flatten from "gulp-flatten";
import plumber from "gulp-plumber";
import dartSass from 'sass';
import gulpSass from "gulp-sass";
const sass = gulpSass( dartSass );
const browserSync = require('browser-sync').create();

// Recognise `production`
const production = process.env.NODE_ENV.trim() === "production";

// Build Directories
// ----
const PATH = {
	src: "src",
	build: production ? "public" : "live",
	assets: {
		images: "src/assets",
		fonts: "src/fonts",
		audio: "src/assets",
		video: "src/assets",
		data: "src/assets",
	}
};

// File Sources
// ----
const sources = {
	styles: {toWatch: `${PATH.src}/**/*.scss`, toCompile: `${PATH.src}/main.scss`},
	views: {toWatch: `${PATH.src}/**/*.html`, toCompile: `${PATH.src}/pages/**/*.html`},
	scripts: {toWatch: `${PATH.src}/**/*.js`, toCompile: `${PATH.src}/app.js`},
	fonts: {toWatch: `${PATH.src}/assets/fonts/*`, toCompile: `${PATH.src}/assets/fonts/**/*`},
	images: {toWatch: `${PATH.src}/assets/images/**/*`, toCompile: `${PATH.src}/assets/**/*`},
	video: {toWatch: `${PATH.src}/assets/video/*`, toCompile: `${PATH.src}/assets/video/**/*`},
	audio: {toWatch: `${PATH.src}/assets/video/*`, toCompile: `${PATH.src}/assets/audio/**/*`},
	data: {toWatch: `${PATH.src}/assets/data/*`, toCompile: `${PATH.src}/assets/data/**/*`},
};

// Main Tasks
// ----

let reload = browserSync.reload;
if(!production) {
	browserSync.init({
		server: {
			baseDir: "./live/"
		}
	});
}


// Styles
export const buildStyles = () => src(sources.styles.toCompile, {nodir: true})
	.pipe(sourcemaps.init())
	.pipe(sass.sync({
		outputStyle: production ? 'compressed' : 'expanded',
		includePaths: ['node_modules']
	}).on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(dest(PATH.build))
	.pipe(browserSync.stream());

// Views
export const buildViews = () => src(sources.views.toCompile)
	.pipe(plumber())
	.pipe(fileinclude({
		prefix: '@@',
		basepath: './src',
		context: {env: production ? 'public' : 'live'}
	}))
	.pipe(flatten())
	.pipe(dest(PATH.build));

// Scripts
export const buildScripts = () => src(sources.scripts.toCompile)
	.pipe(plumber())
	.pipe(babel({presets: ['@babel/preset-env']}))
	.pipe(dest(PATH.build));

// Webpack
export const buildWebpack = () => src(sources.scripts.toCompile)
	.pipe(webpackStream(webpackConfig), webpack)
	.pipe(dest(PATH.build));

// Images
export const convertImages = () => src([sources.images.toCompile, '!' + `${PATH.src}` + '/assets/images/favicon/*'], {nodir: true})
	.pipe(webp())
	.pipe(dest(PATH.build));

export const buildImages = () => src(sources.images.toCompile, {nodir: true})
	.pipe(image({
		pngquant: true,
		optipng: false,
		zopflipng: true,
		jpegRecompress: false,
		mozjpeg: true,
		guetzli: false,
		gifsicle: true,
		svgo: true,
		concurrent: 10,
		quiet: true // defaults to false
	}))
	.pipe(dest(PATH.build));

// Fonts TODO: simplify converting(fontforge?)
export const buildFonts = () => src(sources.fonts.toCompile)
	.pipe(dest(PATH.build));

// Data
export const buildData = () => src(sources.data.toCompile, {nodir: true})
	.pipe(dest(PATH.build));

// Audio TODO: add ffmpeg converting
export const buildAudio = () => src(sources.audio.toCompile, {nodir: true})
	.pipe(dest(PATH.build));

// Video TODO: add ffmpeg converting
export const buildVideo = () => src(sources.video.toCompile, {nodir: true})
	.pipe(dest(PATH.build));

// Clean
export const clean = () => del([PATH.build]);

// Watch Task
export const devWatch = () => {
	watch(sources.styles.toWatch, buildStyles).on("change", reload);
	watch(sources.views.toWatch, buildViews).on("change", reload);
	watch(sources.scripts.toWatch, buildWebpack).on("change", reload);
	watch(sources.images.toWatch, buildImages).on("change", reload);
	watch(sources.fonts.toWatch, buildFonts).on("change", reload);
	watch(sources.data.toWatch, buildData).on("change", reload);
	watch(sources.audio.toWatch, buildAudio).on("change", reload);
	watch(sources.video.toWatch, buildVideo).on("change", reload);
};

// Default task
export default production
	// Development Task
	? series(clean, parallel(buildImages, convertImages, parallel(buildStyles, buildViews, buildWebpack)))
	// Production Task
	: series(clean, parallel(buildImages, convertImages, parallel(buildStyles, buildViews, buildWebpack)), devWatch);

