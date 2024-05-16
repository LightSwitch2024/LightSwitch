import Account from '@assets/account_circle.svg?react';
import DashBoard from '@assets/dashboard.svg?react';
import Log from '@assets/logout.svg?react';
import Flags from '@assets/miniflag.svg?react';
import * as S from '@components/tab/indexStyle';
import { AuthAtom } from '@global/AuthAtom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const index = () => {
  const [auth, setAuth] = useRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    setAuth(() => ({
      memberId: 0,
      email: '',
      firstName: '',
      lastName: '',
      isAuthenticated: false,
      orgName: '',
    }));
    navigate('/login');
  };

  return (
    <S.TabBar>
      <S.TabLogo>
        <S.NavLinkWrapper to="/">
          <S.LogoWrapper>
            <DashBoard />
            <S.LogoText>Light Switch</S.LogoText>
          </S.LogoWrapper>
        </S.NavLinkWrapper>
      </S.TabLogo>

      <S.ButtonWrapper>
        {auth.isAuthenticated ? (
          <>
            <S.ContentContainer>
              <S.LoginWrapper>
                <Flags />
                <S.NavLinkWrapper to="/list">Features</S.NavLinkWrapper>
              </S.LoginWrapper>
              <S.LoginWrapper>
                <Account />
                <S.NavLinkWrapper to="/mypage">사용자 계정</S.NavLinkWrapper>
              </S.LoginWrapper>
            </S.ContentContainer>

            <S.LogoutWrapper>
              <Log style={{ marginTop: '0.3rem' }} />
              <S.LogOutbutton onClick={handleLogout}>로그아웃</S.LogOutbutton>
            </S.LogoutWrapper>
          </>
        ) : (
          <S.LoginWrapper>
            <Log />
            <S.NavLinkWrapper to="/login">로그인</S.NavLinkWrapper>
          </S.LoginWrapper>
        )}
      </S.ButtonWrapper>
    </S.TabBar>
  );
};

export default index;
