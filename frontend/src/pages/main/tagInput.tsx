import { getFlagList, getTagList } from '@api/main/mainAxios';
import { Tag } from '@pages/main/tag';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TagsInput = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 20px;
  max-width: 400px;
  min-width: 250px;
  padding: 0 8px;
  border: 1px solid rgb(1, 186, 138);
  border-radius: 6px;

  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;
  }

  > input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 0;
    :focus {
      //outline: transparent;
    }
  }

  &:focus-within {
    border: 1px solid rgb(1, 186, 138);
  }
`;

const TagItem = styled.li<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  width: auto;
  height: 32px;
  justify-content: center;
  color: rgb(1, 186, 138);
  padding: 0 8px;
  font-size: 14px;
  list-style: none;
  border-radius: 15px;
  margin: 0 8px 8px 0;
`;

const TagContent = styled.span<{ textColor: string; color: string }>`
  background-color: ${({ color }) => color};
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  color: ${({ textColor }) => textColor};
  margin-right: 0.5rem;
  text-shadow: 0.1px 0.1px 0 #000, -0.1px -0.1px 0 #000, 0.1px -0.1px 0 #000,
    -0.1px 0.1px 0 #000;
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
  z-index: 1000;
  background-color: white;
  width: 100%;
  max-height: 270px; // 약 5개 항목의 높이
  max-width: 380px;
  overflow-y: auto; // 스크롤 활성화
`;

interface TagsInputProps {
  selectedTags: Array<Tag>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Array<Tag>>>;
}
//getTagList
export const TagsInputComponent: React.FC<TagsInputProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  const [allTags, setTagList] = useState<Array<Tag>>([]);

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

  const [filteredTags, setFilteredTags] = useState<Array<Tag>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 모든 태그를 초기 필터링 태그로 설정
    setFilteredTags(allTags.filter((tag) => !selectedTags.includes(tag)));
  }, [selectedTags]); // selectedTags 변경 시 업데이트

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
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
    }
    // setShowDropdown(false);
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
    return brightness > 200 ? '#000' : '#FFF';
  };

  return (
    <div>
      <TagsInput>
        <ul id="tags">
          {selectedTags.map((tag, index) => (
            <TagItem key={index} bgColor={tag.colorHex}>
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
          onChange={handleInputChange}
          onFocus={onFocus}
          onBlur={() => setShowDropdown(false)}
          placeholder="Search and select tags"
        />
      </TagsInput>
      {showDropdown && (
        <DropdownContainer>
          {filteredTags.map((tag, index) => (
            <div
              key={index}
              style={{
                width: '100%',
                padding: '5px',
                cursor: 'pointer',
                border: '1px solid #AAA',
              }}
              onClick={() => {
                selectTag(tag);
                // setShowDropdown(false); // 태그 선택 후 드롭다운 닫기
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <TagItem key={index} bgColor={tag.colorHex}>
                <TagContent
                  key={tag.content}
                  color={tag.colorHex}
                  textColor={getContrastColor(tag.colorHex)}
                >
                  {tag.content}
                </TagContent>
              </TagItem>
            </div>
          ))}
        </DropdownContainer>
      )}
    </div>
  );
};
