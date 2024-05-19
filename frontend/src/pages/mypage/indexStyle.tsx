import styled from 'styled-components';

export const MyPageLayout = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
`;

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 3rem 20rem 0;
  padding-bottom: 4rem;
  gap: 1rem;
`;

export const MyPageMemberDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0.5rem;
  margin: 0 3rem;
  background-color: #f5f6f7;
  padding: 2rem 3rem 2rem 2rem;
  gap: 1rem;
`;

export const MyPageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 3rem;
  padding: 1rem 3rem 1rem 4rem;
  gap: 1rem;
`;

export const TitleText = styled.div`
  display: flex;
  font-size: 2rem;
  color: #000000;
  font-weight: 900;
  margin-left: -4rem;
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
  font-size: 1.4rem;
  color: #000000;
  font-weight: bold;
`;

export const MyPageHeader = styled.div`
  height: 1.2rem;
  display: flex;
  flex-direction: row;
`;

export const EmailText = styled.div`
  margin: 0.75rem 0;
  font-size: 1.25rem;
  color: #042781;
  font-weight: 500;
`;

export const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.2rem 0.2rem 0.2rem 0;
  margin-top: 2rem;
  margin-bottom: 0.1rem;
  gap: 0.5rem;
`;

export const TelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.2rem 10rem 0.2rem 0;
  margin-bottom: 4rem;
  gap: 0.5rem;
`;

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: start;
  gap: 3rem;
`;

export const NWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 5rem 0 0;
  margin-left: 1rem;
  gap: 0.5rem;
`;

export const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 0.2rem 2.5rem 0.2rem 0;
  gap: 0.5rem;
`;

export const NameBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // margin-bottom: 2rem;
  padding: 0.2rem 2.5rem 0.2rem 0;
  gap: 0.5rem;
`;

export const TelBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5rem 0.2rem 0;
  gap: 0.5rem;
`;

export const NameInputBox = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const TelInputBox = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.1rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const ButtonWrapper = styled.div`
  margin: 1.5rem 3rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const Button = styled.button`
  width: 10rem;
  padding: 0.3rem 1rem;
  border-radius: 7rem;
  font-size: 1rem;
  font-weight: 500;
  border: 0;
  background-color: #4963a7;
  color: #fff;
  cursor: pointer;
`;

export const DelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 3rem 0 3rem;
  padding: 1rem 3rem 0 0;
  gap: 1rem;
`;

export const DelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

export const DelText = styled.div`
  display: flex;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #000000;
  font-weight: 400;
`;

export const Text = styled.div`
  font-size: 1rem;
  color: #000000;
  margin-top: 0.5rem;
  margin-right: 10rem;
  font-weight: 400;
`;

export const DelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12rem;

  border-radius: 7rem;
  border: 1px solid #e8d4d4;
  font-size: 1rem;
  font-weight: 600;
  background-color: #ffe0de;
  color: #000;
  cursor: pointer;
  & > svg {
    width: 1.2rem;
    fill: #000;
    margin-right: 0.5rem;
    margin-top: 0.1rem;
  }
`;

export const CloseButton = styled.button`
  display: flex;
  margin-left: auto;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 30px;
`;

export const WarnText = styled.div`
  font-size: 0.6rem;
  margin-top: 2.5rem;
  padding-right: 2.5rem;
  color: red;
  font-weight: 500;
`;
