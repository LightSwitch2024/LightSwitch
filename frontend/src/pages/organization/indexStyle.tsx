import styled from 'styled-components';

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
  gap: 20px;
`;

export const OrgLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 500px;
  height: 100%;
  border-radius: 1.25rem;
  border: 1px solid #bdbdbd;
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 2rem 0;
  box-sizing: border-box;
  gap: 1rem;
`;

export const LogoBox = styled.div`
  height: 13rem;
  padding: 0 2rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

export const LogoImg = styled.img`
  height: 100%;
  width: 100%;
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
  height: auto;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
  gap: 1rem;
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
  justify-content: center;
  padding: 0 2rem;
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
