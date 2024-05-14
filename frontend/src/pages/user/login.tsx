import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { logIn } from '@/api/userDetail/userAxios';
// import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import logo from '@/assets/removebg.png';
import BeforeFindPWModal from '@/components/beforeFindPWModal/index';
import SignUpModal from '@/components/signup/index';
import { AuthAtom } from '@/global/AuthAtom';
import * as L from '@/pages/user/loginStyle';

interface MemberInfo {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
  orgName: string | '';
}

const LogIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);
  const [isbeforefindPWModal, setIsbeforefindPWModal] = useState<boolean>(false);

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

  const onPressFindPWButton = (): void => {
    setIsbeforefindPWModal(true);
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
        const { memberId, email, firstName, lastName, telNumber, orgName } = data;
        setAuth(() => ({
          memberId,
          email,
          firstName,
          lastName,
          isAuthenticated: true,
          orgName: orgName || '',
        }));

        if (orgName == 'False') {
          navigate('/fillorg');
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
          {/* <LightswitchLogo /> */}
          <img src={logo} alt="logo" />
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
            <L.SignUpButton onClick={onPressSignUpButton}>회원가입</L.SignUpButton>
            <L.PasswordButton onClick={onPressFindPWButton}>
              비밀번호 찾기
            </L.PasswordButton>
          </L.LogInLinkBox>
        </L.LogInContainer>
      </L.LogInLayout>
      <SignUpModal
        isSignUpModal={isSignUpModal}
        onClose={() => setIsSignUpModal(false)}
      />
      <BeforeFindPWModal
        isbeforefindPWModal={isbeforefindPWModal}
        onClose={() => setIsbeforefindPWModal(false)}
      />
    </L.Layout>
  );
};

export default LogIn;
