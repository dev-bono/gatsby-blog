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