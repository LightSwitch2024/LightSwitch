import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { signUp } from '@/api/userDetail/userAxios';
import * as S from '@/components/signup/indexStyle';

type Props = {
  isSignUpModal: boolean;
  onClose: () => void;
};

type SignUpData = {
  firstName: string;
  lastName: string;
  telNumber: string;
  email: string;
  password: string;
};

const SignUp: React.FC<Props> = ({ isSignUpModal, onClose }) => {
  const navigator = useNavigate();

  const [firstName, setFirstName] = useState<string>('');
  const [firstNameCheck, setFirstNameCheck] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>('');
  const [lastNameCheck, setLastNameCheck] = useState<boolean>(false);
  const [telNumber, settelNumber] = useState<string>('');
  const [telNumberCheck, settelNumberCheck] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [rePassword, setRePassword] = useState<string>('');
  const [signUpFlag, setSignUpFlag] = useState<boolean>(true);

  const validateHangle = (hangle: string): boolean => {
    const hangle_regex = /^[가-힣]+$/g;
    if (!hangle_regex.test(hangle)) {
      return false;
    } else {
      return true;
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(e.target.value);
    setFirstNameCheck(validateHangle(e.target.value));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(e.target.value);
    setLastNameCheck(validateHangle(e.target.value));
  };

  const validatetelNumber = (telNumber: string): boolean => {
    const phone_regex = /^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}$/;
    if (!phone_regex.test(telNumber)) {
      return false;
    } else {
      return true;
    }
  };

  const handletelNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    settelNumber(e.target.value);
    settelNumberCheck(validatetelNumber(e.target.value));
  };

  const validateEmail = (email: string): boolean => {
    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (!email_regex.test(email)) {
      return false;
    } else {
      return true;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setEmailCheck(validateEmail(e.target.value));
  };

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
    };

    signUp<SignUpData>(
      signUpData,
      () => {
        alert('회원가입이 완료되었습니다.');
        navigator('/');
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
      password === rePassword
    ) {
      setSignUpFlag(true);
    } else {
      setSignUpFlag(false);
    }
  }, [
    firstNameCheck,
    lastNameCheck,
    telNumberCheck,
    emailCheck,
    passwordCheck,
    rePassword,
  ]);

  return (
    <S.Layout>
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

          <S.ButtonWrapper>
            <S.CancleButton onClick={handleCancle}>취소</S.CancleButton>
            <S.OKButton $signUpFlag={signUpFlag} onClick={handleSignUp}>
              회원가입
            </S.OKButton>
          </S.ButtonWrapper>
        </S.SignUpContainer>
      </S.SignUpLayout>
    </S.Layout>
  );
};

export default SignUp;
