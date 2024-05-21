import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { checkPassword, deleteUser } from '@/api/userDetail/userAxios';
import { AuthAtom } from '@/global/AuthAtom';

import * as P from './deleteModalStyle';

import { DeleteUserData } from '@/types/User';

type Props = {
  isDeleteModal: boolean;
  onClose: () => void;
};

const PasswordModal: React.FC<Props> = ({ isDeleteModal, onClose }) => {
  const auth = useRecoilValue(AuthAtom);
  const [password, setInputPassword] = useState<string>('');

  const handleClose = () => {
    onClose();
  };

  const handleInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  const handleDelete = async (password: string) => {
    const [isDelOK, setisDelOK] = useState<boolean>(false);
    try {
      await checkPassword<DeleteUserData>(
        auth.memberId,
        {
          memberId: Number(auth.memberId),
          password: password,
        },
        (data) => {
          console.log(data);
          setisDelOK(true);
        },
        (err) => {
          console.log(err);
          setisDelOK(false);
        },
      );

      if (isDelOK) {
        console.log('Password verification successful.');

        await deleteUser<DeleteUserData>(
          auth.memberId,
          (data) => {
            console.log(data);
          },
          (err) => {
            console.log(err);
          },
        );
      } else {
        console.log('Password verification failed.');
        alert('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('An error occurred:', err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <P.ModalOut isOpen={isDeleteModal}>
      <P.Modal isOpen={isDeleteModal}>
        <P.ModalContent>
          <P.CloseButton onClick={handleClose}>X</P.CloseButton>
          <P.TWrapper>
            <P.TitleText>정말 삭제하시겠습니까?</P.TitleText>
          </P.TWrapper>
          <P.CWrapper>
            <P.NText>계정은 영구적으로 삭제되며, 복구할 수 없습니다.</P.NText>
            <P.NText>정말 삭제하시려면 비밀번호를 입력해주세요.</P.NText>
          </P.CWrapper>
          <P.PasswordInputBox
            type="text"
            value={password}
            onChange={handleInputPassword}
          />
          <P.BWrapper>
            <P.Button onClick={() => handleDelete(password)}>삭제하기</P.Button>
          </P.BWrapper>
        </P.ModalContent>
      </P.Modal>
    </P.ModalOut>
  );
};

export default PasswordModal;
