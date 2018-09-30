---
title: '[coursera] AngularJS week 3-2'
date: 2016-09-05 23:10:10
category: javascript
tags:
  - angularjs
  - javascript
  - coursera
---

## Single Page Applications

### Angular ngRoute and Single Page Applications

#### Single Page Applications(SPA)

Single Page Application 이란, 말그대로 하나의 페이지에서 동작하는 어플리케인션을 말한다. 기존의 웹사이트를 보면, 어떤 페이지를 서버에 요청하면 서버가 요청 받은 페이지를 브라우저에 보내는 방식이 반복되는 형태였다. 그래서 어떤 페이지로 이동하려면 서버에 해당 페이지 전부를 요청해야만 했다. 이런방법은 사실 header 나 footer, js, css 파일 등과 같이 모든 페이지에서 필요로하는 것들을 매번 요청해야하는 문제가 따른다(물론 캐싱이 된다).
하지만 SPA 는 index.html 과 같은 single master page 를 다운받은 후, 다른 페이지로 이동하는 것이 아니라 서버에 필요한 데이터만 요청하여 화면을 바꿔치기 하는 형태로 동작한다.

하지만 SPA 도 극복해야할 문제들이 있다.

> 검색엔진 같은 경우, 검색 후 결과를 클릭하면 다른 웹사이트로 이동해야하는데 과연 SPA 로 가능할것이냐?
> SPA 같은 경우는 서버의 데이터를 다운받아 클라이언트에서 사용하게 되는데 이때 서버와 클라이언트 중에 어디에 책임을 전가해야할지를 정하는 문제
> 단일 페이지이기 때문에 history 관리가 어려운 문제
> 페이지의 데이터를 모으기 어려운 문제
> 필요한 모든 라이브러리 및 페이지가 들어있는 최초의 페이지를 읽어 올때의 속도 문제

#### Angular and SPA

지금까지 봐왔던 많은 요소들은 Angular JS 로 SPA 디자인이 가능하다는 것을 보여주고 있다.

> one-way and two-way 바인딩
> MVC/MVVM/MVW 프레임워크
> view -> template 을 사용하고 controller 를 통해서 모델의 데이터를 이용해서 render
> location and routing 을 제공

SPA 에서 서버는 REST API 를 통해서 데이터를 제공하거나 static HTML, Angular templates 와 리소스를 제공한다. 클라이언트는 Temlating 과 라우팅을 이용하여 뷰를 그리는 역할을 한다.

#### Deep Linking

검색이 가능하거나 indexing 이 가능한 웹페이지 내 컨텐츠의 하이퍼링크를 말한다.
예를들면,

```
http://www.conFusion.food/index.html#/menu/0
```

