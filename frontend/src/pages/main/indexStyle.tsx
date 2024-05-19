import styled from 'styled-components';

export const fullHeight = `calc(var(--vh, 1vh) * 100 - 4rem)`;

export const MainLayout = styled.div`
  width: 100%;
  height: ${fullHeight};
  overflow: hidden;
`;

export const ComponentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: calc(${fullHeight} * 0.05);
`;

export const MainTitleComponent = styled.div`
  display: flex;
  flex-direction: row;
  height: 12%;
  align-items: center;
  gap: 1.25rem;
`;

export const OverviewComponent = styled.div`
  display: flex;
  height: 19%;
  align-items: center;
  gap: 1.25rem;
  align-self: stretch;
`;

export const FlagTableComponent = styled.div`
  display: flex;
  flex-direction: column;
  height: 55%;
  align-items: flex-start;
  align-self: stretch;
  gap: calc(${fullHeight} * 0.015);
`;

// MainTitleComponent 하위 컴포넌트 ========================

export const imageContainer = styled.div`
  height: 100%;
  width: calc(${fullHeight} * 0.12);

  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const imageLunitLogo = styled.img<{ path: string }>`
  width: 100%;
  height: 100%;
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
  height: 100%;
  gap: calc(${fullHeight} * 0.03);
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
  font-size: calc(${fullHeight} * 0.06);
  font-style: normal;
  font-weight: 800;
  line-height: calc(${fullHeight} * 0.06);
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
  font-size: calc(${fullHeight} * 0.025);
  font-style: normal;
  font-weight: 400;
  line-height: calc(${fullHeight} * 0.025);
`;

// OverviewComponent 하위 컴포넌트 ========================

export const SdkKeyComponent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
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
  padding: calc(${fullHeight} * 0.02);
  align-items: center;
  gap: calc(${fullHeight} * 0.015);
`;

export const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: calc(${fullHeight} * 0.035);
  font-style: normal;
  font-weight: 700;
  margin: 0 1.25rem 0 0.25rem;
  line-height: calc(${fullHeight} * 0.04);
`;

export const SdkkeyContentContainer = styled.div`
  width: 100%;
  display: flex;
  padding: calc(${fullHeight} * 0.02);
  gap: calc(${fullHeight} * 0.015);
  box-sizing: border-box;
  overflow: hidden;
`;

export const SdkKeyIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.3125rem;
  background: #a8ca47;

  box-sizing: border-box;
`;

export const SdkKeyTextContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

export const NoExistSdkKeyText = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: calc(${fullHeight} * 0.01);
  box-sizing: border-box;
`;

export const createSdkKeyButton = styled.button`
  display: flex;
  padding: 0.7rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border: none;
  border-radius: 0.625rem;
  background: #a8ca47;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const SdkKeyText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: calc(${fullHeight} * 0.02);
  font-style: normal;
  font-weight: 400;
  line-height: calc(${fullHeight} * 0.02);
`;

export const FlagComponent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
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
  padding: calc(${fullHeight} * 0.02);
  align-items: center;
`;

export const FlagContentContainer = styled.div`
  display: flex;
  padding: calc(${fullHeight} * 0.02);
  gap: 2rem;
`;

export const FlagCountContainer = styled.div`
  display: flex;
  gap: calc(${fullHeight} * 0.015);
`;

export const FlagCountIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.3125rem;
  background: #c4f3fa;
`;

export const FlagCountTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const FlagCountTextSmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlagCountTextSmall = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2rem;
`;

export const FlagCountTextBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.2rem;
`;

export const FlagCountTextBigContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FlagCountTextBig = styled.div`
  color: #000;
  font-family: Pretenard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.2rem;
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
  width: 100%;
  height: calc(${fullHeight} * 0.06);
  justify-content: space-between;
  align-items: center;
`;

export const FlagNavTitleContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 1.3rem;
`;

export const FlagNavTitleContainer2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const FlagNavSearchComponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(${fullHeight} * 0.06);
  gap: 1.25rem;
`;

export const FlagNavSearchBoxContainer = styled.div`
  display: flex;
  padding: 0 1.25rem;
  justify-content: space-between;
  align-items: center;
  height: 80%;
  border-radius: 0.625rem;
  border: 0.025rem solid #a9a9a9;
`;

export const FlagNavSearchInput = styled.input`
  display: flex;
  flex: 1 0 0;
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
  justify-content: center;
  align-items: center;
`;

export const FlagNavFilteringContainer = styled.div`
  display: flex;
  width: calc(${fullHeight} * 0.05);
  height: calc(${fullHeight} * 0.05);
  justify-content: center;
  align-items: center;
`;

export const FlagNavFilteringButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 0.625rem;
  border: 1px solid #a9a9a9;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export const FlagNavFiltering = styled.div`
  display: flex;
  width: 2.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const FlagNavCreateButtonContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const FlagNavCreateButton = styled.button`
  display: flex;
  padding: 0.4375rem 1.3125rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.625rem;
  background: #031c5b;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &:hover {
    background: #002f87;
  }
`;

export const ButtonText = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-size: calc(${fullHeight} * 0.03);
  font-style: normal;
  font-weight: 400;
  line-height: calc(${fullHeight} * 0.04);
`;

export const FlagTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(${fullHeight} * 0.49);
  align-items: flex-start;
  align-self: stretch;
`;

// Table 내부 컴포넌트 ========================
export const TableRowDescriptionDiv = styled.div`
  color: var(--Fonts-Primary-Variant, #6e6893);
  font-family: Pretendard;
  font-size: 90%;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.04375rem;
`;
