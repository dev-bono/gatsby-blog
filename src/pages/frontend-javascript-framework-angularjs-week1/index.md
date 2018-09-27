---
title: '[coursera] AngularJS week 1'
date: 2016-08-18 23:10:50
category: javascript
tags:
  - angularjs
  - javascript
  - coursera
---

## Full-Stack Web Development: The Big Picture

### Three Tier Architecture

보통 웹개발에서 말하는 3-티어 아키텍쳐는 아래의 세 영역으로 나뉜다.

- Presentaion Layer : HTML, CSS, JS
- Business Layer : Ruby, Python, Java, C++
- Data Access Layer : DBMS

반면에 Full-Stack 웹 개발은 자바스크립트를 이용하여 위의 세 layer 의 개발을 가능하도록 하는 방법을 말하며, 조금씩 다른 프레임웍을 사용할 수 있겠지만, 이 강의에서는 presentaion layer 에는 자바스크립트 프레임웍인 AngularJS, business layer 에서는 NodeJS, 그리고 Data Access Layer 영역에서는 자바스크립트를 이용한 MongoDB 를 사용하여 개발한다.

이 세 영역은 모두 자바스크리트 기반으로 만들어져 있기 때문에 서버, 브라우저, 모바일 디바이스 등 모든 영역에서 JSON 형태로 통신이 가능하다.

### Course Overview

이번 강의에서 다루는 주제는 다음과 같다.

- AngularJS : 자바스크립트 프레임워크 (버전: 1.4.2)
- Web Tools : Grunt, Gulp, Yo and Yeoman

## Introduction to AngularJS

### Front-End JavaScript Frameworks OverView

> 소프트웨어 라이브러리란 어떤 동작을 실행하는 잘 정의된 인터페이스(or functions or methods)의 집합이라 할 수 있다. 재사용성과 모듈화를 통해서 더 효율적인 개발이 가능하다. 대표적인 예로 jQuery 가 있다.

> 소프트웨어 프레임워크란 라이브러리와는 다소 차이가 있다. 라이브러리는 이미 잘 만들어진 유용한 코드(functions)를 사용한다고 한다면, 프레임워크는 개발자가 작성한 코드가 프레임워크안에서 적절하게 실행할 수 있도록 환경을 제공하는 것이라 할 수 있다. 프레임워크는 일반적인(generic) 함수 셋을 제공하며 개발자가 구체적인 코드를 구현해야한다. 그리고 구현된 코드는 프레임워크가 필요한 경우, 어떤 임무를 완수하기 위해 불려진다. 즉, 라이브러리는 개발자에게 코드를 컨트롤 할 수 있는 권한이 주어지는 반면 프레임워크는 코드의 컨트롤 권한이 프레임워크에게 있는 것과 같다. 이번 강의에서 배울 AngularJS 나 durandal, backbone 등이 대표적이다.

#### 10 가지 Javascript Framework

- Angular : one of the three Major JS framework
- Ember : one of the three Major JS framework
- Backbone : one of the three Major JS framework
- React : 프레임웍이라기 보다 라이브러리에 가까움
- Aurelia
- Meteor : 요즘 각광받기 시작
- Polymer
- Knockout
- Vue
- Mercury

#### 3 가지 메이저 JS Frameworks 비교 (3 > 2 > 1)

|                | Ember | Angular | Backbone |
| :------------- | :---: | :-----: | :------: |
| Opinionated    |   1   |    2    |    3     |
| Ease of Use    |   3   |    2    |    1     |
| Learning Curve |   1   |    2    |    3     |
| Popularity     |   -   |    3    |    -     |

### Introduction to AngularJS

HTML 은 static 한 문서이기 때문에 동적인 웹 어플리케이션을 지원하기에는 HTML 만으로는 한계가 있다. 보통은 자바스크립트의 DOM 객체를 이용해서 HTML 을 동적으로 만들 수 있지만, 자바스크립트 프레임웍인 Angular 를 이용하면 다음과 같은 이점을 가질 수 있다.

> Solving the impedance mismatch

back end 데이터와 static content 를 출력하는데 HTML 만으로는 한계가 있기 때문에 이 문제(impedance mismatch)를 해결이 가능하도록 해준다.

> Designed with CRUD applications (data-driven) in mind

