---
title: '[coursera] AngularJS week 2-1'
date: 2016-08-25 02:30:10
category: javascript
tags:
  - angularjs
  - javascript
  - coursera
---

## Task Runners, Angular Scope, Forms and Form Validation-1

### Web Tools: Grunt and Gulp

#### Task-Runners

웹개발을 하다보면 반복적으로 처리해야하는 태스크가 많이 있다. DRY(do not repeat yourself) 원칙에 따라 태스크를 자동화하기 빌드툴을 사용할 필요가 있다.

CSS 에서 보면 Sass 나 Less 로 컴파일하거나, 어떤 vender prefixes 를 추가하거나 Minification(spaces, newlines, comments 등의 불필요한 캐릭터 삭제)하거나 Concatenation 등의 반복적이 Tasks 가 있다.

Javascript 의 경우에는, JSHint 를 이용한 자바스크립트 에러체킹이나 Concatenation, Uglification(minification + mangling(변수명 char 하나로 줄이기)) 등이 있겠다.

이 외에도 Image 용량 최적화, 태스크 rerunning, 변경된 사항 반영하기 위한 server and Livereload, 파일 변경, 테스팅 등의 반복적인 태스크가 있다.

위에서 살펴본 반복적인 태스크를 Grunt, Gulp 등의 Task Runners 를 이용해 자동화 할 수 있다.

### Grunt

Grunt 는 configuration 기반의 태스크 러너이다. 우선 install 하자. -g 옵션을 주어 global 하게 사용할 수 있도록 한다.

```
npm install -g grunt-cli
```

Grunt 의 설정팔일은 Gruntfile.js 로 정의한다. 대략적인 구조를 살펴보면 아래와 같다.
function 의 argument 에 grunt 객체가 들어가고 그 아래에 필요한 코드를 추가한다. 자세한 내용은 차차 알아보자.

```
module.exports = function(grunt) {
	// do requires here
	require('jit-grunt')(grunt);

	// do grunt task configurations here
	grunt.initConfig({

	});

	// register tasks here
	grunt.registerTask('build', ['jshint']);
	grunt.registerTask('default', ['build']);
}
```

#### File Globbing Patterns

Grunt 는 File Globbing Patterns 를 사용한다. File Globbing Patterns 이란 다음의 내용을 말한다.

- \* 문자열, but not /
- ? 문자 하나, but not /
- \*\* 문자열 including /
- {} comma 로 or 를 표현함
- ! 패턴매치가 negative 함

몇가지 예제를 살펴보자
우선 jshint 와 jshint-stylish 모듈을 install 한다.
jshint 는 자바스크립트의 문법을 체크해주는 모듈이다. 세미콜론이 빠졌거나, 괄호가 빠져 있는것 처럼 문법오류나 개선할 부분이 필요한 것을 체크해준다. jshint-stylish 는 jshint 의 메세지를 좀 더 잘 보여주기 위한 스타일을 제공하는 모듈이다.

```
npm install grunt-contrib-jshint --save-dev
npm install jshint-stylish --save-dev
```

그리고 Configuration 을 다음과 같이 작성하자.
Configuration 파일은 프로젝트 root 폴더에서 Gruntfile.js 를 만들어 아래 내용을 저장한다.

```
jshint: {
	options: {
		jshintrc: '.jshintrc',
		reporter: require('jshint-stylish')
	},
	all: {
		// 실제 체크할 자바스크립트 파일의 경로를 지정한다.
		// Gruntfile.js와 app/scripts의 모든 .js 파일을 검사하겠다는 의미다.
		src: ['Gruntfile.js', 'app/scripts/{,*/}*.js']
	}
}
```

설정파일은 자바스크립트 객체 형식으로 구성된다. options 는 jshint 설정파일과 그외 포맷을 위한 style 모듈이 reporter 로 정의되어 있다. hshintrc 는 jshint 설정파일이다. all 부분은 jshint 를 적용할 자바스크트 파일을 Globbing 패턴으로 지정하였다.

#### Greating a Distribution Folder

수많은 Grunt 관련 모듈과 css, js 파일들을 설치함으로써 프로젝트 구성이 점점 복잡해지고 있다. 그래서 Distribution Folder 를 만들어 꼭 필요한 모듈만 이용하는 웹사이트를 만들어 보자.

다음의 모듈을 설치한다.
global(-g) 옵션이 없는 설치는 local 설치이므로 모듈을 사용할 프로젝트 디렉토리에서 실행한다.

#### usemin module

