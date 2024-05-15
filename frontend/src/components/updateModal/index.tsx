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
import { DefaultValue } from 'recoil';

import { confirmDuplicateFlag } from '@/api/create/createAxios';

interface UpdateModalProps {
  closeUpdateModal: () => void;
  flagDetail: FlagDetailItem;
  setFlagDetail: React.Dispatch<React.SetStateAction<FlagDetailItem>>;
}

interface Variation {
  variationId: number | '';
  value: string;
  portion: number | '';
  description: string;
}

interface Keyword {
  keywordId: number | '';
  properties: Array<Property>;
  description: string;
  value: string;
}

interface Property {
  propertyId: number | '';
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
    defaultPortion: props.flagDetail?.defaultPortion,
    defaultDescription: props.flagDetail?.defaultDescription || '',
    variations: props.flagDetail?.variations || [],
  });

  // const [editedVariationInfo, setDefault] = useState<VariationInfo>({
  //   type: props.flagDetail?.type,
  //   defaultValue: props.flagDetail?.defaultValue,
  //   defaultPortion: props.flagDetail?.defaultPortion,
  //   defaultDescription: props.flagDetail?.defaultDescription || '',
  //   variations: props.flagDetail?.variations || [],
  // });

  const [editedKeywordInfo, setEditedKeywordInfo] = useState<KeywordInfo>({
    keywords: props.flagDetail?.keywords || [],
  });

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isDuplicatedTitle, setIsDuplicatedTitle] = useState<boolean>(false);
  const [isInvalidBooleanVariation, setIsInvalidBooleanVariation] =
    useState<boolean>(false);
  const [isBlankData, setIsBlankData] = useState<boolean>(false);
  const [isWrongType, setIsWrongType] = useState<boolean>(false);
  const [type, setType] = useState<string>(props.flagDetail?.type || 'BOOLEAN');

  const [variations, setVariations] = useState<Array<Variation>>(
    props.flagDetail?.variations || [{ value: 'FALSE', portion: '', description: '' }],
  );
  const [isTypeEdited, setIsTypeEdited] = useState<boolean>(false);

  // default 값 =====================================================================
  const [defaultValue, setDefaultValue] = useState<string>(
    props.flagDetail?.defaultValue || 'TRUE',
  );
  const [defaultPortion, setDefaultPortion] = useState<number | ''>(
    props.flagDetail?.defaultPortion || 100,
  );
  const [defaultDescription, setDefaultDescription] = useState<string>(
    props.flagDetail?.defaultDescription || '',
  );
  const [isInvalidIntegerVariation, setIsInvalidIntegerVariation] =
    useState<boolean>(false);

  const [flagMode, setFlagMode] = useState<string>('');

  const typeConfig = ['BOOLEAN', 'INTEGER', 'STRING', 'JSON'];
  const isDetailMode = (): boolean => {
    return flagMode === 'detail';
  };

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
        variationId: '',
        value: '',
        portion: '',
        description: '',
      },
    ]);
  };

  const handleDefaultDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setDefaultDescription(e.target.value);
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

  const [isTypeChanged, setIsTypeChanged] = useState<boolean>(false);

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
   * 타입 변경 시 default value & variations 초기화 함수
   * @param typeItem
   * @returns
   */
  const handleEditeType = (typeItem: string) => () => {
    // Check if the type has change.

    if (type !== typeItem) {
      setType(typeItem);
      const newDefaultValue = typeItem === 'BOOLEAN' ? 'TRUE' : '';
      const newDefaultDescription = '';

      // Also update individual state items to match the form's expectation
      setDefaultValue(newDefaultValue);
      setDefaultDescription(newDefaultDescription);
      // Set variations based on the new type
      let newVariations: {
        variationId: number;
        value: string;
        portion: number;
        description: string;
      }[] = [];

      if (typeItem === 'BOOLEAN') {
        // For BOOLEAN type, add two default variations
        setDefaultPortion(100);
        newVariations = [{ variationId: 0, value: 'FALSE', portion: 0, description: '' }];
      } else {
        newVariations = [];
      }
      setEditedVariationInfo({
        type: typeItem,
        defaultValue: newDefaultValue,
        defaultPortion: 100,
        defaultDescription: newDefaultDescription,
        variations: newVariations,
      });
    }
  };

  /**
   * 타입 수정 버튼 클릭 이벤트 핸들러
   */
  const onClickTypeEdit = (): void => {
    setIsTypeEdited(true);
    console.log('타입 수정 버튼 클릭');
  };

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
    let value = e.target.value;
    if (editedVariationInfo.type === 'BOOLEAN') {
      value = e.target.value.toUpperCase();
    } else if (
      editedVariationInfo.type === 'INTEGER' &&
      isNaN(Number(e.target.value.at(-1)))
    ) {
      value = e.target.value.slice(0, -1);
    }

    setEditedVariationInfo({
      ...editedVariationInfo,
      defaultValue: value,
    });
  };

  const handleChangeDefaultPortion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedVariationInfo({
      ...editedVariationInfo,
      defaultPortion: Number(e.target.value),
    });

    console.log(editedVariationInfo.defaultPortion);
    // type 변경 생기면 null값으로 바꿈
    if (isTypeChanged) {
      setDefaultPortion(100);
      setEditedVariationInfo({
        ...editedVariationInfo,
        defaultPortion: Number(0),
      });
    }
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
      let value = e.target.value;
      if (editedVariationInfo.type === 'BOOLEAN') {
        value = e.target.value.toUpperCase();
      } else if (
        editedVariationInfo.type === 'INTEGER' &&
        isNaN(Number(e.target.value.at(-1)))
      ) {
        value = e.target.value.slice(0, -1);
      }

      const newVariations = editedVariationInfo.variations.map((variation, i) => {
        if (i === index) {
          return {
            ...variation,
            value: value,
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
      // 맨 앞에 0이 들어가면 0을 제거
      if (e.target.value[0] === '0') {
        e.target.value = e.target.value.slice(1);
      }

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

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedVariationInfo({
      ...editedVariationInfo,
      type: e.target.value,
    });

    console.log(editedVariationInfo.type);
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
            propertyId: '',
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
        keywordId: '',
        properties: [],
        description: '',
        value: '',
      }),
    });

    console.log(editedKeywordInfo.keywords);
  };

  const addVariation = () => {
    // 빈 variation 추가

    // type이 BOOLEAN일 경우 value는 true, false로 고정
    if (
      editedVariationInfo.type === 'BOOLEAN' &&
      editedVariationInfo.variations.length >= 1
    ) {
      setIsInvalidBooleanVariation(true);
      return;
    } else {
      setIsInvalidBooleanVariation(false);
    }

    if (editedVariationInfo.type === 'BOOLEAN') {
      setEditedVariationInfo({
        ...editedVariationInfo,
        variations: editedVariationInfo.variations.concat({
          variationId: '',
          value: editedVariationInfo.defaultValue === 'TRUE' ? 'FALSE' : 'TRUE',
          portion: 0,
          description: '',
        }),
      });

      return;
    }

    setEditedVariationInfo({
      ...editedVariationInfo,
      variations: editedVariationInfo.variations.concat({
        variationId: '',
        value: '',
        portion: '',
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

  // 저장하기 & 취소하기 버튼 클릭 이벤트 (axios 함수 호출)
  const onClickSaveFlagInfo = () => {
    // 유효성 검사
    setIsDuplicatedTitle(false);
    setIsInvalidBooleanVariation(false);
    setIsBlankData(false);

    let valid = true;
    if (editedFlagInfo.title === '' || editedFlagInfo.description === '') {
      valid = false;
      setIsBlankData(true);
      return;
    }

    if (!valid) return;

    updateFlag<FlagDetailItem>(
      props.flagDetail?.flagId,
      editedFlagInfo,
      (data: FlagDetailItem) => {
        console.log(data);
        // 수정된 flagDetail 업데이트
        props.setFlagDetail(data);
        setIsBlankData(false);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const onClickSaveVariationInfo = () => {
    // 유효성 검사
    setIsDuplicatedTitle(false);
    setIsInvalidBooleanVariation(false);
    setIsBlankData(false);

    let valid = true;
    if (editedVariationInfo.type === 'BOOLEAN') {
      if (
        editedVariationInfo.defaultValue !== 'TRUE' &&
        editedVariationInfo.defaultValue !== 'FALSE'
      ) {
        valid = false;
      }

      editedVariationInfo.variations.map((variation) => {
        // BOOLEAN 타입은 TRUE, FALSE만 유효
        if (variation.value !== 'TRUE' && variation.value !== 'FALSE') {
          valid = false;
        }

        // BOOLEAN 타입은 둘 다 TRUE이거나 둘 다 FALSE면 안됨
        if (variation.value === editedVariationInfo.defaultValue) {
          valid = false;
        }
      });

      if (!valid) {
        setIsInvalidBooleanVariation(true);
        return;
      }
    }

    if (editedVariationInfo.type === 'INTEGER') {
      if (isNaN(Number(editedVariationInfo.defaultValue))) {
        valid = false;
        setIsWrongType(true);
      }

      editedVariationInfo.variations.map((variation) => {
        if (isNaN(Number(variation.value))) {
          valid = false;
          setIsWrongType(true);
        }
      });
    }

    editedVariationInfo.variations.map((variation) => {
      if (variation.value === '' || variation.portion === '') {
        valid = false;
        setIsBlankData(true);
      }
    });

    if (editedVariationInfo.defaultValue === '') {
      valid = false;
      setIsBlankData(true);
    }

    if (!valid) return;

    updateVariations<FlagDetailItem>(
      props.flagDetail?.flagId,
      {
        type: editedVariationInfo.type,
        defaultValue: defaultValue,
        defaultPortion: defaultPortion,
        defaultDescription: defaultDescription,
        variations: editedVariationInfo.variations,
      },
      (data: FlagDetailItem) => {
        console.log(data);
        // 수정된 flagDetail 업데이트
        props.setFlagDetail(data);
        setIsInvalidBooleanVariation(false);
        setIsWrongType(false);
        setIsBlankData(false);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const onClickSaveKeywordInfo = () => {
    // 유효성 검사
    // variation type이 BOOLEAN일 경우 value는 TRUE, FALSE만 유효
    setIsDuplicatedTitle(false);
    setIsInvalidBooleanVariation(false);
    setIsBlankData(false);

    let valid = true;

    editedKeywordInfo.keywords.map((keyword) => {
      if (keyword.value === '') {
        setIsBlankData(true);
        valid = false;
      }

      if (editedVariationInfo.type === 'BOOLEAN') {
        // keyword.value 값이 TRUE, FALSE가 아닐 경우 경고
        if (keyword.value !== 'TRUE' && keyword.value !== 'FALSE') {
          setIsInvalidBooleanVariation(true);
          valid = false;
        }
      }

      if (editedVariationInfo.type === 'INTEGER') {
        if (isNaN(Number(keyword.value))) {
          setIsWrongType(true);
          valid = false;
        }
      }
    });

    if (!valid) return;

    updateKeywords<FlagDetailItem>(
      props.flagDetail?.flagId,
      editedKeywordInfo,
      (data: FlagDetailItem) => {
        console.log(data);
        // 수정된 flagDetail 업데이트
        props.setFlagDetail(data);
        // 경고 문구 초기화
        setIsBlankData(false);
        setIsDuplicatedTitle(false);
        setIsInvalidBooleanVariation(false);
      },
      (err: AxiosError) => {
        console.log(err);
      },
    );
  };

  const onClickCancelFlagInfo = () => {
    // 수정된게 없으면 return
    let confirm = false;
    if (
      editedFlagInfo.title === props.flagDetail.title &&
      editedFlagInfo.description === props.flagDetail.description
    ) {
      confirm = window.confirm('수정을 종료하시겠습니까?');
    } else {
      confirm = window.confirm(
        '수정된 내용이 저장되지 않습니다. 수정을 종료하시겠습니까?',
      );
    }

    if (confirm) {
      // editedFlagInfo 초기화
      initEditedData();
      props.closeUpdateModal();
    }
  };

  const onClickCancelVariationInfo = () => {
    // 수정된게 없으면 return
    let confirm = false;
    if (
      editedVariationInfo.defaultValue === props.flagDetail.defaultValue &&
      editedVariationInfo.defaultPortion === props.flagDetail.defaultPortion &&
      editedVariationInfo.defaultDescription === props.flagDetail.defaultDescription
    ) {
      confirm = window.confirm('수정을 종료하시겠습니까?');
    } else {
      confirm = window.confirm(
        '수정된 내용이 저장되지 않습니다. 수정을 종료하시겠습니까?',
      );
    }

    if (confirm) {
      // editedVariationInfo 초기화
      initEditedData();
      props.closeUpdateModal();
    }
  };

  const onClickCancelKeywordInfo = () => {
    // 수정된게 없으면 return
    let confirm = false;
    if (editedKeywordInfo.keywords === props.flagDetail.keywords) {
      confirm = window.confirm('수정을 종료하시겠습니까?');
    } else {
      confirm = window.confirm(
        '수정된 내용이 저장되지 않습니다. 수정을 종료하시겠습니까?',
      );
    }

    if (confirm) {
      // editedKeywordInfo 초기화
      initEditedData();
      props.closeUpdateModal();
    }
  };

  // 탭 이동함수 & 초기화
  const onClickTab = (select: number) => {
    initEditedData();
    setSelectedTab(select);
  };

  const initEditedData = () => {
    setEditedflagInfo({
      title: props.flagDetail.title,
      tags: props.flagDetail.tags,
      description: props.flagDetail.description,
    });

    setEditedVariationInfo({
      type: props.flagDetail.type,
      defaultValue: props.flagDetail.defaultValue,
      defaultPortion: props.flagDetail.defaultPortion,
      defaultDescription: props.flagDetail.defaultDescription,
      variations: props.flagDetail.variations,
    });

    setEditedKeywordInfo({
      keywords: props.flagDetail.keywords,
    });

    // 초기화 하면서 경구 문구도 초기화
    setIsDuplicatedTitle(false);
    setIsInvalidBooleanVariation(false);
    setIsBlankData(false);
    setIsWrongType(false);
  };

  // validation check
  /**
   * 중복된 타이틀 체크
   */
  const checkDuplicatedTitle = () => {
    if (editedFlagInfo.title === '') {
      return;
    }

    if (editedFlagInfo.title === props.flagDetail.title) {
      setIsDuplicatedTitle(false);
      return;
    }

    confirmDuplicateFlag(
      editedFlagInfo.title,
      (data: boolean) => {
        console.log(data);
        setIsDuplicatedTitle(data);
      },
      (err) => {
        console.log(err);
      },
    );

    setIsFocused(false);
  };

  const calculateTotalPortion = (): number => {
    let totalPortion = Number(0);
    editedVariationInfo.variations.map((variation) => {
      totalPortion += Number(variation.portion);
    });
    return totalPortion;
  };

  useEffect(() => {
    if (calculateTotalPortion() > Number(100)) {
      alert('변수 비율의 합이 100을 넘을 수 없습니다.');
      for (let i = 0; i < editedVariationInfo.variations.length; i++) {
        setEditedVariationInfo((prev) => {
          const newVariations = [...prev.variations];
          newVariations[i].portion = Number(0);
          return {
            ...prev,
            variations: newVariations,
          };
        });
      }
    } else {
      setEditedVariationInfo((prev) => {
        return {
          ...prev,
          defaultPortion: Number(100) - calculateTotalPortion(),
        };
      });
      setDefaultPortion(Number(100) - calculateTotalPortion());
    }
  }, [editedVariationInfo.variations]);

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
            <S.Layer>
              <S.FlagVariationInput
                value={editedFlagInfo.title}
                onChange={handelChangeTitle}
                $flag={isFocused}
                onBlur={checkDuplicatedTitle}
              />
            </S.Layer>

            {isDuplicatedTitle && (
              <S.WarnText>중복된 플래그 이름이 존재합니다.</S.WarnText>
            )}
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
            <S.Layer>
              <S.TextArea
                $flag={isFocused}
                value={editedFlagInfo.description}
                onChange={handleChangeDescription}
              />
            </S.Layer>
          </S.Container>
          <S.Container>
            <S.BottomLayer>
              <S.BottomButtonLayer>
                <S.CancelButton onClick={onClickCancelFlagInfo}>취소하기</S.CancelButton>
                <S.ConfirmButton onClick={onClickSaveFlagInfo}>저장하기</S.ConfirmButton>
              </S.BottomButtonLayer>
              <S.WarnTextWrapper>
                {isBlankData && <S.WarnText>필수 값이 비어있습니다.</S.WarnText>}
              </S.WarnTextWrapper>
            </S.BottomLayer>
          </S.Container>
        </S.FlagEditForm>
      );
    }

    // 변수 수정 폼
    if (selectedTab === 1) {
      return (
        <S.Container>
          <S.Layer>
            <S.IconContainer>
              <CallSplit />
            </S.IconContainer>
            <S.TextContainer>
              <S.LabelText>변수 타입</S.LabelText>
            </S.TextContainer>
          </S.Layer>
          <S.FlagTypeContainer onClick={onClickTypeEdit}>
            <S.FlagTypeContentContainer>
              <S.FlagTypeTextContainer>
                <S.FlagTypeText>{type}</S.FlagTypeText>
              </S.FlagTypeTextContainer>
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
          {/* <select value={editedVariationInfo.type}>
            <option value={'BOOLEAN'}>boolean</option>
            <option value={'INTEGER'}>Integer</option>
            <option value={'STRING'}>String</option>
          </select> */}
          <S.Layer>
            <S.IconContainer>
              <Loop />
            </S.IconContainer>
            <S.TextContainer>
              <S.LabelText>변수</S.LabelText>
            </S.TextContainer>
          </S.Layer>
          <S.FlagVariationContentLayer>
            <S.FlagVariationRowContainer>
              <S.VarContainer>
                <S.VarTextContainer>
                  <S.VarText>변수</S.VarText>
                </S.VarTextContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="값을 입력하세요"
                  value={defaultValue}
                  onChange={handleDefaultValueChange}
                  onBlur={checkFormatWithType}
                  $flag={isDetailMode()}
                />
              </S.VarContainer>
              <S.VarContainer>
                <S.VarTextContainer>
                  <S.VarText>비율</S.VarText>
                </S.VarTextContainer>
                <S.FlagVariationInput
                  type="number"
                  placeholder="변수 비율"
                  value={defaultPortion}
                  onChange={handleDefaultPortionChange}
                  onWheel={(event) => (event.target as HTMLElement).blur()}
                  disabled={true}
                  readOnly={true}
                  $flag={isDetailMode()}
                />
              </S.VarContainer>
            </S.FlagVariationRowContainer>
            <S.FlagVariationRowContainer>
              <S.VarDesContainer>
                <S.VarTextContainer>
                  <S.VarDesText>설명</S.VarDesText>
                </S.VarTextContainer>
                <S.FlagVariationInput
                  type="text"
                  placeholder="설명"
                  value={defaultDescription}
                  onChange={handleDefaultDescriptionChange}
                  $flag={isDetailMode()}
                />
              </S.VarDesContainer>
            </S.FlagVariationRowContainer>
            <S.Horizontal />
          </S.FlagVariationContentLayer>

          {editedVariationInfo.variations.map((variation, index) => (
            <React.Fragment key={index}>
              <div key={index}>
                <S.FlagVariationContentLayer>
                  <S.FlagVariationRowContainer>
                    <S.VarContainer>
                      <S.VarTextContainer>
                        <S.VarText>변수</S.VarText>
                      </S.VarTextContainer>
                      <S.FlagVariationInput
                        type="text"
                        placeholder="값을 입력하세요"
                        value={variation.value}
                        onChange={handleChangeVariationValue(index)}
                        $flag={isFocused}
                      />
                    </S.VarContainer>
                    <S.VarContainer>
                      <S.VarTextContainer>
                        <S.VarText>비율</S.VarText>
                      </S.VarTextContainer>
                      <S.FlagVariationInput
                        type="number"
                        placeholder="변수 비율"
                        value={variation.portion}
                        onChange={handleChangeVariaionPortion(index)}
                        onWheel={(event) => (event.target as HTMLElement).blur()}
                        $flag={isFocused}
                      />
                    </S.VarContainer>
                  </S.FlagVariationRowContainer>
                  <S.FlagVariationRowContainer>
                    <S.VarDesContainer>
                      <S.VarTextContainer>
                        <S.VarDesText>설명</S.VarDesText>
                      </S.VarTextContainer>
                      <S.FlagVariationInput
                        type="text"
                        placeholder="설명"
                        value={variation.description}
                        onChange={handleChangeVariationDescription(index)}
                        $flag={isFocused}
                      />
                    </S.VarDesContainer>
                  </S.FlagVariationRowContainer>
                </S.FlagVariationContentLayer>
              </div>
              <S.ButtonLayer>
                <S.DelButton onClick={deleteVariation(index)}>변수 삭제</S.DelButton>
              </S.ButtonLayer>
              <S.Horizontal />
            </React.Fragment>
          ))}
          <S.ButtonLayer>
            <S.AddButton onClick={addVariation}>변수 추가</S.AddButton>
          </S.ButtonLayer>
          <S.BottomButtonLayer>
            <S.CancelButton onClick={onClickCancelVariationInfo}>취소하기</S.CancelButton>
            <S.ConfirmButton onClick={onClickSaveVariationInfo}>저장하기</S.ConfirmButton>
            {isBlankData && <S.WarnText>필수 값이 비어있습니다.</S.WarnText>}
          </S.BottomButtonLayer>
          <S.BottomLayer>
            <S.WarnTextWrapper>
              {isInvalidBooleanVariation && (
                <S.WarnText>BOOLEAN 타입은 TRUE 와 FALSE 값만 유효합니다.</S.WarnText>
              )}
              {isWrongType && <S.WarnText>INTEGER 타입은 숫자만 유효합니다.</S.WarnText>}
            </S.WarnTextWrapper>
          </S.BottomLayer>
        </S.Container>
      );
    }

    //  키워드 수정 폼
    if (selectedTab === 2) {
      return (
        <S.Container>
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
              <S.KeywordHeadWrapper>
                <S.KeywordTextContainer>
                  <S.KeywordText>키워드{indexOfKeyword}</S.KeywordText>
                </S.KeywordTextContainer>
                <S.ButtonLayer>
                  <S.DelButton onClick={() => deleteKeyword(indexOfKeyword)}>
                    Keyword 삭제
                  </S.DelButton>
                </S.ButtonLayer>
              </S.KeywordHeadWrapper>
              <S.Boundary>
                <S.VarVertical>
                  <S.VarDefinitionContainer>
                    <S.TextContainer>
                      <S.VarText>설명</S.VarText>
                    </S.TextContainer>
                    <S.FlagVariationInput
                      type="text"
                      value={keyword.description}
                      onChange={handleChangeKeywordDescription(indexOfKeyword)}
                      $flag={isFocused}
                    />
                  </S.VarDefinitionContainer>
                  <S.VarDefinitionContainer>
                    <S.TextContainer>
                      <S.VarText>값</S.VarText>
                    </S.TextContainer>
                    <S.FlagVariationInput
                      type="text"
                      value={keyword.value}
                      onChange={handleChangeKeywordValue(indexOfKeyword)}
                      $flag={isFocused}
                    />
                  </S.VarDefinitionContainer>
                </S.VarVertical>
                <S.BoldHorizontal />
                {keyword.properties.map((property, indexOfProperty) => (
                  <div key={indexOfProperty}>
                    <S.HorizonButtonLayer>
                      <S.PropertyIndexTextContainer>
                        <S.PropertyIndexText>
                          property index {indexOfProperty}
                        </S.PropertyIndexText>
                      </S.PropertyIndexTextContainer>
                      <S.ButtonLayer>
                        <S.DelButton
                          onClick={deleteProperty(indexOfKeyword, indexOfProperty)}
                        >
                          Property 삭제
                        </S.DelButton>
                      </S.ButtonLayer>
                    </S.HorizonButtonLayer>
                    <S.VarHorizon>
                      <S.VarContainer>
                        <S.TextContainer>
                          <S.VarText>Key</S.VarText>
                        </S.TextContainer>
                        <S.FlagVariationInput
                          type="text"
                          value={property.property}
                          onChange={handleChangeProperty(indexOfKeyword, indexOfProperty)}
                          $flag={isFocused}
                        />
                      </S.VarContainer>
                      <S.VarContainer>
                        <S.TextContainer>
                          <S.VarText>Value</S.VarText>
                        </S.TextContainer>
                        <S.FlagVariationInput
                          type="text"
                          value={property.data}
                          onChange={handleChangeData(indexOfKeyword, indexOfProperty)}
                          $flag={isFocused}
                        />
                      </S.VarContainer>
                    </S.VarHorizon>
                    <S.Horizontal />
                  </div>
                ))}
                <S.ButtonLayer>
                  <S.AddButton onClick={() => addProperty(indexOfKeyword)}>
                    Property 추가
                  </S.AddButton>
                </S.ButtonLayer>
              </S.Boundary>
            </div>
          ))}
          <S.ButtonLayer>
            <S.AddButton onClick={addKeyword}>Keyword 추가</S.AddButton>
          </S.ButtonLayer>
          <S.BottomWrapper>
            <S.BottomButtonLayer>
              <S.CancelButton onClick={onClickCancelKeywordInfo}>취소하기</S.CancelButton>
              <S.ConfirmButton onClick={onClickSaveKeywordInfo}>저장하기</S.ConfirmButton>
            </S.BottomButtonLayer>
            <S.WarnEndWrapper>
              <S.BottomLayer>
                <S.WarnTextWrapper>
                  {isInvalidBooleanVariation && (
                    <S.WarnText>BOOLEAN 타입은 TRUE 와 FALSE 값만 유효합니다.</S.WarnText>
                  )}
                </S.WarnTextWrapper>
                <S.WarnTextWrapper>
                  {isWrongType && (
                    <S.WarnText>INTEGER 타입은 숫자만 유효합니다.</S.WarnText>
                  )}
                </S.WarnTextWrapper>
                <S.WarnTextWrapper>
                  {isBlankData && <S.WarnText>필수 값이 비어있습니다.</S.WarnText>}
                </S.WarnTextWrapper>
              </S.BottomLayer>
            </S.WarnEndWrapper>
          </S.BottomWrapper>
        </S.Container>
      );
    }

    return <></>;
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
              onClick={() => onClickTab(0)}
            >
              <S.TabElementText $select={selectedTab === 0}>플래그</S.TabElementText>
            </S.TabElementContainer>
            <S.TabElementContainer
              $select={selectedTab === 1}
              onClick={() => onClickTab(1)}
            >
              <S.TabElementText $select={selectedTab === 1}>변수</S.TabElementText>
            </S.TabElementContainer>
            <S.TabElementContainer
              $select={selectedTab === 2}
              onClick={() => onClickTab(2)}
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