데이터가 변경되면 변경된 데이터에 맞춰서 동적으로 HTML 이 update 된다. Create, Read, Update, Delete 이 네 가지를 이르는 CRUD 에 대해서는 다음 모듈에서 자세하게 다루기로 한다.

> Declarative approach

Angular 는 선언적인 개발방법을 지원하는데, 이는 개발자가 원하는 것을 기술하면 Angluar 가 그에 맞게 처리해내는 것을 뜻한다(무슨 말인지 잘...)

#### Angular Vocabulary

앞으로 배울 Angular 의 문법은 아래와 같은 것들이 있다.

- Two-way Data Binding
- Scope
- Directives
- Templates
- Routing
- Testing
- Modules
- Controllers
- Filters
- Factory
- Service
- Provider

우선은 Two-way Data Binding 과 Directives 에 대해서 먼저 알아보자

#### Directives

Angular Directives 는 ng-_ or data-ng-_ 로 시작하는 HTML 속성이다. 다음의 몇가지 예를 살펴보자

- ng-app : Angular 앱을 시작과 끝을 나타낸다. 어떠한 태그에도 붙일 수 있다. 즉, 하나의 HTML 파일에 하나 이상의 Angular 앱이 존재할 수도 있다는 말과 같다.

- ng-init : 자바스크립트 변수를 선언하는것과 같다. Angular expression 을 Evaluation 한다(좀더 매끄러운 한글 표현이 필요할 것 같다). object, array 도 사용가능하다.

```
<p ng-init="index=1"></p>
<div ng-init="dish={name:'example', ...}"></div>
```

- ng-model : input value 를 변수로 바인드 한다. (Two-way data binding) ng-model 속성을 부여하면 언제든지 어떤 변수든지 변경이 가능하게 된다.

```
<p>Comment: {{dish.comment}}</p>
<p>Type your comment:
	<input type="text" ng-model="dish.comment" />
</p>
```

dish object 의 comment 는 위에서 이미 정의를 한 상태다. 이때 아래의 input tag 에서 ng-model 속성을 부여하고 이미 정의된 dish.comment 를 입력하면 Two-way data binding 에 의해 처음 설정된 값이 input 태그의 변경되는 값으로 동적으로 변경된다.

양 방향에서 바인딩이 가능하기 때문에 아마도 Two-way data binding 이라고 부르는 것 같다.

- ng-repeat : 반복적인 태그를 작성할 필요가 있을때 사용할 수 있다.

#### Angular Expressions

- Evaluated against an Angular scope object
  Angular 스코프에 맞게 value 가 평가된다.

- No conditionals, loops, or exceptions
  위의 사항들은 expression 으로 사용이 불가하다.

- Expressions enclosed in {{ expression }}
  중괄호 두개를 겹쳐서 사용한다.

```
<p>6 + 5 = {{ 6 + 5 }}</p>
<h2>{{ dish.name }}</h2>
```

## Models, Views and Controllers

### The Model View Controller Framework

> Design pattern is ell-documented solution to a recurring problem

디자인 패턴은 비슷하고 반복되는 문제를 매번 똑같이 구현하는 것이 아니라 재사용 가능하도록 만들어진 일종의 솔루션을 말한다.

#### MVC

MVC 는 소프트웨어 엔지니어링 구조에서 가장 대표적인 디자인 패턴이다. M(Model), V(View), C(Controller) 세가지 영역으로 나누어져있고, 각 영역은 독립적으로 존재한다.

- Model : 애플리케이션에서 도메인의 상태나 도메인 로직을 구현하는 영역이다. 여기서 말하는 도메인은 일반 개발 영역에서 말하는 것과 마찬가지로 소프트웨어가 다루는 특정 활동이나 지식의 범주를 뜻한다(표현이 조금 어렵다). 웹 어플리케이션단에서 보면 model 은 request 요청에 대한 상태 변화에 반응하여 특정 도메인의 행위나 상태를 관리한다고 볼 수 있다. 그리고 대게 모델의 변화는 컨트롤러에 의해 발생한다.

- View : 사용자에게 보여지는 영역이다. view 는 유저와 상호작용을 위해 form 에 모델정보를 redering 한다. 하나의 model 로 서로 다른 목적의 뷰를 만들수도 있다.

