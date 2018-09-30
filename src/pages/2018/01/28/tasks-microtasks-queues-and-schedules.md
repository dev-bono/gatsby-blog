---
title: '[번역] Tasks, microtasks, queues and schedules'
date: 2018-01-28 21:31:39
category: javascript
tags:
  - javascript
  - task
  - microtask
  - Promise
---

> 원본: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
> 의역, 오역이 가득합니다. 개인적으로 정확한 개념을 잡기 위한 번역입니다. 불필요하다 생각한 내용은 과감히 제거했습니다.
> 테스트는 원본 페이지에서 확인 가능합니다.

아래 자바스크립트 코드를 살펴보자.

```javascript
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

위의 코드를 실행하면 아래와 같은 순서로 출력된다.

```
script start
script end
promise1
promise2
setTimeout
```

브라우저에 따라서 조금 다른데 Microsoft Edge, Firefox 40, iOS Safari, desktop Safari 8.0.8 에서는 예외적으로 `setTimeout`이 `promise1`, `promise2`보다 먼저 출력된다. 진짜 이상한점은 Firefox 39, Safari 8.0.7 에서는 정상적으로 출력된다는 것이다.

### 왜 이렇게 출력되는 것일까?

이를 이해하기 위해서는 우선 이벤트 루프가 `task`와 `microtask`를 어떻게 다루는지에 대해 알 필요가 있다.

스레드는 그 자신의 이벤트 루프를 가지고 있고 각각의 web worker 는 자신의 이벤트 루프를 수행하기 때문에 서로 독립적으로 실행된다. 그러나 같은 도메인(origin)의 모든 브라우저 창들은 동기적으로 통신할 수 있기 때문에 이벤트 루프를 서로 공유한다. 이벤트 루프는 지속적으로 돌아가면서, 대기열에 들어가있는 task 들을 실행시킨다. 한 이벤트 루프는 실행 순서를 보장하는 여러개의 task 를 가지고 있지만 각 이벤트 루프의 실행단계에서 어떤 task 를 실행시킬지는 브라우저가 선택한다. 이를 통해 브라우저는 유저 input 과 같은 성능에 민감한 task 에 우선권을 부여할 수 있다.

task 는 브라우저 내부에서 javascript/DOM 으로 들어가 순차적으로 발생하도록 예약된다. task 사이에서 브라우저는 렌더링을 새로한다. 마우스 클릭으로 이벤트 콜백을 발생시키려면 HTML 파싱 처럼 task 예약이 필요하다. 위에서 보았던 `setTimeout`이 좋은 사례이다.

`setTimeout`은 주어진 delay 를 기다린 다음 콜백을 위한 새로운 task 를 예약한다. 이것이 `setTimeout`로그가 `script end`로그 이후에 출력되는 이유이다. `script end`로그는 첫번째 task 의 일부이고 `setTimeout`은 별도의 task 에서 발생한 로그이다.

일반적으로 microtask 는 현재 실행되고 있는 script 바로 다음에 발생해야하는 작업으로 예약된다. 예를들어 일괄처리에 대한 반응(?)이나 새로운 task 를 만들때의 단점 없이 비동기로 어떤 작업을 처리하기 위해 사용된다. microtask 의 대기열은 다른 자바스크립트가 실행중이 아니거나 task 가 끝난 후에 처리된다. 대기중인 microtask 는 대기열의 끝에 더해지고 실행된다. `observer callback`이나 `promise callback`이 대표적인 microtask 다.

promise 가 처리될 때 혹은 이미 처리된 promise 는 callback 을 처리하기 위해 microtask 의 대기열에 들어간다. 이눈 promise 가 처리 여부와 상관없이 그 callbak 이 비동기로 실행됨을 보장한다. 즉, 처리된 promise 에 대해서 `then(resolve, reject)`이 호출되면 그 즉시 microtask 가 대기열에 들어간다. 이것이 바로 `promise1`과 `promise2`가 `script end` 다음에 출력되는 이유이다. 현재 실행되는 script(task)가 끝난 다음에 반드시 microtask 가 처리되어야 한다. `promise1`과 `promise2`가 `setTimeout` 이전에 출력되는 이유는 microtask 가 다음에 실행될 task 이전에 처리되기 때문이다.

위 코드를 다시 살펴보면 아래와 같은 순서로 처리됨을 알 수 있다.

> 원문에서 확인함을 추천, 원문에는 animation 으로 코드의 실행과정과 task queue 및 js 실행 스택을 확인할 수 있다.

```javascript
// 1 - task1 실행: script, script start 출력
console.log('script start')

