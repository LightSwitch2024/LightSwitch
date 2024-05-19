import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const TabBar = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  display: flex;
  width: 12rem;
  height: 100vh;
  padding: 1.25rem;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  flex-shrink: 0;

  background: #031c5b;
`;

export const TabLogo = styled.div`
  width: 100%;
  display: flex;
  padding: 0.63rem 0.31rem;
  margin-bottom: 1.2rem;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
`;

export const LogoName = styled.div`
  display: flex;
  padding: 0.63rem 0.31rem;
  flex-direction: row;
  align-items: center;
  color: #fff;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const Button = styled.button`
  display: flex;
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 12rem;
  gap: 1rem;
`;

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 12rem;
  height: 100%;
  gap: 1rem;
`;

export const LogoutWrapper = styled.div`
  position: absolute;
  bottom: 5rem;
  display: flex;
  flex-direction: row;
  width: 12rem;
  gap: 1rem;
`;

export const OutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 12rem;
  height: 100%;
  gap: 1rem;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  gap: 0.5rem;
`;

export const JustText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  gap: 0.5rem;
`;

export const LogOutbutton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: none;
  textdecoration: none;
  cursor: pointer;
  color: white;
  gap: 0.5rem;
  background: none;
`;

export const NavLinkWrapper = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
  gap: 0.5rem;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.4rem;
`;
