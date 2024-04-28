import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

// import { useSetRecoilState } from 'recoil';
import axios from '@/api/axios';
import { logIn } from '@/api/userDetail/userAxios';
import * as L from '@/pages/login/indexStyle';
import { AuthAtom, isLoginSelector } from '@/recoil/AuthAtom';

const LogIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const isLogIn = useRecoilValue(isLoginSelector);
  const setLogInFlag = useSetRecoilState(AuthAtom);

  function handleEmail() {
    setEmail(email);
  }

  function handlePassword() {
    setPassword(password);
  }

  const navigate = useNavigate();

  /**
     "로그인" 버튼 클릭 이벤트 핸들러
   */

  const onClickLogIn = (): void => {
    logIn(
      {
        email: email,
        password: password,
      },
      (data) => {
        console.log(data);
        setLogInFlag(true);
        navigate('/');
      },
      (err) => {
        console.log(err);
        setLogInFlag(false);
      },
    );
  };

  useEffect(() => 
  if (isLogIn) {
    return
  } else {
    navigate('/login');
  },[])
 

  return (
    <L.LogInLayout>
      <L.LogInContainer>
        <L.LogInInputBox>
          <L.LogInInput
            type="text"
            placeholder="이메일"
            value={email}
            onChange={handleEmail}
          />
          {email && <L.LogInWarnText>이메일을 입력해주세요</L.LogInWarnText>}
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
      </L.LogInContainer>
    </L.LogInLayout>
  );
};
export default LogIn;
