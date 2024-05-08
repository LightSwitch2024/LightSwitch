import { updateFlag, updateKeywords, updateVariations } from '@api/update/updateAxios';
import Bookmark from '@assets/bookmark.svg?react';
import CallSplit from '@assets/call-split.svg?react';
import Description from '@assets/description.svg?react';
import Edit from '@assets/edit.svg?react';
import Loop from '@assets/loop.svg?react';
import OutlinedFlagBig from '@assets/outlined-flag-big.svg?react';
import * as S from '@components/updateModal/indexStyle';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';

import { FlagVariationDivisionLine } from '../createModal/indexStyle';

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

  const renderContentByTab = () => {
    // 플래그 수정 폼
    if (selectedTab === 0) {
      return (
        <S.FlagEditForm>
          <input type="text" value={editedFlagInfo.title} onChange={handelChangeTitle} />
          <textarea
            value={editedFlagInfo.description}
            onChange={handleChangeDescription}
          />

          <button onClick={onClickSaveFlagInfo}>저장하기</button>
        </S.FlagEditForm>
      );
    }

    // 변수 수정 폼
    if (selectedTab === 1) {
      return (
        <>
          <div>
            <select value={editedVariationInfo.type}>
              <option value={'BOOLEAN'}>boolean</option>
              <option value={'INTEGER'}>Integer</option>
              <option value={'STRING'}>String</option>
            </select>
            <div>
              <input
                type="text"
                value={editedVariationInfo.defaultValue}
                onChange={handleChangeDefaultValue}
              />
              <input
                type="number"
                value={editedVariationInfo.defaultPortion}
                onChange={handleChangeDefaultPortion}
              />
              <input
                type="text"
                value={editedVariationInfo.defaultDescription}
                onChange={handleChangeDefaultDescription}
              />
            </div>
            {editedVariationInfo.variations.map((variation, index) => (
              <>
                <div key={index}>
                  <input
                    type="text"
                    value={variation.value}
                    onChange={handleChangeVariationValue(index)}
                  />
                  <input
                    type="number"
                    value={variation.portion}
                    onChange={handleChangeVariaionPortion(index)}
                  />
                  <input
                    type="text"
                    value={variation.description}
                    onChange={handleChangeVariationDescription(index)}
                  />
                </div>
                <button onClick={deleteVariation(index)}>변수 삭제</button>
              </>
            ))}
            <button onClick={addVariation}>변수 추가</button>

            <button onClick={onClickSaveVariationInfo}>저장하기</button>
          </div>
        </>
      );
    }

    //  키워드 수정 폼
    if (selectedTab === 2) {
      return (
        <>
          <div>
            {editedKeywordInfo.keywords.map((keyword, indexOfKeyword) => (
              <div key={indexOfKeyword}>
                <input
                  type="text"
                  value={keyword.description}
                  onChange={handleChangeKeywordDescription(indexOfKeyword)}
                />
                <input
                  type="text"
                  value={keyword.value}
                  onChange={handleChangeKeywordValue(indexOfKeyword)}
                />
                {keyword.properties.map((property, indexOfProperty) => (
                  <div key={indexOfProperty}>
                    property {indexOfProperty} ||| key :
                    <input
                      type="text"
                      value={property.property}
                      onChange={handleChangeProperty(indexOfKeyword, indexOfProperty)}
                    />
                    value :
                    <input
                      type="text"
                      value={property.data}
                      onChange={handleChangeData(indexOfKeyword, indexOfProperty)}
                    />
                    <button onClick={deleteProperty(indexOfKeyword, indexOfProperty)}>
                      Property 삭제
                    </button>
                  </div>
                ))}
                <button onClick={() => addProperty(indexOfKeyword)}>Property 추가</button>
                <button onClick={() => deleteKeyword(indexOfKeyword)}>
                  Keyword 삭제
                </button>
              </div>
            ))}
            <button onClick={addKeyword}>Keyword 추가</button>

            <button onClick={onClickSaveKeywordInfo}>저장하기</button>
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
