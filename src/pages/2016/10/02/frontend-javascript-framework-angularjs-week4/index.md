---
title: '[coursera] AngularJS week 4'
date: 2016-10-02 17:38:30
category: javascript
tags:
  - angularjs
  - javascript
  - coursera
---

## Client-Server Communication and Angular Testing

### Networking Essentials

이번 챕터에서는 클라이언트 서버 구조에서 AngularJS 가 어떻게 동작하는지 살펴볼것이다.
요즘 가장 많이 사용되는 Client-Server 관계는 HTTP 프로토콜과 REST API 를 이용한 백엔드(서버)와 브라우저(클라이언트)간의 통신으로 이뤄진다. 이전 강의까지 보았던 방식은 브라우저에 출력되는 데이터가 services.js 파일의 자바스크립트 오브젝트로 존재했었다. 하지만, Client-Server 구조에서는 거의 모든 데이터를 서버사이드에서 클라이언트 사이드로 제공해준다. HTTP 와 REST API 에 대한 내용은 자세히 다루지는 않겠다(강의 보세요).

HTTP Response 는 클라이언트로 보낼 HTML 페이지나 특정 포맷으로 data 를 가지는데, 주로 XML 또는 JSON 을 많이 사용한다. 이 중에서 JSON(Javascript Object Notation)은 가장 많이 사용되는 데이터 포맷이다. 이름만 보면 자바스크립트에서만 사용될것 같지만, 모바일이나 웹서비스 등 일반적인 HTTP 통신에서 대부분 사용된다. XML 이 잘 사용되지 않는 이유는 JSON 에 비해서 데이터를 parsing 하는 과정이 복잡하기 때문이다.

JSON 데이터 구조를 간단히 살펴보자
자바스크립트 object 와 구조가 비슷하다. name : value 구조로 이뤄지며, value 내에는 array, 스트링, 숫자, object 등의 데이터 타입 등이 들어갈 수 있다.

```
{"promotion":
	[
		{
			"id": 0,
			"name": "weekend buffet",
			"image": "images/buffet.png",
			"label": "New",
			"price": "19.99",
			"description": "asdjfkljaskdlfjas..."
		}
	]
}
```

### Client-Server Communication using $http

#### Angular $http

$http 는 브라우저에서 서버와의 통신을 위한 가장 핵심적인 서비스로 HTTP protocol 을 사용한다. 아마 내부적으로는 AJAX 통신을 할것이기 때문에 비동기로 처리될 것이다.

#### Promise

자바스크립트에서 Promise 란 비동기 통신이 완료된 후에 상태에 따라 특정 콜백을 리턴해 줄 것이라는 일종의 약속 같은 것을 말한다. $http 서비스 역시 프로미스를 리턴한다. 패턴은 아래와 같다.

```
$http({method: 'GET', url:'/dishes'})
	.then(function() { ... }, function() { ... });
```

then 뒤에는 두개의 function 이 파라미터로 들어가 있다. 첫번째는 request 가 성공했을 때 발생하는 함수이고, 두번째는 요청이 실패했을때 발생하는 함수이다. 보통 AJAX 통신을 사용할 때, 'success', 'error' 속성을 사용하는 것과 비슷하다.

#### HTTP Response

요청의 결과로 response 라는 object 가 서버로부터 넘어온다. 이때 reponse 객체에는 다음과 같은 속성들이 포함되어 있다.

- response.data : 메세지 바디를 포함하느 string / object
- response.status : 상태 코드 (200, 400 등)
- response.headers : 헤더정보
- response.config : configuration object
- response.statusText : response 상태 텍스트 값

#### ng-if directive

html 코드를 작성할 때 해당 DOM 을 보여줄지 말지를 결정하기 위해 ngIf directive 를 사용할 수 있다. 사용법은 간단하다.

```
<div class="col-xs-12" ng-if="!showMenu">
	<h3>{{message}}</h3>
</div>
```

showMenu 가 true 면 ng-if 는 false 가 되므로 해당 message 는 안보일것이고, showMenu 가 false 면 반대로 message 가 나타날 것이다.

### Brief Representational State Transfer (REST)

본격적으로 서버와의 통신을 해보기 전에 가장 많이 사용하는 방식인 REST 에 대해서 알아보자. 웹 서비스를 만들때 네트워크와 연결하는 방법에 대한 시스템은 보통 아래 두개 접근법이 가장 일반적이다.

