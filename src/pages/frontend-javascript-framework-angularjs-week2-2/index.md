---
layout: post
comments: true
title:  "[coursera] AngularJS week 2-2"
categories: programming
date:   2016-08-28 01:46:10 +0900
tags:
- angularjs
- javascript
- coursera
---
## Task Runners, Angular Scope, Forms and Form Validation-2

### Angular Scope

스코프는 다음과 같이 정의된다.

> 스코프는 application model과 관련된 object다.
> This is at the core of Angular's two-way data binding
> view와 controller 사이를 연결해주는 역할을 한다.

우선 controller에 scope를 만들어 속성을 부여한다. 그리고 view는 controller에 정의된 속성들을 bind 한다. 이런 방식을 통해 view와 controller의 sync를 맞춰준다.

#### $rootScope

가장 상위의 scope다. app이 시작되면 만들어진다. 새로운 스코프는 ng-controller와 같은 directives 를 통해 만들수 있다. scope의 구조는 DOM의 구조와 비슷하다. 그렇기 때문에 child scope에서는 parent scope의 속성에 접근이 가능하지만 그 반대는 불가하다.


#### app.js

```
// 기존 코드
angular.module('confusionApp', [])
    .controller('MenuController',function(){
        this.tab = 1;
        this.filtText = '';
        
        ...

	});	

// scope 적용 코드
angular.module('confusionApp', [])
	// scope 정의
    .controller('MenuController', ['$scope',function($scope){
        $scope.tab = 1;
        $scope.filtText = '';

        ...

    )]};
```

기존의 코드를 보면 this접근자를 통해서 속성들을 부여하고 있다. 여기서 스코프를 사용하면, this가 아닌 scope에 속성들을 부여함으로써 view단에서 scope를 통해 각 속성에 접근하게 된다. 


#### menu.html

```
<!-- 기존 코드 -->
<div class="container">
    <div class="row row-content" ng-controller="MenuController as menuCtrl">
        <div class="col-xs-12">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" ng-class="{active:menuCtrl.isSelected(1)}">
                    <a ng-click="menuCtrl.select(1)" aria-controls="all menu"
                     role="tab">The Menu</a>
                     ...
                </li>
            </ul>
            <div class="tab-content">
                <ul class="media-list tab-pane fade in active">
                    <li class="media" ng-repeat="dish in menuCtrl.dishes | filter:menuCtrl.filtText">
                    ...
	                </li>
	            </ul>
	        </div>
	    </div>
	</div>
</div>


<!-- scope 적용 코드 -->
<div class="container">
    <div class="row row-content" ng-controller="MenuController">
        <div class="col-xs-12">
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" ng-class="{active:isSelected(1)}">
                    <a ng-click="select(1)" aria-controls="all menu"
                     role="tab">The Menu</a>
                     ...
                </li>
            </ul>
            <div class="tab-content">
                <ul class="media-list tab-pane fade in active">
                    <li class="media" ng-repeat="dish in dishes | filter:filtText">
                    ...
	                </li>
	            </ul>
	        </div>
	    </div>
	</div>
</div>
```

기존코드에서는 menuController의 alias인 menuCtrl을 만들어 각 변수와 함수 앞에 붙여줬었다. 하지만 MenuController에 스코프가 적용되면서 해당 컨트롤러가 속한 DOM 내부에서는 컨트롤러 이름없이 변수/함수명으로 직접 접근이 가능해진다. 스코프를 적용함으로써 훨씬 코드가 간단해졌다. 


#### ng-show

ng-show directive는 주어진 조건(true/false)에 따라서 해당 DOM 객체를 보여줄것인지(show) 말것인지(not show)를 결정해준다. 길게 설명할 필요없이 예제를 보자

```
<div class="col-xs-12">
    <button ng-click="toggleDetails()" class="btn btn-xs btn-primary pull-right" type="button">
        {{showDetails ? 'Hide Details':'Show Details'}}
    </button>
    <ul class="nav nav-tabs" role="tablist">
	    ...
	</ul>
	...
        <p ng-show="showDetails">{{dish.description}}</p>
    ...
</div>
```

$scope.showDetails를 app.js에 설정해놓고 기본값으로 false를 지정해놓자. 그리고는 button을 하나 만들어 showDetails가 true이면 Hide Details 문구의 버튼을 노출하고 false면 Show Details 문구의 버튼을 노출한다. 리스트의 요소중에 description 부분에 ng-show directive를 선언하고 showDetails를 넣어주자. 그리고 버튼을 클릭하면(showDetails가 toggle 된다. app.js에 function을 만들어둔다.) showDetails가 true가 됐다가 false가 되면서 description이 보여졌다가 가려졌다가 할 것이다.



