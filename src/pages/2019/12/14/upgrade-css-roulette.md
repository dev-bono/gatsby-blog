---
title: '[interactive web] 이전에 만들었던 roulette 개선하기'
date: 2019-12-15 21:34:21
category: interactive web
tags:
  - css
  - roulette
  - 뽑기
  - gotcha
  - 룰렛
  - clip-path
---

[이전에 만들었던 roulette](https://blueshw.github.io/2019/06/27/roulette/)는 실제 프로젝트에서 사용하기에는 다소 무리가 있다. 애초에 테스트 용도로 만들었기 때문이다. 실제 프로젝트에서 사용 가능하도록 몇가지를 수정하려고 한다. 항목은 다음과 같다.

> - deprecated된 clip 속성을 제거하고 clip-path로 변경하자.
> - 데이터를 동적으로 가져오자.
> - 당첨 결과를 동적을 처리하자.

결과부터 살펴보자.

<div class="frame-wrap">
<iframe
  src="https://codesandbox.io/embed/upgrade-css-roulette-ivjd7?autoresize=1&fontsize=14&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="upgrade-css-roulette"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
</div>

### clip 속성을 제거하고 clip-path로 변경하자

clip 속성은 `deprecated`되었다. 게다가 활용도도 제한적이기 때문에(rect만 사용 가능) 가급적 `clip-path`를 사용하는것이 좋다. 이전 코드와 비교해서 살펴보자.

#### 이전 코드

~~~CSS
.fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  clip: rect(0px, 300px, 300px, 150px);
}
.fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  clip: rect(0px, 150px, 200px, 0px);
  transform: rotate(45deg);
}
...
.fill_3 {
  transform: rotate(135deg);
}
.fill_3::after {
  background: lightseagreen;
}
...
~~~

fill과 fill::after를 이용하여 파이(pie) 모양을 만들었다. 위에서도 말했듯 clip은 사각형 형태로만 자를 수 있다. 때문에 파이 모양을 그리기 위해서는 fill::after 영역을 45도만큼 rotate해서 겹친 부분만 보여주면 된다. 생각해보면 그리 어려운건 아니지만, 복잡한 느낌이다. 또한 clip를 쓸때는 몇가지 제약이 있다. 첫째로 반드시 `position: absolute` 속성(fixed도 가능)을 넣어줘야한다. 그리고 두번째는 rect만 사용가능하다. 그래서 사각형 형태의 특정 부분만 노출하게 할 수 있다. clip-path를 이용해서 어떻게 바꿀 수 있는지 살펴보자.

#### 개선된 코드

~~~CSS
.fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  -webkit-clip-path: polygon(0% 0%, 50% 50%, 0% 50%, 0% 0%);
  clip-path: polygon(0% 0%, 50% 50%, 0% 50%, 0% 0%);
}
.fill_3 {
  transform: rotate(135deg);
  background: lightseagreen;
}
~~~

코드가 훨씬 간단하다. 이전에는 pie 모양으로 자르기 위해 사각형을 먼저 만들고 after 선택자로 45도 기울어진 사각형을 겹쳤다. 그러나 이제 `after` 선택자는 필요없다. clip-path를 이용하면 원하는 형태(polygon, ellipse, circle)로 자를 수 있기 때문이다. 더이상 after를 이용해서 복잡하게 만들 필요가 없어졌다.

### 데이터를 동적으로 처리하자

roulette이 항상 정해진 데이터로만 구성된다면 상관없지만, 매일 또는 주기적으로 다른 데이터로 구성된 룰렛이 만들어져야한다면, 동적으로 처리해야한다. 서버로부터 데이터를 받는다고 생각하고 변경해보자. 

#### 이전 코드

~~~HTML
<div class="roullete">
  <!-- fill color -->
  <div class="fill fill_1"></div>
  <div class="fill fill_2"></div>
  <div class="fill fill_3"></div>
  <div class="fill fill_4"></div>
  <div class="fill fill_5"></div>
  ...
  <!-- content -->
  <div class="content content_1">100</div>
  <div class="content content_2">꽝</div>
  <div class="content content_3">400</div>
  <div class="content content_4">200</div>
  <div class="content content_5">꽝</div>
  <div class="content content_6">1000</div>
  <div class="content content_7">100</div>
  <div class="content content_8">꽝</div>
</div>
~~~

이전에는 `fill(색칠 영역)`과 `content(글자)` 영역을 분리했다. 딱히 이렇게 만든 이유는 없었다. 문제는 이렇게 만들면 content와 fill이 별도로 구성되기 때문에 각각의 요소를 모두 다른 각도로 회전시켜야한다. 그래서 불필요한 코드가 많이 만들어진다. 그리고 이전에는 룰렛의 모든 데이터를 HTML에 직접 입력했다. 1회만 사용하는 룰렛이거나 항상 같은 값을 필요로 한다면 문제없다. 하지만, 상황에 따라 또는 주기적으로 데이터 갱신이 필요한 룰렛이라면 동적으로 데이터가 들어가도록 만들어야한다. 개선된 코드를 살펴보자. 

#### 개선된 코드

~~~HTML
<div class="roullete">
  <!-- fill color -->
  <div class="fill fill_1"><div class="content"></div></div>
  <div class="fill fill_2"><div class="content"></div></div>
  <div class="fill fill_3"><div class="content"></div></div>
  <div class="fill fill_4"><div class="content"></div></div>
  <div class="fill fill_5"><div class="content"></div></div>
  <div class="fill fill_6"><div class="content"></div></div>
  <div class="fill fill_7"><div class="content"></div></div>
  <div class="fill fill_8"><div class="content"></div></div>
  ...
