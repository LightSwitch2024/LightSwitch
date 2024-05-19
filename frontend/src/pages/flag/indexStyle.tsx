import styled from 'styled-components';

export const fullHeight = `calc(var(--vh, 1vh) * 100 - 40px)`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  gap: 1.25rem;
  width: 100%;
`;

export const FlagContainer = styled.div`
  display: flex;
  width: 60%;
  padding: 0rem 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9375rem;
  align-self: stretch;
`;

export const HistoryContainer = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem 1.875rem 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 0.625rem;
  background: #e1edf8;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  z-index: -3;
`;

export const FlagTitleAndTagsLayer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 0.3125rem;
  flex-shrink: 0;
`;

export const FlagTitleInputContainer = styled.div`
  display: flex;
  height: 5rem;

  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
  align-self: stretch;
`;

export const FlagTitleIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagTitleInput = styled.input`
  border: none;
  font-family: Pretendard;
  font-size: calc(${fullHeight} * 0.05);
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

export const OnOffButtonContainer = styled.div`
  display: flex;
  padding: 0.625rem 0rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const WarnText = styled.div`
  align-self: flex-end;
  font-size: 1rem;
  color: red;
  font-weight: 500;
`;

export const FlagTagsInputContainer = styled.div`
  display: flex;
  padding: 0.5rem 0.625rem;
  align-items: center;
  gap: 0.625rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const FlagDescriptionLabel = styled.div`
  display: flex;
  padding: 0.5rem 0.3rem;
  align-items: center;
  gap: 0.625rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const FlagDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const FlagDescriptionIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > svg {
    width: 2.3rem;
    height: 2.3rem;
  }
`;

export const FlagDescriptionTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const LabelText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const FlagDescriptionTextArea = styled.textarea`
  display: flex;
  height: 5rem;
  padding: 0.625rem;
  margin-left: 0.5rem;
  align-items: flex-start;
  gap: 0.625rem;
  flex-shrink: 0;
  align-self: stretch;
  resize: none;

  border-radius: 0.625rem;
  border: 1px solid #000;
  background: #fff;

  color: #000;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const FlagTypeLayer = styled.div`
  display: flex;
  padding: 0.5rem 0.625rem;
  align-items: center;
  gap: 1.25rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const FlagTypeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const KeywordLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.5rem 0.625rem;
`;

export const FlagTypeIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > svg {
    width: 2.3rem;
    height: 2.3rem;
  }
`;

export const FlagTypeLabelTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagTypeContainer = styled.div`
  display: flex;
  width: 7.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  border-radius: 0.825rem;
  background: #30c2e7;
`;

export const FlagTypeContentContainer = styled.div`
  display: flex;
  padding: 0.4rem 0rem;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
`;

export const FlagTypeTextContainer = styled.div`
  display: flex;
  padding: 0.12rem 0rem;
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
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0.8375rem;
  letter-spacing: 0.07813rem;
  text-transform: uppercase;
`;

export const FlagVariationLabel = styled.div`
  display: flex;
  padding: 0.625rem;
  align-items: center;
  gap: 2.625rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const FlagVariationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

export const FlagVariationIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > svg {
    width: 2.3rem;
    height: 2.3rem;
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
  padding: 1.25rem;
  border-radius: 1rem;
  background-color: #f5f5f5;
`;

export const FlagVariationRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0rem 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 3.125rem;
`;

export const FlagVariationInput = styled.input`
  display: flex;
  width: 100%;
  height: 3.75rem;
  padding: 0.9375rem 0.75rem;
  align-items: center;
  gap: 0.625rem;
  // flex: 1 0 0;

  border-radius: 0.625rem;
  border: 1px solid #000;

  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
  width: 100%;
  height: 0.125rem;
  background: #a9a9a9;
`;

export const KeywordContainer = styled.div`
  display: flex;
  padding: 1.25rem;
  flex-direction: column;
  align-items: center;
  gap: 0.9375rem;
  align-self: stretch;
  margin-left: 1rem;

  border-radius: 1.225rem;
  border: 1px solid #a8a8a8;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
`;

export const TagContainer = styled.div`
  display: flex;
  padding: 0.5rem 0.1rem;
  justify-content: start;
  flex-direction: row;
  gap: 0.9375rem;
`;

export const OutsideToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9375rem;
  align-self: stretch;
`;

export const OutsideToggleRowContainer = styled.div`
  display: flex;
  padding: 0rem 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 3.125rem;
  align-self: stretch;
`;

export const KeywordLabelContainer = styled.div`
  display: flex;
  width: 4rem;
  padding: 0.0625rem 0.625rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const KeywordText = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const KeywordTextInput = styled.input`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.5625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const KeywordValueContainer = styled.input`
  display: flex;
  height: 1.5rem;
  width: 100%;
  padding: 0.9375rem 1.25rem;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;

  border-radius: 0.625rem;
  border: 1px solid #aaaaaa;

  color: #000;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const ToggleButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1875rem;

  &:hover {
    cursor: pointer;
  }
`;

export const ToggleTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

export const ToggleText = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const PropertyContainer = styled.div`
  display: flex;
  padding: 0.3rem 0rem;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  flex: 1 0 0;
`;

export const ButtonLayer = styled.div`
  display: flex;
  padding: 0.75rem 0rem;
  justify-content: flex-end;
  align-items: center;
  gap: 0.8125rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const DeleteButton = styled.button`
  display: flex;
  padding: 1.0625rem 1.5625rem;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border: none;

  border-radius: 0.625rem;
  background: #f5f6f7;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    background: #e0e0e0;
  }
  cursor: pointer;
`;

export const UpdateButton = styled.button`
  display: flex;
  padding: 1.0625rem 1.5625rem;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;

  border-radius: 0.625rem;
  background: #031c5b;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    background: #002f87;
  }
`;

export const DeleteButtonText = styled.div`
  color: rgba(0, 0, 0, 0.87);
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; /* 100% */
`;

export const UpdateButtonText = styled.div`
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem; /* 100% */

  cursor: pointer;
`;

export const HistoryTitleContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.625rem;
  align-items: center;
  gap: 0.625rem;
  // flex: 1 0 0;
  align-self: stretch;
`;

export const HistoryTitleText = styled.div`
  color: #000;
  font-family: Roboto;
  font-size: 2.2125rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const HistoryContentContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.05rem;
  // flex: 1 0 0;
`;

export const HistoryListContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
  height: 100%;
`;

export const HistoryIconListContainer = styled.div`
  position: relative;
  display: flex;
  padding: 0.625rem 0rem;
  flex-direction: column;
  align-items: center;
  gap: 1.05rem;
`;

export const HistoryIconPadding = styled.div<{ $len: number }>`
  width: ${({ $len }) => `${$len}rem`};
  height: ${({ $len }) => `${$len}rem`};

  z-index: -1;

  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

export const HistoryIconContainer = styled.div<{ $len: number }>`
  display: flex;
  width: ${({ $len }) => `${$len}rem`};
  height: ${({ $len }) => `${$len}rem`};
  z-index: 1;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.3125rem;
  background: #0f71b8;
`;

export const HistoryContentTextContainer = styled.div<{ $len: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  height: ${({ $len }) => `${$len}rem`};
`;

export const HistoryContentText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const HistoryTimeText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const Line = styled.div`
  width: 0.125rem;
  height: 100%;
  position: absolute;
  left: 1rem;
  bottom: 0;
  z-index: -2;

  background: var(--black-012, rgba(0, 0, 0, 0.12));
`;
