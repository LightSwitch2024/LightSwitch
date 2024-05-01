import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { logIn } from '@/api/userDetail/userAxios';
import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import { AuthAtom } from '@/AuthAtom';
import * as L from '@/pages/user/loginStyle';

const LogIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const setAuthState = useSetRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onClickSignUp = (): void => {
    navigate('/signup');
  };

  const onClickLogIn = (): void => {
    logIn(
      {
        email: email,
        password: password,
      },
      () => {
        setAuthState({
          isAuthenticated: true,
          email: email,
          password: password,
        });
        navigate('/mypage');
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <L.LogInLayout>
      <L.LogInContainer>
        <LightswitchLogo />
        <L.LogInInputBox>
          <L.LogInInput
            type="text"
            placeholder="이메일"
            value={email}
            onChange={handleEmail}
          />
        </L.LogInInputBox>
        <L.LogInInputBox>
          <L.LogInInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePassword}
          />
        </L.LogInInputBox>
        <L.ButtonWrapper>
          <L.OKButton onClick={onClickLogIn}>로그인</L.OKButton>
        </L.ButtonWrapper>
        <L.LogInLinkBox>
          <L.SignUpText to="/signup">회원가입</L.SignUpText>
          <L.PasswordText to="/passwordfind">비밀번호 찾기</L.PasswordText>
        </L.LogInLinkBox>
      </L.LogInContainer>
    </L.LogInLayout>
  );
};
export default LogIn;
