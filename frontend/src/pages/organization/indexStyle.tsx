import styled from 'styled-components';

export const Layout = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
  display: flex;

  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

export const OrgLayout = styled.div`
  width: 560px;
  margin-top: 5rem;
  border: 2px solid gray;
  border-radius: 10px;
  padding: 2rem;
  height: auto;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 0 2.5rem 0;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 1rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const WarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const LinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 3rem 0;
`;

export const TitleText = styled.div`
  color: #000000;
  background: none;
  border: none;
  padding-left: 5px;
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  cursor: pointer;
`;

export const OKButton = styled.button`
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
  margin: 5rem 0 5rem 0;
  gap: 1rem;
`;

export const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const Logo = styled.img`
  display: flex;
`;

export const TextBox = styled.div`
  display: flex;
  font-size: 1rem;
  font-weight: 800;
  margin: 2rem 0;
  gap: 1rem;
`;
