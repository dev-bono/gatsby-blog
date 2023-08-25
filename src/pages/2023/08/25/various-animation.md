---
title: '프론트엔드에서 다양한 방식으로 애니메이션(animation) 구현하기'
date: 2023-08-25 10:07:00
category: javascript
tags: 
  - CSS
  - javascript
  - front-end
  - animation
---

프론트엔드에서 애니메이션을 구현하는 방법은 다양합니다. CSS 속성만으로도 구현이 가능하죠. 하지만 단순한 애니메이션이면 몰라도 조금만 난의도가 올라도 CSS 코드는 매우 복잡해집니다. 

아래 몇 가지 예를 들어 프론트엔드에서 애니메이션 구현하는 방법에 대해 알아보겠습니다.


## CSS 기반 애니메이션

#### Transition

`Transition`은 CSS의 속성 값 변경을 부드럽게 변환하는 데 사용됩니다. 주로 버튼의 hover 효과, fade in/out 효과 등 간단한 상호작용에 사용됩니다.

```css
.button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: red;
}
```

위 코드는 버튼의 배경색을 부드럽게(transition) 빨간색으로 바꾸는 효과를 나타냅니다. 정말 간단하죠.

#### Keyframes

`KeyFrames`는 transition보다 복잡한 애니메이션을 구현할 때 사용됩니다. 별도의 keyframes로 만들어 여러 단계의 애니메이션을 정의할 수 있습니다.

```css
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

.slide-in-element {
  animation: slideIn 0.5s forwards;
}
```

요소를 왼쪽에서 오른쪽으로 슬라이드하는 애니메이션입니다. `transform` 속성 하나만 사용했지만, `opacity, color 등 다양한 요소를 혼합해서 사용`이 가능합니다. 

## JavaScript 기반 애니메이션

#### requestAnimationFrame

`브라우저의 화면 갱신 주기에 맞춰 애니메이션을 실행`하는 데 사용됩니다. 주로 복잡한 애니메이션 루프나 게임 등에 사용됩니다.

```js
let start;

function step(timestamp) {
  if (!start) start = timestamp;
  let progress = timestamp - start;

  // 애니메이션 코드
  if (progress < 2000) {
    requestAnimationFrame(step);
  }
}

requestAnimationFrame(step);
```

#### Web Animations API

CSS의 Keyframes와 유사한 기능을 JavaScript로도 구현 가능합니다.

```js
const element = document.querySelector(".animated-element");
const keyframes = [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(1.5)", opacity: 0.5 },
    { transform: "scale(1)", opacity: 1 }
];

element.animate(keyframes,
  {
    duration: 2000,
    iterations: Infinity
  }
);
```

a`nimate 메서드로 애니메이션을 실행`시킬 수 있죠.

#### 외부 라이브러리 사용

외부 라이브러리를 활용하여 미리 구현된 애니메이션을 사용할 수 있습니다.

[GSAP(GreenSock Animation Platform)](https://greensock.com/)는 강력한 애니메이션 라이브러리로, 복잡한 시퀀스나 타임라인 기반 애니메이션도 쉽게 만들 수 있습니다.

[Velocity.js](http://velocityjs.org/)도 사용하기 괜찮은 라이브러리입니다. jQuery 애니메이션보다 빠르고 강력한 기능을 제공합니다.


## CSS와 JavaScript의 조합

CSS로 애니메이션을 정의하고, JavaScript로 애니메이션을 조작하거나 제어할 수도 있습니다.

```css
.fadeIn {
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

```js
const box = document.querySelector(".box");

box.addEventListener("click", () => {
  box.classList.add("fadeIn");
});
```

CSS에 애니메이션 동작을 미리 정의해두고, 자바스크립트에서 미리 정의해둔 class를 추가해주었습니다. `box에 fadeIn이라는 class가 붙게되면 애니메이션이 동작`하게 됩니다.


## 성능과 최적화 (will-change)

애니메이션 성능을 최적화하기 위한 방법은 다양하지만, 간단하게 `will-change`를 사용하는 방법이 있습니다. will-change에 transform과 opacity를 넣어주면 브라우저에게 미리 애니메이션을 준비하도록 지시할 수 있습니다.

```css
.smooth-change {
  will-change: transform, opacity;
}
```

## 참고

- [CSS 애니메이션](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
- [JavaScript Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
s