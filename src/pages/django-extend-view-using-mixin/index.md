---
title: "[django] Mixin을 이용한 View 확장하기"
date: 2016-03-08 23:17:30
tags:
- django
- python
- mixin
---
장고 프로젝트는 다양한 방법으로 구현이 가능합니다. 
그 중에서 view에서 처리할 수 있는 방법으로 크게 두 가지가 있는데, 
하나는 함수를 기반으로 만드는 방법, 그리고 또 한가지는 클래스를 기반으로 만드는 방법입니다.

지금까지 장고를 사용하면서 느꼈던 두 방법의 차이점은(지극히 개인적인 견해입니다),
함수를 기반으로 만드는 방법은 쉽고 빠르게 만들 수 있지만 확장성이 떨어지고,
클래스를 기반으로 만드는 방법은 함수를 기반으로 만드는 방법에 비해서 시간이 좀 더 필요하지만 확장성 면에서는 훨씬 뛰어나다는 것입니다.
그 중 클래스 기반의 방법의 확장성을 극대화 시켜주는 녀석이 바로 Mixin이라는 놈입니다.
Mixin이라는 개념은 루비와 같은 타 언어에서도 많이 쓰이고 있는데, 클래스에 부가적인 기능이나 정보를 추가해주기 위한 모듈을 뜻합니다.
함수 기반으로 만든 앱 같은 경우에 추가적인 기능이 필요하면 코드를 직접 구현하거나, 함수를 덧붙이는 형태가 되야할 것입니다.
반면에 클래스의 경우에는 추가적인 기능이 필요하때 Mixin을 추가하면 간단히 해결됩니다.
몇 개를 추가해도 상관없으며 클래스에 의존적이지 않기 때문에 확장성 면에서 굉장히 자유롭다 할 수 있습니다.

루비 언어에서의 믹스인은 다중 상속이 지원되지 않아 이를 해결하기 위한 방안으로 등장했다고 볼 수 있는데요.
파이썬처럼 다중상속이 지원되는 언어에서 굳이 Mixin(실제로는 다중상속)이라는 개념이 따로 있는 이유는,
다중상속이 주는 모호함을 피하기 위함이라는 생각이듭니다.
명확하게 기능을 암시하는 이름(mixin)을 줌으로써 상속받는 클래스와 혼동하지 않도록 하는 것이죠.

```
class FirstMixin(object):
    def test1(self):
        print("first mixin!!!")


class SecondMixin(object):
    def test2(self):
        print("second mixin!!!")


class TestClass(ParentClass, FirstMixin, SecondMixin):
    pass
```

위의 코드에서도 알 수 있듯이 믹스인이라는 것은 상속받는 ParentClass와 다를 것 없는 클래스입니다.
이렇게 TestClass는 실제로 ParentClass, FirstMixin, SecondMixin이라는 세가지 클래스를 상속하는 것이지만,
ParentClass를 상속하고 FirstMixin과 SecondMixin의 기능을 추가로 확장한 것이라 말할 수 있습니다.

그렇다면, 장고(django)에서는 믹스인을 어떻게 사용하고 있을까요?
대표적으로 View같은 경우가 믹스인을 많이 사용하고 있는데요.
예를 한번 살펴보겠습니다.

### views.py 

```
from django.views.generic import TemplateView


class TestTemplateView(TemplateView):
    template_name = "test.html"
```

views.py는 urls.py에서 호출되는 url에 매핑된 클래스(또는 메서드)를 모아놓은 파일입니다
(기본파일일뿐 반드시 views.py에 있을 필요는 없습니다.) 
보통 클래스들은 View를 상속받아서 나머지 코드를 구현하지만, 
장고는 개발자들의 편의를 위해 몇가지 유용한 View를 만들어 두었습니다.

가장 쉬운 예로 TemplateView라는 클래스가 있습니다.
이 클래스는 template_name이라는 변수에 template 파일명(또는 패스)만 넣어주면, 
클라이언트로부터 호출된 요청을 처리할 수 있습니다. 
별다른 로직은 없고 다만, 해당 temlate으로 화면을 이동하는 역할을 할 뿐입니다.

어떻게 이런게 가능한지를 보기위해 TemplateView를 열어봅니다.


