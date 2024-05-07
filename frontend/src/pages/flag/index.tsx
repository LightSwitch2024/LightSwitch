import CallSplit from '@assets/call-split.svg?react';
import Code from '@assets/code.svg?react';
import Description from '@assets/description.svg?react';
import FlagBig from '@assets/flag-big.svg?react';
import Loop from '@assets/loop.svg?react';
import ToggleOffIcon from '@assets/unfold_less.svg?react';
import ToggleOnIcon from '@assets/unfold-more.svg?react';
import * as S from '@pages/flag/indexStyle';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';

import { deleteFlag, getFlagDetail, updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword } from '@/api/main/mainAxios';
import CreateModal from '@/components/createModal';
import UpdateModal from '@/components/updateModal';

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

interface TagItem {
  content: string;
  colorHex: string;
}

const FlagDetail = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { flagId } = useParams<{ flagId: string }>();
  const [flagDetail, setFlagDetail] = useState<FlagDetailItem>({} as FlagDetailItem);
  const [isToggle, setIsToggle] = useState<boolean[]>([]);

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
        setIsToggle(new Array(data.keywords.length).fill(false));
        // setupEditedFlag(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [flagId]);

  const openUpdateModal = () => {
    setIsModalOpened(true);
  };

  const deleteFlag = () => {
    console.log('deleteFlag');
  };

  const closeUpdateModal = () => {
    setIsModalOpened(false);
  };

  return (
    <>
      {isModalOpened &&
        createPortal(
          <UpdateModal
            closeUpdateModal={closeUpdateModal}
            flagDetail={flagDetail}
            setFlagDetail={setFlagDetail}
          />,
          document.body,
        )}
      <S.MainContainer>
        <S.FlagContainer>
          <S.FlagTitleAndTagsLayer>
            <S.FlagTitleInputContainer>
              <S.FlagTitleIconContainer>
                <FlagBig />
              </S.FlagTitleIconContainer>
              <S.FlagTitleInput
                placeholder="플래그 이름"
                value={flagDetail.title}
                readOnly
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
            value={flagDetail.description}
            readOnly
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
            <S.FlagTypeContainer>
              <S.FlagTypeContentContainer>
                <S.FlagTypeTextContainer>
                  <S.FlagTypeText>{flagDetail.type}</S.FlagTypeText>
                </S.FlagTypeTextContainer>
              </S.FlagTypeContentContainer>
            </S.FlagTypeContainer>
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
            <S.FlagVariationRowContainer>
              <S.PropertyContainer>
                <S.KeywordLabelContainer>
                  <S.KeywordText>변수</S.KeywordText>
                </S.KeywordLabelContainer>
                <S.KeywordValueContainer
                  type="text"
                  placeholder="값을 입력하세요"
                  value={flagDetail.defaultValue}
                  readOnly
                />
              </S.PropertyContainer>
              <S.PropertyContainer>
                <S.KeywordLabelContainer>
                  <S.KeywordText>비율</S.KeywordText>
                </S.KeywordLabelContainer>
                <S.KeywordValueContainer
                  type="number"
                  placeholder="변수 비율"
                  value={flagDetail.defaultPortion}
                  readOnly
                />
              </S.PropertyContainer>
            </S.FlagVariationRowContainer>
            <S.FlagVariationRowContainer>
              <S.PropertyContainer>
                <S.KeywordLabelContainer>
                  <S.KeywordText>설명</S.KeywordText>
                </S.KeywordLabelContainer>
                <S.KeywordValueContainer
                  type="text"
                  placeholder="설명"
                  value={flagDetail.defaultDescription}
                  readOnly
                />
              </S.PropertyContainer>
            </S.FlagVariationRowContainer>
          </S.FlagVariationContentLayer>
          <S.FlagVariationDivisionLine />
          {flagDetail.variations &&
            flagDetail.variations.map((variation, index) => (
              <>
                <S.FlagVariationContentLayer key={index}>
                  <S.FlagVariationRowContainer>
                    <S.PropertyContainer>
                      <S.KeywordLabelContainer>
                        <S.KeywordText>변수</S.KeywordText>
                      </S.KeywordLabelContainer>
                      <S.KeywordValueContainer
                        type="text"
                        placeholder="값을 입력하세요"
                        value={variation.value}
                        readOnly
                      />
                    </S.PropertyContainer>
                    <S.PropertyContainer>
                      <S.KeywordLabelContainer>
                        <S.KeywordText>비율</S.KeywordText>
                      </S.KeywordLabelContainer>
                      <S.KeywordValueContainer
                        type="number"
                        placeholder="변수 비율"
                        value={variation.portion}
                        readOnly
                      />
                    </S.PropertyContainer>
                  </S.FlagVariationRowContainer>
                  <S.FlagVariationRowContainer>
                    <S.PropertyContainer>
                      <S.KeywordLabelContainer>
                        <S.KeywordText>설명</S.KeywordText>
                      </S.KeywordLabelContainer>
                      <S.KeywordValueContainer
                        type="text"
                        placeholder="설명"
                        value={variation.description}
                        readOnly
                      />
                    </S.PropertyContainer>
                  </S.FlagVariationRowContainer>
                </S.FlagVariationContentLayer>

                <S.FlagVariationDivisionLine />
              </>
            ))}

          <S.FlagTypeLayer>
            <S.FlagTypeLabel>
              <S.FlagTypeIconContainer>
                <Code />
              </S.FlagTypeIconContainer>
              <S.FlagTypeLabelTextContainer>
                <S.LabelText>키워드</S.LabelText>
              </S.FlagTypeLabelTextContainer>
            </S.FlagTypeLabel>
          </S.FlagTypeLayer>

          {flagDetail.keywords && flagDetail.keywords.length === 0 && (
            <>
              <S.OutsideToggleContainer>
                <S.KeywordText>
                  키워드가 존재하지 않습니다. &quot;수정하기&quot; 버튼을 클릭하여 추가해
                  주세요.
                </S.KeywordText>
              </S.OutsideToggleContainer>
            </>
          )}

          {flagDetail.keywords &&
            flagDetail.keywords.map((keyword, index) => (
              <S.KeywordContainer key={index}>
                <S.OutsideToggleContainer>
                  <S.OutsideToggleRowContainer>
                    <S.KeywordLabelContainer>
                      <S.KeywordText>설명</S.KeywordText>
                    </S.KeywordLabelContainer>
                    <S.KeywordValueContainer value={keyword.description} readOnly />
                  </S.OutsideToggleRowContainer>

                  <S.OutsideToggleRowContainer>
                    <S.KeywordLabelContainer>
                      <S.KeywordText>변수</S.KeywordText>
                    </S.KeywordLabelContainer>
                    <S.KeywordValueContainer value={keyword.value} readOnly />
                  </S.OutsideToggleRowContainer>

                  <S.OutsideToggleRowContainer>
                    {isToggle[index] ? (
                      <S.ToggleButtonContainer
                        onClick={() => {
                          const newToggle = [...isToggle];
                          newToggle[index] = !newToggle[index];
                          setIsToggle(newToggle);
                        }}
                      >
                        <S.ToggleTextContainer>
                          <S.ToggleText>키워드를 가리려면 클릭하세요.</S.ToggleText>
                        </S.ToggleTextContainer>
                        <ToggleOffIcon />
                      </S.ToggleButtonContainer>
                    ) : (
                      <S.ToggleButtonContainer
                        onClick={() => {
                          const newToggle = [...isToggle];
                          newToggle[index] = !newToggle[index];
                          setIsToggle(newToggle);
                        }}
                      >
                        <ToggleOnIcon />
                        <S.ToggleTextContainer>
                          <S.ToggleText>키워드를 확인하려면 클릭하세요.</S.ToggleText>
                        </S.ToggleTextContainer>
                      </S.ToggleButtonContainer>
                    )}
                  </S.OutsideToggleRowContainer>
                  {isToggle[index] && <S.FlagVariationDivisionLine />}
                  {isToggle[index] &&
                    keyword.properties.map((property, index) => (
                      <S.OutsideToggleRowContainer key={index}>
                        <S.PropertyContainer>
                          <S.KeywordLabelContainer>
                            <S.KeywordText>키</S.KeywordText>
                          </S.KeywordLabelContainer>
                          <S.KeywordValueContainer value={property.property} readOnly />
                        </S.PropertyContainer>
                        <S.PropertyContainer>
                          <S.KeywordLabelContainer>
                            <S.KeywordText>값</S.KeywordText>
                          </S.KeywordLabelContainer>
                          <S.KeywordValueContainer value={property.data} readOnly />
                        </S.PropertyContainer>
                      </S.OutsideToggleRowContainer>
                    ))}
                </S.OutsideToggleContainer>
              </S.KeywordContainer>
            ))}

          <S.ButtonLayer>
            <S.DeleteButton onClick={deleteFlag}>
              <S.DeleteButtonText>삭제하기</S.DeleteButtonText>
            </S.DeleteButton>
            <S.UpdateButton onClick={openUpdateModal}>
              <S.UpdateButtonText>수정하기</S.UpdateButtonText>
            </S.UpdateButton>
          </S.ButtonLayer>
        </S.FlagContainer>

        <S.HistoryContainer></S.HistoryContainer>
      </S.MainContainer>
    </>
  );
};

export default FlagDetail;
