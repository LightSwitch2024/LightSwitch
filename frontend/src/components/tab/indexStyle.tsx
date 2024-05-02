import styled from 'styled-components';

export const TabBar = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  display: flex;
  width: 12rem;
  height: 100%;
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

export const LogInButton = styled.button`
  display: flex;
  width: 100%;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.4rem;
  background-color: #1e3232;
  color: #fff;
  cursor: pointer;
`;

export const LogOutButton = styled.button`
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
  justify-content: center;
  align-items: center;
  margin: 5rem 0 5rem 0;
  gap: 1rem;
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 12rem;
  height: 100%;
  gap: 1rem;
`;

export const LogoButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5rem 0 5rem 0;
  gap: 5rem;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  gap: 0.5rem;
`;
