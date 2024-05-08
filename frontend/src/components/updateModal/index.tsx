import { updateFlag, updateKeywords, updateVariations } from '@api/update/updateAxios';
import BlackFlag from '@assets/black-flag.svg?react';
import Bookmark from '@assets/bookmark.svg?react';
import CallSplit from '@assets/call-split.svg?react';
import Description from '@assets/description.svg?react';
import Edit from '@assets/edit.svg?react';
import KeyWord from '@assets/keyword.svg?react';
import Loop from '@assets/loop.svg?react';
import OutlinedFlagBig from '@assets/outlined-flag-big.svg?react';
import * as S from '@components/updateModal/indexStyle';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';

import { ButtonLayer, FlagVariationDivisionLine } from '../createModal/indexStyle';

interface UpdateModalProps {
  closeUpdateModal: () => void;
  flagDetail: FlagDetailItem;
  setFlagDetail: React.Dispatch<React.SetStateAction<FlagDetailItem>>;
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

interface FlagInfo {
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
}

interface VariationInfo {
  type: string;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;
}

interface KeywordInfo {
  keywords: Array<Keyword>;
}

const UpdateModal: React.FC<UpdateModalProps> = (props) => {
  // input box hover용
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // 이벤트 버블링 방지
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const [editedFlagInfo, setEditedflagInfo] = useState<FlagInfo>({
    title: props.flagDetail?.title || '',
    tags: props.flagDetail?.tags || [],
    description: props.flagDetail?.description || '',
  });

  const [editedVariationInfo, setEditedVariationInfo] = useState<VariationInfo>({
    type: props.flagDetail?.type || '',
    defaultValue: props.flagDetail?.defaultValue || '',
    defaultPortion: props.flagDetail?.defaultPortion || 0,
    defaultDescription: props.flagDetail?.defaultDescription || '',
    variations: props.flagDetail?.variations || [],
  });

  const [editedKeywordInfo, setEditedKeywordInfo] = useState<KeywordInfo>({
    keywords: props.flagDetail?.keywords || [],
  });

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handelChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedflagInfo({
      ...editedFlagInfo,
      title: e.target.value,
    });

    console.log(editedFlagInfo.title);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedflagInfo({
      ...editedFlagInfo,
      description: e.target.value,
    });

    console.log(editedFlagInfo.description);
  };

  const handleChangeDefaultValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedVariationInfo({
      ...editedVariationInfo,
      defaultValue: e.target.value,
    });

