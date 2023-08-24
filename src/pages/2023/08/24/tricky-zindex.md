---
title: '써도 써도 헷갈리는 z-index의 미스터리'
date: 2023-08-24 18:00:00
category: css
tags: 
  - CSS
  - z-index
  - front-end
---

CSS의 z-index 속성은 웹 페이지에서 요소 간의 순서를 조절할 때 중요한 역할을 합니다. 그러나 z-index의 동작 방식을 제대로 이해하지 못하면 혼란스러운 상황에 빠집니다. 도대체 어디가 문제인지 알 수 없게 되어버리죠. 오늘은 CSS를 작성할때 부딪칠수 있는 z-index의 동작 원리와 몇 가지 문제점에 대해 알아보겠습니다.


### z-index의 기본적 사용법

z-index는 요소의 스택 순서를 정의하는 CSS 속성입니다. 값이 높은 요소가 다른 요소 위에 나타나도록 그려줍니다.

```css
.layout {
  position: relative;
  z-index: 10;
}

.button {
  position: relative;
}
```

위의 예시에서 .layout에 z-index가 10으로 설정되어 있으므로 `.button`보다 위쪽에  표시됩니다.

당연하지만,,, 쉽죠?


### Stacking Context

지금부터 헷갈릴 수 있습니다. 어떻게 보면 `z-index`의 핵심이라 할 수 있는데요. 스태킹 컨텍스트는 문서의 일부분을 나타내는 개념으로, 그 안의 자식 요소들은 독립적인 층을 형성합니다. z-index는 동일한 스태킹 컨텍스트 내에서 유효하기 때문에 서로 다른 스택 컨텍스트에 있는 요소와 z-index 값의 비교는 의미가 없겠죠.

스택 컨텍스트 생성 조건은 다음과 같습니다.

- HTML `루트` 요소
- position 값이 `static이 아닌 요소`
- opacity가 `1보다 작은 요소`
- `transform, filter, perspective, clip-path, mask, contain, will-change` 등의 값이 none 이외의 값을 가진 요소
- flex 및 grid 컨테이너의 자식 요소에서 `z-index 값이 auto가 아닐 때`
- position 값이 `fixed 또는 sticky`


예를 살펴보죠.

```HTML
<div class="parent">
  Parent
  <div class="child">Child</div>
</div>
```

```css
.parent {
  position: relative;
  z-index: 5;
}

.child {
  position: relative;
  z-index: 10;
}
```

여기서 `.child는 .parent 안에서만` 유효한 z-index 값을 가집니다. 다시 한번 말하지만 다른 스택 컨텍스트에 있는 요소와는 z-index를 비교할 수 없습니다.


### z-index 사용 시 발생하는 문제점

스택 컨텍스트만 이해한다면 사실 z-index 사용 시 실수할 일이 없습니다. 하지만, 여러 사람이 함께 모여있는 팀에서는 z-index 사용으로 혼란을 줄 수 있습니다. 

#### position 속성에 대한 이해

z-index는 position이 static이 아닌 요소에만 적용된다(relative, absolute, fixed, sticky). 만약 `position: static`인 요소에 z-index를 적용하려 한다면, 동작하지 않는다. 

#### 예상치 못한 스택 컨텍스트 생성

앞서 말했듯 opacity, transform, filter와 같은 속성은 스택 컨텍스트를 생성합니다.

```
.element {
  position: relative;
  z-index: 5;
  opacity: 0.9;
}
```

`.element`는 opacity 속성 때문에 새로운 스택 컨텍스트를 생성합니다. 예상치 못한 스택 컨텍스트로 인해 코드를 읽는데 혼란이 발생할 수 있겠죠. 스택 컨텍스트 생성 속성을 사용할 때는 항상 주의가 필요합니다. 필요한 경우 부모 요소에 추가 스타일을 적용하여 해결하면 되겠네요.

#### 일관된 값 사용하기

9999, 200000 등 무작정 의미 없는 큰 수를 사용하는 것은 문제가 있습니다. 이는 z-index를 제대로 이해하지 못하고 대응하는 방식입니다. `SASS나 LESS` 같은 도구를 사용해 변수화해서 사용하면 헷갈리지 않고 팀 작업이 가능합니다.

#### z-index 사용 최소화

z-index에 대한 이해가 명확하다면 많이 사용할 일이 없습니다. 하지만, 애매한 지식이 오히려 무분별한 z-index 남용으로 이어지는데요. 대규모 서비스를 구축할 때 이러한 방식은 자신뿐 아니라 팀원 모두에게 피해를 줍니다. 

명확한 z-index 관리 전략을 설정하고 팀원들과 공유해야 합니다. 예를 들어, 특정 범위를 모달 창, 알림, 툴팁 등의 목적 등으로 예약하는 것이 좋습니다.


### 결론

z-index는 복잡해 보이지만 기본 원칙을 이해하면 쉽게 다룰 수 있습니다. (스택 컨텍스트) 이 원칙을 기억하고, 웹 페이지의 요소 간 순서를 제어할 때는 가급적 사용을 줄이는 것이 좋고, 반드시 써야 한다면 팀에 정해진 컨벤션에 따라 최소한으로 사용해야 합니다. 