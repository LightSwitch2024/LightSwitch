import Bookmark from '@assets/bookmark.svg?react';
import CallSplit from '@assets/call-split.svg?react';
import Description from '@assets/description.svg?react';
import Edit from '@assets/edit.svg?react';
import Loop from '@assets/loop.svg?react';
import OutlinedFlagBig from '@assets/outlined-flag-big.svg?react';
import * as S from '@components/createModal/indexStyle';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createFlag } from '@/api/create/createAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';

interface CreateModalProps {
  closeCreateModal: () => void;
}

interface TagItem {
  content: string;
  colorHex: string;
}

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

const CreateModal: React.FC<CreateModalProps> = (props) => {
  const navigator = useNavigate();

  // 모달 밖 클릭에 대한 이벤트 전파 막기
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const [title, setTitle] = useState<string>('');
  const [allTags, setAllTags] = useState<Array<TagItem>>([]);
  const [tags, setTags] = useState<Array<TagItem>>([]);
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('BOOLEAN');
  const [defaultValue, setDefaultValue] = useState<string>('');
  const [defaultPortion, setDefaultPortion] = useState<number>(100);
  const [defaultDescription, setDefaultDescription] = useState<string>('');
  const [variation, setVariation] = useState<string>('');
  const [variationPortion, setVariationPortion] = useState<number>(0);
  const [variationDescription, setVariationDescription] = useState<string>('');

  const [tagSearchKeyword, setTagSearchKeyword] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Array<TagItem>>([]);

  const [isTypeEdited, setIsTypeEdited] = useState<boolean>(false);

  const typeConfig = ['BOOLEAN', 'NUMBER', 'STRING', 'JSON'];

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
   * 타입 수정 버튼 클릭 이벤트 핸들러
   */
  const onClickTypeEdit = (): void => {
    setIsTypeEdited(true);
    console.log('타입 수정 버튼 클릭');
  };

  /**
   * 플래그 "추가하기" 버튼 클릭 이벤트 핸들러
   */
  const onClickAdd = (): void => {
    createFlag(
      {
        title: title,
        tags: selectedTags,
        description: description,
        type: type,
        defaultValue: defaultValue,
        defaultValuePortion: defaultPortion ? defaultPortion : 0,
        defaultValueDescription: defaultDescription,
        variation: variation,
        variationPortion: variationPortion ? variationPortion : 0,
        variationDescription: variationDescription,

        //TODO : userId 전역설정 기능 추가 후 수정
        userId: 1,
      },
      (data: FlagDetailItem) => {
        console.log(data);
        navigator(`flag/${data.flagId}`);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * 태그 검색어로 태그 목록 업데이트
   * @param typeItem
   * @returns
   */
  const handleEditeType = (typeItem: string) => () => {
    setType(typeItem);
    if (typeItem === 'BOOLEAN') {
      setDefaultValue('TRUE');
      setVariation('FALSE');
    }

    setIsTypeEdited(false);
  };

  /**
   * 전체 태그 목록을 가져오는 함수
   */
  const setupAllTags = (): void => {
    getTagList(
      (data: Array<TagItem>) => {
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
      (data: Array<TagItem>) => {
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
    <S.ModalBackground onClick={() => props.closeCreateModal()}>
      <S.Modal>
        <S.ModalInputForm
          id="modal-scrollable"
          className="modal-scrollable"
          onClick={(event) => stopPropagation(event)}
        >
          <S.FlagTitleAndTagsLayer>
            <S.FlagTitleInputContainer>
              <S.FlagTitleIconContainer>
                <OutlinedFlagBig />
              </S.FlagTitleIconContainer>
              <S.FlagTitleInput
                placeholder="플래그 이름"
                value={title}
                onChange={handleTitleChange}
              />
            </S.FlagTitleInputContainer>
            <S.FlagTagsInputContainer>
              <S.FlagTagsInputLabel>
                <Bookmark />
                <S.LabelTextContainer>
                  <S.LabelText>태그</S.LabelText>
                </S.LabelTextContainer>

                {/* 
                <div>
                  <input
                    type="description"
                    placeholder="태그 명"
                    value={tagSearchKeyword}
                    onChange={handleTagSearchKeywordChange}
                    onBlur={updateTagListByKeyword}
                  />
                  <div>
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
                      {selectedTags.map((tag) => (
                        <span
                          key={tag.content}
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
                      ))}
                    </div>
                  </div>
                </div> 
                */}
              </S.FlagTagsInputLabel>
            </S.FlagTagsInputContainer>
          </S.FlagTitleAndTagsLayer>
          <S.FlagDescriptionLabel>
            <S.FlagDescriptionContainer>
              <S.FlagDescriptionIconContainer>
                <Description />
              </S.FlagDescriptionIconContainer>
              <S.FlagDescriptionTextContainer>
                <S.LabelText>설명</S.LabelText>
              </S.FlagDescriptionTextContainer>
            </S.FlagDescriptionContainer>
          </S.FlagDescriptionLabel>
          <S.FlagDescriptionTextArea
            placeholder="설명"
            value={description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleDescriptionChange(event)
            }
          />
          <S.FlagTypeLayer>
            <S.FlagTypeLabel>
              <S.FlagTypeIconContainer>
                <CallSplit />
              </S.FlagTypeIconContainer>
              <S.FlagTypeLabelTextContainer>
                <S.LabelText>변수 타입</S.LabelText>
              </S.FlagTypeLabelTextContainer>
            </S.FlagTypeLabel>
            <S.FlagTypeContainer onClick={onClickTypeEdit}>
              <S.FlagTypeContentContainer>
                <S.FlagTypeTextContainer>
                  <S.FlagTypeText>{type}</S.FlagTypeText>
                </S.FlagTypeTextContainer>
                <S.FlagTypeEditIconContainer>
                  <Edit />
                </S.FlagTypeEditIconContainer>
              </S.FlagTypeContentContainer>
            </S.FlagTypeContainer>
            {isTypeEdited &&
              typeConfig.map((typeItem, idx) =>
                typeItem === type ? (
                  <S.FlagTypeContentContainerChecked
                    key={idx}
                    onClick={handleEditeType(typeItem)}
                  >
                    <S.FlagTypeTextContainer>
                      <S.FlagTypeText>{typeItem}</S.FlagTypeText>
                    </S.FlagTypeTextContainer>
                  </S.FlagTypeContentContainerChecked>
                ) : (
                  <S.FlagTypeContentContainerUnchecked
                    key={idx}
                    onClick={handleEditeType(typeItem)}
                  >
                    <S.FlagTypeTextContainer>
                      <S.FlagTypeText>{typeItem}</S.FlagTypeText>
                    </S.FlagTypeTextContainer>
                  </S.FlagTypeContentContainerUnchecked>
                ),
              )}
          </S.FlagTypeLayer>
          <S.FlagVariationLabel>
            <S.FlagVariationContainer>
              <S.FlagVariationIconContainer>
                <Loop />
              </S.FlagVariationIconContainer>
              <S.FlagVariationLabelTextContainer>
                <S.LabelText>변수</S.LabelText>
              </S.FlagVariationLabelTextContainer>
            </S.FlagVariationContainer>
          </S.FlagVariationLabel>
          <S.FlagVariationContentLayer>
            <S.FlagVariationContentLayer>
              <S.FlagVariationRowContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="값을 입력하세요"
                  value={defaultValue}
                  onChange={handleDefaultValueChange}
                />
                <S.FlagVariationInput
                  type="number"
                  placeholder="변수 비율"
                  value={defaultPortion}
                  onChange={handleDefaultPortionChange}
                />
              </S.FlagVariationRowContainer>
              <S.FlagVariationRowContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="설명"
                  value={defaultDescription}
                  onChange={handleDefaultDescriptionChange}
                />
              </S.FlagVariationRowContainer>
            </S.FlagVariationContentLayer>
            <S.FlagVariationDivisionLine />
            <S.FlagVariationContentLayer>
              <S.FlagVariationRowContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="값을 입력하세요"
                  value={variation}
                  onChange={handleVariationChange}
                />
                <S.FlagVariationInput
                  type="number"
                  placeholder="변수 비율"
                  value={variationPortion}
                  onChange={handleVariantionPortionChange}
                />
              </S.FlagVariationRowContainer>
              <S.FlagVariationRowContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="설명"
                  value={variationDescription}
                  onChange={handleVariationDescriptionChange}
                />
              </S.FlagVariationRowContainer>
            </S.FlagVariationContentLayer>
          </S.FlagVariationContentLayer>
          <S.ButtonLayer>
            <S.CancelButton onClick={props.closeCreateModal}>취소하기</S.CancelButton>
            <S.ConfirmButton onClick={onClickAdd}>추가하기</S.ConfirmButton>
          </S.ButtonLayer>
        </S.ModalInputForm>
      </S.Modal>
    </S.ModalBackground>
  );
};

export default CreateModal;
