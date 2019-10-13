---
title: '[interactive web] 스크롤(scroll) 이벤트로 목록을 더 아름답게 만들어보자'
date: 2019-10-13 15:50:20
category: interactive web
tags:
  - css
  - javascript
  - scroll
  - interactive web
  - 웹
  - 애플
  - sticky
---

[애플의 웹 사이트](https://www.apple.com/kr/)는 멋지다. 사이트에 특별한 기능이 있는건 아니다. 대부분 제품 소개 페이지다. 제품 소개페이지를 얼마나 잘 만들었길래, 뭐가 멋지다는걸까? 의문이 들 법하다. 그런데, 하나하나 살펴보면, 정말 세심하게 공들인 느낌이다. 단순한 웹 페이지일 뿐이지만, 사용자에게 제품의 특징을 잘 전달하기 위해 여러가지 효과를 만들어냈다.스크롤에 따라 이미지가 `fade-in/fade-out` 되는건 기본이고, 확대되거나 옆에서 나타나기도한다. 영상이 재생되는가 하면, 그래프가 그려진다. 이 모든것들은 오로지 `스크롤`이라는 이벤트를 기반으로 만들어졌다. 사용자가 스크롤만 할 뿐이지만, 웹 페이지에서는 마치 한편의 영상이 재생되는것처럼 보인다.

모던 웹에서 다양한 효과는 많은 부분 스크롤로 표현할 수 있다. 가장 간단하게 `opacity`와 `transform`만 사용하더라도 웹사이트를 충분히 `interactive`하게 만들수 있다. 어떤 목록을 아래로 스크롤하다 viewport에 나타나는 순간 위로 올라오는 애니메이션과 함께 점점 밝아지도록 할 수 있다. 이 단순한 효과만으로 무미건조하고 딱딱한 목록에 생명을 불어 넣을 수 있다.

### opacity와 transform을 이용해서 목록을 interactive하게 만들기

결과물부터 확인하자. 스크롤을 아래로 내리면 각 article과 image가 아래에서 위로 자연스럽게 나타난다.

<p class="codepen" data-height="478" data-theme-id="0" data-default-tab="result" data-user="blueshw" data-slug-hash="PvYZgB" style="height: 540px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="list item show on scroll">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/PvYZgB">
  list item show on scroll</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

자바스크립트 코드는 다음과 같다.

```javascript
function isElementUnderBottom(elem, triggerDiff) {
  const { top } = elem.getBoundingClientRect();
  const { innerHeight } = window;
  return top > innerHeight + (triggerDiff || 0);
}

function handleScroll() {
  const elems = document.querySelectorAll('.up-on-scroll');
  elems.forEach(elem => {
    if (isElementUnderBottom(elem, -20)) {
      elem.style.opacity = "0";
      elem.style.transform = 'translateY(70px)';
    } else {
      elem.style.opacity = "1";
      elem.style.transform = 'translateY(0px)';
    }
  })
}

window.addEventListener('scroll', handleScroll);
```

무척 간단하다. `isElementUnderBottom`는 함수 이름에서도 알 수 있듯이 element가 스크린 아래쪽에 있는지를 검사한다. 스크린 아래에 있으면 true를 반환할것이고, 스크린보다 위에 있으면 false를 반환한다. `IntersectionObserver`를 사용할 수도 있지만, 스크린 아래쪽에 있는지 여부만 판단하기 때문에 `getBoundingClientRect` 메서드를 이용해서 비교하는게 훨씬 간편하다.

`handleScroll`은 scroll 이벤트의 핸들러 함수다. 스크롤이 발생하면 이 함수가 실행된다. `querySelectorAll` API를 이용해서 class 이름을 가진 element를 모두 가져오자. 가져온 각 element가 화면보다 아래에 있다면 `opacity: 0`, `transform: translateY(70px)` 스타일이 적용되도록 하고, 화면 안에 있다면 `opacity: 1`, `transform: translateY(0px)` 스타일이 적용되도록 한다. 이제 스크롤을 하면 아래에서 element가 보일때 즈음 미리 설정한 `transition` 속성을 통해 element가 아래에서 부드럽게 나타나는것을 확인할 수 있다. 좀더 정교하게 구현하려면 `requestAnimationFrame` API를 이용해서 초당 60회 실행되도록 만들어야겠지만, 지금 만드는 효과는 굳이 초당 60회나 실행될 필요는 없다. 좀더 부드러운 움직임을 만들고 싶다면, 반드시 이 API를 사용해서 구현하자.

다음은 HTML과 CSS 코드를 살펴보자.

```html
<style>
  .list .up-on-scroll {
    ...
    transition: transform 0.7s, opacity 1s;
  }
</style>
<div class="list">
  ...
  <article class="up-on-scroll">
    We are dancing. We are extra dancing...
  </article>
  <article class="up-on-scroll">
    We are extra cool everyday dancing...
  </article>
  <div class="img-wrap">
    <img src="..." alt="img1" class="up-on-scroll" />
  </div>
  ...
</div>
```

아래에서 위로 올라오는 효과를 주고 싶은 element에 `up-on-scroll`을 붙여준다. 그리고 `transition` 속성에 opacity와 transform를 적용한다. 끝났다.

### 더욱 화려한 스크롤 이벤트를 만들어보자

결과물부터 확인하자.

<p class="codepen" data-height="522" data-theme-id="0" data-default-tab="result" data-user="blueshw" data-slug-hash="WNNrOEo" style="height: 540px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="more interactive effect on scroll">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/WNNrOEo">
  more interactive effect on scroll</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

세가지 정도 효과를 만들어봤다(코드 정리가 안되있어 [codepen](https://codepen.io/blueshw/pen/WNNrOEo)에서 직접 확인하자).

> 1. 이미지가 하나씩 아래에서 올라오면서 가운데에서 멈춘다. 기존 이미지는 새로운 이미지로 교체된다 .
> 2. 스크롤함에 따라 좌측 설명 부분과 우측의 이미지가 서로 다른 속도로 움직인다.
> 3. 화면에 가득찬 이미지가 있고, 스크롤함에 따라 점점 투명해져 배경색을 교체한다(black => white).

주로 사용한 css 속성은 다음과 같다.

> 1. 이미지 wrapping 태그에 `position: sticky` 속성을 주었다. sticky 속성은 viewport에 고정하는 fixed와는 다르게 scroll box에 고정한다. 즉, 부모 element가 스크롤이 가능하다면 부모 element가 스크롤되는 동안 position을 유지한다.
> 2. 우측 이미지에 `transform`으로 스크롤 위치를 조절했다. 좀더 부드러운 스크롤 동작을 위해 `requestAnimationFrame` API를 사용하여 `throttle` 처리했다.
> 3. sticky와 `filter: grayscale()`, `opacity`를 사용했다.

### 결론

스크롤 이벤트만 잘 활용해도 딱딱한 웹 페이지에 생명을 불어넣을 수 있다. 크게 어려운 개념도 없기 때문에 아이이디만 있으면 누구나 아름다운 웹 페이지 제작이 가능하다. 그렇다고 filter 등 연산량이 많은 작업을 너무 과하게 사용하면 성능 저하가 발생할 수 있으니 조심히 사용하자.  게다가 오래된 브라우저를 지원해야하는 경우라면 더더욱 조심히 사용해야한다.

### 참고자료

- [Scroll Animation](https://cssanimation.rocks/scroll-animations/)
- [apple iPhone 11 Pro 소개페이지](https://www.apple.com/kr/iphone-11-pro/)
