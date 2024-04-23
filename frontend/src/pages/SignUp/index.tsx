import { useState } from 'react';

import { instance } from '../../api/instance';
import * as S from './indexStyle';

type SendAuthCodeData = {
  email: string;
};

type ConfirmAuthCodeData = {
  email: string;
  authCode: string;
};

type SignUpData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [authCode, setAuthCode] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(e.target.value);
    console.log(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(e.target.value);
    console.log(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPhoneNumber(e.target.value);
    console.log(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    console.log(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    console.log(e.target.value);
  };

  const handlePasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPasswordCheck(e.target.value);
    console.log(e.target.value);
  };

  const handleAuthCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAuthCode(e.target.value);
    console.log(e.target.value);
  };

  const handleRecvAuthCode = (): void => {
    const sendAuthCodeData: SendAuthCodeData = {
      email: email,
    };

    instance
      .post('/mails/send', sendAuthCodeData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmAuthCode = (): void => {
    const confirmAuthCodeData: ConfirmAuthCodeData = {
      email: email,
      authCode: authCode,
    };

    instance
      .post('/mails/confirm', confirmAuthCodeData)
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          setIsAuth(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignUp = (): void => {
    if (
      firstName === '' ||
      lastName === '' ||
      phoneNumber === '' ||
      email === '' ||
      password === '' ||
      passwordCheck === '' ||
      !isAuth
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const signUpData: SignUpData = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
    };

    instance
      .post('/users', signUpData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <S.SignUpLayout>
      <S.SignUpContainer>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="이름(First name)"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <S.SignUpInput
            type="text"
            placeholder="성(Last name)"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="전화번호"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <S.SignUpText>유효하지 않은 형식입니다.</S.SignUpText>
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          <S.SignUpText>유효하지 않은 형식입니다.</S.SignUpText>
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          <S.SignUpInput
            type="password"
            placeholder="비밀번호 확인"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
          />
          <S.SignUpText>비밀번호가 일치하지 않습니다.</S.SignUpText>
        </S.SignUpInputBox>
        <S.SendMailButton onClick={handleRecvAuthCode}>
          이메일 인증 키 받기
        </S.SendMailButton>
        <S.AuthConfirmWrapper>
          <S.SignUpInput
            type="text"
            placeholder="인증 키"
            style={{ flexGrow: '1' }}
            value={authCode}
            onChange={handleAuthCode}
            disabled={isAuth}
          />
          <S.ConfirmButton onClick={handleConfirmAuthCode} $isAuth={isAuth}>
            확인
          </S.ConfirmButton>
        </S.AuthConfirmWrapper>
        {isAuth ? (
          <S.SignUpText>인증되었습니다.</S.SignUpText>
        ) : (
          <S.SignUpText>존재하지 않는 키입니다.</S.SignUpText>
        )}
        <S.ButtonWrapper>
          <S.CancleButton>취소</S.CancleButton>
          <S.OKButton $isAuth={isAuth} onClick={handleSignUp}>
            회원가입
          </S.OKButton>
        </S.ButtonWrapper>
      </S.SignUpContainer>
    </S.SignUpLayout>
  );
};

export default SignUp;