- SOAP (Simple Object Access Protocol) : Uses WSDL(Web Service Description Language), 프레젠테이션 영역에 XML 을 사용

- REST (Representational State Transfer) : 가장 많이 사용됨, Use Web standards, Exchange of data using either XML or JSON, SOAP 나 WSDL 보다 훨씬 간단한다.

REST 는 WWW(World Wide Web)과 같이 분산 hypermedia systems 을 위한 아키텍쳐 스타일 중 하나이며, 웹 페이지의 리소스에 어떻게 접근하고 어떻게 정의되고 어떻게 이동하는지에 대한 법칙을 모아놓은 시스템이다.

#### REST 의 기본 법칙

- HTTP 메소드를 사용하며 (Use HTTP methods explicitly)
- 상태를 저장하지 않는다 (Be stateless)
- 리소스는 URI 와 같이 디렉토리 스트럭쳐가 그대로 노출된다 (Expose directory structure-like URIs)
- 통신의 매개체로 XML, JSON 등이 사용된다.

REST 는 세가지 컨셉으로 표현할 수 있다. 특정 URI 로 표현되는 _Nouns(Resources)_, GET or POST 등의 HTTP 메소드인 _Verbs_, XML or JSON 등으로 표현하는 _Representaions_

#### Resources

REST 의 리소스는 다음과 같이 표기한다. 리소스에는 문서나 이미지, 리소스 컬렉션 등이다.

```
http://www.conFusion.food/dishes/			# Retrieve all dishses
http://www.conFusion.food/dishes/123		# Retrieve information about the specific dish (id:123)
http://www.conFusion.food/promotions/
http://www.conFusion.food/leadership/
http://www.conFusion.food/leadership/456
```

#### Verbs

Verb 에 해당하는 HTTP 메소드는 각각 다음과 같은 의미를 가진다.

- GET -> READ
- POST -> CREATE
- PUT -> UPDATE
- DELETE -> DELETE

GET 메소드는 클라이언트가 서버에게 어떤 리소스를 요청하는 메소드이다. 어떤 GET 메소드가 서버에 요청(Request)이 들어오면, 서버는 XML 또는 JSON 형태로 클라이언트(브라우저)에게 응답(Response)을 한다.

#### Representaions

표현을 위해 클라이언트에게 어떤 데이터를 보낼 것이냐 하는 것인데, 가장 많이 쓰이는 두가지 방식이 바로 JSON 과 XML 이다. 최근에는 JSON 타입이 정보 교환을 위한 standards 로 여겨지고 있다.

#### Stateless

REST 는 상태를 저장하지 않다. 매 요청바다 항상 새로운 요청이 발생하게 된다. 그렇기 때문에 클라이언트측에서 요청에 따라 상태가 변화하는 것을 트래킹하기 위해서는 클라이언트 자신이 요청 전의 상태를 기억하고 있어야 한다.

### Clint-Server Communication using $resource

#### Angular ngResource

ngResource 모듈은 restful API 서버와 통신하기 위해 $http 보다 고수준의 추상화를 제공한다(흠...). angular core 가 아니기 때문에 따로 설치해 줘야 한다.

```
bower install angular-resource -S
```

DI 를 이용해서 ngResource 를 사용할 수 있다.

```
angular.module('confusionApp', ['ui.router', 'ngResource'])
```

#### Angular $resource Service

$http 에 비해 $resource 는 훨씬 편리하게 사용할 수 있다. 우선 사용 예시를 살펴보기 전에 $resource 서비스를 사용하기 위해서는 사용하고자하는 service 나 controller 에 DI 로 추가한다.

```
.service('menuFactory', ['$resouce', 'baseURL', function($resource, baseURL) {

	...

	$scope.dishes = $resouce(baseURL + "dishes/:id", null, {'update':{method:'PUT'}}).query();

	var dish = $resource(baseURL + "dishes/:id", null, {'update':{method:'PUT'}}).get({id:0}, function() {
			dish.name = "dovanut";
			dish.$save();
		})
	...

}])
```

$resource 의 기본 action 들은 다음과 있다.

> {'get':{method:'GET'},
> 'save':{method:'POST'},
> 'query':{method:'GET', isArray:true},
> 'remove':{method:'DELETE'},
> 'delete':{method:'DELETE'}};

action 을 커스텀으로 만들 수도 있는데, 위의 예제에서 본 것 처럼 update 라는 메서드를 HTTP PUT 메서드로 정의해 놓으면 update() 함수를 사용할 수 있다. 다음의 예제를 보자