</div>
<script>
  // data from server
  const ROUTLETTE_DATA = [100, 0, 200, 400, 0, 300, 100, 0];
  const DEFAULT_TEXT_ZERO = "X";
  const content = document.querySelectorAll(".roullete .fill .content");
  content.forEach((el, index) => {
    el.textContent = ROUTLETTE_DATA[index] || DEFAULT_TEXT_ZERO;
  });
</script>
<style>
  .content {
    font-size: 30px;
    font-weight: bold;
    width: 260px;
    height: 260px;
    position: absolute;
    top: 20px;
    left: 20px;
    text-align: center;
    transform: rotate(-67deg);
  }
</style>
~~~

우선 content를 fill 아래에 넣었다. content는 단한번 `rotate(-67deg)`하면 된다. content를 별도로 rotate할 필요가 없어졌다. 그리고 룰렛 데이터는 동적으로 가져올 수 있도록 만들었다. 테스트로 만든 코드기 때문에 javascript에 상수로 넣었지만, 필요하다면 api call을 통해 서버에서 가져온 값을 넣자. 그리고 이 데이터(ROUTLETTE_DATA)를 각 content에 넣어주면 된다. 

### 당첨 결과를 동적을 처리하자

마지막이다. 당첨 결과를 동적으로 처리해보자. 이전에는 CSS에 정해진 animation과 keyframes를 사용했기 때문에 항상 고정된 위치에서 정지했다. 룰렛은 어디에서 멈출지 모르기 때문에 미리 서버에서 결정한 값을 받아온 뒤 해당 값이 선택되도록 만들어보자. 

#### 이전 코드

~~~HTML
<script>
  const trigger = document.querySelector(".trigger");
  trigger.addEventListener("click", onClickTrigger);
  function onClickTrigger(e) {
    roullete.classList.add("loop");
  }
</script>
<style>
  .roullete.loop {
    animation: rotation 7s ease-in-out forwards;
  }
  @keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(7045deg);
  }
}
</style>
~~~

`trigger` 버튼을 클릭하면 loop 클래스가 추가되고 animation이 동작한다. 7초 동안 7045도 돌아간다음 멈추도록 처리했다. 항상 동일한 곳에 멈춘다. 이 코드를 동적으로 바꿔보자. 

#### 개선된 코드

~~~HTML
<script>
  const BASE_ROTATE_DEG = 7200;
  const loopAnimationOptions = {
    fill: 'forwards',
    duration: 7000,
    easing: 'ease-in-out'
  }
  const trigger = document.querySelector(".trigger");
  function onClickTrigger() {
    const selectedIdx = Math.floor(Math.random() * 7);
    // 아래계산식은 selectedIdx가 0이면 첫번째 영역이 선택되도록 한다.
    const additionalDeg = 22.5 * (2 * (1 - selectedIdx) + 1);
    const totalDeg = BASE_ROTATE_DEG + additionalDeg;
    const loopAnimation = [
      {transform: 'rotate(0deg)'},
      {transform: `rotate(${totalDeg}deg)`},
    ];
    roulette.animate(loopAnimation, loopAnimationOptions);
  }
</script>
~~~

animation 관련 스타일 코드는 모두 삭제하자. 대신 자바스크립트 코드에서 동적으로 애니메이션을 실행하자. 자바스크립트에서 style 태그를 생성해서 animation keyframes을 넣어줘도 상관없지만, `Web Animation API`를 사용하여 작성해보자. 참고로 Web Animatino API는 모든 브라우저에서 사용가능한건 아니기 때문에 반드시 [호환성 체크](https://caniuse.com/#feat=web-animation)를 하자. 클릭할때마다 random으로 selectedIdx가 바뀌기 때문에 매번 다른 값이 선택된다.

`gocha 버튼`을 누르면 onClickTrigger 함수가 호출된다. 여기서는 `selectedIdx`라는 미리 선택된 값을 이용해(여기서는 랜덤으로 처리) `additionalDeg`를 구한다. 공식이 다소 복잡해 보이지만, 각 index 영역이 룰렛 위쪽 화살표에서 멈추도록 각도를 계산하는 공식이다. totalDeg가 정해지면 animate() 함수를 이용해 룰렛을 회전하자. 약 7초가 지나면 미리 정해두었던 selectedIdx 영역이 위쪽 화살표에서 멈추는걸 확인할 수 있다. 

### 정리

실제 프로젝트에서 사용하려면 제대로된 룰렛 게임처럼 보여야 하기 때문에 좀더 세부적인 개선이 필요할것 같다. 예를 들면 다음과 같은 수정이 가능하다.

> - 위쪽 화살표 가운데서만 멈출게 아니라 pie 영역 처음과 끝 사이 어디서든 멈출수 있도록 랜덤으로 각도를 조절한다.
> - 룰렛이 멈추기전에 좀더 극적으로 특정 영역이 선택되는것 처럼 보이기 위해 애니메이션을 세분화 및 다각화한다.
> - 룰렛 item의 개수를 동적으로 만들거나, 영역의 너비(내각)도 동적으로 처리할 수 있도록 만든다. 

### 참고자료

- [animate in MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
- [Web Animatin API in caniuse](https://caniuse.com/#feat=web-animation)
