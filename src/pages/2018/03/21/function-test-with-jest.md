---
title: '[Jest] mock 함수를 이용하여 함수 호출 테스트 하기'
date: 2018-03-21 01:19:29
category: javascript
tags:
  - jest
  - react
  - javascript
  - unit test
  - mock
  - exports
---

React 프로젝트에서 가장 많이 사용되는 테스트 모듈로 [Jest](https://facebook.github.io/jest/)가 있습니다. react 와 Jest 둘 다 페이스북이 만든 오픈소스 프로젝트입니다. 같은 회사에서 만든 오픈소스기 때문에 서로 호환이 잘 될거라는 믿음으로 사용하고 있습니다. 호환성과 무관하게 Jest 를 이용하면 모듈, React DOM 등의 테스트는 무리없이 진행할 수 있습니다. 무설정으로 React 앱을 만들수 있는 일종의 프레임웍인 [create-react-app](https://github.com/facebook/create-react-app)(이것 역시 페이스북)에서도 기본적으로 Jest 가 내장되어 있습니다.

테스트 환경을 위해 create-react-app 으로 app 을 생성합니다.

```
$ create-react-app jest-fn
```

만들어진 react app 의 src 폴더에 아래의 javascript 파일들을 생성합니다.
분기도 필요없고 모듈도 나눌 필요없는 함수지만, 테스트 목적으로 아래와 같이 작성합니다.

#### /src/number.js

```javascript
import { justReturn } from './util'

export function getFirstNumber(num) {
  if (num >= 10) {
    return returnFirstNum(num)
  } else {
    return justReturn(num)
  }
}
export function returnFirstNum(num) {
  return num % 10
}
```

#### /src/util.js

```javascript
export function justReturn(num) {
  return num
}
```

테스트 코드를 만듭니다.

#### /src/number.test.js

```javascript
import * as util from './util'
import * as number from './number'

describe('getFirstNumber', () => {
  it('number === 8', () => {
    util.justReturn = jest.fn()
    number.getFirstNumber(8)
    expect(util.justReturn).toBeCalled()
  })
  it('number === 15', () => {
    number.returnFirstNum = jest.fn()
    number.getFirstNumber(15)
    expect(number.returnFirstNum).toBeCalled()
  })
})
```

테스트를 실행해봅니다.

```
$ npm test
```

console 에 아래와 같은 메세지가 출력됩니다. 1 개의 테스트에서 에러가 발생했네요.

```
 FAIL  src/number.test.js
  ● getFirstNumber › number === 15
    expect(jest.fn()).toBeCalled()
    Expected mock function to have been called.
    ...

    Test Suites: 1 failed, 1 total
    Tests:       1 failed, 1 passed, 2 total
```

함수의 인자가 `number === 15`일때 발생한 에러입니다. 얼핏 보면 이상할 것 없는 코드인데, `number === 8`일때는 성공했고, `number === 15`일때는 실패했습니다. `getFirstNumber` 함수는 10 이상이냐 10 미만이냐에 따라 분기되고 각 조건절에서 별도의 함수를 호출하고 있습니다. 코드상에서 특별한 문제는 없어 보이는데, 조건절 내부에서 호출되는 함수들이 같은 모듈 내에 있는지 아니면 다른 모듈에서 가져온 함수인지의 차이는 있습니다. 이게 문제일까요? 조금더 깊게 들어가봐야겠습니다.

babel 사이트를 통해서 위의 코드를 트랜스파일링 해보면 아래와 같습니다.

#### /src/number.js

```javascript
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.getFirstNumber = getFirstNumber
exports.returnFirstNum = returnFirstNum

var _util = require('./util')

function getFirstNumber(num) {
  if (num > 10) {
    return returnFirstNum(num)
  } else {
    return (0, _util.justReturn)(num)
  }
}
function returnFirstNum(num) {
  return num % 10
}
```

number.js 를 다른 모듈에서 import(require)하면 function 자체를 가져오는 것이 아니라 모듈의 exports 객체를 가져옵니다. 각 모듈은 모두 독립적으로 존재하고 모듈끼리 서로 참조하기 위해서 import, export 키워드(ES6)를 사용합니다. 그렇기 때문에 하나의 모듈에 있는 함수를 다른 모듈에서 가져다 쓸수는 있지만 함수 그 자체를 변형할 수는 없습니다.

이제 test 코드를 다시 살펴보겠습니다. util 모듈의 `justReturn`에 Jest mock function 을 할당하고 있습니다.

```javascript
import * as number from './number';
...
it ('number === 8', () => {
  util.justReturn = jest.fn();  // util.js의 exports.justReturn에 mock 함수 할당
  ...
}
```

이는 util 모듈의 `justReturn`이라는 함수를 실제로 mock function 으로 변경한게 아닙니다. 단지 util 모듈의 exports 객체의 justReturn 에 `jest.fn()`을 할당한 것입니다. 즉, 이렇게 된 것입니다.

```javascript
exports.justReturn = jest.fn()
```

이 사실을 바탕으로 잘 생각해보면, 두번째 테스트가 왜 실패했는지 짐작해볼 수 있습니다.

```javascript
import * as number from './number';
...
it ('number === 15', () => {
  number.returnFirstNum = jest.fn(); // number.js의 exports.returenFirstnum에 mock 함수 할당
  number.getFirstNumber(15); // number.js의 getFirstNumber 호출
  expect(number.returnFirstNum).toBeCalled()
})
```

우선 number 모듈의 exports 객체의 returnFirstNum 속성에 mock 함수를 할당합니다. 그리고 `getFirstNumber(15)` 함수를 호출합니다. 이때 getFirstNumber 함수의 인자는 15 보다 크기 때문에 내부적으로 returnFirstNum() 함수가 호출됩니다. 그런데 `returnFirstNum` 함수는 `getFirstNumber` 함수와 동일한 모듈에 존재하기 때문에 실제로 호출되는 부분은 number.js 모듈의 실제 `returnFirstNum` 함수입니다(exports.returnFirstNum 이 아니라..).

이는 `number.returnFirstNum`함수가 `getFirstNumber` 내에서 호출되는 `returnFirstNum`과는 전혀 다른 녀석이라는 것입니다. mock 함수를 할당한 변수와 실제 호출되는 함수가 전혀 다르기 때문에 이 테스트는 실패하는게 맞습니다. 그렇다면 같은 모듈에서 호출하는 함수를 테스트하기 위한 방법이 없을까요?

### 방법이 있긴 합니다만..

테스트를 성공시킬수 있는 아주 간단한 방법이 하나 있습니다. 하지만 그다지 추천하고 싶지는 않습니다. `number.js` 파일을 다음과 같이 수정합니다.

```javascript
import { justReturn } from './util'

export function getFirstNumber(num) {
  if (num >= 10) {
    return exports.returnFirstNum(num)
  } else {
    return justReturn(num)
  }
}
export function returnFirstNum(num) {
  return num % 10
}
```

바뀐곳은 딱 한군데입니다. `getFirstNumber`내에서 `returnFirstNum`을 호출할때 앞에 `exports.`을 붙여주었습니다. 이는 returnFirstNum 을 모듈내에서 직접호출하는 것이 아니라 exports 객체의 property 에 할당된 함수를 호출하는 방법입니다. 동작은 이상없이 잘 됩니다만, 문제는 테스트 코드를 위해서 원래 소스를 고쳐야 한다는 것입니다. 그래서 그다지 추천하고 싶지 않습니다.

### 결론

같은 모듈에 있는 함수를 호출할때는 실제 함수를 사용하지만, 다른 모듈의 함수를 호출할때는 실제 그 함수가 호출되는 것이 아니라 모듈의 exports 객체의 property 가 호출됩니다. 그래서같은 모듈의 함수를 호출하는 함수를 테스트할 때는 호출 테스트를 할 수 없습니다. 방법이 있긴 하지만 테스트를 위해 원래 소스를 고쳐야 하므로 그다지 추천하지 않습니다.

> 혹시 좋은 방법 알고 계신분은 알려주시기 바랍니다

### 참고자료

- https://facebook.github.io/jest/docs/en/mock-functions.html
- https://medium.com/@deanslamajr/jest-fn-all-the-things-d26f3b929986
