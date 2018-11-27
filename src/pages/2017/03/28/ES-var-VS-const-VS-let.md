---
title: '[ES6] var VS const VS let'
date: 2017-03-28 23:52:49
category: javascript
tags:
  - javascript
  - ES6
  - var
  - const
  - let
---

ES6(ECMA Script 2015, 줄여서 ES6)로 넘어오면서 기존 ES5 까지 사용하던 변수 선언 키워드인 *var*에다 *const*와 *let*이라는 키워드가 추가되었습니다. 물론 var 없이도 변수를 선언할 수 있습니다만, 그렇게 되면 전역객체(브라우저 환경에서는 window 객체)의 속성이 되기 때문에 동일한 이름의 변수를 사용하다가는 치명적인 문제가 발생할 수도 있습니다.

기존 자바스크립트의 변수는 기본적으로 Function Scope 입니다(var 로 선언한 변수). 변수의 유효범위가 함수단위라는 이야기입니다. java 나 C 등의 많이 사용되는 프로그래밍 언어를 공부해 보았다면 알겠지만, 대체로 이 언어들은 Function Scope 가 아닌 Block Scope 를 가집니다.(python 은 예외) 그래서 java 나 C 계열의 언어를 사용하다가 자바스크립트 코드를 짜다보면 간혹 스코프 문제로 헷갈릴때가 있기 마련이죠. 그래서 ES6 부터는 const 와 let 이 등장했습니다. 예상한대로 const 와 let 은 Block Scope 를 가집니다. 기존에 많이 사용되는 언어들과 같습니다. const 는 단어의 의미처럼 상수를 의미하고 let은 기존의 var 처럼 변수를 의미합니다.

이 밖에도 이 세가지 키워드에는 몇가지 차이점이 존재합니다. 예제를 통해 이 세가지 변수선언 키워드에 대해서 알아보겠습니다.

### 재할당 및 재선언하기

```javascript
// var의 경우
var a = 1
a = 2
console.log(a) // 2
var a = 3
console.log(a) // 3

// let의 경우
let b = 1
b = 2
console.log(b) // 2
let b = 3 // SyntaxError: Identifier 'b' has already been declared

// const의 경우
const c = 1
c = 2 // TypeError: Assignment to constant variable
```

var 의 경우 굉장히 유연합니다. *var a = 1;*로 선언한 뒤, 2 를 재할당하고 다시 *var = 3;*으로 재선언(?) 해도 문제될게 없습니다.
그런데 let 의 경우 재할당은 문제 없습니다만, *let b = 3;*으로 재선언하고 나면 이미 선언된 변수라는 에러를 뱉어냅니다.
마지막으로 const 는 상수이기 때문에 재할당, 재선언 모두 불가합니다.

### 스코프 (Scope)

```javascript
var a = 1
let b = 2

if (true) {
  var a = 11
  let b = 22
  console.log('a = ' + a) // 11
  console.log('b = ' + b) // 22
}

console.log('a = ' + a) // 11
console.log('b = ' + b) // 2

function func() {
  var a = 111
  let b = 222
  console.log('a = ' + a) // 111
  console.log('b = ' + b) // 222
}

func()

console.log('a = ' + a) // 11
console.log('b = ' + b) // 2
```

전역 영역에서 var a, let b 를 선언하고 각각 1, 2 를 할당했습니다. 우선 if 블럭 내에서 각각의 변수 값을 변형시켰더니 블럭 내에서는 변경된 값이 모두 출력되었습니다. 그런데, if 블럭 바깥으로 나갔더니 let 으로 선언했던 b 값은 가장 상단에 선언한 값과 동일한 2 인데, a 는 11 로 변경되었습니다. 그 이유는 var 의 경우 변수의 유효범위가 함수이므로 블럭으로 감쌌다고 하더라도 함수 스코프가 바뀐것이 아니기 때문에 if 블럭 내에서 재할당한 값을 출력하는 것입니다.

함수내에서 a, b 각 변수를 선언했을때는 어떨까요? var 든, const 든 새로운 함수로 감싸게 되면 그 안에서 선언한 변수는 함수(func)내의 지역변수가 되므로 바깥에서 선언한 변수의 이름과 겹치더라도 함수(func) 내에서는 새로 할당한 값들이 출력됩니다. 마지막으로 함수가 호출되고 나서 각 변수를 출력해보면, 함수 내에서 할당한 값은 그 함수 호출이 끝남과 동시에 유효범위도 사라지므로 함수 선언 이전의 a, b 값이 출력됩니다.

### let vs const

위에서 let 은 변수, const 는 상수라고 구분지어 설명했지만, 좀더 구체적으로 설명할 필요가 있어보입니다. let 은 변수고 const 는 상수가 맞긴 하지만, 할당된 값이 원시타입이냐 참조타입(array, object, function)이냐에 따라서 조금 다르게 사용됩니다.

```javascript
let a = 1
const b = 2

a = 11
b = 22 // TypeError: Assignment to constant variable.

let obj_a = {
  name: 'obj_a',
}

const obj_b = {
  name: 'obj_b',
}

obj_a['name'] = 'a'
obj_b['name'] = 'b'

obj_a['number'] = 1
obj_b['number'] = 2

obj_a = {}
obj_b = {} // TypeError: Assignment to constant variable.
```

기본적으로 let 은 재할당이 가능한반면, const 는 재할당이 불가합니다. 재할당하게 되면 TypeError 가 발생하죠. 그런데 차이점이 있다면, 처음 할당된 객체를 변형시킬때는 아무 문제없이 동작한다는 것을 알 수 있습니다. 처음에는 두 객체 모두 'name' 이라는 속성만 가지고 있었는데, 이를 변형하거나 새로운 속성(number)를 추가하더라도 let, const 둘다 에러를 발생시키지 않습니다. 이는 array 와 function 의 경우도 마찬가지인데, 이유는 const 에 실제로 할당된 값은 원시타입처럼 특정 값이 아니라 객체의 주소값이기 때문입니다. 실제 객체가 변한다고해서 한번 할당된 객체의 주소값이 바뀌는건 아니죠.

### 결론

> - ES6 에서 var, const, let 모두 사용 가능하지만, 상황에 맞게 적절한 키워드를 사용해야 하겠습니다. (되도록 const, let 을 사용하는게 좋겠죠)
> - 객체를 새로 할당할 특별한 이유(이런 경우는 드물다 생각합니다)가 없다면 되도록 const 를 사용하여 객체를 선언하는게 좋을것 같습니다.
