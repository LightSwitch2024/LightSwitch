import { getFlagList, getTagList } from '@api/main/mainAxios';
import { Tag } from '@/types/Tag';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import TagHandle from '@/assets/handle.svg?react';

const TagsInput = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 20px;
  max-width: 400px;
  min-width: 250px;
  padding: 0 8px;
  border: 1px solid rgb(189, 189, 189);
  border-radius: 6px;

  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;
    > li {
      margin-right: 4px;
      margin-bottom: 4px;
    }
  }

  > input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
  }

  &:focus-within {
    border: 1px solid rgb(1, 186, 138);
  }
`;

const TagContainer = styled.div`
  position: relative;
  width: 320px;
`;

const TagItem = styled.li<{ bgColor: string }>`
  position: relative;
  background-color: ${(props) => props.bgColor};
  display: flex;
  align-items: center;
  height: 32px;
  justify-content: center;
  color: rgb(1, 186, 138);
  padding: 0 8px;
  font-size: 14px;
  list-style: none;
  border-radius: 15px;
  cursor: pointer;
`;

const TagContent = styled.span<{ textColor: string; color: string }>`
  background-color: ${({ color }) => color};
  padding: 0.1rem 0.1rem;
  border-radius: 0.5rem;
  color: ${({ textColor }) => textColor};
  margin-right: 0.5rem;
`;

export const TagCloseIcon = styled.span`
  display: block;
  width: 16px;
  height: 16px;
  text-align: center;
  font-size: 14px;
  margin-left: 8px;
  color: rgb(1, 186, 138);
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const DropdownItemsBox = styled.div`
  position: relative;
  background-color: rgb(245, 246, 247);
  width: 100%;
  z-index: 1000;
  max-height: 200px; // 약 5개 항목의 높이
  overflow-y: auto; // 스크롤 활성화
`;

const DropdownItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  border: 1px solid #ffffff;
  width: 95%;
  height: 32px;
`;

const AddNewTagContainer = styled.div`
  position: relative;
  background: #dedfe0;
  border-radius: 6px;
  width: 100%;
  z-index: 1001;
`;

const ColorPickerContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding: 5px;
`;

const ColorButton = styled.div`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
`;

const TagPreview = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding: 0.5rem 1rem;
  margin-top: 10px;