// 2 - task2 등록: timer task 대기열에 들어감
setTimeout(function() {
  // 8 - task2 실행
  console.log('setTimeout')
}, 0)

// 3 - microtask1 등록: promise가 microtask 대기열에 들어감
Promise.resolve()
  .then(function() {
    // 5 - microtask1 실행: promise1 출력
    console.log('promise1')
    // 6 - microtask2 등록:
  })
  .then(function() {
    // 7 - microtask2 실행: promise2 출력
    console.log('promise2')
  })

// 4 - task1 종료: script end 출력
console.log('script end')
```

### 그럼 어떤 브라우저에서는 왜 다르게 동작할까?

위에서 언급한 특정 브라우저에서는 `promise1`과 `promise2`가 두번째 task 인 `setTimeout` 이후에 출력된다. 이때는 promise 가 microtask 가 아닌 새로운 task 로 인식되어 `setTimeout` task 이후에 출력되는 것이 아닐까 생각된다.

promise 가 HTML 이 아니라 ECMAScript 에서 나왔기 때문에 변명의 여지가 있어보입니다. ECMAScript 는 microtask 와 비슷한 job 의 개념을 가지고 있다. 그러나 그 관계가 명확한 것은 아니지만([vague mailing list discussions](https://esdiscuss.org/topic/the-initialization-steps-for-web-browsers#content-16)), 일반적으로 promise 는 microtask 대기열의 일부로 받아들여지고 있다.

promise 를 task 로써 다룰 때는 성능상 문제가 발생할 수 있는데, promise callback 이 렌더링과 같은 task 관련 작업들에 의해 불필요하게 연기될수도 있기 때문이다. 또한 이는 다른 자바스크립트 소스와의 상호작용으로 인해서 무결성이 훼손될수도 있고 그로인해 다른 API 와의 상호작용이 깨질수도 있다.

해당 이슈는 Edge 브라우저에서 이미 완결되었다([Edge ticket](https://connect.microsoft.com/IE/feedback/details/1658365)).

### task 인지 microtask 인지는 어떻게 알수 있을까?

테스트 방법은 하나다. 비록 올바르게 구현됐다는 가정이 필요하지만, promise 와 `setTimeout`과 관련된 로그의 출력을 보면 알 수 있다.

더 확실한 방법은 스펙을 찾아보면 된다. 예를들어 task 가 대기열에 들어가는 과정을 나타낸 [step 14 of setTimeout](https://html.spec.whatwg.org/multipage/webappapis.html#timer-initialisation-steps)을 살펴볼 수 있고, microtask 가 큐에 들어가는 과정을 나타낸 [step 5 of queueing a mutation record](https://dom.spec.whatwg.org/#queue-a-mutation-record)를 보면 좀 더 자세하게 알 수 있다.

이미 얘기한것 처럼 ECMAScript 에서는 microtask 는 job 으로 불린다. [step 8 .a PerformPromiseThen](http://www.ecma-international.org/ecma-262/6.0/#sec-performpromisethen)을 보면, EnqueueJob 은 microtask 대기열에서 호출됨을 알 수 있다.

다음에는 좀더 복잡한 예제를 살펴보자.

### Level 1 bossfight

아래에 간단한 html 이 있다.

```html
<div class="outer">
  <div class="inner"></div>
</div>
```

그리고 아래 자바스크립트 코드 일부가 있다. 이때 `div .inner`를 클릭하면 로그가 어떻게 출력될까?

```javascript
// outer 클래스 element와 inner 클래스 element를 가져온다.
var outer = document.querySelector('.outer')
var inner = document.querySelector('.inner')

