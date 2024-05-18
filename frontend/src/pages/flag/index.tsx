import CallSplit from '@assets/call-split.svg?react';
import Code from '@assets/code.svg?react';
import Description from '@assets/description.svg?react';
import FlagBig from '@assets/flag-big.svg?react';
import Loop from '@assets/loop.svg?react';
import QueryBuilder from '@assets/query-builder.svg?react';
import Restore from '@assets/restore.svg?react';
import ToggleOffIcon from '@assets/unfold_less.svg?react';
import ToggleOnIcon from '@assets/unfold-more.svg?react';
import { styled, Switch } from '@mui/material';
import { switchClasses } from '@mui/material/Switch';
import * as S from '@pages/flag/indexStyle';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { deleteFlag, getFlagDetail, updateFlag } from '@/api/flagDetail/flagDetailAxios';
import { getTagList, getTagListByKeyword, patchFlagActive } from '@/api/main/mainAxios';
import CreateModal from '@/components/createModal';
import History from '@/components/history';
import UpdateModal from '@/components/updateModal';

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

interface history {
  flagTitle: string;
  target: string | null;
  previous: string | null;
  current: string | null;
  action: historyType;
  createdAt: number[];
}

enum historyType {
  // flag
  CREATE_FLAG = 'CREATE_FLAG',
  UPDATE_FLAG_TITLE = 'UPDATE_FLAG_TITLE',
  UPDATE_FLAG_TYPE = 'UPDATE_FLAG_TYPE',
  SWITCH_FLAG = 'SWITCH_FLAG',
  DELETE_FLAG = 'DELETE_FLAG',

  // variation
  CREATE_VARIATION = 'CREATE_VARIATION',
  UPDATE_VARIATION_VALUE = 'UPDATE_VARIATION_VALUE',
  UPDATE_VARIATION_PORTION = 'UPDATE_VARIATION_PORTION',
  DELETE_VARIATION = 'DELETE_VARIATION',

  // keyword
  CREATE_KEYWORD = 'CREATE_KEYWORD',
  UPDATE_KEYWORD = 'UPDATE_KEYWORD',

  //    UPDATE_KEYWORD_PROPERTY,
  DELETE_KEYWORD = 'DELETE_KEYWORD',

