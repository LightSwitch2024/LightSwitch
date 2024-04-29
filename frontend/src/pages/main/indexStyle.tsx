import styled from 'styled-components';

export const MainTitleComponent = styled.div`
  display: flex;
  height: 10rem;
  padding-bottom: 0.9375rem;
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
`;

export const OverviewComponent = styled.div`
  display: flex;
  height: 11rem;
  padding-bottom: 0.4375rem;
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
`;

export const FlagTableComponent = styled.div`
  // display: flex;
  // height: 31.5625rem;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
`;

// MainTitleComponent 하위 컴포넌트 ========================

export const imageContainer = styled.div`
  display: flex;
  width: 12rem;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const imageLunitLogo = styled.img<{ path: string }>`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 0.625rem;

  background-image: url(${(props) => props.path});
  background-color: lightgray;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
`;

export const LunitInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const LunitTitleContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const LunitTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 4.25rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const LunitDescriptionContainer = styled.div`
  display: flex;
  padding: 0rem 0.625rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const DescriptionContainer = styled.div`
  display: flex;
  padding: 0rem 0.625rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
`;

export const SummaryInfoContinaer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const CatchPhraseContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;

export const InfoTextContiner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const InfoText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.7rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

// OverviewComponent 하위 컴포넌트 ========================

export const SdkKeyComponent = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem 1.25rem 1.25rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 0.625rem;
  background: #d2ea60;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const SdkKeyTitleContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  align-items: center;
  gap: 1.875rem;
`;

export const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SdkkeyContentContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  align-items: center;
  gap: 0.625rem;
`;

export const SdkKeyIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.3125rem;
  background: #a8ca47;
`;

export const SdkKeyTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const SdkKeyText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const FlagComponent = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem 1.25rem 1.25rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 0.625rem;
  background: #f5f6f7;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const FlagTitleContainer = styled.div`
  display: flex;
  padding: 0.3125rem 0rem;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.625rem;
`;

export const FlagCountContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagCountIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.3125rem;
  background: #c4f3fa;
`;

export const FlagCountTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagCountTextSmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagCountTextSmall = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const FlagCountTextBigContainer = styled.div`
  display: flex;
  padding: 0rem 0.3125rem;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagCountTextBig = styled.div`
  color: #000;
  font-family: Pretenard;
  font-size: 1.8rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const HistoryComponent = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem 1.25rem 1.25rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 0.625rem;
  background: #89e6f5;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const HisotryTitleContainer = styled.div`
  display: flex;
  padding: 0.3125rem 0rem;
  align-items: center;
  gap: 0.625rem;
`;

// FlagTableComponent 하위 컴포넌트 ========================

export const TableNavContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagNavTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.3rem;
`;

export const FlagNavTitleContainer2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagNavSearchComponent = styled.div`
  display: flex;
  padding-bottom: 0.4375rem;
  justify-content: space-between;
  align-items: center;

  gap: 1.875rem;
  flex: 1 0 0;
`;

export const FlagNavSearchBoxContainer = styled.div`
  display: flex;
  padding: 0.4375rem 1.25rem;
  justify-content: space-between;
  align-items: center;

  border-radius: 0.625rem;
  border: 0.125rem solid #bdbdbd;
`;

export const FlagNavSearchInput = styled.input`
  display: flex;
  flex: 1 0 0;
  padding: 0.625rem;
  border: none;
  outline: none;
  background-color: transparent;

  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SearchIconContainer = styled.div`
  display: flex;
  padding: 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagNavFilteringContainer = styled.div`
  display: flex;
  width: 4.375rem;
  height: 4.375rem;
  padding: 0.375rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagNavFilteringButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 0.625rem;
  border: 2px solid #000;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const FlagNavFiltering = styled.div`
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  justify-content: center;
  align-items: center;
`;

export const FlagNavCreateButtonContainer = styled.div`
  display: flex;
  padding: 0.4375rem 0rem;
  justify-content: center;
  align-items: center;
  gap: 1.875rem;
`;

export const FlagNavCreateButton = styled.button`
  display: flex;
  height: 4.375rem;
  padding: 0.4375rem 1.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.625rem;
  background: #031c5b;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const ButtonText = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const FlagTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

// Table 내부 컴포넌트 ========================
export const TableRowDescriptionDiv = styled.div`
  color: var(--Fonts-Primary-Variant, #6e6893);
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.04375rem;
`;
