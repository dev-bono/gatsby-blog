---
title: '[javascript] require vs import (CommonJs와 ES6)'
date: 2017-05-16 23:59:31
category: javascript
tags:
  - javascript
  - ES6
  - require
  - import
---

## CommonJs, AMD, ES6 Module

require 와 import 에 대해서 비교해 보기 위해서는 우선 [CommonJs](http://www.commonjs.org/)와 [AMD(Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD), ES6 내장모듈과 같은 자바스크립트의 모듈 시스템에 대해 알고 있어야 합니다. 모듈에 대한 본격적인 포스팅이 아니기 때문에 깊게 다루진 않겠습니다(사실 자세히 모르게도 합니다ㅠ).

기존의 자바스크립트(ES5, 현재 대부분의 브라우저에서 지원하는 자바스크립트 문법)는 모듈이라는 개념이 부족하여 각 모듈(또는 파일)간의 의존성 처리에 제한이 있었습니다. 고전적인 웹 프로젝트에서 자바스크립트를 사용하는 방법을 살펴보면, HTML 파일내부에 `<script>` 태그를 삽입하여 모듈을 로드하고 있습니다. 하지만 이런 방식은 한가지 문제가 있는데, 자바스크립트 파일(또는 모듈)끼리 서로 모듈을 공유하는데 제약이 없다는점입니다. 그 이유는 script 태그로 로드된 모듈은 모두 window 객체의 속성이기 때문에 서로 다른 파일에 위치하면서도 모든 객체를 공유할 수 있기 때문입니다. 이처럼 각 자바스크립트 파일이 독립적으로 존재하지 못해 발생하는 여러 문제들(예를들어 다른 파일에서 같은 이름의 변수를 사용하는 경우) 때문에 하나의 모듈로 관리하기위한 다양한 패턴(모듈패턴, 즉시실행함수 등)을 사용하여 의존성을 관리할 수 밖에 없었습니다.

이를 해결하기 위한 수단으로 모듈이라는 개념을 도입하여 정의한 방법(또는 표준)이 CommonJs 와 AMD 입니다. 이 둘은 내부적으로 모듈 서로 간의 의존성(로드)이 지원되지 않는 상태로 만들어졌는데, ES6 에 이르러 언어 내부적으로 자바스크립트 모듈 의존성을 지원하게 되었습니다(import, export).

### 모듈정의 방식의 혼용

ES6 모듈은 기본적으로 CommonJs 와 AMD 모듈을 혼용해서 사용할 수 있습니다. 모듈을 가져오는 부분에 require 와 import 를 같이 쓰더라도 문제없이 동작하죠. import 는 ES6 문법이라 현재 사용되는 브라우저에서는 지원하지 않지만 babel 과 같은 트랜스파일러가 해결해줄수 있습니다. AMD 는 생략하고 ES6 와 CommonJs 를 비교하여 설명해보겠습니다.

모듈을 정의한다는 것은 다른 모듈에서 사용할 수 있도록 하나의 모듈로써 노출하겠다는 의미다.

#### 모듈 정의하기 (export)

**ES6**

```
// 모듈 전체를 export, 파일내 한번만 사용가능하다.
var module = {};
export default module


// 모든 속성을 export
export *;


// 함수를 직접 export
export function moduleFunc() {};
var property = "some property";
export {property};
```

**CommonJs**

```
// 모듈 전체를 export
module.exports = module;


// 모든 속성을 export
// (아시는 분 알려주세요)


// 함수를 직접 export
exports.moduleFunc = function() {};
```

#### 모듈 가져오기 (import)

**ES6**

```
// 모듈 전체를 import
import module
import module as myModule


// 모든 속성 import
import * from module


// 특정 멤버(함수 등)만 import
import {moduleFunc, moduleFunc2} from module
```

**CommonJs**

```
// 모듈 전체를 import
var module = require('./someModule.js');

// 모든 속성 import
// (위의 module 객체에 모든 속성이 담아져 온다.)

// 특정 멤버(함수 등)만 import, 위의 module을 이용한다.
module.moduleFunc
```

### 결론

> 바벨과 같은 트랜스파일링 모듈을 사용한다면 주저없이 ES6 를 사용합니다.
> 혼용하는것도 가능하지만 가급적이면 통일되게 사용하는 것이 좋다고 생각합니다.
> 실제로 제가 프로젝트 진행하면서 mocha 테스트 중 ES6 의 import/export 와 CommonJs 의 `module.exports` 를 혼용하여 사용시 문제가 발생했었습니다(자세히 언급하지 않음).

### 참고

- [JavaScript 표준을 위한 움직임: CommonJS 와 AMD](http://d2.naver.com/helloworld/12864)
- [ES6: Use of "import { property } from 'module'" is Not a Great Plan](https://www.exratione.com/2015/12/es6-use-of-import-property-from-module-is-not-a-great-plan/)
