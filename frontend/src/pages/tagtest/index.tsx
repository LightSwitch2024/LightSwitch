import SearchIcon from '@assets/search.svg?react';
import * as S from '@pages/tagtest/indexStyle';
import React from 'react';

interface TagItem {
  content: string;
  colorHex: string;
}

const index = () => {
  const tagConfig = [
    { colorHex: '#FAF0BE', highlightHex: '#AA952F' },
    { colorHex: '#B5B8FF', highlightHex: '#A92323' },
    { colorHex: '#C2FABE', highlightHex: '#21B217' },
    { colorHex: '#BEDDFA', highlightHex: '#266CB2' },
    { colorHex: '#8684F0', highlightHex: '#1815C6' },
    { colorHex: '#84DDF0', highlightHex: '#0C859E' },
    { colorHex: '#FABEF8', highlightHex: '#BC2969' },
    { colorHex: '#E27209', highlightHex: '#9A4D05' },
  ];

  const tagConfigMap = new Map<string, string>();
  tagConfig.forEach((tag) => {
    tagConfigMap.set(tag.colorHex, tag.highlightHex);
  });

  const tagData = [
    {
      content: 'UI',
      colorHex: '#FAF0BE',
    },
    {
      content: 'v1.0',
      colorHex: '#8684F0',
    },
    {
      content: 'production',
      colorHex: '#E27209',
    },
  ];

  return (
    <S.TagModal>
      <S.SearchInputContainer>
        <S.SearchInput />
        <S.SearchIconContainer>
          <SearchIcon />
        </S.SearchIconContainer>
      </S.SearchInputContainer>
      <S.SearchBoxDivisionLine />
      {tagData.map((tag, index) => (
        <S.TagItem key={index}>
          <S.ColorTag colorHex={tag.colorHex}>
            <S.HightLightTag highlightHex={tagConfigMap.get(tag.colorHex) || ''} />
          </S.ColorTag>
          {tag.content}
        </S.TagItem>
      ))}
      index
    </S.TagModal>
  );
};

export default index;