### generic/base.py

```
class TemplateView(TemplateResponseMixin, ContextMixin, View):
    """
    A view that renders a template.  This view will also pass into the context
    any keyword arguments passed by the url conf.
    """
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)
```

주석을 대충 해석해보면, 

> template을 그려주는 view이다. 또한 이 view는 url conf를 통해서 kwargs에 어떠한 값이라도  context를 추가해줄수 있다.

TemplateView는 위와 같이 세가지 클래스를 상속받고 있습니다. 
TempalteResponseMixin, ContextMixin 그리고 View입니다.
여기에 바로 우리가 찾고 있던 mixin이 있습니다!!

기본적으로 사용되는 View에다가 기능을 확장하기 위해 두가지 mixin을 덧붙였습니다.
그럼 각 믹스인이 어떤 역할을 하는지 살펴보겠습니다.


### TemplateResponseMixin

```
class TemplateResponseMixin(object):
    template_name = None
    template_engine = None
    response_class = TemplateResponse
    content_type = None

    def render_to_response(self, context, **response_kwargs):
        response_kwargs.setdefault('content_type', self.content_type)
        return self.response_class(
            request=self.request,
            template=self.get_template_names(),
            context=context,
            using=self.template_engine,
            **response_kwargs
        )

    def get_template_names(self):
        if self.template_name is None:
            raise ImproperlyConfigured(
                "TemplateResponseMixin requires either a definition of "
                "'template_name' or an implementation of 'get_template_names()'")
        else:
            return [self.template_name]
```

TemplateView에서  

> return self.render_to_response(context)

위의 부분이 호출하면, 실제로 TemplateResponseMixin 클래스의 render_to_response(context)가 호출됩니다.
이 메서드는 request, template, context 등을 세팅한 다음 TemplateResponse 클래스를 리턴하게 됩니다.
TemplateResponse 클래스에 대해서 자세히 설명하진 않겠지만, 
간략히 설명하면 get 메서드에서 리턴할때 template과 context를 실어서 클라이언트에 응답을 보내는 역할을 합니다.

결과적으로 TemplateView에서는  template 변수만 설정하면(request는 get 메서드에서 가져옴, context는 ContextMixin에서 가져옴) 
응답에 필요한 모든 값을 설정하여 클라이언트에 응답을 보낼수 있게 되는 것입니다.


### ContextMixin

```
class ContextMixin(object):
    def get_context_data(self, **kwargs):
        if 'view' not in kwargs:
            kwargs['view'] = self
        return kwargs
```

TemplateResponseMixin에서 설명했듯이 context를 가져오기 위한 역할을 하는것이 ContextMixin입니다.
context는, 클라이언트에 응답을 보낼 때 keyword argument(dict)로 값을 실어서 보낼 수 있는 역할을 하는 변수입니다(이름도 바꿀 수 있음).
TemplateView의 구현부분을 살펴보면, 

> context = self.get_context_data(**kwargs)

바로 이 부분을 통해서 context를 생성하여 클라이언트에 보낼 수 있게 됩니다.
만약 views.py 구현부에서 추가적으로 context에 추가할 필요가 있을때는
아래처럼 오버라이딩하여 context를 추가해주면 됩니다.


### views.py - 2 

```
from django.views.generic import TemplateView


class TestTemplateView(TemplateView):
    template_name = "test.html"

    def get_context_data(self, **kwargs):
        context = super(TestTemplateView, self).get_context_data(**kwargs)
        context['extra_value'] = 100
        return context
```

믹스인은 사용함에 따라서 거의  무한하게 확장할 수 있습니다.
TemplateView와 같이 기능이 단순한 경우에는 두개 정도의 믹스인만 사용되었지만, 
ListView같은 View들은 TemplateView 보다 다양하고 복잡한 믹스인을 사용하여 기능을 확장시켰습니다.
검색해보면, ListView 외에도 대부분의 확장된 View들이 믹스인을 확장하여 다양한 기능을 가지는 View를 만들어 내고 있습니다.

이처럼 믹스인을 잘 이용하면 자기 입맛에 딱 맞는 CustomView를 만드는데 큰 도움이 될 수 있습니다.
