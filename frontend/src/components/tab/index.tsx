import Account from '@assets/account_circle.svg?react';
import DashBoard from '@assets/dashboard.svg?react';
import Log from '@assets/logout.svg?react';
import Flags from '@assets/miniflag.svg?react';
import * as S from '@components/tab/indexStyle';
import { isLoggedInSelector } from '@global/AuthAtom';
import { useRecoilValue } from 'recoil';

const index = () => {
  const isLoggedIn = useRecoilValue(isLoggedInSelector);

  return (
    <S.TabBar>
      <S.TabLogo>
        <S.LogoButtonWrapper>
          <S.LogoWrapper>
            <DashBoard />
            <S.LogoText>Light Switch</S.LogoText>
          </S.LogoWrapper>
          <S.ButtonWrapper>
            <S.LoginWrapper>
              <Flags />
              <S.NavLinkWrapper to="/create">Features</S.NavLinkWrapper>
            </S.LoginWrapper>
            {isLoggedIn ? (
              <S.OutWrapper>
                <S.LoginWrapper>
                  <Account />
                  <S.NavLinkWrapper to="/mypage">사용자 계정</S.NavLinkWrapper>
                </S.LoginWrapper>
                <S.LogoutWrapper>
                  <Log />
                  <S.JustText>로그 아웃</S.JustText>
                </S.LogoutWrapper>
              </S.OutWrapper>
            ) : (
              <S.LoginWrapper>
                <Log />
                <S.NavLinkWrapper to="/login">로그인</S.NavLinkWrapper>
              </S.LoginWrapper>
            )}
          </S.ButtonWrapper>
        </S.LogoButtonWrapper>
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
