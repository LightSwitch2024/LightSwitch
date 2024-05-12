import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Layout = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 60px);
  display: flex;

  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;

export const LogInLayout = styled.div`
  width: 560px;
  margin-top: 5rem;
  border: 2px solid gray;
  border-radius: 10px;
  padding: 2rem;
  height: auto;
`;

export const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 2.5rem 0 2.5rem 0;
  gap: 1rem;
`;

export const LogInInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  &::placeholder {
    color: #bdbdbd;
  }
`;

export const LogInWarnText = styled.div`
  align-self: flex-end;
  font-size: 0.6rem;
  color: red;
  font-weight: 500;
`;

export const LogInInputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

export const LogInLinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 3rem 0;
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