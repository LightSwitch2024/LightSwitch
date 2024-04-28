import DashBoard from '@assets/dashboard.svg?react';
import * as S from '@components/tab/indexStyle';
import React from 'react';

const index = () => {
  return (
    <S.TabBar>
      <S.TabLogo>
        <DashBoard />
        <S.LogoName>Light Switch</S.LogoName>
      </S.TabLogo>
      {/* 
      <S.TabRouteList>
        <div>
          <div>플래그</div>
          <div>계정정보</div>
        </div>
      </S.TabRouteList> 
      */}
    </S.TabBar>
  );
};

export default index;