```
// 조건에 맞는 모든 파일을 원하는 폴더(여기서는 dist)로 복사한다.
npm install grunt-contrib-copy --save-dev

// 해당 폴더의 clean out 한다. rebuild를 위한 초반 작업이다. 그렇기 때문에 가장 먼저 실행해야한다.
npm install grunt-contrib-clean --save-dev

// js, css 파일들을 하나로 합쳐준다.
npm install grunt-contrib-concat --save-dev

// css 파일 minification
npm install grunt-contrib-cssmin --save-dev

// 자바스크립트 변수를 문자열 => 문자로 변경한다.
npm install grunt-contrib-uglify --save-dev

// minification한 뒤, css, js 파일을 버전업한다. (브라우저 캐싱 대비)
// 해싱 알고리즘과 length등을 선택할 수 있다.
npm insatll grunt-filerev --save-dev

// css, js 파일을 minification 해준다.
// useminPrepare -> concat -> cssmin -> uglify -> filerev -> usemin의 순서로 태스크가 진행된다.
npm insatll grunt-usemin --save-dev
```

usemin 은 js, css 파이릉 minification 하기 위한 모듈이다. usemin 은 독자적으로 동작하지 않고 여러가지 모듈을 거쳐가는데 대체로 다음과 같다.

> useminPrepare -> concat -> cssmin -> uglify -> filerev -> usemin

우선 useminPrepare 는 html 주석 처리된 부분을 기준으로 css, js 각각의 하나의 파일로 합치기 위한 준비를 한다. concat 을 통해 css, js 파일들을 각각 하나로 합쳐준다. 그리고 cssmin, uglify 모듈을 통해 css, js 파일을 minification 하고 filerev 로 버전관리를 한다. 마지막으로 usemin 이 html 파일에 이전의 모든 모듈이 행한 결과를 반영한다.

#### watch

original 파일의 변경이 발생하였을때 rerun 하기 위한 모듈이다.
설정된 모든 파일중에 하나라도 변경이 일어나면 즉시 reload 한다.
reload 는 모든 파일들을 복사하는것과 같다고 보면 된다.
그런데, js, css 파일들은 copy 를 예외처리하는데, usemin 모듈에서 먼저 빌드처리 되기 때문에 watch 에서는 제외된다.

```
npm install grunt-contrib-watch --save-dev
```

#### connect

브라우저에서 dist 폴더의 특정 html 파일(보통 index.html)이 실행되도록 한다.
watch 모듈과 같이 사용하면 이렇게 사용할 수 있다.

> 파일 변경 -> livereload (build and copy) -> open(update) browse

```
npm install grunt-contlib-connect --save-dev
```

#### Gruntfile.js

```
'use strict';

module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		useminPrepare: 'grunt-usemin'
	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'app/scripts/{,*/}*.js'
				]
			}
		},
		useminPrepare: {
			html: 'app/menu.html',
			options: {
				dest: 'dist'
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {}
		},
		uglify: {
			dist: {}
		},
		cssmin: {
			dist: {}
		},
		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 20
			},
			release: {
				files: [{
					src: [
						'dist/scripts/*js',
						'dist/styles/*.css'
					]
				}]
			}
		},
		usemin: {
			html: ['dist/*.html'],
			css: ['dist/styles/*.css'],
			options: {
				assetsDirs: ['dist', 'dist/styles']
			}
		},

		copy: {
			dist: {
				cwd: 'app',
				src: ['**', '!styles/**/*.css', '!scripts/**/*.js'],
				dest: 'dist',
				expand: true
			},
			fonts: {
				files:[
					{
						expand: true,
						dot: true,
						cwd: 'bower_components/bootstrap/dist',
						src: ['fonts/*.*'],
						dest: 'dist'
					}, {
						expand: true,
						dot: true,
						cwd: 'bower_components/font-awesome',
						src: ['fonts/*.*'],
						dest: 'dist'
					}
				]
			}
		},
		watch: {
			copy: {
				files: ['app/**', '!app/**/*.css', '!app/**/*.js'],
				tasks: ['build']
			},
			scripts: {
				files: ['app/scripts/app.js'],
				tasks: ['build']
			},
			styles: {
				files: ['app/styles/mystyles.css'],
				tasks:['build']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'app/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost',
				livereload: 35729
			},
			dist: {
				options: {
					open: true,
					base: {
						path: 'dist',
						options: {
							index: 'menu.html',
							maxAge: 300000
						}
					}
				}
			}
		},
		clean: {
			build: {
				src: ['dist/']
			}
		}
	});

	// 태스크 등록
	// 순서가 중요하다.
	// jshint로 모든 .js 파일을 검사하게 된다.
	grunt.registerTask('build', [
		'clean',
		'jshint',
		'useminPrepare',
		'concat',
		'cssmin',
		'uglify',
		'copy',
		'filerev',
		'usemin'
	]);

	// 순서가 중요하다. 먼저 build, 다음에는 브라우져 오픈, watch
	// watch가 마지막에 실행되므로, 파일 변경을 감지하면 build, 브라우저 오픈, 다시 watch 와 같은 순서로 진행된다.
	grunt.registerTask('serve', ['build','connect:dist','watch']);
	grunt.registerTask('default', ['build']);
};
```

