---
title: '[CSS] SCSS(Sass, 사스)의 유용한 기능 5가지'
date: 2019-10-19 15:50:20
category: css
tags:
  - css
  - SCSS
  - Sass
  - 사스
---

리액트(React)로 프로젝트를 진행할때는 [styled-components](https://www.styled-components.com/)같은 `CSS-in-JS` 라이브러를 사용하기 때문에 `SCSS` 같은 CSS 전처리기(CSS preprocessor)를 직접 사용할 일이 없다. 물론, styled-components 안에서 SCSS 문법을 사용할 수 있지만, 애초에 컴포넌트에 종속되어 사용되는 스타일에 복잡한 문법은 불필요하다. 진행하는 회사 프로젝트에서 사용하는 styled-component depth는 대부분 1이다. 간혹 JSX 구조로 표현하기에 복잡한 경우에 한정해서 2 depth 까지 사용하기도 한다. 하지만, 극히 일부다. 아무튼 요즘처럼 React나 Vue 등의 프론트 프레임웍(또는 라이브러리)을 사용하는 프로젝트에서 스타일을 위해 css파일(or scss파일)을 직접 구현하기보다는 CSS-in-JS를 사용하는 경우가 더 많은것 같다.

최근에는 CodePen이나 CodeSandbox와 같이 샌드박스(sandbox) 환경에서 간단한 기능을 만들거나 애니메이션을 구현하는 경우가 많아졌다. 이때도 역시 styled-component를 사용할 수 있지만, 인터랙티브한 요소를 만들거나 복잡한 애니메이션을 구현할때는 CSS를 직접 만드는게 더 편하다(적어도 나는 그렇다).
그런데, CSS로만 작성하다보니 복잡한 페이지일수록 중복되는 코드가 많아지는게 느껴졌다. 그래서 SCSS를 제대로 한번 살펴보고자하는 생각이 들었다. 몇가지 유용한 SCSS 문법을 살펴보고 앞으로 잘 이용해보자.

## at-rules

at(@)-rules(@규칙)은 SCSS에서 가장 유용한 기능이다. CSS 코드의 상단에 @과 함께 붙여서 사용한다. 아래의 몇가지 at-rules를 살펴보자.

### @imports @use



`@import`와 `@use` 둘다 외부에서 파일을 가져온다. 그리고 가져온 파일안에서 사용한 각종 변수와 @mixin, @function 등을 사용할 수 있다. 하지만 한가지 큰 차이점이 있다. 

### @mixin and @include



### @extend

### @function

### @error @debug @warn

## Flow Control

## Operator

## Built-In-Module

## 참고자료

- [sass 공식 홈페이지 document](https://sass-lang.com/documentation)
- [Introducing Sass Modules](https://css-tricks.com/introducing-sass-modules/)



## use와 forward는 새로 추가된 feature 

## namespace 문제

import를 사용하면 해당 파일의 모든 변수를 가져올 수 있다. 하지만, 같은 이름을 쓰는 경우에는 문제가 있다. 특히나 써드파티 라이브러리를 같이 사용하는 경우라면 문제를 찾기가 더욱 어려워진다. 예를들어 다음과 같은 세 파일이 있을 때 main.scss 파일에서 사용하는 `$background_color`가 어디에서 가져온 값인지 알 수 없다. 물론 SCSS는 순차적으로 컴파일되기 때문에 동일한 이름의 변수가 있다면 나중에 선언된 값으로 결정되기 때문에 오류가 발생하는것은 아니다. 다만 사용하는 입장에서 내가 지금 사용하는 변수가 어디에서 가져온것인지 직관적으로 알수 없다는 뜻이다. 

```scss
// box.scss
$background-color: red;

.box {
  background-color: $background-color;
  width: 200px;
  height: 200px;
}
```

```scss
// card.scss
$background-color: blue;

.card {
  background-color: $background-color;
  width: 200px;
  height: 200px;
}
```

```scss
// main.scss
@import box;
@import card;

.big-box {
  background: $background-color; // background-color는 red일까? blue일까?
}
```

`.big-box`의 이름만 보면 웬지 box의 bg(red)를 가져오고 싶어한것 같지만, 실제로는 `blue` 색상이 적용된다. `$background-color`라는 이름의 변수가 box.scss, card.scss 모두에 존재하고 card.scss가 나중에 import되었기 때문이다. 