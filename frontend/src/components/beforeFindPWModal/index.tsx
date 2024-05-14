import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { confirmAuthCode, sendAuthCode } from '@/api/userDetail/userAxios';
import * as S from '@/components/beforeFindPWModal/indexStyle';

type Props = {
  isbeforefindPWModal: boolean;
  onClose: () => void;
};

type ConfirmAuthCodeData = {
  email: string;
  authCode: string;
};

type SendAuthCodeData = {
  email: string;
};

type FindPWData = {
  email: string;
  authCode: string;
};

const BeforeFindPW: React.FC<Props> = ({ isbeforefindPWModal, onClose }) => {
  const navigator = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [findPWFlag, setFindPWFlag] = useState<boolean>(false);

  useEffect(() => {
    if (emailCheck && isAuth) {
      setFindPWFlag(true);
    } else {
      setFindPWFlag(false);
    }
  }, [isAuth]);

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

  const handleAuthCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAuthCode(e.target.value);
  };

  const handleSendAuthCode = (): void => {
    const sendAuthCodeData: SendAuthCodeData = {
      email: email,
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

  return (
    <S.Layout isbeforefindPWModal={isbeforefindPWModal}>
      <S.Container isbeforefindPWModal={isbeforefindPWModal}>
        <S.InputBox>
          <S.TitleText>비밀번호를 찾고자 하는 이메일 입력</S.TitleText>
          <S.Input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          {email && !emailCheck && <S.WarnText>유효하지 않은 형식입니다.</S.WarnText>}
        </S.InputBox>
        <S.InputBox>
          <S.SendMailButton onClick={handleSendAuthCode}>
            이메일 인증 키 받기
          </S.SendMailButton>
          <S.AuthConfirmWrapper>
            <S.Input
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
            <S.Text>인증되었습니다.</S.Text>
          ) : (
            <S.WarnText>인증이 필요합니다.</S.WarnText>
          )}
          <S.ButtonWrapper>
            <S.CancleButton onClick={handleCancle}>취소</S.CancleButton>
          </S.ButtonWrapper>
        </S.InputBox>
      </S.Container>
    </S.Layout>
  );
};

export default BeforeFindPW;
