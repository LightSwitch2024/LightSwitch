import BlackFlag from '@assets/black-flag.svg?react';
import Bookmark from '@assets/bookmark1.svg?react';
import CallSplit from '@assets/call-split1.svg?react';
import Description from '@assets/description1.svg?react';
import Edit from '@assets/edit.svg?react';
import Loop from '@assets/loop.svg?react';
import OutlinedFlagBig from '@assets/outlined-flag-big.svg?react';
import * as S from '@components/createModal/indexStyle';
import { TagsInputComponent } from '@pages/main/tagInput';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { confirmDuplicateFlag, createFlag } from '@/api/create/createAxios';
import { updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';
import { AuthAtom } from '@/global/AuthAtom';
import { FlagDetailItem, Variation, Keyword } from '@/types/Flag';
import { Tag } from '@/types/Tag';

interface CreateModalProps {
  closeCreateModal: () => void;
  mode: string;
  flagDetail: FlagDetailItem | undefined;
}

const CreateModal: React.FC<CreateModalProps> = (props) => {
  const navigator = useNavigate();

  const auth = useRecoilValue(AuthAtom);

  const [title, setTitle] = useState<string>(props.flagDetail?.title || '');
  const [allTags, setAllTags] = useState<Array<Tag>>([]);
  const [tags, setTags] = useState<Array<Tag>>(props.flagDetail?.tags || []);
  const [description, setDescription] = useState<string>(
    props.flagDetail?.description || '',
  );
  const [type, setType] = useState<string>(props.flagDetail?.type || 'BOOLEAN');
  const [keywords, setKeywords] = useState<Array<Keyword>>([]);
  const [defaultValue, setDefaultValue] = useState<string>(
    props.flagDetail?.defaultValue || 'TRUE',
  );
  const [defaultPortion, setDefaultPortion] = useState<number | ''>(
    props.flagDetail?.defaultPortion || 100,
  );
  const [defaultDescription, setDefaultDescription] = useState<string>(
    props.flagDetail?.defaultDescription || '',
  );
  const [variation, setVariation] = useState<string>('');
  const [variations, setVariations] = useState<Array<Variation>>(
    props.flagDetail?.variations || [{ value: 'FALSE', portion: '', description: '' }],
  );

  const [tagSearchKeyword, setTagSearchKeyword] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  const [isTypeEdited, setIsTypeEdited] = useState<boolean>(false);
  const [isDuplicatedTitle, setIsDuplicatedTitle] = useState<boolean>(false);
  const [isInvalidBooleanVariation, setIsInvalidBooleanVariation] =
    useState<boolean>(false);
  const [isInvalidIntegerVariation, setIsInvalidIntegerVariation] =
    useState<boolean>(false);
  const [flagMode, setFlagMode] = useState<string>(props.mode);
  const [isBool, setIsBool] = useState<boolean>(false);

  const typeConfig = ['BOOLEAN', 'INTEGER', 'STRING', 'JSON'];

  // 모달 밖 클릭에 대한 이벤트 전파 막기
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

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
    // 맨 앞에 0이 들어가면 0을 제거
    if (e.target.value[0] === '0') {
      e.target.value = e.target.value.slice(1);
    }
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
  };

  /**
   * 타이틀이 있는지 확인하는 함수
   */
  const checkDuplicatedTitle = () => {
    if (title === '') {
      return;
    }

    confirmDuplicateFlag(
      title,
      (data: boolean) => {
        setIsDuplicatedTitle(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const addValidation = (): boolean => {
    if (
      title === '' ||
      description === '' ||
      defaultPortion === '' ||
      defaultDescription === '' ||
      (type === 'BOOLEAN' && !(defaultValue === 'TRUE' || defaultValue === 'FALSE'))
    ) {
      return false;
    }

    variations.map((variation) => {
      if (
        variation.portion === '' ||
        variation.description === '' ||
        (type === 'BOOLEAN' &&
          !(variation.value === 'TRUE' || variation.value === 'FALSE'))
      ) {
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
    } else if (isDuplicatedTitle) {
      alert('중복된 플래그 이름이 존재합니다.');
      return;
    } else if (isInvalidBooleanVariation) {
      alert('BOOLEAN 타입은 TRUE 와 FALSE 값만 유효합니다.');
      return;
    } else if (isInvalidIntegerVariation) {
      alert('정수만 입력 가능합니다.');
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
        navigator(`/flag/${data.flagId}`);
        const html = document.querySelector('html');
        html?.classList.remove('scroll-locked');
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * 타입 변경 시 default value & variations 초기화 함수
   * @param typeItem
   * @returns
   */
  const handleEditeType = (typeItem: string) => () => {
    if (isDetailMode()) {
      return;
    }

    setIsInvalidBooleanVariation(false);
    setType(typeItem);
    if (typeItem === 'BOOLEAN') {
      setDefaultValue('TRUE');
      setVariations([
        {
          value: 'FALSE',
          portion: 0,
          description: '',
        },
      ]);
    } else {
      setDefaultValue('');
      setVariations([]);
    }

    setIsTypeEdited(false);
  };

  const checkFormatWithType = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    // invalid 초기화
    setIsInvalidBooleanVariation(false);
    setIsInvalidIntegerVariation(false);

    if (type === 'BOOLEAN') {
      event.target.value = event.target.value.toUpperCase();
      if (!(event.target.value === 'TRUE' || event.target.value === 'FALSE')) {
        setIsInvalidBooleanVariation(true);
      } else if (defaultValue === 'TRUE' && variations[0].value === 'TRUE') {
        setIsInvalidBooleanVariation(true);
      } else if (defaultValue === 'FALSE' && variations[0].value === 'FALSE') {
        setIsInvalidBooleanVariation(true);
      } else {
        setIsInvalidBooleanVariation(false);
      }
    } else if (type === 'INTEGER') {
      // 정수만 입력 가능하도록 설정
      if (isNaN(Number(event.target.value))) {
        setIsInvalidIntegerVariation(true);
      } else {
        setIsInvalidIntegerVariation(false);
      }
    }
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

  const onClickAddVariation = (): void => {
    if (type === 'BOOLEAN' && variations.length >= 1) {
      setIsInvalidBooleanVariation(true);
      return;
    } else {
      setIsInvalidBooleanVariation(false);
    }

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
    } else if (isDuplicatedTitle) {
      alert('중복된 플래그 이름이 존재합니다.');
      return;
    } else if (isInvalidBooleanVariation) {
      alert('BOOLEAN 타입은 TRUE 와 FALSE 값만 유효합니다.');
      return;
    } else if (isInvalidIntegerVariation) {
      alert('정수만 입력 가능합니다.');
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

        memberId: auth.memberId,
      },
      (data: FlagDetailItem) => {
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
            onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) =>
              checkFormatWithType(e)
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
            onWheel={(event: React.WheelEvent<HTMLInputElement>) => {
              const target = event.target as HTMLInputElement;
              if (target) {
                target.blur();
              }
            }}
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
        <S.LayOut>
          <S.ModalTitleTextContainer>
            <S.ModalTitleText>새 플래그 생성하기</S.ModalTitleText>
          </S.ModalTitleTextContainer>
          <S.FlagTitleAndTagsLayer>
            <S.FlagTitleContainer>
              <S.HeadFlagTitleIconContainer>
                <BlackFlag />
              </S.HeadFlagTitleIconContainer>
              <S.FlagTitleTextContainer>
                <S.LabelText>플래그 이름</S.LabelText>
              </S.FlagTitleTextContainer>
            </S.FlagTitleContainer>
            <S.FlagTitleInputContainer $flag={isDetailMode()}>
              <S.FlagTitleIconContainer>
                <OutlinedFlagBig />
              </S.FlagTitleIconContainer>
              <S.FlagTitleInput
                placeholder="ex. 사진 크기 등 ..."
                value={title}
                onChange={handleTitleChange}
                onBlur={checkDuplicatedTitle}
                $flag={isDetailMode()}
              />
            </S.FlagTitleInputContainer>
            {isDuplicatedTitle && (
              <S.WarnText>중복된 플래그 이름이 존재합니다.</S.WarnText>
            )}
            <S.FlagTagsInputContainer>
              <S.FlagTagsInputLabel>
                <Bookmark />
                <S.LabelTextContainer>
                  <S.LabelText>태그</S.LabelText>
                </S.LabelTextContainer>
              </S.FlagTagsInputLabel>
              <TagsInputComponent
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                allowCreation={true}
              />
            </S.FlagTagsInputContainer>
          </S.FlagTitleAndTagsLayer>
          <S.FlagDescriptionLayer>
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
          </S.FlagDescriptionLayer>
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
          <S.FlagVariationLayer>
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
                    onBlur={checkFormatWithType}
                    $flag={isDetailMode()}
                  />
                  <S.FlagVariationInput
                    type="number"
                    placeholder="변수 비율"
                    value={defaultPortion}
                    onChange={handleDefaultPortionChange}
                    onWheel={(event: React.WheelEvent<HTMLInputElement>) => {
                      const target = event.target as HTMLInputElement;
                      if (target) {
                        target.blur();
                      }
                    }}
                    disabled={true}
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
              {type != 'BOOLEAN' ? (
                <S.ButtonLayer>
                  <S.ConfirmButton onClick={onClickAddVariation} $flag={isDetailMode()}>
                    추가
                  </S.ConfirmButton>
                </S.ButtonLayer>
              ) : (
                <></>
              )}
              {isInvalidBooleanVariation && (
                <S.WarnText>BOOLEAN 타입은 TRUE 와 FALSE 값만 유효합니다.</S.WarnText>
              )}
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
          </S.FlagVariationLayer>
        </S.LayOut>
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
