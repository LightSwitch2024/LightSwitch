import styled from 'styled-components';

export const fullHeight = `calc(var(--vh, 1vh) * 100 - 40px)`;

export const Title = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: calc(${fullHeight} * 0.05);

  font-style: normal;
  font-weight: 700;
  line-height: calc(${fullHeight} * 0.04);
`;

export const FlagTableComponent = styled.div`
  display: flex;
  flex-direction: column;
  height: 55%;
  align-items: flex-start;
  align-self: stretch;
  gap: calc(${fullHeight} * 0.015);
`;

// FlagTableComponent 하위 컴포넌트 ========================

export const TableNavContainer = styled.div`
  margin-top: 1rem;
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
  height: 90%;
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
  // height: calc(${fullHeight} * 0.49);
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
