---
title: '[CSS] 쉬우면서도 항상 찾아보게 만드는 CSS 속성들'
date: 2023-08-29 23:34:00
category: css
tags: 
  - css
  - front-end
  - tricky
---
CSS에는 다양한 속성이 있지만, 사용할 때는 은근히 까다로운 속성도 있습니다. 아래 몇 가지 쉬운면서도 어려운 CSS 속성을 예제를 통해 알아보겠습니다.

## **clip-path**
   
clip-path는 요소의 시각적 영역을 제어하는 CSS 속성입니다. 이 속성을 사용하여 요소의 모양을 자유롭게 조정할 수 있습니다. 원형, 직사각형, 또는 기타 복잡한 모양으로 자르거나, 요소의 일부를 보이지 않게 만들 수 있습니다.

#### 원
```css
.clip-circle {
    clip-path: circle(50% at center);
}
```

#### 아래가 뾰족한 세모
```css
.clip-polygon {
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
}
```

#### 항아리 모양
```css
.clip-ellipse {
    clip-path: ellipse(50% 70% at 50% 50%);
}
```

실제 코드로 확인하자.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="BavKNvN" data-user="blueshw" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/BavKNvN">
  Untitled</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## **:nth-child와 :nth-of-type**

`:nth-child`와 `:nth-of-type`는 요소의 위치를 기반으로 요소를 선택하는 CSS 의사 클래스입니다. `:nth-child`는 요소의 형제 중 순서를 기준으로 요소를 선택합니다. `:nth-of-type`는 요소의 형제 내에서 같은 종류의 요소 중 순서를 기준으로 선택합니다.

#### 첫 번째, 두 번째, 그리고 세 번째 항목 선택
```css
li:nth-child(-n+3) {
    font-weight: bold;
    color: red;
}
```

#### 5의 배수 항목 선택
```css
div:nth-of-type(5n) {
    background-color: yellow;
}
```

#### 홀수 항목만 선택
```css
p:nth-child(odd) {
    color: green;
}
```

실제 코드로 확인하자.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="qBLZOBL" data-user="blueshw" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/qBLZOBL">
  Untitled</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## **filter**

filter는 요소의 시각적 효과를 추가하는 CSS 속성입니다. 이 속성을 사용하여 요소를 블러 처리하거나, 밝기나 대비를 조정하거나, 특정 색상을 강조 표시할 수 있습니다.

#### 이미지를 반투명하게 만들기
```css
.transparent-image {
    filter: opacity(50%);
}
```

#### 이미지에 선명도 효과 추가
```css
.sharpened-image {
    filter: contrast(150%);
}
```

#### 이미지에 블러 효과 적용
```css
.blurred-image {
    filter: blur(5px);
}
```

실제 코드로 확인하자.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="jOXqbyG" data-user="blueshw" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/jOXqbyG">
  Untitled</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## **결론**

CSS는 직관적이 쉬운 편이지만, 논리적으로 기억하기는 쉽지 않습니다. 보통 제한된 범위에서 같은 속성만 반복 사용하기 때문입니다. 그렇기 때문에 의도적으로 다양한 속성을 이해하고 학습하는 시간을 가져야 합니다.
