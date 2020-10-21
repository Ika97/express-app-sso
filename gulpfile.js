/*jshint esversion: 6 */
const dotenv = require('dotenv');
const gulp = require('gulp');
const gulpMocha = require('gulp-mocha');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const log = require('fancy-log');
const merge = require('merge2');

dotenv.config({ path: '.env' });
const tsProject = ts.createProject('tsconfig.json');

const paths = {
  favicon: {
    src: 'src/public/favicon.ico',
    dest: 'dist/public/'
  },
  img: {
    src: 'src/public/img/**/*',
    dest: 'dist/public/img/'
  },
  css: {
    src: 'src/public/css/**/*',
    dest: 'dist/public/css/'
  },
  validator: {
    src: 'node_modules/validator/validator.min.js',
    dest: 'dist/public/js/'
  },
  vue: {
    src: 'node_modules/vue/dist/vue.min.js',
    dest: 'dist/public/js/'
  },
  ejs: {
    src: 'src/views/**/*.ejs',
    dest: 'dist/views/'
  },
  typescript: {
    src: 'src/**/*.ts',
    dest: 'dist'
  },
  tests: {
    src: 'test/**/*.test.ts',
    dest: 'test/**/*.test.ts'
  }
};

function app(done) {
  var started = false;
  log('Node Environment:', process.env.PORT, process.env.NODE_ENV);

  return nodemon({
      script: 'dist/app.js',
      delay: '1000',
      watch: ['dist'],
      env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT
      }
  }).on('start', () => {
      if (!started) {
          started = true;
          done();
      }
  });
}

function assets() {
  return merge(
    gulp.src(paths.img.src).pipe(gulp.dest(paths.img.dest)),
    gulp.src(paths.favicon.src).pipe(gulp.dest(paths.favicon.dest)),
    gulp.src(paths.css.src).pipe(gulp.dest(paths.css.dest)),
    gulp.src(paths.validator.src).pipe(gulp.dest(paths.validator.dest)),
    gulp.src(paths.vue.src).pipe(gulp.dest(paths.vue.dest))
  );
}

function compile() {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.typescript.dest));
}

function ejs() {
  return gulp.src(paths.ejs.src).pipe(gulp.dest(paths.ejs.dest));
}

function testOnce() {
  return gulp.src(paths.tests.src)
  .pipe(gulpMocha({
    bail: false,
    reporter: 'spec',
    compilers: 'ts:ts-node/register'
    }).on('error', console.error));
}

function testing(done) {
  gulp.watch(paths.tests.src, mocha);
  done();
}

function watch(done) {
  gulp.watch(paths.img.src, gulp.series(assets));
  gulp.watch(paths.favicon.src, gulp.series(assets));
  gulp.watch(paths.css.src, gulp.series(assets));
  gulp.watch(paths.ejs.src, gulp.series(ejs, compile));
  gulp.watch(paths.typescript.src, compile);
  done();
}

const build = gulp.series(compile, ejs, assets);
const serve = gulp.series(app, watch);
const assess = gulp.series(testOnce, testing);

gulp.task('build', build);
gulp.task('serve', serve);
gulp.task('test', assess);
gulp.task('testing', testing);
gulp.task('default', build);