    console.log(editedVariationInfo.defaultValue);
  };

  const handleChangeDefaultPortion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedVariationInfo({
      ...editedVariationInfo,
      defaultPortion: Number(e.target.value),
    });

    console.log(editedVariationInfo.defaultPortion);
  };

  const handleChangeDefaultDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedVariationInfo({
      ...editedVariationInfo,
      defaultDescription: e.target.value,
    });

    console.log(editedVariationInfo.defaultDescription);
  };

  const handleChangeVariationValue =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariations = editedVariationInfo.variations.map((variation, i) => {
        if (i === index) {
          return {
            ...variation,
            value: e.target.value,
          };
        }
        return variation;
      });

      setEditedVariationInfo({
        ...editedVariationInfo,
        variations: newVariations,
      });

      console.log(editedVariationInfo.variations);
    };

  const handleChangeVariaionPortion =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariations = editedVariationInfo.variations.map((variation, i) => {
        if (i === index) {
          return {
            ...variation,
            portion: Number(e.target.value),
          };
        }
        return variation;
      });

      setEditedVariationInfo({
        ...editedVariationInfo,
        variations: newVariations,
      });

      console.log(editedVariationInfo.variations);
    };

  const handleChangeVariationDescription =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariations = editedVariationInfo.variations.map((variation, i) => {
        if (i === index) {
          return {
            ...variation,
            description: e.target.value,
          };
        }
        return variation;
      });

      setEditedVariationInfo({
        ...editedVariationInfo,
        variations: newVariations,
      });

      console.log(editedVariationInfo.variations);
    };

  const handleChangeKeywordDescription =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
        if (i === index) {
          return {
            ...keyword,
            description: e.target.value,
          };
        }
        return keyword;
      });

      setEditedKeywordInfo({
        ...editedKeywordInfo,
        keywords: newKeywords,
      });

      console.log(editedKeywordInfo.keywords);
    };

  const handleChangeKeywordValue =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
        if (i === index) {
          return {
            ...keyword,
            value: e.target.value,
          };
        }
        return keyword;
      });

      setEditedKeywordInfo({
        ...editedKeywordInfo,
        keywords: newKeywords,
      });

      console.log(editedKeywordInfo.keywords);
    };

  const handleChangeProperty =
    (indexOfKeyword: number, indexOfProperty: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
        if (i === indexOfKeyword) {
          return {
            ...keyword,
            properties: keyword.properties.map((property, j) => {
              if (j === indexOfProperty) {
                return {
                  ...property,
                  property: e.target.value,
                };
              }
              return property;
            }),
          };
        }
        return keyword;
      });

      setEditedKeywordInfo({
        ...editedKeywordInfo,
        keywords: newKeywords,
      });

      console.log(editedKeywordInfo.keywords);
    };

  const addProperty = (indexOfKeyword: number): void => {
    // 빈 property 추가
    const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
      if (i === indexOfKeyword) {
        return {
          ...keyword,
          properties: keyword.properties.concat({
            property: '',
            data: '',
          }),
        };
      }
      return keyword;
    });

    setEditedKeywordInfo({
      ...editedKeywordInfo,
      keywords: newKeywords,
    });

    console.log(editedKeywordInfo.keywords);
  };

  const addKeyword = () => {
    // 빈 keyword 추가
    setEditedKeywordInfo({
      ...editedKeywordInfo,
      keywords: editedKeywordInfo.keywords.concat({
        properties: [],
        description: '',
        value: '',
      }),
    });

    console.log(editedKeywordInfo.keywords);
  };

  const addVariation = () => {
    // 빈 variation 추가
    setEditedVariationInfo({
      ...editedVariationInfo,
      variations: editedVariationInfo.variations.concat({
        value: '',
        portion: 0,
        description: '',
      }),
    });

    console.log(editedVariationInfo.variations);
  };

  const deleteVariation = (indexOfVariation: number) => () => {
    const newVariations = editedVariationInfo.variations.filter(
      (variation, i) => i !== indexOfVariation,
    );

    setEditedVariationInfo({
      ...editedVariationInfo,
      variations: newVariations,
    });

    console.log(editedVariationInfo.variations);
  };

  const handleChangeData =
    (indexOfKeyword: number, indexOfProperty: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
        if (i === indexOfKeyword) {
          return {
            ...keyword,
            properties: keyword.properties.map((property, j) => {
              if (j === indexOfProperty) {
                return {
                  ...property,
                  data: e.target.value,
                };
              }
              return property;
            }),
          };
        }
        return keyword;
      });

      setEditedKeywordInfo({
        ...editedKeywordInfo,
        keywords: newKeywords,
      });

      console.log(editedKeywordInfo.keywords);
    };

  const deleteProperty = (indexOfKeyword: number, indexOfProperty: number) => () => {
    const newKeywords = editedKeywordInfo.keywords.map((keyword, i) => {
      if (i === indexOfKeyword) {
        return {
          ...keyword,
          properties: keyword.properties.filter((property, j) => j !== indexOfProperty),
        };
      }
      return keyword;
    });

    setEditedKeywordInfo({
      ...editedKeywordInfo,
      keywords: newKeywords,
    });

    console.log(editedKeywordInfo.keywords);
  };

  const deleteKeyword = (indexOfKeyword: number) => {
    const newKeywords = editedKeywordInfo.keywords.filter(
      (keyword, i) => i !== indexOfKeyword,
    );

    setEditedKeywordInfo({
      ...editedKeywordInfo,
      keywords: newKeywords,
    });

    console.log(editedKeywordInfo.keywords);
  };

  // 저장하기 버튼 클릭 이벤트 (axios 함수 호출)
  const onClickSaveFlagInfo = () => {
    // 수정된게 없으면 return

    console.log(editedFlagInfo);

    updateFlag<FlagDetailItem>(
      props.flagDetail?.flagId,
      editedFlagInfo,
      (data: FlagDetailItem) => {
        console.log(data);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const onClickSaveVariationInfo = () => {
    // 수정된게 없으면 return

    console.log(editedVariationInfo);

    updateVariations<FlagDetailItem>(
      props.flagDetail?.flagId,
      editedVariationInfo,
      (data: FlagDetailItem) => {
        console.log(data);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const onClickSaveKeywordInfo = () => {
    // 수정된게 없으면 return

    updateKeywords<FlagDetailItem>(
      props.flagDetail?.flagId,
      editedKeywordInfo,
      (data: FlagDetailItem) => {
        console.log(data);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const handleCancle = () => {
    // 취소 버튼 눌렀을 때 로직
    alert('취소버튼누름!');
    return null;
  };

  const renderContentByTab = () => {
    // 플래그 수정 폼
    if (selectedTab === 0) {
      return (
        <S.FlagEditForm>
          <S.Container>
            <S.Layer>
              <S.IconContainer>
                <BlackFlag />
              </S.IconContainer>
              <S.TextContainer>
                <S.LabelText>플래그 이름</S.LabelText>
              </S.TextContainer>
            </S.Layer>
            <S.Input
              value={editedFlagInfo.title}
              onChange={handelChangeTitle}
              $flag={isFocused}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </S.Container>
          <S.TagContainer>
            <S.Layer>
              <S.IconContainer>
                <Bookmark />
              </S.IconContainer>
              <S.TextContainer>
                <S.LabelText>태그</S.LabelText>
              </S.TextContainer>
            </S.Layer>
            {/* 여기에다가 태그 수정 로직 */}
          </S.TagContainer>
          <S.Container>
            <S.Layer>
              <S.IconContainer>
                <Description />
              </S.IconContainer>
              <S.TextContainer>
                <S.LabelText>설명</S.LabelText>
              </S.TextContainer>
            </S.Layer>
            <S.TextArea
              $flag={isFocused}
              value={editedFlagInfo.description}
              onChange={handleChangeDescription}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </S.Container>
          {/* 
          <input type="text" value={editedFlagInfo.title} onChange={handelChangeTitle} />
          <textarea
            value={editedFlagInfo.description}
            onChange={handleChangeDescription}
          /> */}
          <S.BottomButtonLayer>
            <S.CancelButton onClick={handleCancle}>취소하기</S.CancelButton>
            <S.ConfirmButton onClick={onClickSaveFlagInfo}>저장하기</S.ConfirmButton>
          </S.BottomButtonLayer>
          {/* <button onClick={onClickSaveFlagInfo}>저장하기</button> */}
        </S.FlagEditForm>
      );
    }

    // 변수 수정 폼
    if (selectedTab === 1) {
      return (
        <>
          <div>
            <S.Container>
              <S.Layer>
                <S.IconContainer>
                  <CallSplit />
                </S.IconContainer>
                <S.TextContainer>
                  <S.LabelText>변수 타입</S.LabelText>
                </S.TextContainer>
              </S.Layer>
              <select value={editedVariationInfo.type}>
                <option value={'BOOLEAN'}>boolean</option>
                <option value={'INTEGER'}>Integer</option>
                <option value={'STRING'}>String</option>
              </select>
              <S.Layer>
                <S.IconContainer>
                  <Loop />
                </S.IconContainer>
                <S.TextContainer>
                  <S.LabelText>변수</S.LabelText>
                </S.TextContainer>
              </S.Layer>
              <div>
                <S.VarVertical>
                  <S.VarHorizon>
                    <S.VarContainer>
                      <S.VarTextContainer>
                        <S.VarText>변수</S.VarText>
                      </S.VarTextContainer>
                      <S.Input
                        type="text"
                        value={editedVariationInfo.defaultValue}
                        onChange={handleChangeDefaultValue}
                        $flag={isFocused}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </S.VarContainer>
                    <S.VarContainer>
                      <S.VarTextContainer>
                        <S.VarText>비율</S.VarText>
                      </S.VarTextContainer>
                      <S.Input
                        type="number"
                        value={editedVariationInfo.defaultPortion}
                        onChange={handleChangeDefaultPortion}
                        $flag={isFocused}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </S.VarContainer>
                  </S.VarHorizon>
                  <S.VarContainer>
                    <S.VarTextContainer>
                      <S.VarText>설명</S.VarText>
                    </S.VarTextContainer>
                    <S.Input
                      type="text"
                      value={editedVariationInfo.defaultDescription}
                      onChange={handleChangeDefaultDescription}
                      $flag={isFocused}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </S.VarContainer>
                </S.VarVertical>
                <S.Horizontal />
              </div>
              {editedVariationInfo.variations.map((variation, index) => (
                <>
                  <div key={index}>
                    <S.VarVertical>
                      <S.VarHorizon>
                        <S.VarContainer>
                          <S.VarTextContainer>
                            <S.VarText>변수</S.VarText>
                          </S.VarTextContainer>
                          <S.Input
                            type="text"
                            value={variation.value}
                            onChange={handleChangeVariationValue(index)}
                            $flag={isFocused}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                          />
                        </S.VarContainer>
                        <S.VarContainer>
                          <S.VarTextContainer>
                            <S.VarText>비율</S.VarText>
                          </S.VarTextContainer>
                          <S.Input
                            type="number"
                            value={variation.portion}
                            onChange={handleChangeVariaionPortion(index)}
                            $flag={isFocused}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                          />
                        </S.VarContainer>
                      </S.VarHorizon>
                      <S.VarContainer>
                        <S.VarTextContainer>
                          <S.VarText>설명</S.VarText>
                        </S.VarTextContainer>
                        <S.Input
                          type="text"
                          value={variation.description}
                          onChange={handleChangeVariationDescription(index)}
                          $flag={isFocused}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </S.VarContainer>
                    </S.VarVertical>
                  </div>
                  <ButtonLayer>
                    <S.DelButton onClick={deleteVariation(index)}>변수 삭제</S.DelButton>
                  </ButtonLayer>
                  <S.Horizontal />
                </>
              ))}
              <S.ButtonLayer>
                <S.AddButton onClick={addVariation}>변수 추가</S.AddButton>
              </S.ButtonLayer>
              <S.BottomButtonLayer>
                <S.CancelButton onClick={handleCancle}>취소하기</S.CancelButton>
                <S.ConfirmButton onClick={onClickSaveVariationInfo}>
                  저장하기
                </S.ConfirmButton>
              </S.BottomButtonLayer>
              {/* <button onClick={onClickSaveVariationInfo}>저장하기</button> */}
            </S.Container>
          </div>
        </>
      );
    }

    //  키워드 수정 폼
    if (selectedTab === 2) {
      return (
        <>
          <div>
            <S.Layer>
              <S.IconContainer>
                <KeyWord />
              </S.IconContainer>
              <S.TextContainer>
                <S.LabelText>키워드</S.LabelText>
              </S.TextContainer>
            </S.Layer>
            {editedKeywordInfo.keywords.map((keyword, indexOfKeyword) => (
              <div key={indexOfKeyword}>
                <S.Boundary>
                  <S.VarVertical>
                    <S.VarContainer>
                      <S.TextContainer>
                        <S.VarText>설명</S.VarText>
                      </S.TextContainer>
                      <S.Input
                        type="text"
                        value={keyword.description}
                        onChange={handleChangeKeywordDescription(indexOfKeyword)}
                        $flag={isFocused}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </S.VarContainer>
                    <S.VarContainer>
                      <S.TextContainer>
                        <S.VarText>값</S.VarText>
                      </S.TextContainer>
                      <S.Input
                        type="text"
                        value={keyword.value}
                        onChange={handleChangeKeywordValue(indexOfKeyword)}
                        $flag={isFocused}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </S.VarContainer>
                  </S.VarVertical>
                </S.Boundary>
                {keyword.properties.map((property, indexOfProperty) => (
                  <div key={indexOfProperty}>
                    <S.VarText>property {indexOfProperty} |||</S.VarText>
                    <S.VarHorizon>
                      <S.VarContainer>
                        <S.TextContainer>
                          <S.VarText>Key</S.VarText>
                        </S.TextContainer>
                        <S.Input
                          type="text"
                          value={property.property}
                          onChange={handleChangeProperty(indexOfKeyword, indexOfProperty)}
                          $flag={isFocused}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </S.VarContainer>
                      <S.VarContainer>
                        <S.TextContainer>
                          <S.VarText>Value</S.VarText>
                        </S.TextContainer>
                        <S.Input
                          type="text"
                          value={property.data}
                          onChange={handleChangeData(indexOfKeyword, indexOfProperty)}
                          $flag={isFocused}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </S.VarContainer>
                    </S.VarHorizon>
                    <S.HorizonButtonLayer>
                      <S.ButtonLayer>
                        <S.DelButton
                          onClick={deleteProperty(indexOfKeyword, indexOfProperty)}
                        >
                          Property 삭제
                        </S.DelButton>
                      </S.ButtonLayer>
                    </S.HorizonButtonLayer>
                    <S.Horizontal />
                  </div>
                ))}
                <S.ButtonLayer>
                  <S.AddButton onClick={() => addProperty(indexOfKeyword)}>
                    Property 추가
                  </S.AddButton>
                </S.ButtonLayer>
                <S.Horizontal />
                <S.ButtonLayer>
                  <S.DelButton onClick={() => deleteKeyword(indexOfKeyword)}>
                    Keyword 삭제
                  </S.DelButton>
                </S.ButtonLayer>
              </div>
            ))}
            <ButtonLayer>
              <S.AddButton onClick={addKeyword}>Keyword 추가</S.AddButton>
            </ButtonLayer>
            <S.BottomButtonLayer>
              <S.CancelButton onClick={handleCancle}>취소하기</S.CancelButton>
              <S.ConfirmButton onClick={onClickSaveKeywordInfo}>저장하기</S.ConfirmButton>
            </S.BottomButtonLayer>

            {/* <button onClick={onClickSaveKeywordInfo}>저장하기</button> */}
          </div>
        </>
      );
    }
  };

  return (
    <S.ModalBackground onClick={() => props.closeUpdateModal()}>
      <S.Modal>
        <S.ModalInputForm
          id="modal-scrollable"
          className="modal-scrollable"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            stopPropagation(e)
          }
        >
          {/* 탭 부분 */}
          <S.TabContainer>
            <S.TabElementContainer
              $select={selectedTab === 0}
              onClick={() => {
                setSelectedTab(0);
              }}
            >
              <S.TabElementText $select={selectedTab === 0}>플래그</S.TabElementText>
            </S.TabElementContainer>
            <S.TabElementContainer
              $select={selectedTab === 1}
              onClick={() => {
                setSelectedTab(1);
              }}
            >
              <S.TabElementText $select={selectedTab === 1}>변수</S.TabElementText>
            </S.TabElementContainer>
            <S.TabElementContainer
              $select={selectedTab === 2}
              onClick={() => {
                setSelectedTab(2);
              }}
            >
              <S.TabElementText $select={selectedTab === 2}>키워드</S.TabElementText>
            </S.TabElementContainer>
          </S.TabContainer>

          {/* 컨텐츠 부분 */}
          <S.ContentContainer>{renderContentByTab()}</S.ContentContainer>
        </S.ModalInputForm>
      </S.Modal>
    </S.ModalBackground>
  );
};

export default UpdateModal;
