import styled from 'styled-components';

export const LayOut = styled.div`
  display: flex;
  // justify-content: center;
  // align-items: center;
  flex-direction: column;
  padding: 4rem 3rem 2rem 3rem;
  gap: 2rem;
`;

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

  z-index: 2;
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
  // align-items: center;
  // justify-content: center;
  // gap: 0.625rem;
  // width: 100%;
  // height: 100%;
`;

export const ModalInputForm = styled.div`
  display: flex;
  color: #fff;
  width: 70%;
  height: 90%;
  background-color: #fff;

  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  font-size: 2rem;
  font-weight: 800;

  display: flex;
  margin: 10rem;
  flex-direction: column;
  gap: 0.9375rem;
  flex-shrink: 0;
`;

export const FlagTitleAndTagsLayer = styled.div`
  display: flex;
  width: 100%;
  padding-top: 2rem;
  flex-direction: column;
  gap: 0.7rem;
  flex-shrink: 0;
`;

export const FlagTitleInputContainer = styled.div<{ $flag: boolean }>`
  display: flex;
  height: 2rem;
  padding: 0.9375rem 0.75rem;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;

  border-radius: 0.625rem;
  border: 1px solid #000;

  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  ${(props) =>
    props.$flag &&
    `
    background-color: #f2f2f2;
    pointer-events: none;
  `}
`;

export const FlagTitleIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.3125rem;
  background: #f5f6f7;
  > svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const FlagTitleInput = styled.input<{ $flag: boolean }>`
  border: none;
  width: 100%;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  color: #545454;
  font-weight: 600;
  line-height: normal;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #d6d6d6;
  }

  ${(props) =>
    props.$flag &&
    `
    background-color: #f2f2f2;
    pointer-events: none;
  `}
`;

export const WarnText = styled.div`
  align-self: flex-end;
  font-size: 1rem;
  color: red;
  font-weight: 500;
`;

export const FlagTagsInputContainer = styled.div`
  display: flex;
  padding: 0.5rem 0;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagTagsInputLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const LabelTextContainer = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const LabelText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const FlagDescriptionLabel = styled.div`
  display: flex;
  padding: 0.5rem 0;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagDescriptionIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  > svg {
    width: 1.7rem;
    height: 1.7rem;
  }
`;

export const FlagDescriptionTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagDescriptionTextArea = styled.textarea<{ $flag: boolean }>`
  display: flex;
  height: 10.3125rem;
  padding: 1.3rem;
  align-items: flex-start;
  gap: 0.625rem;
  flex-shrink: 0;
  align-self: stretch;

  border-radius: 0.625rem;
  border: 1px solid #000;
  background: #fff;

  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  color: #545454;
  font-weight: 600;
  line-height: normal;

  &::placeholder {
    color: #d6d6d6;
  }

  ${(props) =>
    props.$flag &&
    `
    background-color: #f2f2f2;
    pointer-events: none;
  `}
`;

export const FlagTypeLayer = styled.div`
  display: flex;
  padding: 0.5rem 0;
  align-items: center;
  gap: 1.25rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagTypeLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.625rem;
`;

export const FlagTypeIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  > svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const FlagTypeLabelTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagTypeContainer = styled.div<{ $flag: boolean }>`
  display: flex;
  width: 8.625rem;
  height: 2.125rem;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  border-radius: 0.625rem;
  background: #30c2e7;

  ${(props) =>
    !props.$flag &&
    `
  &:hover {
    cursor: pointer;
  }
  `}
`;

export const FlagTypeContentContainer = styled.div`
  display: flex;
  padding: 0.6875rem 0rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
`;

export const FlagTypeTextContainer = styled.div`
  display: flex;
  padding: 0.25rem 0rem;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagTypeEditIconContainer = styled.div`
  display: flex;
  padding: 0.25rem 0rem;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagTypeText = styled.div`
  color: #1e3232;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 0.9375rem; /* 75% */
  letter-spacing: 0.07813rem;
  text-transform: uppercase;
  cursor: pointer;
`;

export const FlagVariationLabel = styled.div`
  display: flex;
  // padding: 0.5rem 0;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagVariationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagVariationIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  > svg {
    width: 1.9rem;
    height: 1.9rem;
  }
`;

export const FlagVariationLabelTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagVariationContentLayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9375rem;
  align-self: stretch;
`;

export const FlagVariationRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0rem 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 3.125rem;
`;

export const FlagVariationInput = styled.input<{ $flag: boolean }>`
  display: flex;
  width: 100%;
  height: 2rem;
  padding: 0.9375rem 0.75rem;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;

  border-radius: 0.625rem;
  border: 1px solid #000;

  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  color: #545454;
  font-weight: 600;
  line-height: normal;

  &::placeholder {
    color: #d6d6d6;
  }

  ${(props) =>
    props.$flag &&
    `
    background-color: #f2f2f2;
    pointer-events: none;
  `}
`;

export const FlagVariationDescriptionContainer = styled.div`
  display: flex;
  width: 100%;
  height: 4.75rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
`;

export const FlagVariationDivisionLine = styled.div`
  width: 98%;
  height: 0.125rem;

  background: #000;
`;

export const ButtonLayer = styled.div`
  display: flex;
  padding: 0.5rem 0rem;
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
  cursor: pointer;
`;

export const DeleteButton = styled.button`
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
  cursor: pointer;
`;

export const ConfirmButton = styled.button<{ $flag: boolean }>`
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
  cursor: pointer;

  ${(props) =>
    props.$flag &&
    `
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

export const FlagTypeContentContainerChecked = styled.div`
  display: flex;
  padding: 0.6875rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
  background: #f5f6f7;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;
`;

export const FlagTypeContentContainerUnchecked = styled.div`
  display: flex;
  padding: 0.6875rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  border-radius: 0.625rem;
`;

export const FlagDescriptionLayer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 0.3125rem;
  flex-shrink: 0;
`;

export const FlagVariationLayer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

export const ModalTitleText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const ModalTitleTextContainer = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const FlagTitleContainer = styled.div`
  display: flex;
  padding: 0.325rem 0;
  gap: 0.325rem;
`;

export const FlagTitleTextContainer = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const HeadFlagTitleIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  > svg {
    width: 1.7rem;
    height: 1.7rem;
  }
`;

export const FlagTagsIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  > svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const BottomLayer = styled.div`
  display: flex;
  flex-direction: column;
`;
