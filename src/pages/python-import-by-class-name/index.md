---
title: "[python] 클래스 이름을 사용한 동적 모듈 import"
date: 2016-02-24 00:56:51
tags:
- python
- module
---
파이썬에서 모듈을 import 할때, 보통 파일 최상단(but, 메서드 내에서 지역적으로 import 가능)에 정의해서 쓰곤 합니다.
그런데 최근에 작업하면서 여러 클래스를 하나의 메서드에서 처리하면 좋겠다는 부분이 생겼지요.
그래서 생각한 끝에 클래스 이름만으로 동적으로 import하는 방법이 있지 않을까하는 궁금증이 생겼습니다.

> 아마도, 파이썬이라면 가능하다. 아마 누군가 똑같은 고민을 했을 것이다

라는 생각이 들어 한번 찾아 보았습니다.

검색결과, 역시나,,,, 파이썬,,,,
동일한 조건의 답을 찾는데 꽤 시간이 걸렸지만 결국에는 딱 맞는 방법을 찾아냈습니다.
현재 조건을 바탕으로 동적으로 import 하는 방법은 아래와 같습니다.


### 조건

> 파일 A, B가 있고 c라는 클래스의 이름으로 B에서 import 해야함
> 파일 A에서 B의 함수를 호출함, 이때 파라미터로 c 클래스의 이름을 전달
> 파일 A에는 c 클래스를 import 하고 있음


### file A

```
from package.temp import TempClass
from package import b

def a_function():
    module_name = TempClass.__module__       # 클래스가 정의된 모듈의 이름(패스)을 불러온다. 
    class_name = TempClass.__name__           # 클래스 이름을 string으로 가져온다. 
    b_function(module_name, class_name)
```


### file B

```
import importlib          # 모듈을 import 할 수 있는 모듈

def b_function(module_name, class_name):
    mod = importlib.import_module(module_name)          # 모듈을 import하고 모듈을 리턴
    class = getattr(mod, class_name)          # 모듈과 클래스 이름으로 클래스 정보를 가져온다.
``` 

정리해보면,
우선 file A에서 클래스를 import 합니다. 그리고 특수 기능을 가진 private method인 __module__과 __name__을 이용하여 각각 클래스가 정의된 모듈의 이름과 클래스 이름을 text로 가져옵니다. 두 개의 값을 b_function의 파라미터로 전달한 뒤, file B에서 두 파라미터를 이용하여 importlib 모듈을 통해 import한뒤 클래스 정보를 가져오게 됩니다.