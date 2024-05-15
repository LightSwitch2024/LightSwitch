import styled from 'styled-components';

interface ModalProps {
  isbeforefindPWModal: boolean;
}

export const LayOut = styled.div`
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

export const BeforeLayout = styled.div<ModalProps>`
  display: flex;
  width: 500px;
  height: 100%;
  border-radius: 1.25rem;
  border: 1px solid #bdbdbd;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  padding: 2rem 2rem;
  box-sizing: border-box;
  display: ${(props) => (props.isbeforefindPWModal ? 'block' : 'none')};
`;

export const Container = styled.div<ModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 3rem;
  gap: 1rem;
  transform: ${(props) =>
    props.isbeforefindPWModal ? 'translateX(0)' : 'translateX(100%)'};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const Text = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: #00c9ea;
  font-weight: 500;
`;

export const TitleText = styled.div`
  font-size: 1.3rem;
  padding-bottom: 0.6rem;
  color: #000;
  font-weight: 700;
`;

export const WarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const InputBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const CancleButton = styled.button`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 1rem;
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
  gap: 0.5rem;
`;

export const ConfirmButton = styled.button<{ $isAuth: boolean }>`
  width: 5rem;
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #031c58;
  color: #bdbdbd;
  cursor: ${({ $isAuth }) => ($isAuth ? 'default' : 'pointer')};
  opacity: ${({ $isAuth }) => ($isAuth ? '0.5' : '1')};
  pointer-events: ${({ $isAuth }) => ($isAuth ? 'none' : 'auto')};
`;
