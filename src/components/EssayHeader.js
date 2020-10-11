import React from 'react';
import s from './css/EssayHeader.module.scss';

export default function EssayHeader() {
  return (
    <div className={s.wrapper}>
      <div className={s.text1}>
        더이상 이 블로그에서 에세이를 쓰지 않습니다.
      </div>
      <div className={s.text2}>
        에세이는{' '}
        <a
          href="https://brunch.co.kr/@blueshw83"
          style={{
            borderBottom: '3px solid #d7c3ee',
            color: '#aaa',
            textDecoration: 'none',
          }}
        >
          브런치
        </a>
        에서 읽어주세요.
      </div>
    </div>
  );
}
