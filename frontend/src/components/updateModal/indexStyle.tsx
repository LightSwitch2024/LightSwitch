import styled from 'styled-components';

export const ModalBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
`;

export const DetailLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalInputForm = styled.div`
  width: 60%;
  height: 90%;

  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
`;

export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  align-self: stretch;
`;

export const TabElementContainer = styled.div<{ $select: boolean }>`
  display: flex;
  width: 10.625rem;
  // height: 5rem;
  padding: 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.625rem 0.625rem 0rem 0rem;
  ${(props) =>
    props.$select
      ? `
  background: #031c5b;
  `
      : `
  border-top: 1px solid rgba(0, 0, 0, 0.50);
  border-right: 1px solid rgba(0, 0, 0, 0.50);
  border-left: 1px solid rgba(0, 0, 0, 0.50);
  background: #FFF;
  `}
`;

export const TabElementText = styled.div<{ $select: boolean }>`
  text-align: center;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  ${(props) =>
    props.$select
      ? `
  color: #fff;
  `
      : `
  color: #7F7F7F;
  `}
`;

export const FlagEditForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
  padding: 2.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;

  border-radius: 0rem 0.625rem 0.625rem 0.625rem;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const WarnText = styled.div`
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: #ff0000;
`;
