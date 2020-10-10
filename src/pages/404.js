import React, { useEffect } from 'react';
import '../common/css/404.scss';

export default function NotFoundPage() {
  useEffect(() => {
    const TRANSFORM_RATIO = 5;
    let isXMinus = true;
    let maxScrollValue = 0;

    const containerEl = document.querySelector('.container-404');
    const firstEl = document.querySelector('.container-404 .first');
    const secondEl = document.querySelector('.container-404 .second');
    const thirdEl = document.querySelector('.container-404 .third');

    function handleScroll() {
      const scrollRate = pageYOffset / maxScrollValue;
      const fontSize = 25 - scrollRate * 15 + 'vh';
      firstEl.style.fontSize = fontSize;
      secondEl.style.fontSize = fontSize;
      thirdEl.style.fontSize = fontSize;
    }
    function handleResize() {
      maxScrollValue = document.body.offsetHeight - innerHeight;
    }
    function handleMove(e) {
      const { clientX, clientY } = e.type === 'touchmove' ? e.touches[0] : e;
      const { innerWidth, innerHeight } = window;
      const posX = (innerWidth / 2 - clientX) / TRANSFORM_RATIO;
      const posY = (innerHeight / 2 - clientY) / TRANSFORM_RATIO;
      setZIndex(posX);
      setTransform(posX, posY);
      setTextShadow(posX, posY);
    }
    function setZIndex(posX) {
      if (!isXMinus && posX < 0) {
        firstEl.style.zIndex = 1;
        secondEl.style.zIndex = 2;
        thirdEl.style.zIndex = 3;
        isXMinus = true;
      } else if (isXMinus && posX >= 0) {
        firstEl.style.zIndex = 3;
        secondEl.style.zIndex = 2;
        thirdEl.style.zIndex = 1;
        isXMinus = false;
      }
    }
    function setTransform(posX, posY) {
      const transformValue = `translate3d(${posX}px, ${posY}px, 0)`;
      firstEl.style.transform = transformValue;
      secondEl.style.transform = transformValue;
      thirdEl.style.transform = transformValue;
    }
    function setTextShadow(posX, posY) {
      firstEl.style.textShadow = getTextShadow(posX, posY, 0.5);
      secondEl.style.textShadow = getTextShadow(posX, posY, 0);
      thirdEl.style.textShadow = getTextShadow(posX, posY, -0.5);
    }
    function getTextShadow(posX, posY, padX) {
      const values = [];
      const unitX = (-1 * posX) / 50 + padX;
      const unitY = (-1 * posY) / 50;
      for (let i = 1; i < 50; i++) {
        const c = 160 + i * 2;
        const color = `rgba(${c}, ${c}, ${c}, ${1 - i / 50})`;
        const x = unitX * i;
        const y = unitY * i;
        values.push(`${x}px ${y}px ${color}`);
      }
      return values.join(', ');
    }
    containerEl.style.opacity = 1;
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  if (typeof window === undefined) {
    return null;
  }
  return (
    <>
      <div className="container-404">
        <span className="first">4</span>
        <span className="second">0</span>
        <span className="third">4</span>
        <a href="https://blueshw.github.io" className="home">
          # 블로그 홈으로
        </a>
      </div>
    </>
  );
}
