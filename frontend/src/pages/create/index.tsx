import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { Tag } from '@/types/Tag';

import { createFlag } from '@/api/create/createAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';
import { AuthAtom } from '@/global/AuthAtom';

const CreateFlag = () => {
  const auth = useRecoilState(AuthAtom);
  const [title, setTitle] = useState<string>('');
  const [allTags, setAllTags] = useState<Array<Tag>>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('BOOLEAN');
  const [defaultValue, setDefaultValue] = useState<string>('');
  const [defaultPortion, setDefaultPortion] = useState<number>(100);
  const [defaultDescription, setDefaultDescription] = useState<string>('');
  const [variation, setVariation] = useState<string>('');
  const [variationPortion, setVariationPortion] = useState<number>(0);
  const [variationDescription, setVariationDescription] = useState<string>('');

  const [tagSearchKeyword, setTagSearchKeyword] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleTagSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTagSearchKeyword(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // 선택인지 해제인지 확인
    if (e.target.checked) {
      // 선택된 태그 추가
      setSelectedTags([...selectedTags, { content: e.target.value, colorHex: '' }]);
    } else {
      // 선택 해제된 태그 제거
      setSelectedTags(selectedTags.filter((tag) => tag.content !== e.target.value));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setType(e.target.value);
  };

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDefaultValue(e.target.value);
  };

  const handleDefaultPortionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDefaultPortion(Number(e.target.value));
  };

  const handleDefaultDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setDefaultDescription(e.target.value);
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVariation(e.target.value);
  };

  const handleVariantionPortionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setVariationPortion(Number(e.target.value));
  };

  const handleVariationDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setVariationDescription(e.target.value);
  };

  /**
   * 전체 태그 목록을 가져오는 함수
   */
  const setupAllTags = (): void => {
    getTagList(
      (data: Array<Tag>) => {
        setAllTags(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * 컴포넌트 마운트 시 전체 태그 목록을 가져옴
   */
  useEffect(() => {
    setupAllTags();
  }, []);

  /**
   * 태그 검색어 입력 onBlur 이벤트 핸들러
   * @returns void
   */
  const updateTagListByKeyword = (): void => {
    // 태그 검색어가 없으면 axios 호출하지 않음
    if (
      tagSearchKeyword === '' ||
      tagSearchKeyword === undefined ||
      tagSearchKeyword === null
    )
      return;

    getTagListByKeyword(
      tagSearchKeyword,
      (data: Array<Tag>) => {
        setTags(data);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  /**
   * 태그 검색어 비울때 전체 태그로 변경
   */
  useEffect(() => {
    if (
      tagSearchKeyword === '' ||
      tagSearchKeyword === undefined ||
      tagSearchKeyword === null
    ) {
      setTags(allTags);
    }
  }, [tagSearchKeyword]);

  /**
   * 태그 목록이 비어있고 태그 검색어가 있으면 새로운 태그 생성
   */
  useEffect(() => {
    // 태그 목록이 비어있고 태그 검색어가 있으면 새로운 태그 생성
    if (tags.length === 0 && tagSearchKeyword) {
      setSelectedTags([
        ...selectedTags,
        { content: tagSearchKeyword, colorHex: '#909090' },
      ]);
    }
  }, [tags]);

  return (
    <div>
      <div>
        <label htmlFor="title">플래그 이름</label>
        <input
          type="title"
          placeholder="플래그 이름"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        <label htmlFor="tags">태그 검색</label>
        <input
          type="description"
          placeholder="태그 명"
          value={tagSearchKeyword}
          onChange={handleTagSearchKeywordChange}
          onBlur={updateTagListByKeyword}
        />
        <div>
          {/* selectedTag에 존재하면 선택된 상태 */}
          {tags.map((tag, idx) => (
            <div key={idx}>
              <input
                type="checkbox"
                value={tag.content}
                onChange={handleTagsChange}
                checked={selectedTags.some(
                  (selectedTag) => selectedTag.content === tag.content,
                )}
              />
              <span
                style={{
                  backgroundColor: tag.colorHex,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  marginRight: '0.5rem',
                }}
              >
                <label>{tag.content}</label>
              </span>
            </div>
          ))}

          <div>
            <span>선택된 태그 목록</span>
            {selectedTags.map((tag, idx) => (
              <div key={idx}>
                <span
                  style={{
                    backgroundColor: tag.colorHex,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.5rem',
                    color: '#000',
                    marginRight: '0.5rem',
                  }}
                >
                  <span>{tag.content}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="description">설명</label>
        <input
          type="description"
          placeholder="설명"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div>
        <label htmlFor="type">타입</label>
        <select value={type} onChange={handleTypeChange}>
          <option value="BOOLEAN">BOOLEAN</option>
          <option value="string">STRING</option>
          <option value="INTEGER">NUMBER</option>
          {/*<option value="JSON">JSON</option>*/}
        </select>
      </div>
      <div>
        <label htmlFor="defaultValue">기본값</label>
        <input
          type="defaultValue"
          placeholder="값을 입력하세요"
          value={defaultValue}
          onChange={handleDefaultValueChange}
        />
      </div>
      <div>
        <label htmlFor="defaultPortion">기본 비율</label>
        <input
          type="defaultPortion"
          placeholder="기본 비율"
          value={defaultPortion}
          onChange={handleDefaultPortionChange}
        />
      </div>
      <div>
        <label htmlFor="defaultDescription">기본 설명</label>
        <input
          type="defaultDescription"
          placeholder="설명"
          value={defaultDescription}
          onChange={handleDefaultDescriptionChange}
        />
      </div>
      <div>
        <label htmlFor="variation">변수</label>
        <input
          type="variation"
          placeholder="변수 이름"
          value={variation}
          onChange={handleVariationChange}
        />
      </div>
      <div>
        <label htmlFor="variationPortion">변수 비율</label>
        <input
          type="variationPortion"
          placeholder="비율"
          value={variationPortion}
          onChange={handleVariantionPortionChange}
        />
      </div>
      <div>
        <label htmlFor="variationDescription">변수 설명</label>
        <input
          type="variationDescription"
          placeholder="설명"
          value={variationDescription}
          onChange={handleVariationDescriptionChange}
        />
      </div>
      <div>
        <button>추가</button>
      </div>
    </div>
  );
};

export default CreateFlag;
