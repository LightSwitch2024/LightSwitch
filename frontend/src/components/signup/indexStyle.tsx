import styled from 'styled-components';

interface ModalProps {
  isSignUpModal: boolean;
}

export const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 4rem);
  padding: 1rem 0;
  margin-right: 14.5rem;
  box-sizing: border-box;
  overflow: hidden;
`;

export const SignUpLayout = styled.div<ModalProps>`
  display: flex;
  width: 500px;
  height: 100%;
  border-radius: 1.25rem;
  border: 1px solid #bdbdbd;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  padding: 2rem 2rem;
  box-sizing: border-box;
  display: ${(props) => (props.isSignUpModal ? 'block' : 'none')};
`;

export const SignUpContainer = styled.div<ModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 0.3rem;
  transform: ${(props) => (props.isSignUpModal ? 'translateX(0)' : 'translateX(100%)')};
`;

export const SignUpInput = styled.input`
  width: 100%;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const SignUpText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: #00c9ea;
  font-weight: 500;
  line-height: 0.6rem;
`;

export const SignUpWarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
  line-height: 0.6rem;
`;

export const SignUpEmptyText = styled.div`
  width: 100%;
  height: 0.6rem;
`;

export const SignUpInputBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const SignUpInputWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const CancleButton = styled.button`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const OKButton = styled.button<{ $signUpFlag: boolean }>`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.25rem;
  background-color: #00c9ea;
  color: #fff;
  cursor: pointer;
  opacity: ${({ $signUpFlag }) => ($signUpFlag ? '1' : '0.3')};
  pointer-events: ${({ $signUpFlag }) => ($signUpFlag ? 'auto' : 'none')};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;

export const SendMailButton = styled.button`
  width: 100%;
  padding: 0.3rem 0;
  // padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const AuthConfirmWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
`;

export const ConfirmButton = styled.button<{ $isAuth: boolean }>`
  width: 5rem;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #031c58;
  color: #bdbdbd;
  cursor: pointer;
  opacity: ${({ $isAuth }) => ($isAuth ? '0.5' : '1')};
  pointer-events: ${({ $isAuth }) => ($isAuth ? 'none' : 'auto')};
`;