// outer element의 상태(attribute) 변화를 감시한다.
new MutationObserver(function() {
  console.log('mutate')
}).observe(outer, {
  attributes: true,
})

// click 리스너
function onClick() {
  console.log('click')

  setTimeout(function() {
    console.log('timeout')
  }, 0)

  Promise.resolve().then(function() {
    console.log('promise')
  })

  outer.setAttribute('data-random', Math.random())
}

// inner, outer element에 클릭 이벤트를 붙인다.
inner.addEventListener('click', onClick)
outer.addEventListener('click', onClick)
```

`div.inner`를 클릭했을 때와, `div .outer`를 클릭했을때 어떻게 다른지 알겠는가? 당신이 여전히 맞을수도 있겠지만 불행하게도 브라우저마다 동일한 결과를 보여주지는 않는다(버전 명시가 안되있어서 현재 최신 버전에서도 동일할지는 테스트가 필요하겠다).

```
Chrome :
click - promise - mutate - click - promise - mutate - timeout - timeout

Firefox :
click - mutate - click - mutate - timeout - promise - promise - timeout

Safari :
click - mutate - click - mutate - promise - promise - timeout - timeout

Edge
click - click - mutate - timeout - promise - timeout - promise
```

### 어떤 브라우저가 맞을까?

클릭 이벤트를 전달하는것은 하나의 task 다(즉, `div .inner`에서 클릭이 발생해서 `div .outer`로 버블링되더라도 두개의 동작이 별도의 task 가 아니라 하나의 task 라는 의미). Mutation observer 나 promise callback 은 microtask 로 대기열에 들어가고 `setTimeout` 콜백은 task 로 대기열에 들어간다. 즉 아래와 같은 방식으로 처리된다.

```javascript
// 1 - task1 실행: script 실행
var outer = document.querySelector('.outer')
var inner = document.querySelector('.inner')

new MutationObserver(function() {
  // 8 - microtask2 실행: mutation observer 콜백 실행
  // 13 - microtask4 실행: mutation observer 콜백 실행
  console.log('mutate')
}).observe(outer, {
  attributes: true,
})

// 3 - task2 등록 및 실행: inner 영역 click 이벤트 발생
// 9 - task2 계속 실행 : inner에서 outer로 click 이벤트 버블링
function onClick() {
  console.log('click')

  // 4 - task3 등록: inner 영역 타이머 task 생성, setTimeout
  // 10 - task4 등록: outer 영역 타이머 task 생성, setTimeout
  setTimeout(function() {
    // 14 - task3 실행: inner 영역 타이머 콜백 실행
    // 15 - task4 실행: outer 영역 타이머 콜백 실행
    console.log('timeout')
  }, 0)

  // 5 - microtask1 등록: inner 영역 promise
  // 11 - microtask3 등록: outer 영역 promise
  Promise.resolve().then(function() {
    // 7 - microtask1 실행 : inner 영역의 promise 콜백 실행
    console.log('promise')
  })

  // 6 - microtask2 등록: inner 영역 Mutation observer
  // 12 - microtask4 등록: outer 영역 Mutation observer 등록
  outer.setAttribute('data-random', Math.random())
}