- Controller : View 와 모델 사이를 중재하는 역할을 한다. 일반적으로 컨트롤러는 유저의 input 을 받아서 모델의 상태변화를 만들어낸다. 그렇기 때문에 컨트롤러는 결과적으로 모델의 변화를 이끌어 낸다고 할 수 있다.

#### MVVM (Model View View-Model)

MVC 패턴의 파생된 형태중 하나인 MVVM 은 Model, View, View-Model 로 구성된다. 컨트롤러에 들어갈 비즈니스 로직이 모델이 있으며 View-Model 과 View 사이에서 데이터 바인딩이 이루어진다.

### Angular Modules and Controllers

일반적으로 Angular 도 MVC 패턴을 따르고 있다고 할 수 있지만, 어떤 사람들은 Angular 가 MVVM 이 적합하다고도 한다. 또한 많은 사람들은 모델(M)과 뷰(V), 그리고 그 사이는 무엇이든 상관없다는 MVW(model-view-whatever)로 간단히 부르기도 한다.

#### Angular Modules

Angular Modules 은 다음처럼 스크립트 태그안에 정의한다. angular.module 메서드는 두개의 파라미터를 가지는데, 첫번째는 ngApp 속성에 정의된 이름이고 두번째는 array 인데 나중에 설명할 것이다. 아래같은 경우 ngApp 이 html 태그에 선언되어 있으므로 아래의 모듈에서 현재 페이지 모두를 관리 할 수 있게 된다.

```
<html ngApp="confusionApp">

...

<body>

...

	<script>
		var app = angular.module('confusionApp',[]);
	</script>

</body>

</html>
```

#### Angular Controller

Angular 컨트롤러는 특정 태그의 ng-controller 속성으로 선언된다.

```
<div class="row row-content" ng-controller="menuController as menuCtrl">

</div>

<script>
var app = angular.module('confusionApp', []);

app.controller('menuController', function() {
	var dishes = [item, ... ];
	this.dishes = dishes;
});

</script>
```

모듈과 컨트롤러는 위와 같이 구현할 수 있다. 이전에 보았던 ng-init directive 는 HTML 속성으로 직접 넣어줘야하지만, 컨트롤러를 사용하면 해당 태그(여기서는 div) 내부의 데이터를 자바스크립트 코드로 컨트롤할 수 있게 된다. 컨트롤러의 두번째 파라미터인 익명함수 마지막에 **this.dishes = dishes** 부분은 아마도 div 태그 내에서 사용가능한 dishes 를 정의해주기 위해 자바스크립트 오브젝트인 dishes 를 this.dishes 에 할당해준게 아닌가 생각된다.

## Angular Filters

필터는 서버사이드 또는 클라이언트에서 만들어진 data 를 end user 에게 잘 표현하기 위한 수단으로 사용된다. 필터는 기반 데이터를 바꿀 수는 없으며 view templates, controllers, services 등에서 사용된다. AngularJS 는 기본적으로 빌트인 필터를 여러개 제공하고 있고, 개발자 필요에 따라 커스텀 필터를 만들어 사용할 수 있다.

```
<div class="media-body">
	<h2 class="media-headgin">{{dish.name}}
		<span class="label label-danger label-xs">{{dish.label}}</span>
		<!-- currency 필터는 price에 $를 붙여준다.-->
		<span class="badge">{{dish.price | currency}}</span>
	</h2>
	<p>{{dish.description}}</p>
</div>
```

#### Angluar 의 Built-in Filters

- uppercase / lowercase : converts the text
- currency : $를 붙여준다.
- date : 날짜 포맷을 변경한다.
- filter : 특정 조건에 맞게 array 의 서브셋을 리턴한다.
- orderBy : 조건에 맞게 정렬한다.
- json, limitTo 등도 있다.

```
<!-- filter 예제, HTML 코드 -->
<li class="media" ng-repeat="dish in menuCtrl.dishes | filter:menuCtrl.filtText">...</li>

<!-- javascript 코드 -->
var filtText = "";

this.select = function(setTab) {
	this.tab = setTab;
	if (setTab === 2)
		this.filtText = "appetizer"
	else if (setTab === 3)
		this.filtText = "mains"
	else if (setTab === 4)
		this.filtText = "dessert"
	else
		this.filtText = ""
}
```

