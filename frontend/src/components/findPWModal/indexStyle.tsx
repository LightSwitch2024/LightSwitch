import styled from 'styled-components';

interface ModalProps {
  isFindPWModal: boolean;
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

export const FindLayout = styled.div<ModalProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 100%;
  border-radius: 1.25rem;
  border: 1px solid #bdbdbd;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  padding: 2rem 2rem;
  box-sizing: border-box;
  display: ${(props) => (props.isFindPWModal ? 'block' : 'none')};
`;

export const Container = styled.div<ModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 3rem;
  gap: 1rem;
  transform: ${(props) => (props.isFindPWModal ? 'translateX(0)' : 'translateX(100%)')};
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

export const WarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const TitleText = styled.div`
  font-size: 1.3rem;
  padding-bottom: 0.6rem;
  color: #000;
  font-weight: 700;
`;

export const EmptyText = styled.div`
  width: 100%;
  height: 0.6rem;
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

export const OKButton = styled.button<{ $checkPWFlag: boolean }>`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.4rem;
  background-color: #00c9ea;
  color: #fff;
  cursor: ${({ $checkPWFlag }) => ($checkPWFlag ? 'pointer' : 'default')};
  opacity: ${({ $checkPWFlag }) => ($checkPWFlag ? '1' : '0.3')};
  pointer-events: ${({ $checkPWFlag }) => ($checkPWFlag ? 'auto' : 'none')};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

export const ConfirmButton = styled.button<{ $isAuth: boolean }>`
  width: 5rem;
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #031c58;
  color: #bdbdbd;
  cursor: pointer;
  opacity: ${({ $isAuth }) => ($isAuth ? '0.5' : '1')};
  pointer-events: ${({ $isAuth }) => ($isAuth ? 'none' : 'auto')};
`;
