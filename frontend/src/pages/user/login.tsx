import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { logIn } from '@/api/userDetail/userAxios';
import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import SignUpModal from '@/components/signup/index';
import { AuthAtom } from '@/global/AuthAtom';
import * as L from '@/pages/user/loginStyle';

interface MemberInfo {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
  organization: string | '';
}

const LogIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const [auth, setAuth] = useRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onPressSignUpButton = (): void => {
    setIsSignUpModal(true);
  };

  useEffect(() => {
    console.log(auth);
  }, [auth]);

  useEffect(() => {
    let vh = 0;
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [window.innerHeight]);

  const onClickLogIn = (): void => {
    console.log('Logging in with:', email, password);
    logIn<MemberInfo>(
      {
        email: email,
        password: password,
      },
      (data) => {
        console.log(data);
        const { memberId, email, firstName, lastName, telNumber, organization } = data;
        setAuth(() => ({
          memberId,
          email,
          firstName,
          lastName,
          isAuthenticated: true,
          organization: organization || '',
        }));
        if (organization == null) {
          navigate('/fillOrg');
        } else {
          navigate('/');
        }
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <L.Layout>
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
            <L.SignUpText onClick={onPressSignUpButton}>회원가입</L.SignUpText>
            <L.PasswordText to="/passwordfind">비밀번호 찾기</L.PasswordText>
          </L.LogInLinkBox>
        </L.LogInContainer>
      </L.LogInLayout>
      <SignUpModal
        isSignUpModal={isSignUpModal}
        onClose={() => setIsSignUpModal(false)}
      />
    </L.Layout>
  );
};
export default LogIn;
