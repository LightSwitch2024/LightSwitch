import styled from 'styled-components';

export const MyPageLayout = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
`;

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 3rem;
  gap: 1rem;
`;

export const MyPageInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const MyPageText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: #00c9ea;
  font-weight: 500;
`;

export const TitleText = styled.div`
  align-self: flex-end;
  font-size: 2rem;
  color: #000000;
  font-weight: 500;
`;

export const MyPageWarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const MyPageInputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const PasswordButton = styled.button`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const UpdateButton = styled.button`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.4rem;
  background-color: #00c9ea;
  color: #fff;
  cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;
