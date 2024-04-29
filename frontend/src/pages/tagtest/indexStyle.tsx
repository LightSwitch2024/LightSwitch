import styled from 'styled-components';

export const TagModal = styled.div`
  display: inline-flex;
  padding: 0.625rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.625rem;
  border: 1px solid #1e3232;
  background: #f5f6f7;
`;

export const SearchInputContainer = styled.div`
  width: 100%;
  height: 3.125rem;
  border-radius: 0.625rem;
  border: 1px solid #323232;

  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  border-radius: 0.625rem;
  padding: 0.625rem;
  width: 7.75rem;
  height: 1.5rem;
  background: #f5f6f7;

  font-size: 1.25rem;
  font-family: 'Pretendard';
`;

export const SearchIconContainer = styled.div`
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.625rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchBoxDivisionLine = styled.div`
  display: flex;
  height: 0.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  background: #323232;
`;

export const TagItem = styled.div`
  width: 100%;
  height: 2.625rem;
  color: #000;

  font-family: Pretendard;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  display: flex;
  justify-content: left;
  align-items: center;
`;

export const ColorTag = styled.div<{ colorHex: string }>`
  display: flex;
  padding: 0.6875rem 0.625rem;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.625rem;
  background: ${(props) => props.colorHex};
  margin-right: 0.8rem;
`;

export const HightLightTag = styled.div<{ highlightHex: string }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.625rem;
  background: ${(props) => props.highlightHex};
`;