위와 같이 HTML 과 javascript 코드를 작성한다.
그리고 특정 탭을 만들어 각 탭에 번호를 부여한다(setTab).
그럼 각 탭 을 눌렀을때 filtText 가 특정 문자열로 변경된다.
미리 적용해놓은 filter 에 따라서 각 li 태그가 보여지기도 하고 가려지기도 할 것이다.

## Excercise Code

```
<!DOCTYPE html>
<html lang="en" ng-app="confusionApp">

<head>
     <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head
         content must come *after* these tags -->
    <title>Ristorante Con Fusion: Menu</title>
        <!-- Bootstrap -->
    <link href="../bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="../bower_components/bootstrap/dist/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="../bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="styles/bootstrap-social.css" rel="stylesheet">
    <link href="styles/mystyles.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body>

    <div class="container">
        <div class="row row-content" ng-controller="menuController as menuCtrl">
            <div class="col-xs-12">
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" ng-class="{active:menuCtrl.isSelected(1)}">
                        <a ng-click="menuCtrl.select(1)" aria-controls="all menu" role="tab">The Menu</a>
                    </li>
                    <li role="presentation" ng-class="{active:menuCtrl.isSelected(2)}">
                        <a ng-click="menuCtrl.select(2)" aria-controls="appetizers" role="tab">Appetizers</a>
                    </li>
                    <li role="presentation" ng-class="{active:menuCtrl.isSelected(3)}">
                        <a ng-click="menuCtrl.select(3)" aria-controls="mains" role="tab">Mains</a>
                    </li>
                    <li role="presentation" ng-class="{active:menuCtrl.isSelected(4)}">
                        <a ng-click="menuCtrl.select(4)" aria-controls="desserts" role="tab">Desserts</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <ul class="media-list tab-pane fade in active">
                        <li class="media" ng-repeat="dish in menuCtrl.dishes | filter:menuCtrl.filtText">
                            <div class="media-left media-middle">
                                <a href="#">
                                <img class="media-object img-thumbnail" ng-src="{{dish.image}}" alt="Uthapizza">
                                </a>
                            </div>
                            <div class="media-body">
                                <h2 class="media-heading">{{dish.name}}
                                    <span class="label label-danger">{{dish.label}}</span>
                                    <span class="badge">{{dish.price | currency}}</span>
                                </h2>
                                <p>{{dish.description}}</p>
                                <!-- <p>Comment: {{dish.comment}}</p> -->
                                <!-- <p>Type your comment: -->
                                    <!-- <input type="text" ng-model="dish.comment"> -->
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script src="../bower_components/angular/angular.min.js"></script>
    <script>
        var app = angular.module('confusionApp', []);
        app.controller('menuController', function(){

            this.tab = 1;
            this.filtText = '';

            var dished = [
                              {
                                name: 'Uthapizza',
                                image: 'images/uthapizza.png',
                                category: 'mains',
                                label: 'Hot',
                                price: '4.99',
                                description:'A unique combination of Indizan Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer',
                                comment: 'aaaaaaa'
                              },
                              {
                                name: 'Uthapizza2',
                                image: 'images/zucchipakoda.png',
                                category: 'mains',
                                label: '',
                                price: '4.99',
                                description:'A unique combination of Indizan Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer',
                                comment: ''
                              },
                              {
                                name: 'Uthapizza3',
                                image: 'images/vadonut.png',
                                category: 'appetizer',
                                label: 'New',
                                price: '4.99',
                                description:'A unique combination of Indizan Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer',
                                comment: ''
                              },
                              {
                                name: 'Uthapizza4',
                                image: 'images/elaicheesecake.png',
                                category: 'dessert',
                                label: '',
                                price: '4.99',
                                description:'A unique combination of Indizan Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer',
                                comment: ''
                              },
                            ];
            this.dishes = dished;

            this.select = function(setTab) {
                this.tab = setTab;

                if (setTab === 2)
                    this.filtText = "appetizer";
                else if (setTab === 3)
                    this.filtText = "mains"
                else if (setTab === 4)
                    this.filtText = "dessert"
                else
                    this.filtText = "";
            }

            this.isSelected = function(checkTab) {
                return (this.tab === checkTab)
            }
        });
    </script>
</body>

</html>
```