해시태그(#)가 url 에 왜 붙었느냐??
url 에 해시태그가 붙으면 해시태그 이후에 나타나는 부분에 대해서는 서버에 요청(?)하지 말라는 의미다. 즉, reload 안하겠다는 거다. 이미 index.html 페이지에 위치한 상태에서 #/menu/0 가 붙는다고 페이지가 리로드 되지 않는다. 다만, #/menu/0 에 해당하는 리소스를 찾는다. angularJS 에서는 router 의해 해당 리소스를 찾게된다. 물론 페이지가 리로드되지 않지만 해시태그 뒷부분 url 의 데이터가 서버에 위치할 수도 있지만 아마 그때는 ajax 로 데이터를 가져오지 않을까 싶다.

즉, angularJS 에서는 url 의 해시태그 뒷부분을 handling 하여 페이지를 변경하게된다.

#### $location service

- 현재 주소창의 URL 을 보여준다.
- back / forward 버튼 등에 의한 url 변화에 대해 동기화시켜준다.
- url(), path(), search(), hash() 등의 메서드로 get / set 을 통해 url 을 변경할 수 있도록 해준다.

#### ngRoute Module

우선 install 한다. conFusion 폴더에서 실행한다.

```
bower install angular-route -S
```

ngRoute 는 $location 서비스와 렌더된 뷰 사이의 관계를 관리한다. url 을 변경할 필요가 있으면 $location 서비스의 메서드를 이용하여 url 변경(# 뒷부분)하여 페이지를 갱신할 수 있다.

다음과 괕이 angular module 에서 사용된다.

```javascript
// 의존적으로 주입한다.
angular.module('confusionApp', ['ngRoute'])
```

ngRoute 에서는 Angular provider 를 사용할 수 있는데, provider 는 url 이 변경됨에 따라 그에 알맞는 적절한 template 과 url(handlers)로 매핑시켜준다.

```javascript
angular
  .module('confusionApp', ['ngRoute'])
  // 라우팅을 위해 config 함수를 사용한다.
  // 파라미터로 $routeProvider가 들어간다.
  .config(function($routeProvider) {
    $routeProvider
      .when('/contactus', {
        templateUrl: 'contactus.html',
        controller: 'ContactController',
      })

      .when('/menu', {
        templateUrl: 'menu.html',
        controller: 'MenuController',
      })

      .when('/menu/:id', {
        templateUrl: 'dishDetail.html',
        controller: 'DishDetailController',
      })
      // 디폴트, 아무것도 매치가 안되면 otherwise 실행
      .otherwise('/contactus')
  })
```

url 이 변경되면 해당되는 url 을 $routeProvider.when 의 첫번째 파라미터에서 찾은 다음 각각 알맞는 template 과 contoller 를 지정해주어 view 를 렌더링한다.

$routeParams 를 이용하면 주어진 파라미터로 url 에 삽입할 수 있다.
예를 보자

```javascript
// menu.html
<div class="media-left media-middle">
	<a ng-href="#/menu/{{dish._id}}">

// controllers.js
.controller('DishDetailController', ['$scope', '$routeParams',
	'menuFactory', function($scope, $routeParams, menuFactory) {
		var dish = menuFactory.getDish(parseInt($routeParams.id, 10));
	}]);
```

/menu/\[id\]와 같은 url 이 들어왔을때 \[id\] 부분은 파라미터로 처리한다.
만약 dish 이미지를 클릭햇을때 각각의 detail 페이지로 이동하는 동작을 처리한다고 생각해보자. 각각의 dish 에 id 를 부여하고 이미지의 a 태그에 id 를 이용하여 링크를 만들어 둔다.

이미지를 클릭하면 DishDetailController 에 의존적으로 주입한 $routeParams 에 url 에 전달된 dish.\_id 가 id 라는 이름으로 들어가 이 id 에 해당하는 dish 데이터를 가져오게 될 것이다.

마지막으로 지난 강의에서 index.html 의 header 와 footer 사이에 넣었던 ng-include 를 ng-view 로 변경하자. ng-view directive 는 $route 서비스와 함께 동작하여 url 변경에 따라 현재 렌더링된 템플릿을 html 파일에 포함시켜준다.

### Angular UI-Router for Single Page Applications

이전 강의에서 살펴본 ngRoute 는 한계가 있다.

- 한 페이지 당 하나의 뷰만 사용이 가능하다 (no multiple, no nested)
- view 가 url 에 종속적이다.

이에반해 UI Router 는 어플리케이션의 상태에 기반을 두고 있다. 이 말은 즉, url 이 바뀌지 않아도 일부분을 바꿀 수 있다는 뜻이다. (multiple, nested)

우선 설치부터 하자

```
bower install angular-ui-router -S
```

사용법은 이전과 비슷하다.

```javascript
angular.module('confusionApp', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('app', {
				url:'/',
				views: {
					'header': {templateUrl: 'views/header'html},
					'content': {template: '<h1>To be Completed</h1>', controller : 'IndexController'}
					'footer': {templateUrl: 'views/footer.html'}
				}
			})
			.state('app.aboutus', {
				url:'aboutus',
				views: {
					'content@': {template: '<h1>To be Completed</h1>', controller : 'AboutController'}

			});
			// default
			$urlRouterProvider.otherwise('/');
	})
```

state 에 따라서 각각 url 을 지정해줄 수 있다. 그리고 views 속성에 여러 뷰(multiple)를 선언해줄 수도 있다.

두번째 state 는 app 의 nested view 를 나타내는데, 특이하게 content 뒤에 '@' 마크가 붙어 있다. 이는 해당 view 가 content 에 속하는 view 라는 것을 말해준다.

위의 state 내 views 속성에 지정해둔 view name 은 html 코드에서 ui-view 로 매핑시켜준다.
그리고 ui-sref 속성은 state 를 변경 시켜주는데 사용한다. href 가 url 을 이동하기 위한 속성이었다면 ui-sref 는 url 은 변경시켜주지 않고 속성만 바꾸는 link 역할을 한다.

```html
<div ui-view="header"></div>
<div ui-view="content"></div>
<div ui-view="footer"></div>

<a ui-sref="app"></a>
<a ui-sref="app.aboutus"></a>
<a ui-sref="app.menu"></a>
```

$routeParams 와 마찬가지로 $stateParams 를 사용할 수 있다.
사용법은 기존과 거의 같다.

```javascript
// menu.html
<a ui-sref="app.dishdetails({id:dish._id})"> ... </a>

// DishDetailController
.controller('DishDetailController', ['$scope', '$stateParams',
	'menuFactory', function($scope, $stateParams, menuFactory) {
		var dish = menuFactory.getDish(parseInt(parseInt($stateParams.id,10));
		$scope.dish = dish;
	}
])
```
