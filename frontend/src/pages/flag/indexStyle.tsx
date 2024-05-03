import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  gap: 1.25rem;
  width: 100%;
  height: 100%;
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
  background: #89e6f5;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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
  height: 6.0625rem;
  background-color: #bdbdbd;

  padding: 0rem 0.625rem;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
  align-self: stretch;
`;

export const FlagTitleIconContainer = styled.div`
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.3125rem;
  background: #f5f6f7;
`;

export const FlagTitleInput = styled.input`
  border: none;
  font-family: Pretendard;
  font-size: 50px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  width: 100%;

  &:focus {
    outline: none;
  }
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
  flex: 1 0 0;
  align-self: stretch;
`;

export const FlagDescriptionLabel = styled.div`
  display: flex;
  padding: 0.5rem 0.625rem;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
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
`;

export const FlagDescriptionTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const LabelText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 3.125rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;

export const FlagDescriptionTextArea = styled.textarea<{ $flag: boolean }>`
  display: flex;
  height: 10.3125rem;
  padding: 0.625rem;
  align-items: flex-start;
  gap: 0.625rem;
  flex-shrink: 0;
  align-self: stretch;

  border-radius: 0.625rem;
  border: 1px solid #000;
  background: #fff;

  color: #000;
  font-family: Pretendard;
  font-size: 1.25rem;
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