  // property
  CREATE_PROPERTY = 'CREATE_PROPERTY',
  UPDATE_PROPERTY_KEY = 'UPDATE_PROPERTY_KEY',
  UPDATE_PROPERTY_VALUE = 'UPDATE_PROPERTY_VALUE',
  DELETE_PROPERTY = 'DELETE_PROPERTY',
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

interface FlagDetailResponse {
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
  histories: Array<history>;
}

interface TagItem {
  content: string;
  colorHex: string;
}

const FlagDetail = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { flagId } = useParams<{ flagId: string }>();
  const [flagDetail, setFlagDetail] = useState<FlagDetailItem>({} as FlagDetailItem);
  const [historyList, setHistoryList] = useState<history[]>([]);
  const [isToggle, setIsToggle] = useState<boolean[]>([]);
  const navigator = useNavigate();
  const MySwal = withReactContent(Swal);
  /**
   * flagId를 통해 마운트 시 해당 flag의 상세 정보를 가져옴
   */
  useEffect(() => {
    if (flagId === undefined || flagId === null) return;

    getFlagDetail<FlagDetailResponse>(
      Number(flagId),
      (data: FlagDetailResponse) => {
        console.log(data);
        setFlagDetail(data);
        setIsToggle(new Array(data.keywords.length).fill(false));
        console.log(data.histories);
        setHistoryList(data.histories);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [flagId]);

  const openUpdateModal = () => {
    setIsModalOpened(true);
  };

  const onClickDeleteFlag = () => {
    MySwal.fire({
      title: '플래그를 삭제하시겠습니까?',
      text: '다시 되돌릴 수 없습니다. 신중하세요.',
      icon: 'warning',

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '확인', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정

      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      if (result.isConfirmed) {
        requestDeleteFlag();
      }
    });
  };

  const requestDeleteFlag = () => {
    deleteFlag<number>(
      Number(flagId),
      (data: number) => {
        navigator('/');
      },
      (error) => {
        console.error(`플래그 삭제에 실패 했습니다. ${error}`);
      },
    );
  };

  const closeUpdateModal = () => {
    MySwal.fire({
      title: '모달을 닫으시겠습니까?',
      text: '변경사항이 저장되지 않습니다.',
      icon: 'warning',

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '확인', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정

      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      if (result.isConfirmed) {
        const html = document.querySelector('html');
        setIsModalOpened(false);
        html?.classList.remove('scroll-locked');
      }
    });
  };

  /**
   * 스위치 컴포넌트 스타일 선언
   */
  const SwitchTextTrack = styled(Switch)({
    width: 80,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: '#565555',
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
    },
    [`& .${switchClasses.track}`]: {
      background: 'linear-gradient(to right, #565555, #a2a1a1)',
      opacity: '1 !important',
      borderRadius: 20,
      position: 'relative',
      '&:before, &:after': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        width: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontWeight: 500,
      },
      '&:before': {
        content: '"ON"',
        left: 4,
        opacity: 0,
      },
      '&:after': {
        content: '"OFF"',
        right: 4,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: '#031c5b',
        transform: 'translateX(32px)',
        '&:hover': {
          backgroundColor: 'rgba(24,90,257,0.08)',
        },
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: '#fff',
      },
      [`& + .${switchClasses.track}`]: {
        background: 'linear-gradient(to right, #0533a5, #031c5b)',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
  });

  const handleToggleButtonClick = (flagId: number, active: boolean) => {
    onPressFlagSwitch(flagId, active);
  };

  /**
   * 플래그 스위치를 눌렀을 때 실행되는 함수를 반환합니다.
   * @param flagId 플래그 아이디
   * @returns
   */
  const onPressFlagSwitch = (flagId: number, currentActive: boolean) => {
    // 서로 다른 사용자가 동시에 같은 플래그를 수정할 때 발생하는 문제를 해결하기 위해
    // 현재 상태를 active로 보내고, 서버에서도 변경된 flag의 active 상태를 반환받아
    // 클라이언트에서 다시 한 번 변경을 시도합니다.
    patchFlagActive<boolean>(
      flagId,
      { active: currentActive },
      (changedActive) => {
        switchFlag(changedActive);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  /**
   * flag Id에 해당하는 플래그의 활성화 상태를 변경합니다.
   * @param flagId 플래그 아이디
   */
  function switchFlag(result: boolean): void {
    setFlagDetail({ ...flagDetail, active: result });
  }

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
              <S.OnOffButtonContainer>
                <SwitchTextTrack
                  sx={{ m: 1 }}
                  defaultChecked={flagDetail.active}
                  onChange={() =>
                    handleToggleButtonClick(flagDetail.flagId, flagDetail.active)
                  }
                />
                {/* <S.OnOffButton>{flagDetail.active ? 'ON' : 'OFF'}</S.OnOffButton> */}
              </S.OnOffButtonContainer>
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
            <S.DeleteButton onClick={onClickDeleteFlag}>
              <S.DeleteButtonText>삭제하기</S.DeleteButtonText>
            </S.DeleteButton>
            <S.UpdateButton onClick={openUpdateModal}>
              <S.UpdateButtonText>수정하기</S.UpdateButtonText>
            </S.UpdateButton>
          </S.ButtonLayer>
        </S.FlagContainer>

        <S.HistoryContainer>
          <S.HistoryTitleContainer>
            <Restore />
            <S.HistoryTitleText>히스토리</S.HistoryTitleText>
          </S.HistoryTitleContainer>

          <S.HistoryListContainer>
            {/* HistoryIconListContainer의 len과 HistoryContentTextContainer의 len은 반드시 일치 */}
            <S.HistoryIconListContainer>
              <S.Line />
              {/* 절대위치로 iconContainer 뒤에 선 긋기 */}
              {historyList.map((history, index) => {
                return (
                  <S.HistoryIconPadding key={index} $len={2.5}>
                    <S.HistoryIconContainer $len={1.5}>
                      <QueryBuilder />
                    </S.HistoryIconContainer>
                  </S.HistoryIconPadding>
                );
              })}
            </S.HistoryIconListContainer>
            <S.HistoryContentContainer>
              {/* map */}
              {historyList.map((history, index) => {
                return (
                  <S.HistoryContentTextContainer $len={2.5} key={index}>
                    <History {...history} />
                  </S.HistoryContentTextContainer>
                );
              })}
            </S.HistoryContentContainer>
          </S.HistoryListContainer>
        </S.HistoryContainer>
      </S.MainContainer>
    </>
  );
};

export default FlagDetail;
