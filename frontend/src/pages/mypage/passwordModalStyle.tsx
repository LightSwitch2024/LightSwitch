import styled from 'styled-components';

// 모달 컨테이너 스타일
export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 20rem;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
`;

// 모달 콘텐츠 스타일
export const ModalContent = styled.div`
  padding: 1rem;
`;

// 닫기 버튼 스타일
export const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;