`;

interface TagsInputProps {
  selectedTags: Array<Tag>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Array<Tag>>>;
  allowCreation?: boolean;
}

interface ColorPairs {
  [key: string]: string;
}

const colorPairs: ColorPairs = {
  '#FAF0BE': '#AA952F',
  '#FFB5B5': '#A92323',
  '#C2FABE': '#21B217',
  '#BEDDFA': '#266CB2',
  '#8684F0': '#1815C6',
  '#84DDF0': '#0C859E',
  '#FABEF8': '#BC2969',
  '#E27209': '#9A4D05',
};

const MySVG = ({ mainColor = '#AA952F' }) => {
  const [accentColor, setAccentColor] = useState(colorPairs[mainColor]);

  useEffect(() => {
    setAccentColor(colorPairs[mainColor] || '#FFFFFF'); // 기본값 설정
  }, [mainColor]);

  return (
    <svg width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" rx="10" fill={mainColor} />
      <rect x="10" y="10" width="10" height="10" rx="10" fill={accentColor} />
    </svg>
  );
};

export default MySVG;

export const TagsInputComponent: React.FC<TagsInputProps> = ({
  selectedTags,
  setSelectedTags,
  allowCreation = false,
}) => {
  const [allTags, setTagList] = useState<Array<Tag>>([]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState({
    mainColor: '',
    accentColor: '',
  });
  const [filteredTags, setFilteredTags] = useState<Array<Tag>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddNewTagContainer, setShowAddNewTagContainer] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTagList(
      (data: Array<Tag>) => {
        setTagList(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 모든 태그를 초기 필터링 태그로 설정
    setFilteredTags(allTags.filter((tag) => !selectedTags.includes(tag)));
  }, [selectedTags, allTags]); // selectedTags 변경 시 업데이트

  useEffect(() => {
    const existingTag = allTags.some(
      (tag) => tag.content.toLowerCase() === inputText.toLowerCase(),
    );
    setShowAddNewTagContainer(!existingTag && inputText !== ''); // 태그가 존재하지 않고 입력 필드가 비어있지 않을 때만 true
  }, [inputText, allTags]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setInputText(inputText);
    if (inputText) {
      setFilteredTags(
        allTags.filter(
          (tag) =>
            tag.content.toLowerCase().includes(inputText.toLowerCase()) &&
            !selectedTags.includes(tag),
        ),
      );
    } else {
      setFilteredTags(allTags.filter((tag) => !selectedTags.includes(tag)));
    }
    setShowDropdown(true);
  };

  const onFocus = () => {
    setShowDropdown(true);
    setFilteredTags(allTags.filter((tag) => !selectedTags.includes(tag))); // 포커스 시 필터링
  };

  const selectTag = (tag: Tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInputText('');
    }
  };

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const getContrastColor = (hex: string) => {
    // HEX 코드에서 RGB 값을 추출
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    // 밝기 계산 공식
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 밝기가 128보다 크면 검은색, 그렇지 않으면 흰색 반환
    return brightness > 128 ? '#000' : '#FFF';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      inputText &&
      allowCreation &&
      !allTags.find((tag) => tag.content.toLowerCase() === inputText.toLowerCase())
    ) {
      const newTag = { content: inputText, colorHex: '#CCCCCC' };
      setTagList([...allTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      setInputText('');
    }
  };

  const handleColorSelect = (
    event: { stopPropagation: () => void },
    mainColor: string,
    accentColor: string,
  ) => {
    event.stopPropagation(); // 이벤트 버블링 중지
    setSelectedColors({ mainColor, accentColor });
  };

  const addNewTag = () => {
    if (
      inputText &&
      !allTags.some((tag) => tag.content.toLowerCase() === inputText.toLowerCase())
    ) {
      if (selectedColors.mainColor) {
        // 색상이 선택되었는지 확인
        const newTag = {
          content: inputText,
          colorHex: selectedColors.mainColor,
        };
        setTagList([...allTags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
        setInputText(''); // 입력 필드 초기화
        setSelectedColors({ mainColor: '', accentColor: '' }); // 색상 선택 초기화
      }
    }
  };

  return (
    <TagContainer>
      <TagsInput>
        <ul id="tags">
          {selectedTags.map((tag, index) => (
            <TagItem key={index} bgColor={tag.colorHex}>
              <MySVG mainColor={tag.colorHex} />
              <TagContent
                key={tag.content}
                color={tag.colorHex}
                textColor={getContrastColor(tag.colorHex)}
              >
                {tag.content}
              </TagContent>
              <TagCloseIcon onClick={() => removeTag(tag)}>&times;</TagCloseIcon>
            </TagItem>
          ))}
        </ul>
        <input
          className="tag-input"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={() => {
            if (!showDropdown) setShowDropdown(false); // 드롭다운이 활성화되어 있지 않을 때만 닫기
          }}
          placeholder="태그 검색"
        />
      </TagsInput>
      {showDropdown && (
        <DropdownContainer ref={dropdownRef}>
          <DropdownItemsBox>
            {filteredTags.map((tag, index) => (
              <DropdownItem
                key={index}
                onClick={() => {
                  selectTag(tag);
                }}
                onMouseDown={(e: { preventDefault: () => void }) => e.preventDefault()}
              >
                <TagHandle />
                <TagItem key={index} bgColor={tag.colorHex}>
                  <MySVG mainColor={tag.colorHex} />
                  <TagContent
                    key={tag.content}
                    color={tag.colorHex}
                    textColor={getContrastColor(tag.colorHex)}
                  >
                    {tag.content}
                  </TagContent>
                </TagItem>
              </DropdownItem>
            ))}
          </DropdownItemsBox>
          {allowCreation && showAddNewTagContainer && (
            <AddNewTagContainer>
              <TagPreview>
                <TagItem
                  bgColor={selectedColors.mainColor}
                  onClick={(event: { stopPropagation: () => void }) => {
                    event.stopPropagation();
                    addNewTag(); // 태그 추가 함수 호출
                  }}
                >
                  <MySVG mainColor={selectedColors.mainColor} />
                  <TagContent
                    color={selectedColors.mainColor}
                    textColor={getContrastColor(selectedColors.mainColor)}
                  >
                    {inputText || 'New Tag'}
                  </TagContent>
                </TagItem>
              </TagPreview>
              <ColorPickerContainer>
                {Object.entries(colorPairs).map(([mainColor, accentColor]) => (
                  <ColorButton
                    key={mainColor}
                    onClick={(event: { stopPropagation: () => void }) => {
                      event.stopPropagation();
                      handleColorSelect(event, mainColor, accentColor);
                    }}
                  >
                    <MySVG mainColor={mainColor} />
                  </ColorButton>
                ))}
              </ColorPickerContainer>
            </AddNewTagContainer>
          )}
        </DropdownContainer>
      )}
    </TagContainer>
  );
};
