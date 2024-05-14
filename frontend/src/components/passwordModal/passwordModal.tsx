import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { updatePassword } from '@/api/userDetail/userAxios';
import { AuthAtom } from '@/global/AuthAtom';

import * as P from './passwordModalStyle';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
}

interface PWData {
  email: string;
  newPassword: string;
}

const PasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const auth = useRecoilValue(AuthAtom);
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
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

  const handleSubmit = () => {
    if (password === confirmPassword) {
      const passwordData = {
        email: auth.email,
        newPassword: password,
      };
      updatePassword<PWData>(
        auth.email,
        passwordData,
        (data) => {
          console.log('Password update successful:', data);
          alert('비밀번호 변경 성공!');
        },
        (err) => {
          console.log(err);
        },
      );
      onClose();
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <P.ModalOut isOpen={isOpen}>
      <P.Modal isOpen={isOpen}>
        <P.ModalContent>
          <P.CloseButton onClick={handleClose}>×</P.CloseButton>
          <P.TWrapper>
            <P.TitleText>비밀번호 수정</P.TitleText>
          </P.TWrapper>
          <P.CWrapper>
            <P.NText>새 비밀번호</P.NText>
            <P.Input
              type="password"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePasswordChange(e)
              }
            />
            {passwordCheck ? (
              <P.SignUpText>안전한 비밀번호 입니다.</P.SignUpText>
            ) : (
              <P.SignUpWarnText>
                8~15자의 영문 대소문자, 숫자, 특수문자를 사용하세요.
              </P.SignUpWarnText>
            )}
          </P.CWrapper>
          <P.CWrapper>
            <P.NText>새 비밀번호 확인</P.NText>
            <P.Input
              type="password"
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleConfirmPasswordChange(e)
              }
            />
            {confirmPassword &&
              (password !== confirmPassword ? (
                <P.SignUpWarnText>비밀번호가 일치하지 않습니다.</P.SignUpWarnText>
              ) : (
                <P.SignUpText>비밀번호가 일치합니다.</P.SignUpText>
              ))}
          </P.CWrapper>
          <P.BWrapper>
            <P.Button onClick={handleSubmit}>수정하기</P.Button>
          </P.BWrapper>
        </P.ModalContent>
      </P.Modal>
    </P.ModalOut>
  );
};

export default PasswordModal;
