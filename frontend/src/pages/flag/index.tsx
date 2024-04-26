import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { deleteFlag, getFlagDetail, updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';

interface FlagDetailItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  defaultValue: string;
  defaultValuePortion: number;
  defaultValueDescription: string;
  variation: string;
  variationPortion: number;
  variationDescription: string;

  userId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface FlagUpdateRuquest {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  defaultValue: string;
  defaultValuePortion: number;
  defaultValueDescription: string;
  variation: string;
  variationPortion: number;
  variationDescription: string;

  userId: number;
}

interface TagItem {
  content: string;
  colorHex: string;
}

const FlagDetail = () => {
  const [flagDetail, setFlagDetail] = useState<FlagDetailItem>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [allTags, setAllTags] = useState<Array<TagItem>>([]);

  const [editedFlagId, setEditedFlagId] = useState<number>();
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedType, setEditedType] = useState<string>();
  const [editedDefaultValue, setEditedDefaultValue] = useState<string>('');
  const [editedDefaultPortion, setEditedDefaultPortion] = useState<number>(100);
  const [editedDefaultDescription, setEditedDefaultDescription] = useState<string>('');
  const [editedVariation, setEditedVariation] = useState<string>('');
  const [editedVariationPortion, setEditedVariationPortion] = useState<number>(0);
  const [editedVariationDescription, setEditedVariationDescription] =
    useState<string>('');

  const [tags, setTags] = useState<Array<{ content: string; colorHex: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<
    Array<{ content: string; colorHex: string }>
  >([]);
  const [tagSearchKeyword, setTagSearchKeyword] = useState<string>('');

  const { flagId } = useParams<{ flagId: string }>();

  /**
   * flagId를 통해 마운트 시 해당 flag의 상세 정보를 가져옴
   */
  useEffect(() => {
    getFlagDetail<FlagDetailItem>(
      Number(flagId),
      (data: FlagDetailItem) => {
        setFlagDetail(data);
        setupEditedFlag(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [flagId]);

  /**
   * 수정에 사용할 Flag 정보를 셋업하는 함수
   * @param data FlagDetailItem
   */
  const setupEditedFlag = (data: FlagDetailItem): void => {
    setEditedFlagId(data.flagId);
    setEditedTitle(data.title);
    setEditedDescription(data.description);
    setEditedType(data.type);
    setEditedDefaultValue(data.defaultValue);
    setEditedDefaultPortion(data.defaultValuePortion);
    setEditedDefaultDescription(data.defaultValueDescription);
    setEditedVariation(data.variation);
    setEditedVariationPortion(data.variationPortion);
    setEditedVariationDescription(data.variationDescription);

    setSelectedTags(data.tags);
  };

  /**
   * Flag 삭제 버튼 클릭 이벤트 핸들러
   */
  const onPressDeleteButton = () => {
    const deleteConfirm: boolean = confirm('삭제하기');

    if (deleteConfirm) {
      deleteFlag<FlagDetailItem>(
        Number(flagId),
        (data: FlagDetailItem) => {
          console.log(`${data}번 flag 삭제 완료`);
        },
        (err) => {
          console.log(err);
        },
      );
    }
  };

  /**
   * Flag 수정 버튼 클릭 이벤트 핸들러
   */
  const onPressEditButton = () => {
    setIsEditMode(true);
  };

  /**
   * 수정 모드(edit mode == true)일 때, setupAllTags 함수 호출
   */
  useEffect(() => {
    if (isEditMode == false) return;
    setupAllTags();
  }, [isEditMode]);

  /**
   * 전체 태그 목록을 가져오는 함수
   */
  const setupAllTags = (): void => {
    getTagList(
      (data: Array<{ content: string; colorHex: string }>) => {
        setAllTags(data);
        setTags(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * 태그 검색어 입력 onBlur 이벤트 핸들러
   */
  const updateTagListByKeyword = (): void => {
    // 태그 검색어가 없으면 axios 호출하지 않음
    if (
      tagSearchKeyword === '' ||
      tagSearchKeyword === undefined ||
      tagSearchKeyword === null
    ) {
      return;
    }

    getTagListByKeyword(
      tagSearchKeyword,
      (data: Array<{ content: string; colorHex: string }>) => {
        setTags(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const handleEditedTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedTitle(e.target.value);
  };

  const handleEditedDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedDescription(e.target.value);
  };

  const handleEditedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setEditedType(e.target.value);
  };

  const handleEditedDefaultValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedDefaultValue(e.target.value);
  };

  const handleEditedDefaultPortionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedDefaultPortion(Number(e.target.value));
  };

  const handleEditedDefaultDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedDefaultDescription(e.target.value);
  };

  const handleEditedVariationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedVariation(e.target.value);
  };

  const handleEditedVariationPortionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedVariationPortion(Number(e.target.value));
  };

  const handleEditedVariationDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setEditedVariationDescription(e.target.value);
  };

  const handleTagSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTagSearchKeyword(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // 선택인지 해제인지 확인
    if (e.target.checked) {
      // 선택된 태그 추가
      setSelectedTags([
        ...selectedTags,
        { content: e.target.value, colorHex: '#bdbdbd' },
      ]);
    } else {
      // 선택 해제된 태그 제거
      setSelectedTags(selectedTags.filter((tag) => tag.content !== e.target.value));
    }
  };

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

  /**
   * 취소하기 버튼 클릭 이벤트 핸들러
   */
  const onPressCancelButton = () => {
    setIsEditMode(false);
    if (flagDetail) {
      setupEditedFlag(flagDetail);
    }
  };

  /**
   * 저장하기 버튼 클릭 이벤트 핸들러
   */
  const onPressSaveButton = () => {
    updateFlag<FlagDetailItem, FlagUpdateRuquest>(
      editedFlagId || 0,
      {
        flagId: editedFlagId || 0,
        title: editedTitle,
        tags: selectedTags,
        description: editedDescription,
        type: editedType || '',
        defaultValue: editedDefaultValue,
        defaultValuePortion: editedDefaultPortion,
        defaultValueDescription: editedDefaultDescription,
        variation: editedVariation,
        variationPortion: editedVariationPortion,
        variationDescription: editedVariationDescription,

        userId: 1,
      },
      (data: FlagDetailItem) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
    );
    console.log('저장하기');
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

  return (
    <div>
      {flagDetail && !isEditMode && (
        <div>
          <div>
            <span>{flagDetail.title}</span>
          </div>
          <div>
            {flagDetail.tags.map((tag) => {
              return (
                <span
                  key={tag.content}
                  style={{ backgroundColor: tag.colorHex, color: '#fff' }}
                >
                  {tag.content}
                </span>
              );
            })}
          </div>
          <div>
            <span>{flagDetail.description}</span>
          </div>
          <div>
            <span>{flagDetail.type}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValue}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValuePortion}</span>
          </div>
          <div>
            <span>{flagDetail.defaultValueDescription}</span>
          </div>
          <div>
            <span>{flagDetail.variation}</span>
          </div>
          <div>
            <span>{flagDetail.variationPortion}</span>
          </div>
          <div>
            <span>{flagDetail.variationDescription}</span>
          </div>
          <div>
            <span>{flagDetail.userId}</span>
          </div>
          <div>
            <span>{flagDetail.createdAt}</span>
          </div>
          <div>
            <span>{flagDetail.updatedAt}</span>
          </div>
          <div>
            <span>{flagDetail.active ? '활성화' : '비활성화'}</span>
          </div>

          <button onClick={onPressDeleteButton}>삭제하기</button>
          <button onClick={onPressEditButton}>수정하기</button>
        </div>
      )}

      {editedFlagId && isEditMode && (
        <div>
          <div>
            <input value={editedTitle} onChange={handleEditedTitleChange} />
          </div>
          <div>
            <label htmlFor="tags">태그 검색</label>
            <input
              placeholder="태그 명"
              value={tagSearchKeyword}
              onBlur={updateTagListByKeyword}
              onChange={handleTagSearchKeywordChange}
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
            <input value={editedDescription} onChange={handleEditedDescriptionChange} />
          </div>
          <div>
            <select defaultValue={editedType} onChange={handleEditedTypeChange}>
              <option value={'BOOLEAN'}>BOOLEAN</option>
              <option value={'INTEGER'}>INTEGER</option>
              <option value={'STRING'}>STRING</option>
              {/* <option value={'JSON'}>JSON</option> */}
            </select>
          </div>
          <div>
            <input value={editedDefaultValue} onChange={handleEditedDefaultValueChange} />
          </div>
          <div>
            <input
              value={editedDefaultPortion}
              onChange={handleEditedDefaultPortionChange}
            />
          </div>
          <div>
            <input
              value={editedDefaultDescription}
              onChange={handleEditedDefaultDescriptionChange}
            />
          </div>
          <div>
            <input value={editedVariation} onChange={handleEditedVariationChange} />
          </div>
          <div>
            <input
              value={editedVariationPortion}
              onChange={handleEditedVariationPortionChange}
            />
          </div>
          <div>
            <input
              value={editedVariationDescription}
              onChange={handleEditedVariationDescriptionChange}
            />
          </div>
          {/* active는 수정모드에서 조작 불가 */}

          <button onClick={onPressCancelButton}>취소하기</button>
          <button onClick={onPressSaveButton}>저장하기</button>
        </div>
      )}
    </div>
  );
};

export default FlagDetail;
