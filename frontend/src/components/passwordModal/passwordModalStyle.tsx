import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
}

export const ModalOut = styled.div<ModalProps>`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
  position: fixed;
  top: 0;
  left: 0;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

export const Modal = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 1s ease-out;
`;

export const ModalContent = styled.div`
  // padding: 20px;
  height: 100%;
  display: flex;
  padding: 0 2rem 0 2rem;
  flex-direction: column;
`;

export const CloseButton = styled.button`
  display: flex;
  margin-left: auto;
  padding-top: 2rem;
  align-items: flex-end;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 30px;
`;

export const Input = styled.input`
  margin-tom: 200px;
  margin-bottom: 10px;
  padding: 10px;
  height: 2rem;
  font-size: 16px;
  background-color: #e3f4f6;
  border-radius: 0.5rem;
  border: none;
  outline: none;
`;

export const TitleText = styled.div`
  display: flex;
  font-size: 2rem;
  color: #000000;
  font-weight: 900;
`;

export const NText = styled.div`
  display: flex;
  font-size: 1.5rem;
  padding-bottom: 2rem;
  color: #000000;
  font-weight: 700;
`;

export const TWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px 5px 35px 10px;
`;

export const CWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px 5px 0 10px;
`;

export const BWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 70px 5px 0 10px;
`;

export const Button = styled.button`
  align-self: flex-end;
  width: 9rem;
  padding: 0.3rem 1rem;
  border-radius: 5rem;
  border: 1px solid #00c9ea;
  font-size: 1rem;
  font-weight: 500;
  background-color: #00c9ea;
  color: #000;
  cursor: pointer;
`;

export const SignUpText = styled.div`
  align-self: flex-end;
  font-size: 0.8rem;
  color: #00c9ea;
  font-weight: 500;
`;

export const SignUpWarnText = styled.div`
  align-self: flex-end;
  font-size: 0.8rem;
  color: red;
  font-weight: 500;
`;
