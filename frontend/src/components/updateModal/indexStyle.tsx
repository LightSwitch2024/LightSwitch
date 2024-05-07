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
  background-color: #fff;

  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9375rem;
  flex-shrink: 0;
`;

export const FlagEditForm = styled.div``;
