import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { logIn } from '@/api/userDetail/userAxios';
// import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import LightswitchLogo from '@/assets/lightswitchLogo.png';
import FistFindPWModal from '@/components/FirstFindPWModal/index';
import SecondFindPWModal from '@/components/SecondFindPWModal/index';
// import FindPWModal from '@/components/findPWModal/index';
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
  const [isFirstFindPWModal, setIsFirstFindPWModal] = useState<boolean>(false);
  const [isSecondFindPwModal, setIsSecondFindPWModal] = useState(false);
  //화면 체크용
  // const [isFindPWModal, setIsFindPWModal] = useState<boolean>(false);

  const [auth, setAuth] = useRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const onPressSignUpButton = () => {
    setIsSignUpModal(true);
    setIsFirstFindPWModal(false);
    // setIsFindPWModal(false);
  };
  const onPressFindPWButton = () => {
    setIsSignUpModal(false);
    setIsFirstFindPWModal(true);
    // setIsFindPWModal(true);
  };

  const handlePasswordReset = async () => {
    setIsFirstFindPWModal(false);
    setIsSecondFindPWModal(false);
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

        if (orgName == 'false') {
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
      {!isSignUpModal && (
        <L.LogInLayout>
          <L.LogInContainer>
            <L.LogoBox>
              <L.LogoImg src={LightswitchLogo} alt="Lightswitch Logo" />
            </L.LogoBox>

            <L.LoginInputBox>
              <L.LogInInputWrapper>
                <L.LogInInput
                  type="text"
                  placeholder="이메일"
                  value={email}
                  onChange={handleEmail}
                />
              </L.LogInInputWrapper>
              <L.LogInInputWrapper>
                <L.LogInInput
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePassword}
                />
              </L.LogInInputWrapper>
            </L.LoginInputBox>

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
      )}
      {isSignUpModal && (
        <SignUpModal
          isSignUpModal={isSignUpModal}
          onClose={() => setIsSignUpModal(false)}
        />
      )}
      {isFirstFindPWModal && (
        <FistFindPWModal
          isFirstFindPWModal={isFirstFindPWModal}
          onClose={() => setIsFirstFindPWModal(false)}
          onOpenSecondModal={() => setIsSecondFindPWModal(true)}
        />
      )}
      {isSecondFindPwModal && (
        <SecondFindPWModal
          isSecondFindPWModal={isSecondFindPwModal}
          onClose={() => setIsSecondFindPWModal(false)}
          onPasswordResetSuccess={handlePasswordReset}
        />
      )}
    </L.Layout>
  );
};

export default LogIn;
