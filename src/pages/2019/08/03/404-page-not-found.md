---
title: '[CSS] 404 페이지를 만들어봤다'
date: 2019-08-04 23:18:12
category: css
tags:
  - javascript
  - css
  - page not found
  - interactive design
  - 인터랙티브웹
  - design
  - 3D
  - text-shadow
---

`404`페이이지를 만들었다. 404페이지가 뭔지 모르는 분은 없겠지만, 간단히 말하면 페이지를 찾지 못했을때 나타하는 에러 페이지다. 정상적이 상황에서 보이는 페이지가 아니기 때문에 대부분 서비스를 만들때 중요하게 생각하지 않는다. 하지만, 유명한 웹 서비스들은 404페이지 조차 그대로 두는 법이 없다. 캐릭터를 만들어 넣는다거나 애니메이션 효과를 주기도 한다. 더러는 간단한 게임을 만들기도 한다. 내 블로그에는 게임까지는 아니지만, 최근 [인프런](https://www.inflearn.com/)에서 [인터랙티브 웹 개발 제대로 시작하기](https://www.inflearn.com/course/interactive_web#) 수업을 들었는데, 여기서 배운 내용을 바탕으로 간단한 404페이지를 만들어보았다. 

우선 어떤 페이지인지 아래에서 확인해보자. 같지만, [블로그에 적용된 404 페이지](https://blueshw.github.io/abcd)도 확인해보자
(ios에서는 codepen이 제대로 동작하지 않는다. 아마도 iframe이슈... 블로그의 404페이지에서 확인하자).

<p class="codepen" data-height="465" data-theme-id="0" data-default-tab="result" data-user="blueshw" data-slug-hash="jgLOPY" style="height: 465px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="3d Text using Text-Shadow">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/jgLOPY/">
  3d Text using Text-Shadow</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

3D 효과(3D 속성은 사용하지 않았다)가 적용된 텍스트에 마우스나 스크롤로 효과를 주었다. 마우스를 이동하면 그에 따라 텍스트의 위치가 변한다. 또한 스크롤을 하면 폰트 사이즈가 변한다. 모바일의 경우 `mousemove` 이벤트는 무시되므로 `touchmove` 이벤트도 사용하였다. 테스트해보면 알겠지만, 모바일에서는 간혹 스크롤과 터치 이벤트가 의도대로 동작하지 않음을 알 수 있다. PC에서는 scroll이벤트와 mousemove 이벤트가 확실히 분리되어 있기 때문에 문제 없지만, 모바일에서는 두가지 모두 터치를 기반으로 동작하기 때문에 문제가 된다. 예를들어 스크롤이 완전히 멈추기 전에는 touch 이벤트가 발생하지 않고 계속해서 스크롤 이벤트만 동작한다. 큰 이슈는 아니라 생각해서 이를 위한 별도의 처리는 하지 않았다(사실, 귀찮아서...).

그럼, 페이지를 만들면서 사용한 몇가지 요소를 살펴보자.

### 마우스(터치) 움직임에 따라 텍스트가 움직이는 효과

자바스크립트를 이용하면 간단히 만들수 있다. 

```html
<div class="container">
  <span class="first">4</span>
  <span class="second">0</span>
  <span class="third">4</span>
</div>

<script>
  const TRANSFORM_RATIO = 5; // 임의의 값, 이 값을 조절하면 텍스트 3D 효과의 정도를 조절할 수 있다.
  window.addEventListener("mousemove", handleMove);
  function handleMove(e) {
    // touchmove냐 mousemove냐에 따라 clientX, clientY 구하는 방법이 다름.
    const { clientX, clientY } = e.type === 'touchmove' ? e.touches[0] : e;
    const { innerWidth, innerHeight } = window;
    const posX = (innerWidth / 2 - clientX) / TRANSFORM_RATIO;
    const posY = (innerHeight / 2 - clientY) / TRANSFORM_RATIO;

    const transformValue = `translate3d(${posX}px, ${posY}px, 0)`;
    firstEl.style.transform = transformValue;
    secondEl.style.transform = transformValue;
    thirdEl.style.transform = transformValue;
  }
</script>
```

clientX, clientY(현재 mouse/touch의 좌표)와 innerWidth, innerHeight(window의 사이즈)를 구한다.
이 값들로 가운데가 0이고 오른쪽/아래가 음수 반대는 양수인 `posX`와 `posY` 값을 구한다. 오른쪽이 음수가 되는 이유는 마우스가 오른쪽으로 이동했을때 텍스트는 그 반대쪽인 왼쪽으로 움직여야 하기 때문이다. 이렇게 만들어진 두 값을 이용해 각 텍스트 element에 `transform` 스타일을 적용하면 된다. 그럼 마우스(터치)의 움직임에 따라 텍스트는 반대방향으로 움직이게 된다. 


### 3D 텍스트

3D 효과를 주기위해 `perspective` 등의 3D 속성을 사용하지 않았다. 대신 `text-shadow`라는 속성을 사용하였다. text-shadow는 콤마(,)로 여러번 사용할 수 있기 때문에 수십개의 텍스트 그림자(50개의 그림자를 사용)를 잘 배치하면 3D 효과를 낼수 있다.

```js
function handleMove(e) {
  // ...
  // posX, posY는 가운데를 기준으로 
  // 우측이나 아래쪽으로 가면 음수의 특정값을 갖고 반대는 양수의 특정값을 갖는다.
  // 계산식은 위 transfrom 코드를 참고하자.
  firstEl.style.textShadow = getTextShadow(posX, posY, 0.5);
  secondEl.style.textShadow = getTextShadow(posX, posY, 0);
  thirdEl.style.textShadow = getTextShadow(posX, posY, -0.5);
}

function getTextShadow(posX, posY, padX) {
  const shadowCount = 50;
  const values = [];
  const baseX = (-1 * posX) / shadowCount + padX;
  const baseY = (-1 * posY) / shadowCount;
  for (let i = 1; i < shadowCount; i++) {
    const c = 160 + i * 2;
    const color = `rgba(${c}, ${c}, ${c}, ${1 - i / shadowCount})`;
    const x = baseX * i;
    const y = baseY * i;
    values.push(`${x}px ${y}px ${color}`);
  }
  return values.join(", ");
}
```

일부분만 발췌하였다. 우선 텍스트는 하나씩 분리한다. 그리고 `mousemove` 이벤트가 발생할때마다 각 텍스트의 text-shadow 값을 변경한다. 로직이 복잡해 보이지만 알고나면 간단하다. 

텍스트 이미지 값을 반환하는 `getTextShadow`함수는 세개의 매개변수를 가진다. `posX`, `posY`는 position 계산식으로 산출한다. 그리고 `padX`는 perspective 효과를 주기위한 값이다(각 텍스트마다 다르게 주어 결과를 다르게 만든다). posX(Y)와 padX를 이용하면 그림자간의 간격인 `baseX`, `baseY`를 구할수 있다. 첫번째 그림자를 배치한 다음 두번째 그림자는 x축으로 baseX만큼, y축으로 baseY만큼 이동하여 배치한다. 예를들어 첫번째 그림자 위치와 색상이 `1px, 2px, #color`라면 두번째 그림자는 `(1 + baseX)px, (2 + baseY)px, #color`가 된다. 이를 50회(임의로 정한 값, 정해진 값은 아니다) 반복한다. 그러면, 연속적으로 배치된 그림자가 마치 3D인것처럼 보이게 된다. 여기다 `gradient`효과를 추가로 주기위해 각 그림자마다 조금씩 색상을 바꾼다. 50개의 그림자 값을 배열에 넣고 콤마(,)로 구분해서 string으로 만들면 완성이다. 

### 스크롤에 따라 글자 크기 변경

스크롤은 가장 간단하다. 코드를 보자.

```js
let maxScrollValue = 0;
window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleResize);

function handleScroll(e) {
  const scrollRate = pageYOffset / maxScrollValue;
  const fontSize = (25 - scrollRate * 15) + 'vh';
  firstEl.style.fontSize = fontSize;
  secondEl.style.fontSize = fontSize;
  thirdEl.style.fontSize = fontSize;
}
function handleResize() {
  maxScrollValue = document.body.offsetHeight - innerHeight;
}
```

`handleScroll`에서 스크롤 비율(0~1)을 구한다음 이 비율을 바탕으로 `fontSize`를 구한다. 내 경우에는 스크롤에 따라 `25vh`에서 `10vh`까지 크기가 변하도록 하였다. 테스트해보면서 각자가 원하는 적절한 값을 설정하면 된다. 추가로 `resize` 이벤트 핸들러도 만들어 주었는데, 이는 `maxScrollValue`를 구하기 위함이다. 사실 maxScrollValue은 handleScroll에서 항상 계산해도 된다. 아마 속도에도 크게 영향을 주진 않을것이다(조금 차이 나겠지..). 하지만 window size가 변하지 않았는데 매번 maxScrollValue를 구하는건 불필요한 연산이다. 그렇기 때문에, window size가 변할때만 `handleResize`함수에서 maxScrollValue을 값을 갱신한다.

요즘은 스크롤 이벤트를 이용하여 다양한 효과를 만드는 웹사이트가 많다. 예를들어 스크롤을 내리고 특정 위치에 도달했을때 애니메이션이 동작한다던가, 여러 이미지를 스크롤에 따라 다르게(방향또는 스크롤 정도) 움직여 마치 하나의 영상처럼 보이도록 만든다. 어려운 로직이나 복잡한 계산이 전혀 없기 때문에 아이디어만 있다면 아주 간단하게 웹 사이트를 interactive하게 만들 수 있다.

### 결론
요즘 interactive 웹에 관심이 많아졌다. 블로그 전체에 다양한 효과를 내는것도 좋지만, 404페이지처럼 독립된 페이지를 만들어 보는것이 좋다고 생각했다. 왜냐하면 제약이 없으므로 다양한 실험이 가능하기 때문이다. interactive 웹은 사실 거창한것이 아니다. 알고보면 대부분은 mouse, scroll 등 기본적인 이벤트를 기반으로 만들어지기 때문이다. 그래서 기본적인 몇가지 기법만 익혀도 충분히 아름다운 웹을 만들 수 있다. 


