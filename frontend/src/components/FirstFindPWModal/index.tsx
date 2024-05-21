import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { confirmAuthCode, sendAuthCode } from '@/api/signup/signupAxios';
import * as S from '@/components/FirstFindPWModal/indexStyle';
import { AuthAtom } from '@/global/AuthAtom';
import { SendAuthCodeData, ConfirmAuthCodeData } from '@/types/User';
type Props = {
  isFirstFindPWModal: boolean;
  onClose: () => void;
  onOpenSecondModal: () => void;
};

const BeforeFindPW: React.FC<Props> = ({
  isFirstFindPWModal,
  onClose,
  onOpenSecondModal,
}) => {
  if (!isFirstFindPWModal) return null;

  const navigator = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [emailCheck, setEmailCheck] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isFindPWModal, setIsFindPWModal] = useState<boolean>(false);
  const [findPWFlag, setFindPWFlag] = useState<boolean>(false);
  const [auth, setAuth] = useRecoilState(AuthAtom);

  useEffect(() => {
    if (emailCheck && isAuth) {
      setFindPWFlag(true);
    } else {
      setFindPWFlag(false);
    }
  }, [emailCheck, isAuth]);

  useEffect(() => {
    let vh = 0;
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [window.innerHeight]);

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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
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
        setAuth((prev) => ({
          ...prev,
          email: email,
        }));
        setIsAuth(true);
        onOpenSecondModal();
        onClose();
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
    <S.BeforeLayout isbeforefindPWModal={isFirstFindPWModal}>
      <S.Container isbeforefindPWModal={isFirstFindPWModal}>
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
    </S.BeforeLayout>
  );
};

export default BeforeFindPW;
