import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { logIn } from '@/api/userDetail/userAxios';
import LightswitchLogo from '@/assets/lightswitchLogo.svg?react';
import SignUpModal from '@/components/signup/index';
import { AuthAtom } from '@/global/AuthAtom';
import * as L from '@/pages/organization/indexStyle';

interface MemberInfo {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
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
    console.log('hello');
  }, [auth]);

  const onClickLogIn = (): void => {
    logIn<MemberInfo>(
      {
        email: email,
        password: password,
      },
      (data) => {
        const memId = Number(data.memberId);
        const memEmail = data.email;
        const memFirstname = data.firstName;
        const memLastname = data.lastName;
        setAuth(() => ({
          memberId: memId,
          email: memEmail,
          firstName: memFirstname,
          lastName: memLastname,
          isAuthenticated: true,
        }));
        navigate('/');
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
          <L.TextBox>
            <L.TitleText>회사 이름을 입력해주세요</L.TitleText>
          </L.TextBox>
          <L.LogInInput
            type="text"
            placeholder="회사명"
            value={password}
            onChange={handlePassword}
          />
          <L.ButtonWrapper>
            <L.OKButton onClick={onClickLogIn}>생성</L.OKButton>
          </L.ButtonWrapper>
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