```
$resource(baseURL+"dishes/:id", null, {'update':{method:'PUT'}}).update({id:$scope.dish.id},$scope.dish);
```

### Angular Testing

Angular 테스팅은 unit 테스트를 제공한다. unit 테스트란 각 부분의 독립된 로직을 테스트하는 기법을 말하는데, Angluar 에서는 작성한 controller, filter, factory, service 등의 모듈을 개별적으로 검사할 수 있다. 그렇기 때문에 angular 로 작성한 코드는 DOM 과는 완전히 분리되어 테스트할 수가 있다.

#### Jasmine

angularJS 를 테스트하기위해 Behavior driven development 프레임웍인 Jasmine 을 이용한다. 구체적으로 그룹 테스트를 위해 "describe" 함수를 이용하고, 개별테스트를 위해서 "it" 함수를 이용한다.

다음의 예를 보자

```
describe('Controller:MenuController', function() {
	it('should create "dishes" with 2 dishes fetched from xhr', function() {
		// showMenu가 true이길 기대함
		expect(scope.showMenu).toBeTruthy();
		// dishes가 정의됨을 기대함
		expect(scope.dishes).toBeDefined();
		// dishes의 개수가 2개임을 기대함
		expect(scope.dishes.length).toBe(2);
	});
});
```

describe 는 MenuController 를 테스트 한다는것을 말한다. 두번째 it 은 xhr 로부터 dishes 가 2 dishes 가 fetched 된 dishes 가 만들어질 것이라는 걸 말하고 두번째 인자에 들어간 함수 내에서는 expect 함수로 각각의 조건이 만족하는지를 체크한다.

#### Karma

카르마는 자바스크립트 기반 command line tool 이다(NodeJS application). 카르마를 이용하면 Jasmine 으로 테스트한 결과를 브라우저로 가져와 쉽게 확인할 수 있다.

#### angular-mocks

ngMock 모듈을 이용하면 테스트의 결과를 의존성을 가지는 다른 서비스나 컨트롤러에 미리 적용해 볼 수 있다. 한가지 예로 $httpBackend 를 이용하면 서버에 XHR 리퀘스트를 테스트로 날려볼수도 있다.

#### exercise

우선 필요한 모듈들을 install 한다. 글로벌로 설치하는 건 상관없지만 그 외에는 conFusion 폴더 내에서 설치하도록 하자.

```
# 자스민 코어 설치
sudo npm install jasmine-core --save-dev

# karma-jasmine 설치
sudo npm install karma-jasmine --save-dev

# 카르마, 클라이언트 설치
sudo npm install karma --save-dev
sudo npm install karma-cli -g
sudo npm install karma-cli --save-dev

# 카르마를 통한 결과를 크롬에 보여주기 위한 모듈 설치
sudo npm install phantomjs karma-phantomjs-launcher karma-chrome-launcher --save-dev

# angular mocks 설치
bower install angular-mocks -S
```

/conFusion/test 폴더를 생성하고 karma.conf.js 파일을 생성한다.

```
module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['jasmine'],
		// list of files, 테스트하려는 파일 목록
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-resource/angular-resource.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'app/scripts/*.js',
			'test/unit/**/*.js'
		],
		// list of files to exclude, 테스트 제외 목록
		exclude: [
			'test/protractor.conf.js', 'test/e2e/*.js'
		],
		preprocessors: {

		},
		// test results reporter to use
		// possible values: 'dots', 'progress'
		reporters: ['progress'],
		port: 9876,
		// colors in the output (reporters and logs)
		colors: true,
		// config.LOG_DISALBE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// 파일 변경시 auto reload
		autoWatch: true,
		// browser, available browser launchers
		browsers: ['Chrome', 'PhantomJS', 'PhantomJS_custom'],
		customLaunchers: {
			'PhantomJS_custom': {
				base: 'PhantomJS',
				options: {
					windowName: 'my-window',
					settings: {
						webSecurityEnabled: false
					},
				},
				flags: ['--load-images=true'],
				debug: true
			}
		},
		phantomjsLauncher: {
			// ResourceError 발생시 phantomjs 종료, 비정상 종료시 유용함
			exitOnResourceError: true
		},
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,
		// Concurrency level
		concurrency: Infinity

	})
}
```

conFusion/test/unit/menucontroller.js 파일을 생성해서 unit 테스트를 실행한다.
