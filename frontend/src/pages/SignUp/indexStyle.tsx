import styled from 'styled-components';

export const SignUpLayout = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
`;

export const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 3rem;
  gap: 1rem;
`;

export const SignUpInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const SignUpText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: #00c9ea;
  font-weight: 500;
`;

export const SignUpInputBox = styled.div`
  display: flex;
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

export const OKButton = styled.button<{ $isAuth: boolean }>`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.4rem;
  background-color: #00c9ea;
  color: #fff;
  cursor: pointer;
  opacity: ${({ $isAuth }) => ($isAuth ? '1' : '0.5')};
  pointer-events: ${({ $isAuth }) => ($isAuth ? 'auto' : 'none')};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

export const SendMailButton = styled.button`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const AuthConfirmWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

export const ConfirmButton = styled.button<{ $isAuth: boolean }>`
  width: 4.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #031c58;
  color: #bdbdbd;
  cursor: pointer;
  opacity: ${({ $isAuth }) => ($isAuth ? '0.5' : '1')};
  pointer-events: ${({ $isAuth }) => ($isAuth ? 'none' : 'auto')};
`;
