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
  gap: 0.5rem;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  width: -webkit-fill-available;
  padding: 2.5rem;
  flex-direction: column;
  justify-content: space-between;
  // align-items: center;
  flex: 1 0 0;

  border-radius: 0rem 0.625rem 0.625rem 0.625rem;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.325rem 0;
  margin: 0.5rem 2rem;
  gap: 0.525rem;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.325rem 0;
  margin: 0 2rem;
  gap: 0.625rem;
`;

export const Layer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.325rem 0;
  gap: 0.625rem;
`;
export const KeywordHeadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1.3rem 0;
  justify-content: space-between;
`;

export const IconContainer = styled.div`
  display: flex;
  gap: 0.625rem;
  > svg {
    margin-top: 1.2rem;
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px 0 2px 0;
  gap: 0.625rem;
`;

export const KeywordTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  gap: 0.625rem;
`;

export const PropertyIndexTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.7rem;
`;

export const VarContainer = styled.div`
  display: flex;
  width: 48%;
  flex-direction: row;
  gap: 0.125rem;
`;
export const VarDefinitionContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 0.125rem;
`;

export const VarHorizon = styled.div`
  display: flex;
  // width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

export const VarVertical = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  gap: 0.625rem;
`;

export const Input = styled.input<{ $flag: boolean }>`
  padding: 8px;
  width: 100%;
  height: 2.5rem;
  border-radius: 6px;
  border: 2px ${({ $flag }) => ($flag ? '1px solid #545454' : ' solid #d4d4d4')};

  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  // transition: border-color 0.3s, background-color 0.3s; /* 색상 변경 시 애니메이션 효과 */
  // &:hover,
  // &:focus {
  //   border-color: darkblue;

  ${(props) =>
    props.$flag &&
    `
    border: 2px solid #545454
    pointer-events: none;
  `}
`;

export const LabelText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const KeywordText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const PropertyIndexText = styled.div`
  display: flex;
  width: 20rem;
  margin: 0.3rem 0;
  color: #000;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const VarText = styled.div`
  display: flex;
  width: 4rem;
  color: #000;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const TextArea = styled.textarea<{ $flag: boolean }>`
  padding: 8px 0x;
  width: 100%;
  height: 7rem;
  border-radius: 6px;
  border: 2px ${({ $flag }) => ($flag ? '1px solid #545454' : ' solid #d4d4d4')};

  font-size: 1.5rem;
  font-style: normal;
  font-family: 'Pretendard-Regular';
  font-weight: 400;
  line-height: normal;

  // transition: border-color 0.3s, background-color 0.3s; /* 색상 변경 시 애니메이션 효과 */
  // &:hover,
  // &:focus {
  //   border-color: darkblue;

  ${(props) =>
    props.$flag &&
    `
    border: 2px solid #545454
    pointer-events: none;
  `}
`;

export const ButtonLayer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8125rem;
  flex: 1 0 0;
  align-self: stretch;
  padding: 0.5rem 0 0.5rem 0;
`;

export const HorizonButtonLayer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.8125rem;
  flex: 1 0 0;
  align-self: stretch;
  padding-top: 0.25rem;
`;

export const BottomButtonLayer = styled.div`
  display: flex;
  padding: 5rem 0 0.75rem 0;
  justify-content: flex-end;
  align-items: center;
  gap: 0.8125rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const CancelButton = styled.button`
  display: flex;
  padding: 1.0625rem 1.5625rem;

  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border-radius: 0.625rem;
  background: #f5f6f7;

  color: rgba(0, 0, 0, 0.87);
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; /* 100% */

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    background: #f5f6f7;
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  padding: 1.0625rem 1.5625rem;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border-radius: 0.625rem;
  background: #031c5b;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; /* 100% */

  &:hover {
    background: #002f87;
  }

  &:active {
    background: #031c5b;
  }
`;

export const AddButton = styled.button`
  display: flex;
  padding: 0.8rem 0.8rem;
  margin: 1rem 0;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border-radius: 0.625rem;
  background: #031c5b;

  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 100% */

  &:hover {
    background: #002f87;
  }

  &:active {
    background: #031c5b;
  }
`;

export const DelButton = styled.button`
  display: flex;
  padding: 0.8rem 0.8rem;
  margin-right: 0.3rem;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border-radius: 0.625rem;
  background: #f5f6f7;

  color: rgba(0, 0, 0, 0.87);
  text-align: center;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 100% */

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    background: #f5f6f7;
  }
`;

export const Horizontal = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: #000;
  margin: 1.4rem 0;
`;

export const BoldHorizontal = styled.div`
  display: flex;
  width: 100%;
  height: 4px;
  background-color: #000;
  margin: 1.4rem 0;
`;

export const VarTextContainer = styled.div``;

export const Boundary = styled.div`
  border: 2px solid #545454;
  border-radius: 10px;
  padding: 1rem;
`;
