import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 4rem);
  padding: 2rem 0;
  box-sizing: border-box;
  overflow: hidden;
`;

export const LogInLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 560px;
  height: 100%;
  border: 2px solid gray;
  border-radius: 10px;
  margin-right: 14.5rem;
`;

export const LogInContainer = styled.div`
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

export const LogInWarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const LoginInputBox = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
  gap: 1rem;
`;

export const LogInInputWrapper = styled.div`
  display: flex;
  width: 100%;
  height: inherit;
  justify-content: center;
`;

export const LogInInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const LogInLinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
`;

export const SignUpText = styled.button`
  color: #000000;
  text-decoration: underline;
  background: none;
  border: none;
  padding-left: 5px;
  margin: 0;
  font-size: 16px;
  cursor: pointer;
`;

export const PasswordText = styled(Link)`
  color: #000000;
  text-decoration: underline;
  margin-right: 3px;
  cursor: pointer;
`;

export const SignUpButton = styled.a`
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  background-color: #1e3232;
  color: #fff;
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

export const Logo = styled.img`
  display: flex;
`;
