import Description from '@assets/description.svg?react';
import OutlinedFlagBig from '@assets/outlined-flag-big.svg?react';
import * as S from '@pages/flag/indexStyle';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { deleteFlag, getFlagDetail, updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';
import CreateModal from '@/components/createModal';

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

// interface FlagUpdateRuquest {
//   flagId: number;
//   title: string;
//   tags: Array<{ content: string; colorHex: string }>;
//   description: string;
//   type: string;
//   defaultValue: string;
//   defaultValuePortion: number;
//   defaultValueDescription: string;
//   variation: string;
//   variationPortion: number;
//   variationDescription: string;

//   userId: number;
// }

interface TagItem {
  content: string;
  colorHex: string;
}

const FlagDetail = () => {
  const [flagDetail, setFlagDetail] = useState<FlagDetailItem>({} as FlagDetailItem);
  const { flagId } = useParams<{ flagId: string }>();

  /**
   * flagId를 통해 마운트 시 해당 flag의 상세 정보를 가져옴
   */
  useEffect(() => {
    if (flagId === undefined || flagId === null) return;

    getFlagDetail<FlagDetailItem>(
      Number(flagId),
      (data: FlagDetailItem) => {
        console.log(data);
        setFlagDetail(data);
        // setupEditedFlag(data);
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
  // const setupEditedFlag = (data: FlagDetailItem): void => {
  //   setEditedFlagId(data.flagId);
  //   setEditedTitle(data.title);
  //   setEditedDescription(data.description);
  //   setEditedType(data.type);
  //   setEditedDefaultValue(data.defaultValue);
  //   setEditedDefaultPortion(data.defaultValuePortion);
  //   setEditedDefaultDescription(data.defaultValueDescription);
  //   setEditedVariation(data.variation);
  //   setEditedVariationPortion(data.variationPortion);
  //   setEditedVariationDescription(data.variationDescription);

  //   setSelectedTags(data.tags);
  // };

  // /**
  //  * Flag 삭제 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressDeleteButton = () => {
  //   const deleteConfirm: boolean = confirm('삭제하기');

  //   if (deleteConfirm) {
  //     deleteFlag<FlagDetailItem>(
  //       Number(flagId),
  //       (data: FlagDetailItem) => {
  //         console.log(`${data}번 flag 삭제 완료`);
  //       },
  //       (err) => {
  //         console.log(err);
  //       },
  //     );
  //   }
  // };

  // /**
  //  * Flag 수정 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressEditButton = () => {
  //   setIsEditMode(true);
  // };

  // /**
  //  * 수정 모드(edit mode == true)일 때, setupAllTags 함수 호출
  //  */
  // useEffect(() => {
  //   if (isEditMode == false) return;
  //   setupAllTags();
  // }, [isEditMode]);

  // /**
  //  * 전체 태그 목록을 가져오는 함수
  //  */
  // const setupAllTags = (): void => {
  //   getTagList(
  //     (data: Array<{ content: string; colorHex: string }>) => {
  //       setAllTags(data);
  //       setTags(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  // };

  // /**
  //  * 태그 검색어 입력 onBlur 이벤트 핸들러
  //  */
  // const updateTagListByKeyword = (): void => {
  //   // 태그 검색어가 없으면 axios 호출하지 않음
  //   if (
  //     tagSearchKeyword === '' ||
  //     tagSearchKeyword === undefined ||
  //     tagSearchKeyword === null
  //   ) {
  //     return;
  //   }

  //   getTagListByKeyword(
  //     tagSearchKeyword,
  //     (data: Array<{ content: string; colorHex: string }>) => {
  //       setTags(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  // };

  // const handleEditedTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setEditedTitle(e.target.value);
  // };

  // const handleEditedDescriptionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedDescription(e.target.value);
  // };

  // const handleEditedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
  //   setEditedType(e.target.value);
  // };

  // const handleEditedDefaultValueChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedDefaultValue(e.target.value);
  // };

  // const handleEditedDefaultPortionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedDefaultPortion(Number(e.target.value));
  // };

  // const handleEditedDefaultDescriptionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedDefaultDescription(e.target.value);
  // };

  // const handleEditedVariationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setEditedVariation(e.target.value);
  // };

  // const handleEditedVariationPortionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedVariationPortion(Number(e.target.value));
  // };

  // const handleEditedVariationDescriptionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setEditedVariationDescription(e.target.value);
  // };

  // const handleTagSearchKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setTagSearchKeyword(e.target.value);
  // };

  // const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   // 선택인지 해제인지 확인
  //   if (e.target.checked) {
  //     // 선택된 태그 추가
  //     setSelectedTags([
  //       ...selectedTags,
  //       { content: e.target.value, colorHex: '#bdbdbd' },
  //     ]);
  //   } else {
  //     // 선택 해제된 태그 제거
  //     setSelectedTags(selectedTags.filter((tag) => tag.content !== e.target.value));
  //   }
  // };

  // /**
  //  * 태그 목록이 비어있고 태그 검색어가 있으면 새로운 태그 생성
  //  */
  // useEffect(() => {
  //   // 태그 목록이 비어있고 태그 검색어가 있으면 새로운 태그 생성
  //   if (tags.length === 0 && tagSearchKeyword) {
  //     setSelectedTags([
  //       ...selectedTags,
  //       { content: tagSearchKeyword, colorHex: '#909090' },
  //     ]);
  //   }
  // }, [tags]);

  // /**
  //  * 취소하기 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressCancelButton = () => {
  //   setIsEditMode(false);
  //   if (flagDetail) {
  //     setupEditedFlag(flagDetail);
  //   }
  // };

  // /**
  //  * 저장하기 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressSaveButton = () => {
  //   updateFlag<FlagDetailItem, FlagUpdateRuquest>(
  //     editedFlagId || 0,
  //     {
  //       flagId: editedFlagId || 0,
  //       title: editedTitle,
  //       tags: selectedTags,
  //       description: editedDescription,
  //       type: editedType || '',
  //       defaultValue: editedDefaultValue,
  //       defaultValuePortion: editedDefaultPortion,
  //       defaultValueDescription: editedDefaultDescription,
  //       variation: editedVariation,
  //       variationPortion: editedVariationPortion,
  //       variationDescription: editedVariationDescription,

  //       userId: 1,
  //     },
  //     (data: FlagDetailItem) => {
  //       console.log(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  //   console.log('저장하기');
  // };

  // /**
  //  * 태그 검색어 비울때 전체 태그로 변경
  //  */
  // useEffect(() => {
  //   if (
  //     tagSearchKeyword === '' ||
  //     tagSearchKeyword === undefined ||
  //     tagSearchKeyword === null
  //   ) {
  //     setTags(allTags);
  //   }
  // }, [tagSearchKeyword]);

  return (
    <S.MainContainer>
      {/* {flagDetail && (
        <CreateModal
          closeCreateModal={(): void => {
            console.log('close');
          }}
          mode="detail"
          flagDetail={flagDetail}
        />
      )} */}
      <S.FlagContainer>
        <S.FlagTitleAndTagsLayer>
          <S.FlagTitleInputContainer>
            <S.FlagTitleIconContainer>
              <OutlinedFlagBig />
            </S.FlagTitleIconContainer>
            <S.FlagTitleInput
              placeholder="플래그 이름"
              value={flagDetail.title}
              // onChange={handleTitleChange}
              // onBlur={checkDuplicatedTitle}
            />
          </S.FlagTitleInputContainer>
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
      </S.FlagContainer>
      <S.HistoryContainer></S.HistoryContainer>
    </S.MainContainer>
  );
};

export default FlagDetail;