### Angular Forms and Form Validation

#### Forms 
form은 유저에게 웹 사이트의 정보를 제공하는 가장 널리 상요되는 방법이다. 이번 강의에서는 angularJS에서 form을 이용하는 방법과 form의 validation 체크하는 방법에 대해서 알아보자.

form에서는 two-way data binding이 중요하게 사용되는데, 
넘어가기 앞서 잠깐 짚고 넘어가야할게 있다. 
ng-model의 개념이 약간 모호해서 한번 찾아봤다.

> _ng-model_
> 
> html의 input, select, textarea 와 같은 입력 요소에 값을 갱신하면 ng-model해 설정된 변수의 값도 변함
> 반대로 변수의 값이 바뀌면 input 등의 화면도 동일하게 변경된다.
> 이를 two-way data binding이라 한다.
> 참고로 form 필드에 설정된 ng-model의 속성을 필드 내에서 부여할 수도 있다.

form과 자바스크립트 object간의 연결해주는 역할을 하는 것이 ng-model이다. ng-model에 설정된 변수가 변경되면 변경된 것을 html에 그대로 반영해준다. 
예를들어보자.

```
// javascript code
.controller('ContactController', ['$scope', function($scope){
    $scope.feedback = {mychannel:"", firstname:"",
                       lastname:"", agree:"", email:""};
}]);

// html code
<input type="text" class="form-control" id="firstname" 
	name="firstname" placeholder="Enter First Name" 
	ng-model="feedback.firstname" required>
```

위와 같이 angularJS의 controller에 feedback이라는 object를 만들어두고, html에서 feedback.firstname을 ng-model attribute에 지정해두면, firstname이 변함에 따라서 자동으로 feedback.firstname의 값을 변경한다.

select의 경우에는 어떤가 보자

```
// javascript code
var channels = [{value:"tel", label:"Tel."}, {value:"Email", label:"Email"}];

// html code
<select class="form-control" ng-model="feedback.mychannel" 
		ng-options="channel.value as channel.label for channel in channels">
	<option value="">Tel. or Email?</option>
</select>
```

우선 select의 item들을 저장해둘 자바스크립트 array 변수 channels를 만든다. 그리고 select 태그내에 ng-model, ng-options를 위와 같이 설정해두자. ng-model의 mychannel에는 유저가 선택된 channel의 value가 들어갈 것이다. ng-options directive에서 channels라는 자바스크립트 array를 for loop로 분해하여 각각 channel이라는 object를 가져온다. 그리고 channel.label이 option의 text로 들어가고, channel.value가 option 태그의 value로써 들어가게 된다. 즉, 만들어진 selectbox의 item 하나를 선택하게 되면, 해당 item의 value 가 feedback.mychannel 변수에 할당된다.

위의 방법을 이용하면 form의 다른요소나, 웹페이지의 상태에 따라 select의 항목을 동적으로 바꿀 수 있게 된다. 


#### Form Validation

우선 HTML5 form validation을 끄자
그리고 ng-submit directive를 이용하여 form이 submit될 때 sendFeedback함수를 호출하도록 하자.

```
<form class="form-horizontal" name="feedbackForm" ng-submit="sendFeedback()" novalidate>
```

validation 체크할때 field name을 이용하여 다음의 필드 속성들을 체크할 수 있다.

| property | Description |
|---|---|
| $pristine | true if form has not been changed (form의 변경사항이 없다면,) |
| $dirty | reverse of $pristine |
| $valid | true if form field/whole form is valid (form이 valid 하면,) |
| $invalid | reverse of $valid |

예를 들어보자.
* feedbackForm.firstName.$pristine : firstName 필드의 변경사항이 없으면 true
* feebackForm.$valid : feedbackForm의 모든 항목이 valid 하면 true

에러가 있을경우(invalid 하면) bootstrap의 class를 이용하자.

> .has-error, .has-warning, .has-success
> .help-block to display helpful messages below the field


#### app.js

```
...

	.controller('ContactController', ['$scope', function($scope){
	    $scope.feedback = {mychannel:"", firstname:"",
	                       lastname:"", agree:"", email:""};
	    var channels = [{value:"tel", label:"Tel."}, 
	                    {values:"Email", label:"Email"}];
	    $scope.channels = channels;
	    $scope.invalidChannelSelection = false;

	}])
	.controller('FeedbackController', ['$scope', function($scope){
	    $scope.sendFeedback = function() {
	        console.log($scope.feedback);

	        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
	            $scope.invalidChannelSelection = true;
	            console.log('incorrent');
	        } else {
	            $scope.invalidChannelSelection = false;
	            $scope.feedback = {
	                mychannel:"", firstname:"",
	                lastname:"", agree:false, email:"" 
	            };
	            $scope.feedback.mychannel = "";
	            $scope.feedbackForm.$setPristine();
	            console.log($scope.feedback);
	        }
	    };
	}]);
    
...

```

