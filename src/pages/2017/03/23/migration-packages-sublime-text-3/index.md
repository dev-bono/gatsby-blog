---
title: 'Sublime Text 3 패키지 공유하기'
date: 2017-03-23 00:37:32
category: programming
tags:
  - SublimeText
  - tool
---

### SublimeText 3 환경 설정 공유하기

서브라임 텍스트 사용 중에 가장 아쉬운 점은 바로 환경설정 부분입니다. 아톰 등의 몇몇 텍스트에디터들은 계정과 연동되어 어느 기기에서 설치하더라도 동일한 환경으로 작업할 수 있는 장점이 있는데, 서브라임은 이 기능을 지원하지 않아 매번 *[package Control](https://packagecontrol.io/installation)*부터 사용하는 패키지를 새로 설치해야 되는 문제가 있죠. 패키지를 몇가지 사용하지 않는다면 이게 뭐가 문제냐라고 생각할지 모르지만, 수많은 패키지를 설치한 사용자에게는 모든 패키지 리스트를 받아서 새로 설치하는건 크나큰 고역이 아닐 수 없습니다.

방법은 의외로 간단합니다. 사용자가 개발한 여러 싱크 플러그인 중 하나를 사용해도 무방하지만 저는 package control 사이트에서 기본적으로 제안하는 방법을 사용하도록 하겠습니다.

### [Syncing](https://packagecontrol.io/docs/syncing)

위 페이지를 보면 크게 2 가지 방법이 있는 것을 알 수 있습니다.

> 1. Using Git (Git 을 이용하는 방법)
> 2. Using Dropbox (Dropbox 를 이용하는 방법)

Git 을 이용하게 되면 별도의 Git 서버를 구축하지 않는 이상 대부분 Github 같은 서비스를 이용하게 될텐데 이때 문제가 하나 있습니다. Github 은 private 저장소가 아닌 이상 오픈되어 있기 때문에 서브라임을 사용하면서 유료로 구매한 패키지 정보들이 고스란히 노출될 수 있습니다. 그래서 저는 Git 을 이용하지 않고 안전한 Dropbox 를 선택했습니다.

### Using Dropbox (mac)

- Step 1. 드롭박스를 이용하려면 우선 mac 용 드롭박스 앱을 설치합니다. (~/Dropbox 생성)

- Step 2. 우선 저장할 패키지를 가진 기기에서 아래의 명령어를 차례로 입력합니다. Dropbox 에 Sublime 이라는 디렉토리를 생성하고, Packages 디렉토리 안에있는 User 정보를 dropbox 의 Sublime 디렉토리로 이동합니다. 그리고 dropbox 내 유저 정보를 simbolic link 로 연결합니다.

```
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
mkdir ~/Dropbox/Sublime
mv User ~/Dropbox/Sublime/
ln -s ~/Dropbox/Sublime/User
```

- Step 3. 이제 다른 기기(새로 설치할 기기)에 가서 아래 명령어를 순차적으로 입력합니다

```
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
rm -r User
ln -s ~/Dropbox/Sublime/User
```

이렇게 초기의 환경에서

![](/img/sublime-before.png)

이렇게 변합니다.

![](/img/sublime-after.png)

### 결론

이게 끝입니다. 간단하죠?
혹시 완료했는데 적용이 안된다면, Sublime Text 를 완전히 종료한 뒤 다시 실행시켜보세요.
서브라임은 최초에 실행될때 누락된 패키지가 있는지 체크하고 설치하는 과정을 거쳐
간단히 요약해보면, 아래와 같습니다.

> 패키지 정보가 들어있는 User 정보를 dropbox 로 이동하고 해당 폴더를 simbolic link 로 바라보게 만든다.
> 이렇게 되면 내 sublime 정보가 dropbox 에만 존재하므로, 어느 기기에서 사용하더라도 동일한 환경으로 설정이 가능하다.
