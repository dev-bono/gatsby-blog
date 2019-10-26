---
title: '[CSS] SCSS에 새로 추가된 Module System (@use, @forward)'
date: 2019-10-27 00:02:33
category: css
tags:
  - css
  - SCSS
  - Sass
  - 사스
  - at-rules
  - use
  - forward
  - import
  - 모듈
  - module system
---

> 이 글은 [Introducing Sass Module](https://css-tricks.com/introducing-sass-modules/))를 참고하여 정리하였다.

최근, SCSS(사스, Sass)에 모듈 시스템(Module System)을 지원하기 위한 새로운 feature들이 몇가지 승인(accepted)되었다. 그 중에 at-rules에 두개의 feature가 추가되었는데 하나는 `@use`, 하나는 `@forward`다. @use는 이전부터 존재하던 feature인 @import와 유사하다. 하지만, 기존에 @import가 가진 문제점을 보완한다. SCSS 커뮤니티에서는 점진적으로 import를 deprecated 하고 @use만 사용하도록 할 계획이다. 아직, 정식 `spec`은 아니고 얼마전 `accepted` 되었기 때문에 [libsass](https://github.com/sass/libsass)와 같은 Sass 컴파일러에서는 아직 사용할 수 없다. 대신 Ruby로 만들어진 Original [Sass](https://github.com/sass/sass) 패키지를 설치해서 테스트 해보자.

```
npm install -g sass
```

설치가 완료되면 컴파일 할 대상을 정해서 css 파일로 변환하자.

```
ex) sass src/scss/main.scss dist/css/main.css
```

그럼 이제, 새롭게 추가된 feature들이 기존 문제를 어떻게 해결하고 어떤 방식으로 동작하는지 간단히 알아보자.

### @import는 어떤 문제가 있고, @use는 이 문제들을 어떻게 해결할까?

`@import` 키워드를 사용해서 파일을 불러오면 다음과 같은 문제가 발생할 수 있다.

* pure CSS도 @import를 사용하기 때문에 혼란스러울 수 있다.
* 같은 파일을 여러번 import 하면 코드 충돌과 중복 코드로 인해 컴파일 속도가 느려질 수 있다.
* 모든 변수와 함수가 전역으로 관리되기 때문에 같은 이름의 변수나 함수를 사용하면 먼저 선언된 것들이 무시된다.
* 어디서 가져온 변수 or 함수인지 직관적으로 알 수 없다.

`@use`를 사용하면 @import를 사용할 때 발생하는 문제를 명확히 해결할 수 있다.

* @import가 아닌 @use를 사용하기 때문에 혼란을 피할 수 있다.
* @use는 모듈시스템과 동일하게 동작하기 때문에 컴파일 중에 단 한번만 improt된다.
* @use를 사용하면 모듈 별로 별도의 namespace를 가지기 때문에 각 변수와 함수는 독립적으로 사용된다. (아래에서 예제로 살펴보자)
* 변수나 함수를 사용할때는 `namespace.function()`과 같이 사용하기 때문에 어디서 가져온 요소인지 직관적으로 알 수 있다.

### @import와 namespace 문제

import를 사용하면 선언된 파일의 모든 변수와 함수, mixin 등을 가져올 수 있다. 하지만, import를 사용하면 모든 변수와 함수들이 전역 namespace에 존재하기 때문에 다른 모듈에서 같은 이름을 쓰면 문제가 된다. 특히 써드파티 라이브러리에서 특정 이름의 변수명을 사용하는 경우라면 더욱 심각하다. 이 경우에는 문제가 어디서 발생하는지조차 모를수도 있다.

예를들어 아래와 같은 세 파일(box.scss, card.scss, main.scss)이 있다고 했을때, main.scss에서 사용하는 `$background_color`와 `getBorder()`는 어디서 가져온 변수(or 함수)인지 전혀 알 수 없다. 물론 SCSS는 순차적으로 컴파일되기 때문에 동일한 이름의 변수가 있다면 나중에 선언된 값으로 결정되기 때문에 에러가 발생하지는 않는다. 다만 사용하는 입장에서 내가 지금 사용하는 변수가 어디서 온것인지 직관적으로 알기 어렵기 때문에 문제가 발생할 경우 해결하는데 많은 시간이 소요된다(사용한 변수가 어디있는지 뒤져봐야하니까..).

```scss
// box.scss
$background-color: red;

@function getBorder($is-black: true) {
  @if $is-black {
    @return 4px solid black;
  }
  @else {
    @return 2px dashed blue;
  }
}

.box {
  background-color: $background-color;
  width: 200px;
  height: 200px;
}
```

```scss
// card.scss
$background-color: blue;

@function getBorder($is-black: true) {
  @if $is-black {
    @return 1px dashed black;
  }
  @else {
    @return none;
  }
}

.card {
  background-color: $background-color;
  border: getBorder(true);
  width: 200px;
  height: 200px;
}
```

```scss
// main.scss
@import 'box';
@import 'card';

.big-box {
  background: $background-color; // background-color는 red일까? blue일까?
}
```

`.big-box`의 이름만 보면 웬지 box의 bg(red)를 가져오고 싶어한것 같지만, 실제로는 `blue` 색상이 적용된다. `$background-color`라는 이름의 변수가 box.scss, card.scss 모두에 존재하고 card.scss가 나중에 import되었기 때문이다.

이렇게 namespace가 파일별로 없고, 모든 요소들이 전역으로 관리되기 때문에 같은 이름을 썼을때 주의할 필요가 있다. 이 문제는 이번에 새로 추가된 `@use`를 쓰면 간단히 해결할 수 있다. 

### @use는 namespace 문제를 어떻게 해결할까?

@use를 이용해서 동일한 코드를 수정하자. box.scss와 card.scss의 코드는 동일하므로 `main.scss`만 수정한다.

```scss
// main.scss
@use 'box';
@use 'card' as c;

.big-box {
  background: box.$background-color;
  border: box.getBorder(true);
  width: 200px;
  height: 200px;
}
```

이전 코드에서 .big-box의 `$background-color`는 어떤 파일에서 가져온 변수인지 직관적으로 알수 없었다. 하지만, @use를 이용하면 `box.$background-color`, `box.getBorder(true)` 처럼 명시적으로 사용할 수 있기 때문에 혼란을 피할 수 있다. 또한 `as` 키워드를 사용하면 모듈의 이름을 바꿔서 사용할 수도 있다. 각 모듈별로 별도의 namespace가 존재하기 때문에 @import를 사용할 때 발생하는 namespace문제는 말끔히 해결되었다.

### @use의 다른 기능들

@use에 몇가지 기능이 더 추가되었다. underscore(_)나 hyphen(-)을 이용하면 private member를 만들수 있다. 또한 Sass 내장 모듈도 @use를 통해서 사용 가능하다.

#### private member(_ or -)

private member를 만들기 위해, 위에서 사용한 코드를 조금 추가하자.

```scss
// box.scss
$background-color: red;
$_border: 1px solid #ccc;

.box {
  background-color: $background-color;
  width: 200px;
  height: 200px;
  border: $_border;
}
```

`$_border`라는 변수를 만들었다. underscore(_)로 시작하기 때문에 private 변수다.

```scss
// main.scss
@use 'box';

.big-box {
  background: box.$background-color;
  border: box.$_border;
  width: 200px;
  height: 200px;
}
```

.big-box에 `border: box.$_border;`를 추가했다. 이렇게 작성한 다음 실행해보면, 아래와 같은 에러를 만날것이다.

```
Error: Private members can't be accessed from outside their modules.
```

underscore로 시작하는 변수(or 함수)는 private이기 때문에 모듈 외부에서 사용할 수 없다는 말이다.

#### SCSS(Sass) 내장 모듈

이제는 내장 모듈을 사용할때도 @use를 사용하면 된다. 기존에는 아래 같은 방식으로 내장 기능을 사용했다.

```SCSS
$section-padding: 20px 10px 30px 0px;
$default-margin: 20px;
$default-black: rgba(51, 51, 51, 0.5);

section {
  font-size: round(15.4px); // 반올림, 15px
  padding: nth($section-padding, 2); // 2번째 항목 추출, 10px
  margin: append($default-margin, 10px); // 항목 추가, 20px 10px
  color: transparentize($default-black, 0.3); // 투명도 추가, rgba(51, 51, 51, 0.2);
}
```

그러나 이제부터는 @use를 이용해서 내장모듈을 가져온다(물론 기존 방식도 동작할것이다). 위의 코드는 아래처럼 바꿀 수 있다.

```SCSS
@use "sass:math";
@use "sass:list";
@use "sass:color";

$section-padding: 20px 10px 30px 0px;
$default-margin: 20px;
$default-black: rgba(51, 51, 51, 0.5);

section {
  font-size: math.round(15.4px);
  padding: list.nth($section-padding, 2);
  margin: list.append($default-margin, 10px);
  color: color.adjust($default-black, $alpha: -0.3);
}
```

물론 이전 방식처럼 직접 내장 함수를 그대로 사용할수도 있다. 하지만 모듈시스템을 적극 이용한다면, 코드 품질 향상을 위해서라도 @use를 사용하자. 대부분의 함수는 이전에 사용하던 방식 그대로 이식되었다. 하지만, 일부 함수는 아예 사라졌고, 일부 함수는 추가되었거나 수정되었다. 예를들어 이전에 사용하던 투명도 조절을 위한 `transparentize()` 같은 함수는 없어졌다(타이핑 하기도 어려운데 잘 됐다). 대신 `color` 모듈의 `adjust()` 메서드를 사용해서 투명도를 조정한다. adjust는 투명도 조정 이에외 다양하게 활용할 수 있다. RGB 프로퍼티나 Hue 등의 HSL 프로퍼티 등을 조절할때도 adjust()를 사용한다.

### @forward는 언제 사용할까?

@use와 @forward는 비슷한 기능을 한다. 둘다 각 파일의 모든 요소를 import한다. 실제로 컴파일된 CSS 결과물도 같다. 그러나 가장 큰 차이점이 하나 있는데, 바로 @use와 다르게 @forward를 사용하면 페이지 내에서 forwad한 모듈의 요소(variables, functions, mixins)를 사용할 수 없다는 점이다. `@forward`는 단지 전달만 할뿐이다. 만약 forward한 모듈의 요소를 사용하려면 forward로 모듈을 가져온 파일을 @use를 사용해 import하면 된다. 말이 좀 어려운데, 예를 들어보자.

여러개의 모듈이 있고 각 모듈을 @use로 import하지 않고 통일된 namespace를 사용해서 각 요소를 사용하려고 한다. 다음과 같이 box, card, modules, main 파일이 있다.

```SCSS
// box.scss
$border-color: #dddddd;
$background-color: #eeeeee;

@function getBorder($is-black: true) {
  @if $is-black {
    @return 4px solid black;
  }
  @else {
    @return 2px dashed blue;
  }
}

.box {
  background: $background-color;
  margin: 20px;
  width: 200px;
  height: 200px;
  border: 4px solid $border-color;
  border-radius: 8px;
}
```

```SCSS
// card.scss
$card-bg-color: #ff0000;

.card {
  background: $card-bg-color;
  width: 400px;
  height: 400px;
  border: 2px solid #dddddd;
}
```

```SCSS
// modules.scss
@forward 'box'
@forward 'card'
```

```SCSS
// main.scss
@use 'modules';

section {
  border: modules.getBorder(true);
  background: modules.$card-bg-color;
}
```

`modules.scss`라는 파일을 만들자. 이 모듈에서는 `@forward` 키워드로 `box.scss`와 `card.scss` 모듈을 forward 한다(이때는 위에서 언급했듯이 modules 내부에서 import한 모듈의 요소를 사용하지 못한다). 다음으로 `main.scss`에서 `@use`를 사용해서 `modules.scss`를 import하자. 이제 main.scss에서 box와 card의 요소를 사용할 수 있다. 한가지 주의할점은 `box.getBorder(true)` 형태로 사용하는 것이 아니라 `modules.getBorder(true)`로 사용해야 한다.

그런데 한가지 문제가 있다. 위의 코드에서는 문제 없지만, 만약 box와 card에서 동일한 이름의 변수를 사용한다면 문제가 된다. 가져오려는 변수를 어떤 모듈에서 가져와야할지 알 수 없기 때문이다. 예를들어 card.scss에도 $background-color가 있다고 한다면, main.scss에서 `$background-color`를 사용할때 어느 모듈에서 값을 가져와야 할지 알수 없다. 그래서 이런 구조로 코드가 구성되면 컴파일시에 에러가 발생한다. 실제로 컴파일 해보자. 다음과 같은 에러가 발생하면서 컴파일이 실패한다.

```
Error: Module box.scss and the new module both forward a variable named $background-color.
```

`modules.scss`와 `main.scss` 파일의 수정이 필요하다.

```SCSS
// modules.scss
@forward 'box' as box-*;
@forward 'card' as card-*;
```

```SCSS
// main.scss
@use 'modules';

section {
  border: modules.getBorder(true);
  background: modules.$box-background-color;
}
```

결국 `modules`로 통합된 namespace가 문제가 되었기 때문에 충돌을 막기위해 각 모듈 내 요소의 이름을 변경한다. `$background-color`가 아니라,  `box-`, `card-`를 prefix로 붙여줘서 `$box-background-color`와 같이 사용하면 문제가 해결된다.

### 정리

@use는 확실히 중요하고 유용한 feature임에 틀림없다고 생각하지만, @forward는 잘 모르겠다. @use가 namespace 충돌을 막기위해 나왔음에도 불구하고 @forward를 사용하면 또다른 namespace 충돌의 여지가 생길 수 있기 때문이다. 아직 SCSS로 큰 프로젝트를 진행해본적이 없어서 그런지 몰라도 @forward는 왠지 잘 사용하지 않을것 같다. 그럼에도 모듈 시스템의 도입은 확실히 큰 개선임에는 틀림없다. 소개한 내용 이외에도 추가된 내용이 많이 있으니 문서를 꼼꼼히 읽어보자.

### 참고자료

- [Sass Documentation](https://sass-lang.com/documentation)
- [Introducing Sass Modules](https://css-tricks.com/introducing-sass-modules/)