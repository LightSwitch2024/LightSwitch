import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { findPW } from '@/api/userDetail/userAxios';
import * as S from '@/components/beforeFindPWModal/indexStyle';

type Props = {
  isfindPWModal: boolean;
  onClose: () => void;
};

type FindPWData = {
  password: string;
};

const FindPW: React.FC<Props> = ({ isfindPWModal, onClose }) => {
  const navigator = useNavigate();

  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [rePassword, setRePassword] = useState<string>('');
  const [rePasswordCheck, setRePasswordCheck] = useState<boolean>(false);

  const validatePassword = (password: string): boolean => {
    const password_regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    if (!password_regex.test(password)) {
      return false;
    } else {
      return true;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setPasswordCheck(validatePassword(e.target.value));
  };

  const handlRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRePassword(e.target.value);
  };


    sendAuthCode<SendAuthCodeData>(
      sendAuthCodeData,
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const handleConfirmAuthCode = (): void => {
    const confirmAuthCodeData: ConfirmAuthCodeData = {
      email: email,
      authCode: authCode,
    };

    confirmAuthCode<boolean>(
      confirmAuthCodeData,
      () => {
        setIsAuth(true);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const handleCancle = (): void => {
    onClose();
  };

  const handleSignUp = (): void => {
    if (!signUpFlag) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const signUpData: SignUpData = {
      firstName: firstName,
      lastName: lastName,
      telNumber: telNumber,
      email: email,
      password: password,
      authCode: authCode,
    };

    signUp<SignUpData>(
      signUpData,
      () => {
        alert('회원가입이 완료되었습니다.');
        navigator('/login');
      },
      (err) => {
        console.log(err);
      },
    );
  };

  useEffect(() => {
    if (
      firstNameCheck &&
      lastNameCheck &&
      telNumberCheck &&
      emailCheck &&
      passwordCheck &&
      password === rePassword &&
      isAuth
    ) {
      setSignUpFlag(true);
    } else {
      setSignUpFlag(false);
    }
  }, [firstNameCheck, lastNameCheck, telNumberCheck, emailCheck, passwordCheck, isAuth]);

  return (
    <S.SignUpLayout isSignUpModal={isSignUpModal}>
      <S.SignUpContainer isSignUpModal={isSignUpModal}>
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
          {firstName && lastName && (!firstNameCheck || !lastNameCheck) && (
            <S.SignUpWarnText>유효하지 않은 형식입니다.</S.SignUpWarnText>
          )}
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="회사명"
            value={orgName}
            onChange={handleorgNameChange}
          />
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="전화번호"
            value={telNumber}
            onChange={handletelNumberChange}
          />
          {telNumber && !telNumberCheck && (
            <S.SignUpWarnText>유효하지 않은 형식입니다.</S.SignUpWarnText>
          )}
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="text"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          {email && !emailCheck && (
            <S.SignUpWarnText>유효하지 않은 형식입니다.</S.SignUpWarnText>
          )}
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SignUpInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordCheck ? (
            <S.SignUpText>안전한 비밀번호 입니다.</S.SignUpText>
          ) : (
            <S.SignUpWarnText>
              8~15자의 영문 대소문자, 숫자, 특수문자를 사용하세요.
            </S.SignUpWarnText>
          )}
          <S.SignUpInput
            type="password"
            placeholder="비밀번호 확인"
            value={rePassword}
            onChange={handlRePasswordChange}
            disabled={!passwordCheck}
          />
          {rePassword &&
            (password !== rePassword ? (
              <S.SignUpWarnText>비밀번호가 일치하지 않습니다.</S.SignUpWarnText>
            ) : (
              <S.SignUpText>비밀번호가 일치합니다.</S.SignUpText>
            ))}
        </S.SignUpInputBox>
        <S.SignUpInputBox>
          <S.SendMailButton onClick={handleSendAuthCode}>
            이메일 인증 키 받기
          </S.SendMailButton>
          <S.AuthConfirmWrapper>
            <S.SignUpInput
              type="text"
              placeholder="인증 키"
              style={{ width: '100%' }}
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
            <S.SignUpWarnText>인증이 필요합니다.</S.SignUpWarnText>
          )}
          <S.ButtonWrapper>
            <S.CancleButton onClick={handleCancle}>취소</S.CancleButton>
            <S.OKButton $signUpFlag={signUpFlag} onClick={handleSignUp}>
              회원가입
            </S.OKButton>
          </S.ButtonWrapper>
        </S.SignUpInputBox>
      </S.SignUpContainer>
    </S.SignUpLayout>
  );
};

export default FindPW;
