---
title: 'modal(popup) 에서 외부(body or parentElement) 스크롤 막기'
date: 2019-04-25 12:45:43
category: javascript
tags:
  - javascript
  - react
  - react-modal
  - modal
  - popup
  - scroll
  - prevent body scroll
  - momentum scroll
---

react에서 modal 뷰 구현을 위해 react-modal 패키지를 사용한다. 근데 이 react-modal을 쓰다보면 한가지 문제에 부딪힌다. 바로 모달 외부의 dimmed 영역이 스크롤되는 문제다. 예제를 살펴보자 (모바일이라면 반드시 새창으로 열어서 확인하자). 

<iframe src="https://codesandbox.io/embed/p514nlnnvx?fontsize=14" title="[prevent-scroll] 1. base-modal" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

외부 영역의 스크롤은 큰 문제가 아닐 수 있다. 하지만, 의도치 않은 동작이기 때문에 가능하면 스크롤을 막는게 좋다. `react-modal` githup 저장소의 [issue](https://github.com/reactjs/react-modal/issues)탭에서 `scroll`, `body scroll`, `prevent scroll` 등의 키워드로 검색(closed 포함)해보면 꽤 많은 사람들이 이 문제를 겪고 있음을 알게된다([대표적인 issue](https://github.com/reactjs/react-modal/issues/191)). 가장 많이 등장하는 해결책은 바로 아래 css 코드를 추가하는 것이다.

### 첫번째 방법: (overflow: hidden;)

~~~css
.ReactModal__Body--open {
  overflow: hidden;
}
~~~

해보면, 잘된다. 적어도 데스크탑에서는 잘 된다.
그런데 issue를 조금 더 보면 모바일에서 여전히 스크롤이 발생한다는 보고가 군데군데 보인다.
모바일에서 테스트해보자. 정말 `안된다!`

### 두번째 방법: 스타일을 좀 더 추가하자.

~~~css
.ReactModal__Body--open {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}
~~~

되는것 같이(?) 보인다. 그런데, 좀더 테스트 해보면 문제가 있음을 알 수 있다. 스크롤을 아래로 내린 상태에서 `modal 열기` 버튼을 클릭하자. 그러면 스크롤이 가장 상위로 올라간다. 이는 확실히 문제가 있다. 예를들어 스크롤 뷰어(웹툰이라고 상상하자)에서 특정 버튼을 눌렀을때 모달뷰가 뜨는 경우가 있다. 중간정도 위치를 보는 중이었는데 갑자기 모달이 뜨면서 스크롤이 가장 위로 올라가면 사용자는 자신이 보던 위치를 잃어버리게 된다. 그러므로 위 방법이 적절한 해결책은 아니다.

### 세번째 방법: 다른 패키지를 써라

스타일로는 해결이 안되는것 같다(찾지 못했다가 정확하다). 문득 react-modal의 문제일수도 있다는 생각이 들었다. react-modal 대신 react-aria-modal 패키지를 쓰면 해결된다는 글이 있길래 설치하고 테스트 해보았다.
그러나 마찬가지로 `실패`

### 네번째 방법: touchmove 이벤트를 이용하자

네번째 방법은 modal이 떠 있을때(isOpen === true 상태) touchmove 이벤트를 아예 차단하는 방법이다.

~~~javascript
const [showModal, setShowModal] = useState(false);
useEffect(() => {
  function handleTouchMove(event) {
    if (showModal) {
      event.preventDefault(); // 여기가 핵심
    }
  }
  window.addEventListener("touchmove", handleTouchMove, {
    passive: false
  });
  return () =>
    window.removeEventListener("touchmove", handleTouchMove);
}, [showModal]);
~~~

showModal === true일때 `event.preventDefault()`를 호출하고 EventListenerOptions 옵션에 `passive: false`를 설정한다.
첫째는 modal이 떠있을때 `preventDefault` 함수로 터치 이벤트의 기본 동작인 `scroll`을 막겠다는 의도다. 그리고 두번째 `passive: false`는 touch 이벤트가 발생했을때 preventDefault가 호출된다면 이벤트(scroll) 발생을 막겠다는 것이다. passive가 true일때는 preventDefault 함수를 무시하고 scroll을 하겠다는 의미다. passive의 기본값은 false기 때문에 따로 설정할 필요가 없다. 그럼에도 명시적으로 false를 넣어준것은 특정 브라우저 버전이나 기기에서 기본값이 `true`인 경우가 있기 때문이다.

이제 문제가 해결된 것처럼 보인다. 그런데, 만약 모달뷰 내부에 콘텐츠가 길어져서 스크롤이 필요한 경우라면 어떨까? 아래 코드를 테스트해보자 (모바일에서 새 창으로 열어서 테스트해야 정상적으로 확인가능하다.).

<iframe src="https://codesandbox.io/embed/p29k96rq2m?fontsize=14" title="[prevent-scroll] 5. prevent-by-event-bug" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

모달의 콘텐츠가 길어지니 문제가 생겼다. 외부 스크롤은 잘 막히지만, 정작 필요한 내부 스크롤은 동작하지 않는다. 뭐가 문제일까?

모바일 디바이스에서 touchmove 이벤트와 scroll이 발생하는 시점 사이의 정확한 매커니즘은 잘 모르겠지만, touchmove 이벤트 전파가 완료된 다음 scroll 이벤트가 발생하는것 같다. 그래서 window에 바인딩된 이벤트 핸들러에서 `preventDefault`가 호출되면 스크롤 자체가 막히므로 모달뷰 또한 스크롤되지 않는다.

> 전반적으로 react-hooks를 사용하고 있는데, hooks에 익숙하지 않다면 아래 공식 문서를 읽어보자.
> https://reactjs.org/docs/hooks-intro.html

### 다섯번째 방법: event 전파를 잘 이용하자.

이벤트 전파 과정을 잘 이용하면 모달뷰 내 스크롤이 막히는 현상을 해결할 수 있다. 이벤트는 기본적으로 부모 노드부터 타겟 노드로 전파(캡쳐링)되고 그다음 타겟 노드에서 다시 부모 노드로 전파(버블링)된다. 이때 노드에 바인딩한 이벤트 핸들러가 언제 호출될지는 capturing과 bubbling을 옵션으로 정할수 있다. 예를들어 `EventListenerOptions` 객체 기준으로 `capture: true`를 넣어주면 capturing시에 이벤트 핸들러가 실행된다. 기본 값은 false기 때문에 기본적으로 event bubbling시에만 이벤트 핸들러가 실행된다.

~~~javascript
// ex) 캡쳐링 이벤트를 감지해서 핸들러 함수(handleClick)를 실행시키고 싶다면..
window.addEventListener('click', handleClick, {capture: true});
~~~

조금 생각해보자. 네번째 방법에서 window 객체에 `touchmove` 이벤트를 바인딩 했는데, 이때 capture 옵션을 별도로 넣어주지 않았다. 즉, 이벤트가 버블링될때 핸들러 함수가 실행된다. 이벤트 버블링은 타겟 노드부터 부모 노드 방향으로 이벤트가 전파된다. 그래서 window 객체의 `handleTouchMove` 핸들러 함수는 touchmove 이벤트 전파 중 가장 마지막에 호출된다. 만약, 중간에 어떤 부분(예를들어 .modal-body)에서 이벤트 버블링은 막을수 있다면 결과적으로 handleTouchMove 함수의 호출을 막을수 있다. 그말은 즉, 정상적으로 스크롤을 할수 있게 된다는 의미다. modal-body 클래스 노드에 onTouchMove 이벤트 핸들러를 바인딩하고 핸들러에서 `e.stopPropagation()`을 호출하자. 

> 참고로 stopPropagation 함수는 더 이상 이벤트가 전파되지 않도록 막는다. 

~~~javascript
<div className="modal-body" onTouchMove={e => e.stopPropagation()}>
~~~

내부 영역이 스크롤되면서 외부 영역은 스크롤되지 않는걸 확인할수 있다. 몇번 더 해보자. 이상하다. 간헐적으로 내부 스크롤이 안되고 외부만 스크롤 되는 현상이 발생한다. 좀더 구체적으로 말하자면, 모달뷰가 스크롤 가능할때 가장 위에서 위쪽으로 스크롤을 시도하거나 가장 아래에서 아래쪽으로 스크롤을 시도하면 모달뷰가 아닌 외부의 dimmed 영역이 스크롤 되는 문제(?)가 있다(모바일만..). 심지어 touchmove 이벤트가 dimmed 영역으로 전파되지 않았음에도 말이다. 아마 터치 이벤트가 종료되더라도 계속해서 스크롤이 이어지는 모멘텀(Momentum) 스크롤 때문이 아닐까 조심스레 추측해본다(정말??).

### 여섯번째 방법: 마지막(?)

마지막 방법이다. 최소한 내가 찾은 마지막 방법이다. 출처를 밝히고 싶은데, 기록은 안해둬서 찾기가 어렵다. 아무튼 다섯번째 방법에서 발생했던 문제를 해결하는 방법은 다음과 같다.  

~~~css
# css
.modal-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 300px; <- modal 높이와 동일하게 맞춰준다.
}
~~~
~~~javascript
# react
...
const divRef = useRef(null);
useEffect(() => {
  if (divRef.current) {
    preventMomentumScroll(divRef.current);
  }
}, [divRef]);
...
return (
  ...
  <div
    ref={divRef}
    className="modal-body"
    onScroll={e => preventMomentumScroll(e.currentTarget)} // 이 코드가 없다면 가장 위일때와 가장 아래일때 한번더 touchmove가 발생해야 스크롤이 동작한다.
    onTouchMove={e => {
      if (!preventMomentumScroll(e.currentTarget)) {
        e.stopPropagation();
      }
    }}
  >
  ...
)

