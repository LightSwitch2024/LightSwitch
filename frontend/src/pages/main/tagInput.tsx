import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TagsInput = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 20px;
  width: 480px;
  padding: 0 8px;
  border: 1px solid rgb(1, 186, 138);
  border-radius: 6px;

  > ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;

    > .tag {
      width: auto;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgb(1, 186, 138);
      padding: 0 8px;
      font-size: 14px;
      list-style: none;
      border-radius: 15px;
      margin: 0 8px 8px 0;
      background: rgb(242, 243, 244);

      > .tag-close-icon {
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
      }
    }
  }

  > input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 0;
    :focus {
      outline: transparent;
    }
  }

  &:focus-within {
    border: 1px solid rgb(1, 186, 138);
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: white;
  width: 100%;
  max-height: 160px; // 약 5개 항목의 높이
  overflow-y: auto; // 스크롤 활성화
`;

export const TagsInputComponent = () => {
  const allTags = [
    'CodeStates',
    'kimcoding',
    'JavaScript',
    'React',
    'NodeJS',
    'HTML',
    'CSS',
    'Redux',
    'TypeScript',
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
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
            tag.toLowerCase().includes(inputText.toLowerCase()) &&
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

  const selectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowDropdown(false);
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <TagsInput>
        <ul id="tags">
          {selectedTags.map((tag, index) => (
            <li className="tag" key={index}>
              <span>{tag}</span>
              <span className="tag-close-icon" onClick={() => removeTag(tag)}>
                &times;
              </span>
            </li>
          ))}
        </ul>
        <input
          className="tag-input"
          type="text"
          onChange={handleInputChange}
          onFocus={onFocus}
          placeholder="Search and select tags"
        />
      </TagsInput>
      {showDropdown && (
        <DropdownContainer>
          {filteredTags.map((tag, index) => (
            <div
              key={index}
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => selectTag(tag)}
            >
              {tag}
            </div>
          ))}
        </DropdownContainer>
      )}
    </div>
  );
};
