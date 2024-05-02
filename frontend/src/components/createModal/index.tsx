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
import { useRecoilValue } from 'recoil';

import { createFlag } from '@/api/create/createAxios';
import { updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';
import { AuthAtom } from '@/global/AuthAtom';

interface CreateModalProps {
  closeCreateModal: () => void;
  mode: string;
  flagDetail: FlagDetailItem | undefined;
}

interface TagItem {
  content: string;
  colorHex: string;
}

interface Variation {
  value: string;
  portion: number | '';
  description: string;
}

interface Keyword {
  properties: Array<Property>;
  description: string;
  value: string;
}

interface Property {
  property: string;
  data: string;
}

interface FlagDetailItem {
  flagId: number;
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
  type: string;
  keywords: Array<Keyword>;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const CreateModal: React.FC<CreateModalProps> = (props) => {
  const navigator = useNavigate();

  const auth = useRecoilValue(AuthAtom);

  // 모달 밖 클릭에 대한 이벤트 전파 막기
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const [title, setTitle] = useState<string>(props.flagDetail?.title || '');
  const [allTags, setAllTags] = useState<Array<TagItem>>([]);
  const [tags, setTags] = useState<Array<TagItem>>(props.flagDetail?.tags || []);
  const [description, setDescription] = useState<string>(
    props.flagDetail?.description || '',
  );
  const [type, setType] = useState<string>(props.flagDetail?.type || 'BOOLEAN');
  const [keywords, setKeywords] = useState<Array<Keyword>>([]);
  const [defaultValue, setDefaultValue] = useState<string>(
    props.flagDetail?.defaultValue || '',
  );
  const [defaultPortion, setDefaultPortion] = useState<number | ''>(
    props.flagDetail?.defaultPortion || 100,
  );
  const [defaultDescription, setDefaultDescription] = useState<string>(
    props.flagDetail?.defaultDescription || '',
  );
  const [variation, setVariation] = useState<string>('');
  const [variations, setVariations] = useState<Array<Variation>>(
    props.flagDetail?.variations || [],
  );

  const [tagSearchKeyword, setTagSearchKeyword] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Array<TagItem>>([]);

  const [isTypeEdited, setIsTypeEdited] = useState<boolean>(false);

  const typeConfig = ['BOOLEAN', 'INTEGER', 'STRING', 'JSON'];

  const [flagMode, setFlagMode] = useState<string>(props.mode);

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
    if (type === 'BOOLEAN') {
      setDefaultValue(e.target.value.toUpperCase());
    } else if (type === 'INTEGER' && isNaN(Number(e.target.value.at(-1)))) {
      setDefaultValue(e.target.value.slice(0, -1));
    } else {
      setDefaultValue(e.target.value);
    }
  };

  const handleDefaultPortionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    const inputValue = e.target.value;
    if (inputValue === '' || !isNaN(Number(inputValue))) {
      setDefaultPortion(inputValue === '' ? '' : Number(inputValue));
    }
  };

  const handleDefaultDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setDefaultDescription(e.target.value);
  };

  const handleVariationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ): void => {
    if (type === 'BOOLEAN') {
      setVariations((prev) => {
        const newVariations = [...prev];
        newVariations[idx].value = e.target.value.toUpperCase();
        return newVariations;
      });
    } else if (type === 'INTEGER' && isNaN(Number(e.target.value.at(-1)))) {
      setVariations((prev) => {
        const newVariations = [...prev];
        newVariations[idx].value = e.target.value.slice(0, -1);
        return newVariations;
      });
    } else {
      setVariations((prev) => {
        const newVariations = [...prev];
        newVariations[idx].value = e.target.value;
        return newVariations;
      });
    }
  };

  const calculateTotalPortion = (): number => {
    let totalPortion = Number(0);
    variations.map((variation) => {
      totalPortion += Number(variation.portion);
    });
    return totalPortion;
  };

  const handleVariationPortionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ): void => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    const inputValue = e.target.value;

    if (inputValue === '' || !isNaN(Number(inputValue))) {
      setVariations((prev) => {
        const newVariations = [...prev];
        newVariations[idx].portion = inputValue === '' ? '' : Number(inputValue);
        return newVariations;
      });
    }
  };

  useEffect(() => {
    if (calculateTotalPortion() > Number(100)) {
      alert('변수 비율의 합이 100을 넘을 수 없습니다.');
      for (let i = 0; i < variations.length; i++) {
        setVariations((prev) => {
          const newVariations = [...prev];
          newVariations[i].portion = Number(0);
          return newVariations;
        });
      }
    } else {
      setDefaultPortion(Number(100) - calculateTotalPortion());
    }
  }, [variations]);

  const handleVariationDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ): void => {
    setVariations((prev) => {
      const newVariations = [...prev];
      newVariations[idx].description = e.target.value;
      return newVariations;
    });
  };

  /**
   * 타입 수정 버튼 클릭 이벤트 핸들러
   */
  const onClickTypeEdit = (): void => {
    if (isDetailMode()) return;
    setIsTypeEdited(true);
    console.log('타입 수정 버튼 클릭');
  };

  const addValidation = (): boolean => {
    if (
      title === '' ||
      description === '' ||
      defaultPortion === '' ||
      defaultDescription === '' ||
      (type === 'BOOLEAN' && !(defaultValue === 'TRUE' || defaultValue === 'FALSE'))
    ) {
      console.log(title);
      console.log(description);
      console.log(defaultPortion);
      console.log(defaultDescription);
      return false;
    }

    variations.map((variation) => {
      if (
        variation.portion === '' ||
        variation.description === '' ||
        (type === 'BOOLEAN' &&
          !(variation.value === 'TRUE' || variation.value === 'FALSE'))
      ) {
        console.log(variation.portion);
        console.log(variation.description);
        console.log(variation.value);
        return false;
      }
    });

    return true;
  };

  /**
   * 플래그 "추가하기" 버튼 클릭 이벤트 핸들러
   */
  const onClickAdd = (): void => {
    if (!addValidation()) {
      alert('필수 입력값을 입력해주세요');
      return;
    }

    createFlag(
      {
        title: title,
        tags: selectedTags,
        description: description,
        type: type,
        keywords: keywords,
        defaultValue: defaultValue,
        defaultPortion: defaultPortion ? defaultPortion : 0,
        defaultDescription: defaultDescription,
        variations: variations,

        //TODO : userId 전역설정 기능 추가 후 수정
        memberId: auth.memberId,
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
    if (isDetailMode()) {
      return;
    }
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

  const onClickAddVariation = (): void => {
    setVariations([
      ...variations,
      {
        value: '',
        portion: '',
        description: '',
      },
    ]);
  };

  const onClickModifyCancle = (): void => {
    setFlagMode('detail');
  };

  const onClickSave = (): void => {
    if (!props.flagDetail || !addValidation()) {
      alert('필수 입력값을 입력해주세요');
      return;
    }

    updateFlag(
      Number(props.flagDetail?.flagId),
      {
        title: title,
        tags: selectedTags,
        description: description,
        type: type,
        keywords: keywords,
        defaultValue: defaultValue,
        defaultPortion: defaultPortion ? defaultPortion : 0,
        defaultDescription: defaultDescription,
        variations: variations,
        //TODO : userId 전역설정 기능 추가 후 수정
        memberId: auth.memberId,
      },
      (data: FlagDetailItem) => {
        console.log(data);
        setFlagMode('detail');
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const onClickModify = (): void => {
    setFlagMode('edit');
  };

  const isDetailMode = (): boolean => {
    return flagMode === 'detail';
  };

  const renderVariationForms = () => {
    return variations.map((variation, idx) => (
      <S.FlagVariationContentLayer key={idx}>
        <S.FlagVariationRowContainer>
          <S.FlagVariationInput
            type="text"
            placeholder="값을 입력하세요"
            value={variation.value}
            // 변경된 값이 있을 때 처리하는 함수 바인딩
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleVariationChange(e, idx)
            }
            $flag={isDetailMode()}
          />
          <S.FlagVariationInput
            type="number"
            placeholder="변수 비율"
            value={variation.portion}
            // 변경된 값이 있을 때 처리하는 함수 바인딩
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleVariationPortionChange(e, idx)
            }
            $flag={isDetailMode()}
          />
        </S.FlagVariationRowContainer>
        <S.FlagVariationRowContainer>
          <S.FlagVariationInput
            type="text"
            placeholder="설명"
            value={variation.description}
            // 변경된 값이 있을 때 처리하는 함수 바인딩
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleVariationDescriptionChange(e, idx)
            }
            $flag={isDetailMode()}
          />
        </S.FlagVariationRowContainer>
      </S.FlagVariationContentLayer>
    ));
  };

  const renderTotalForm = () => {
    return (
      <>
        <S.FlagTitleAndTagsLayer>
          <S.FlagTitleInputContainer>
            <S.FlagTitleIconContainer>
              <OutlinedFlagBig />
            </S.FlagTitleIconContainer>
            <S.FlagTitleInput
              placeholder="플래그 이름"
              value={title}
              onChange={handleTitleChange}
              $flag={isDetailMode()}
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
          $flag={isDetailMode()}
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
          <S.FlagTypeContainer onClick={onClickTypeEdit} $flag={isDetailMode()}>
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
                $flag={isDetailMode()}
              />
              <S.FlagVariationInput
                type="number"
                placeholder="변수 비율"
                value={defaultPortion}
                onChange={handleDefaultPortionChange}
                $flag={isDetailMode()}
              />
            </S.FlagVariationRowContainer>
            <S.FlagVariationRowContainer>
              <S.FlagVariationInput
                type="text"
                placeholder="설명"
                value={defaultDescription}
                onChange={handleDefaultDescriptionChange}
                $flag={isDetailMode()}
              />
            </S.FlagVariationRowContainer>
          </S.FlagVariationContentLayer>
          <S.FlagVariationDivisionLine />
          {renderVariationForms()}
          <S.ButtonLayer>
            <S.ConfirmButton onClick={onClickAddVariation} $flag={isDetailMode()}>
              추가
            </S.ConfirmButton>
          </S.ButtonLayer>
        </S.FlagVariationContentLayer>
        <S.ButtonLayer>
          {flagMode === 'create' ? (
            <S.CancelButton onClick={props.closeCreateModal}>취소하기</S.CancelButton>
          ) : flagMode === 'edit' ? (
            <S.CancelButton onClick={onClickModifyCancle}>취소하기</S.CancelButton>
          ) : null}
          {flagMode === 'create' ? (
            <S.ConfirmButton onClick={onClickAdd} $flag={false}>
              추가하기
            </S.ConfirmButton>
          ) : flagMode === 'edit' ? (
            <S.ConfirmButton onClick={onClickSave} $flag={false}>
              저장하기
            </S.ConfirmButton>
          ) : flagMode === 'detail' ? (
            <S.ConfirmButton onClick={onClickModify} $flag={false}>
              수정하기
            </S.ConfirmButton>
          ) : null}
        </S.ButtonLayer>
      </>
    );
  };

  return flagMode === 'create' ? (
    <S.ModalBackground onClick={() => props.closeCreateModal()}>
      <S.Modal>
        <S.ModalInputForm
          id="modal-scrollable"
          className="modal-scrollable"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            stopPropagation(e)
          }
        >
          {renderTotalForm()}
        </S.ModalInputForm>
      </S.Modal>
    </S.ModalBackground>
  ) : (
    <S.DetailLayout>{renderTotalForm()}</S.DetailLayout>
  );
};

export default CreateModal;