// 2 - task1 종료 : inner 및 outer element에 click 이벤트 리스너 등록
inner.addEventListener('click', onClick)
outer.addEventListener('click', onClick)
```

역시 크롬이 맞다(글 작성자가 구글 직원이다). 다른 자바스크립트가 실행되고 있지 않다고 가정하고 microtask 가 task 의 끝에서 처리된다기 보다는 콜백들이 모두 처리된 이후에 처리된다고 보는게 맞다. 이 규칙은 콜백을 호출하는 HTML 스펙에 잘 정의되어 있다.

> 만약 [자바스크립트 스택](https://html.spec.whatwg.org/multipage/webappapis.html#stack-of-script-settings-objects)이 비어있다면 [microtask 가 실행될지를 체크](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)하다.
> \- [HTML: Cleaning up after a callback](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback) step 3

microtask 대기열이 처리중이 아니라면 microtask 수행 체크는 microtask 대기열을 지나가버린다. 비슷하게 ECMAScript 는 jobs 에 대해 이렇게 말한다.

> job 의 실행은 단지 실행 컨택스트가 동작하지 않을때만 초기화된다.
> [ECMAScript: Jobs and Job Queues](http://www.ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues)

### 다른 브라우저들은 뭐가 잘못됐을까?

Firefox 와 Safari 에서는 mutation 콜백에서 보여줬듯이 클릭 리스너 사이에 microtask 대기열을 제대로 소진시킨다. 그러나 promise 는 좀 더 다른 방식으로 큐에 삽입된다. job 과 microtask 의 연관성이 모호하다는 것을 감안하더라도 여전히 콜백 사이에서 실행될것이라 기대된다. Firefox 이슈를 확인해보자([Firefox ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=1193394), [Safari ticket](https://bugs.webkit.org/show_bug.cgi?id=147933)).

이전에 살펴보았듯이 Edge 에서는 promise 가 제대로 동작하지 않는다(task 로 인식). 그리고 또다른 문제는 microtask 대기열이 클릭 리스너 사이에서 소진되는 것이 아니라 모든 리스너가 호출된 다음에 호출된다. 이것이 두 클릭 로그 이후에 하나의 mutate 가 찍힌 이유다.([Bug ticket](https://connect.microsoft.com/IE/feedbackdetail/view/1658386/microtasks-queues-should-be-processed-following-event-listeners))

### Level 1 boss's angry older brother (왜 이런 표현을 쓸까..?)

그렇다면 아래처럼 자바스크립트에서 직접 click 함수를 호출하는 경우에는 어떨까?

```javascript
// 위 코드와 동일, 직접 리스너를 호출하는 아래 코드만 추가
inner.click()
```

조금 다른 결과가 나왔다. 브라우저 별로 어떻게 다른지도 살펴보자

```
Chrome :
click - click - promise - mutate - promise - timeout - timeout

Firefox :
click - click - mutate - timeout - promise - promise - timeout

Safari :
click - click - mutate - promise - promise - timeout - timeout

Edge
click - click - mutate - timeout - promise - timeout - promise
```

다른 브라우저는 제쳐두고서라도 크롬에서도 다른 결과가 발생했다(이와중에 Edge 는 동일하다). 여러번 테스트 해보아도 동일한 결과가 나온다.

### 왜 다른것일까?

그 이유는 자바스크립트 코드 마지막에서 `inner.click()`이 실행되면 script 가 아직 종료되기 전이므로 자바스크립트 스택이 비어있지 않은 상태가 된다(자바 스크립트 스택이 비어 있지 않으므로 microtask 를 처리할 수 없다). 그렇기 때문에 microtask 가 실행되지 않고 바로 outer 로 버블링되어 클릭 리스너가 실행되는 것이다.
(mutate 가 한번만 출력되는 이유는 하나의 mutation microtask 가 등록되어 있으면 다른 mutation task 를 등록할 수 없기 때문)

결론은 역시(?) 크롬이 제대로된 결과를 출력한다는 것.

위에서 언급했던것 처럼 리스너 콜백이 호출된 후 자바스크립트 실행 스택이 비어있는 경우에만 microtask 체크를 수행하기 때문에 `inner.click()`으로 메서드가 호출중인 상태에서는 microtask 체크가 진행되지 않는다.

이전에 보았던 예제에서는 microtask 가 리스너 콜백 사이에서 실행되었지만(사용자에 의해 클릭 동작이 처리되었으므로) `.click()`은 동기적으로 이벤트가 전달되므로 `.click()`을 호출하는 스크립트는 여전히 콜백 사이의 스택에 남아있게 된다. 이 규칙은 자바스크립트가 실행중일 때는 microtask 가 끼어들지 못한다는 것을 보장한다. 이는 우리가 리스너 콜백 사이에서 microtask 를 처리하지 못하고 모든 리스너가 실행된 후에 처리된다는 것을 의미한다.