### Gulp

Grunt 는 Configuration 기반의 태스크 러너였다면, 반대로 Gulp 는 코드 기반의 태스크 러너 이다. Gulp 는 Grunt 처럼 태스크를 실행하기 위한 중간 파일을 만들지 않고 NodeJS streams 을 사용하여 복잡한 파이프라인 형태로 실행된다(무슨 말이지는 잘 모르겠지만, 예제를 보면 알겠지).

일단 global 로 설치하자.

```
npm install -g gulp
```

Grunt 예제와 비슷하게 동작하는 예제를 실행하기 위해 다음과 같은 plugins 을 설치한다.

```
npm install
	gulp-jshint jshint-stylish
	gulp-imagemin gulp-concat gulp-uglify gulp-minify-css gulp-usemin
	gulp-cache gulp-rev gulp-rename gulp-notify
	browser-sync del
--save-dev
```

플러그인을 로드하는 방법은 다음과 같다.
직접 각 플러그인을 로드해도 되지만, package.json 파일 형태로 저장할 수도 있다.

```
var gulp = require('gulp'),
  jshint = require('gulp-jshint')
  sylish = require('jshint-stylish')

  ...
```

#### Gulp Streams

Gulp Streams 는 nodeJS streams 를 사용하여 파이프라인을 구성하는데, 파이프 라인이란 하나의 function 의 결과가 다음 function 으로 그대로 전달되는 연쇄적인 명령셋을 말한다. 예제를 살펴보자

```
gulp.task('jshint', function() {
	gulp.src('app/scripts/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});
```

우선 걸프 태스크를 생성하고 그 안에서 소스를 선택하고 jshint 를 생성하고 스타일을 적용해주는 일련의 명령들을 pipe 라는 function 을 이용하여 연결하였다.

Watch 태스크 예제를 살펴보자

```
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('{app/scripts/**/*.js, app/style/**/*.css, app/**/*.html}', ['usemin']);
	gulp.watch('app/images/**/*', ['imagemin']);
});
```

태스크의 두번째 인자를 보면, browser-sync 가 대괄호로 묶여져 있다. 이 의미는 browser-sync 는 watch 태스크에 종속적이라는 말이다. 즉, watch 태스크가 실행되면 자동으로 browser-sync 가 실행된다.

#### Default Task

```
gulp.task('default', ['clean'], function() {
	gulp.start('usemin', 'imagemin', 'copyfonts');
});
```

default 태스크는 콘솔창에서 gulp 라고 입력하면 실행되는 태스크이다. clean 태스크가 연쇄적으로 발생하게 되고, 내부에서는 서로 dependency 가 없는 usemin, imagemin, copyfonts 가 동시에 실행된다.

#### gulpfile.js

콤마(,)와 띄어쓰기에 유의해야 한다.

```
var gulp = require('gulp'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	changed = require('gulp-changed'),
	rev = require('gulp-rev'),
	browserSync = require('browser-sync'),
	del = require('del');

gulp.task('jshint', function() {
	return gulp.src('app/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('usemin', ['jshint'], function() {
	return gulp.src('./app/menu.html')
		.pipe(usemin({
			css:[minifycss(),rev()],
			js: [uglify(),rev()]
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function() {
	return del(['dist/images']), gulp.src('app/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
	return del(['dist'])
});

gulp.task('copyfonts', ['clean'], function() {
	gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
		.pipe(gulp.dest('./dist/fonts'));
	gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
	gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function() {
	var files = [
		'app/**/*.html',
		'app/styles/**/*.css',
		'app/images/**/*.png',
		'app/scripts/**/*.js',
		'dist/**/*'
	];

	browserSync.init(files, {
		server: {
			baseDir: "dist",
			index: "menu.html"
		}
	});

	gulp.watch(['dist/**']).on('change', browserSync.reload);
});

gulp.task('default', ['clean'], function() {
	gulp.start('usemin', 'imagemin', 'copyfonts');
});
```