#### contactus.html

```
<!DOCTYPE html>
<html lang="en" ng-app="confusionApp">

...

<body>
    <div class="container" ng-controller="ContactController">
    	...
                <form class="form-horizontal" role="form" name="feedbackForm" ng-submit="sendFeedback()" novalidate>
                    <div class="form-group" ng-class="{ 'has-error' : feedbackForm.firstname.$error.required && !feedbackForm.firstname.$pristine }">
                        <label for="firstname" class="col-sm-2 control-label">First Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="firstname" name="firstname" placeholder="Enter First Name" ng-model="feedback.firstname" required>
                            <span ng-show="feedback.firstname.$error.required && !feedbackForm.firstname.$pristine" class="help-block">Your First name is required</span>
                        </div>
                    </div>
                    <div class="form-group" ng-class="{ 'has-error' : feedbackForm.lastname.$error.required && !feedbackForm.lastname.$pristine }">
                        <label for="lastname" class="col-sm-2 control-label">Last Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="lastname" name="lastname" placeholder="Enter Last Name" ng-model="feedback.lastname" required>
                            <span ng-show="feedback.lastname.$error.required && !feedbackForm.lastname.$pristine" class="help-block">Your Last name is required</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="telnum" class="col-sm-2 control-label">Contact Tel.</label>
                        <div class="col-xs-5 col-sm-4 col-md-3">
                            <div class="input-group">
                                <div class="input-group-addon">(</div>
                                    <input type="tel" class="form-control" id="areacode" name="areacode" placeholder="Area code" ng-model="feedback.tel.areacode">
                                <div class="input-group-addon">)</div>
                            </div>
                        </div>
                        <div class="col-xs-7 col-sm-6 col-md-7">
                                    <input type="tel" class="form-control" id="telnum" name="telnum" placeholder="Tel. number" ng-model="feedback.tel.number">
                        </div>
                    </div>
                    <div class="form-group" ng-class="{ 'has-error' : feedbackForm.emailid.$invalid && !feedbackForm.emailid.$pristine }">
                        <label for="emailid" class="col-sm-2 control-label">Email</label>
                        <div class="col-sm-10">
                            <input type="email" class="form-control" id="emailid" name="emailid" placeholder="Email" ng-model="feedback.email" required>
                            <span ng-show="feedbackForm.emailid.$invalid && !feedbackForm.emailid.$pristine" class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                            <span ng-show="feedbackForm.emailid.$invalid && !feedbackForm.emailid.$pristine" class="help-block">Enter a valid email address.</span>
                            <span ng-show="feedbackForm.emailid.$error.required && !feedbackForm.emailid.$pristine" class="help-block">Enter a valid email address.</span>
                        </div>
                    </div>
                    <div class="form-group" ng-class="{ 'has-error' : invalidChannelSelection }">
                       <div class="checkbox col-sm-5 col-sm-offset-2">
                            <label class="checkbox-inline">
                                <input type="checkbox" name="approve" value="" ng-model="feedback.agree">
                                <strong>May we contact you?</strong>
                            </label>
                        </div>
                        <div class="col-sm-3 col-sm-offset-1" ng-show="feedback.agree">
                            <select class="form-control" ng-model="feedback.mychannel" ng-options="channel.value as channel.label for channel in channels">
                                <option value="">Tel. or Email?</option>
                            </select>
                            <span ng-show="invalidChannelSelection" class="help-block">Select an option.</span>
                        </div>
                    </div>                    
                    <div class="form-group">
                        <label for="feedback" class="col-sm-2 control-label">Your Feedback</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="feedback" name="feedback" rows="12" ng-model="feedback.comments"></textarea>
                        </div>
                    </div> 
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary" ng-disabled="feedbackForm.$invalid">Send Feedback</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-xs-12 col-sm-3">
                <h3>Your Current Feedback:</h3>
                <p>{{feedback.firstname}} {{feedback.lastname | uppercase }}</p>
                <p>Contact Tel.: ({{feedback.tel.areacode}}){{feedback.tel.number}}</p>
                <p>Contact Email: {{feedback.email}}</p>
                <p ng-show="feedback.agree">Contact by:{{feedback.mychannel}}</p>
                <p>Comments: {{feedback.comments}}</p>
            </div>
       </div>
    </div>
</body></html>
```
