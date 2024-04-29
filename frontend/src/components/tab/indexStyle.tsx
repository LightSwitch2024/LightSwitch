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
  color: #fff;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;
