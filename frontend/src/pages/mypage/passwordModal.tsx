import React, { useState } from 'react';

import * as P from './passwordModalStyle';

const PasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false); // 모달 열림 상태 관리

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordChange = () => {
    // 비밀번호 수정 로직 구현
    console.log('새 비밀번호:', newPassword);
    console.log('새 비밀번호 확인:', confirmPassword);
  };

  return (
    <>
      <button onClick={handleOpenModal}>비밀번호 수정</button>
      <P.ModalContainer isOpen={isOpen}>
        <P.ModalContent>
          <P.CloseButton onClick={handleCloseModal}>X</P.CloseButton>
          <h2>비밀번호 수정</h2>
          <div>
            <label htmlFor="newPassword">새 비밀번호:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">새 비밀번호 확인:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button onClick={handlePasswordChange}>비밀번호 수정</button>
        </P.ModalContent>
      </P.ModalContainer>
    </>
  );
};

export default PasswordModal;
