---
title: '[interactive web] 스크롤에 따라 svg path 변화시키기 (1부터 9까지 숫자 변형하기)'
date: 2020-01-26 14:22:10
category: interactive web
tags:
  - SVG
  - path
  - onScroll
  - 숫자변형
  - 스크롤 애니메이션
  - scroll interactive
---

스크롤하면 숫자 1부터 9까지 모양이 점진적으로 변하도록 만들어보았다. 각 숫자의 형태를 만들기 위해 웹에서 사용가능한 벡터 이미지인 SVG를 이용해 구현했다. SVG가 뭐지? 라는 분들이 있다면 W3Scools의 [SVG Tutorial](https://www.w3schools.com/graphics/svg_intro.asp)을 읽어보자.

우선 결과물부터..

<p class="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="blueshw" data-slug-hash="VwYqJxJ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="svg path change onScroll (1-9)">
  <span>See the Pen <a href="https://codepen.io/blueshw/pen/VwYqJxJ">
  svg path change onScroll (1-9)</a> by Hyunwoo Seo (<a href="https://codepen.io/blueshw">@blueshw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

간단히 설명하자면, 우선 1부터 9까지 각 숫자의 path를 배열로 미리 만들어둔다. 페이지 전체 높이를 배열의 길이만큼으로 나눠서 각 지점에 도달했을때 해당 숫자가 나타나도록 path를 변경한다. 단, 각 숫자가 한번에 바뀌는게 아니라 점진적으로 변경되므로 스크롤에 따른 일부 연산이 필요하다. 자세한 설명은 아래 구현과정을 통해서 알아보자. 

## HTML

HTML은 매우 간단하다. `SVG animation`을 사용하는게 아니기 때문에 svg 태그와 path 태그 하나씩만 있으면 된다. 숫자 표현을 위해서 점과 `베지어곡선(C)`을 사용하였다. 아래는 초기값으로 숫자 `1`을 나타낸다. 그런데 점과 C, 숫자들이 꽤 많이 보인다. 1일 그리는데는 점 두개면 되는거 아닌가? 이유는 2, 3, 4를 그리다보면 알 수 있는데, 숫자의 변형은 각 점의 위치를 이동하면서 만든다. 즉, 모든 숫자를 동일한 개수의 점(총 7개)으로 만들어야한다는 의미다. 2를 그릴때는 대략 4개 정도의 점이면 충분히 그릴수 있다. 하지만, 3이나 8같이 곡선이 많은 숫자를 부드럽게 표현하기 위해서는 7개정도의 점이 필요하다. 그래서 모든 숫자는 7개의 점으로 표현한다.

```HTML
<div class="wrapper">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" id="svg-number">
    <path id="number-path" fill="none" stroke="#C0362C" stroke-width="50" stroke-linecap="round" stroke-linejoin="round" d="M 400 50 C 400 80 400 100 400 100 C 400 120 400 150 400 150 C 400 150 400 180 400 200 C 400 220 400 300 400 300 C 400 300 400 350 400 350 C 400 350 400 450 400 500">
    </path>
  </svg>
</div>
```

path에 사용한 몇가지 속성을 살펴보자. 

> - fill: 요소를 칠할때 사용되는 색상, 애니메이션의 경우 최종 상태를 정의
> - stroke: path의 색상
> - stroke-width: path의 너비
> - stroke-linecap: path 끝을 어떻게 표현할지 결정 (round: 둥글게 표현)
> - stroke-linejoin: path의 모서리를 어떻게 표현할지 결정 (round: 둥글게 표현), 이 속성이 없으면 path가 겹칠때 깨진다.

## onScroll

window에 scroll이벤트를 등록해서 스크롤이 발생할때마다 이벤트 리스너가 호출되도록 한다. 리스너 함수인 `handleScroll()`이 호출되면 `heightRate(스크롤이 가장 위일때 0, 가장 아래일때 1)`로 계산된 d값과 numberColor, bgColor를 구해서 각 element에 적용한다.

```javascript
function handleScroll() {
  ticking = false;
	const totalHeight = document.body.scrollHeight - window.innerHeight;
	const heightRate = Math.round(window.pageYOffset / totalHeight * 100) / 100;
	const d = getCalculatedPath(heightRate);
	path.setAttribute('d', d);
	const numberColor = getCalculatedColor(heightRate, false);
	path.setAttribute('stroke', numberColor);
	const bgColor = getCalculatedColor(heightRate, true);
	document.body.style.backgroundColor = bgColor;
}
```

## 스크롤 위치에 따른 d 값 구하기

`d` 값을 구하는 과정은 다음과 같다.

> - heightRate를 이용해 현재 스크롤 위치가 1~9 사이의 어디인지(preIndex, nextIndex)를 구한다.
> - d값을 연산하기 쉽도록 미리정의해둔 d 문자열을 객체 형태로 변환(getPathItem)해 가져온다(정확히는 객체의 배열).
> - 이때 getPathItem 함수의 반환값은 반복되는 경우가 많으므로 `memoization`한다.
> - `reduce 함수`를 이용해 변환된 d 배열 두개를 비교해 모든 점의 현재 위치를 구한다(자세한 공식 설명은 생략). 
> - 각 점의 위치 값을 가진 배열을 문자열 하나로 합쳐서(join) 다시 d 문자열로 변환한다.

위 과정을 거치면 현재 스크롤의 path값을 구할 수 있다. 예를 들어 현재 스크롤이 1과 2 사이 중간쯤이라면 각 점은 모두 1과 2의 중간(베지어 곡선도 마찬가지)값을 갖는다. 가령, 1의 첫번째 점이 (400, 50)이고 2의 첫번째 점은 (250, 150)이다. 스크롤이 1, 2 사이에 정확히 가운데 위치한다면 현재 점의 위치는 `x: 325, y: 100`이된다.

```javascript
function getCalculatedPath(_heightRate) {
	const { preIndex, nextIndex, calcRate } = getCalculatorInfo(_heightRate);
	const preD = getPathItem(preIndex);
	const nextD = getPathItem(nextIndex);
	return nextD.reduce((acc, item, index) => {
		let nodeText = '';
		const {x, y, type} = item;
		if (type) {
			nodeText += type + " ";
		}
		const {x:ax, y:ay} = preD[index];
		const {x:bx, y:by} = nextD[index];
		const calcX = ax + (bx - ax) * calcRate;
		const calcY = ay + (by - ay) * calcRate;
		nodeText += calcX + ' ' + calcY;
		acc.push(nodeText);
		return acc;
	}, []).join(" ");
}
```

## 변화되는 글자색/배경색 구하기

글자 모양만 변화하면 단조롭기 때문에 색상도 변하도록 만들었다. 글자색 뿐 아니라 배경색도 바뀌게 만들어 단조롭지 않도록 만들었다. 색상 구현은 d를 구하는것 보단 간단하다. 미리 정의해둔(PATH_STROKE_COLOR_LIST)를 이용해 d를 구할때와 비슷하게 색상값을 구한다. 

> heightRate를 이용하여 preIndex, nextIndex를 구한다. d를 구할때와 로직이 동일하기 때문에 공통함수(getCalculatorInfo)를 만들었다.
> 백그라운드 색은 글자색에서 2번째 이후 색상이 적용되도록 한다.
> 각 색상(preColor, nextColor)을 가져와 각각의 R,G,B값을 분리한다. (ex. R:'C0', G:'36', B:'2C')
> R, G, B 값은 계산하기 쉽도록 10진법으로 변환한다(원리는 점의 위치를 구할때와 동일). 계산이 완료되면 다시 16진법으로 변환한다.
> 계산된 R, G, B 값을 더해서 완성된 색상코드를 반환한다.

```javascript
function getCalculatedColor(_heightRate, isBg) {
	const {preIndex, nextIndex, calcRate} = getCalculatorInfo(_heightRate);
	const bgPadding = isBg ? 2 : 0;
	const preColor = PATH_STROKE_COLOR_LIST[preIndex + bgPadding];
	const nextColor = PATH_STROKE_COLOR_LIST[nextIndex + bgPadding];
	const calcR = getCalculatedColorPart(preColor, nextColor, calcRate, 0);
	const calcG = getCalculatedColorPart(preColor, nextColor, calcRate, 2);
	const calcB = getCalculatedColorPart(preColor, nextColor, calcRate, 4);
	return `#${calcR}${calcG}${calcB}`;
}
function getCalculatedColorPart(preColor, nextColor, calcRate, rgbIdx) {
	const calcPrePart = preColor.substr(rgbIdx, 2);
	const calcNextPart = nextColor.substr(rgbIdx, 2);
	const r1 = parseInt(calcPrePart, 16); // 16진법을 10진법으로 변경
	const r2 = parseInt(calcNextPart, 16);
	return Math.round(r1 + (r2 - r1) * calcRate).toString(16); // 10진법을 16진법으로 변경
}
```

## 정리

간략하게 구현한 과정을 살펴보았다. 전체 코드를 보려면 [codepen](https://codepen.io/blueshw/pen/VwYqJxJ?editors=1010)에서 확인하자. 사실, 개인적으로 완성도는 아쉽다. 각 node를 디테일하게 컨트롤하지 못해서 숫자 사이의 변화가 어색하다. 점 배치를 다르게하면 개선할 여지도 있겠지만 node가 직선상으로만 이동하기 때문에 근본적으로 한계가 있다. 예를들어 3과 4와 같이 숫자 모양이 완전 다를때는 점들이 겹치고 교차하면서 자연스럽게 변하지 않는다. 그렇다고 각 점이 변하는 위치를 개별적으로 제어하는건 과해보인다. 아이디어가 떠오르면 개선해보자.  

## 참고자료

- [SVG Tutorial by W3Scools](https://www.w3schools.com/graphics/svg_intro.asp)
- [codepen page](https://codepen.io/blueshw/pen/VwYqJxJ?editors=1010)
- [간단한 svg path 생성기 by codepen](https://codepen.io/anthonydugois/pen/mewdyZ)
