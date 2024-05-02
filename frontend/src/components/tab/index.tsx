import DashBoard from '@assets/dashboard.svg?react';
import * as S from '@components/tab/indexStyle';
// import { useNavigate } from 'react-router-dom';

const index = () => {
  // const navigate = useNavigate();
  // const onClickLogIn = (): void => {
  //   navigate('/login');
  // };
  return (
    <S.TabBar>
      <S.TabLogo>
        <S.LogoButtonWrapper>
          <S.LogoWrapper>
            <DashBoard />
            <S.LogoText>Light Switch</S.LogoText>
          </S.LogoWrapper>
          <S.ButtonWrapper>
            {/* <S.LogInButton onClick={onClickLogIn}>로그인</S.LogInButton> */}
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