// 여기가 핵심이다. 가장 위일때는 +1, 가장 아래일때는 -1
function preventMomentumScroll(el) {
  const { scrollTop, offsetHeight, scrollHeight } = el;
  if (scrollTop === 0) {
    el.scrollTo(0, 1);
    return true;
  }
  if (scrollTop + offsetHeight >= scrollHeight) {
    el.scrollTo(0, scrollHeight - offsetHeight - 1);
    return true;
  }
  return false;
}
~~~

반드시 모바일에서 새창으로 열어서 확인하자.

<iframe src="https://codesandbox.io/embed/xlm05zzzyo?fontsize=14" title="[prevent-scroll] 7. final" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

스크롤의 가장 위와 가장 아래에서 발생하는 문제이기 때문에 해당 위치에서 별도의 처리를 한다. scroll이 가장 위일때는 1px만큼 더해주고, 가장 아래일때는 1px만큼 빼준다. 이때는 위치만 보정해줘야 한다. 버블링을 막지 않기 위해 `stopPropagation`을 호출하지 않고 window로 터치 이벤트를 버블링한다. 그리고 window의 터치 이벤트 핸들러에서 `preventDefault`을 호출해서 외부 스크롤을 막아준다. 여기서 끝이 아니다. 스크롤을 시도했는데 위치만 보정되고 실제로 스크롤이 동작하지 않는다면 이 또한 문제다. `onScroll` 이벤트 핸들러를 `modal-body`에 추가한다. scroll은 touchmove보다 늦게 호출된다. 그렇기 때문에 scroll이 호출될 시점에 이미 스크롤 위치가 보정되어 있다. 그러면 아마도 문제 없이 스크롤이 동작하게 된다. 추가로 최초 로딩(모달이 열렸을때)되었을때는 스크롤 위치가 가장 상단에 위치하므로 useEffect에서 스크롤 위치 보정 함수 `preventMomentumScroll`을 호출해준다.

### 정리

완벽한 해결책이라고는 생각하지 않는다. 데스크탑이나 모바일에서 이벤트 발생이나 전파 방식에는 차이가 있을 수 있기 때문에 그 특성을 고려해서 보완하는 코드를 추가한것 뿐이다. 그래도 이번 이슈를 해결하면서 이벤트 버블링(또는 캡쳐링)이나 모바일에서의 스크롤 동작같은 세부적인 내용에 대해 살짝 맛본것에 의의를 두는것으로 만족한다. 

### 참고자료
- [addEventListener의 옵션들](http://sculove.github.io/blog/2016/12/29/addEventListener-passive/)
