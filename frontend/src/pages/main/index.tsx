import LunitLogo from '@assets/LunitLogo.png';
import { AuthAtom } from '@global/AuthAtom';
import { Tag } from '@pages/main/tag';
import { TagsInputComponent } from '@pages/main/tagInput';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRecoilValue } from 'recoil';

import { createSdkKey, getMainPageOverview } from '@/api/main/mainAxios';
import CopyButton from '@/assets/content-copy.svg?react';
import FilteringIcon from '@/assets/filtering.svg?react';
import FilledFlag from '@/assets/flag.svg?react';
import OutlinedFlag from '@/assets/outlined-flag.svg?react';
import QueryBuilder from '@/assets/query-builder.svg?react';
import SdkKey from '@/assets/sdk-key.svg?react';
import SearchIcon from '@/assets/search.svg?react';
import CreateModal from '@/components/createModal';
import HistorySummary from '@/components/historySummary';
import * as S from '@/pages/main/indexStyle';
import FlagTable from '@/pages/main/table';

interface OverviewInfo {
  sdkKey: string;
  totalFlags: number;
  activeFlags: number;
}

interface SdkKeyResDto {
  key: string;
}

interface history {
  flagTitle: string;
  target: string | null;
  previous: string | null;
  current: string | null;
  action: historyType;
  createdAt: string;
}

enum historyType {
  // flag
  CREATE_FLAG,
  UPDATE_FLAG_TITLE,
  UPDATE_FLAG_TYPE,
  SWITCH_FLAG,
  DELETE_FLAG,

  // variation
  CREATE_VARIATION,
  UPDATE_VARIATION_VALUE,
  UPDATE_VARIATION_PORTION,
  DELETE_VARIATION,

  // keyword
  CREATE_KEYWORD,
  UPDATE_KEYWORD,

  // UPDATE_KEYWORD_PROPERTY,
  DELETE_KEYWORD,

  // property
  CREATE_PROPERTY,
  UPDATE_PROPERTY_KEY,
  UPDATE_PROPERTY_VALUE,
  DELETE_PROPERTY,
}

const index = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [totalFlags, setTotalFlags] = useState<number>(0);
  const [activeFlags, setActiveFlags] = useState<number>(0);
  const [historySummaryList, setHistorySummaryList] = useState<Array<history>>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [flagKeyword, setFlagKeyword] = useState<string>('');
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const auth = useRecoilValue(AuthAtom);
  const dropdownContainerRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    console.log('auth');
    console.log(auth);
  }, [auth]);

  /**
   * 화면 마운트 시 필요한 정보 가져오기
   */
  useEffect(() => {
    getMainPageOverview(
      (data: OverviewInfo) => {
        console.log('data');
        console.log(auth);
        setSdkKey(data.sdkKey ? data.sdkKey : '');
        setTotalFlags(data.totalFlags);
        setActiveFlags(data.activeFlags);
        setHistorySummaryList([
          {
            flagTitle: '플래그 생성',
            target: null,
            previous: null,
            current: null,
            action: historyType.CREATE_FLAG,
            createdAt: '2021-08-01T00:00:00',
          },
          {
            flagTitle: '플래그 생성',
            target: null,
            previous: null,
            current: null,
            action: historyType.CREATE_FLAG,
            createdAt: '2021-08-01T00:00:00',
          },
        ]);
      },
      (err) => {
        console.error(err);
      },
    );
  }, [auth]);

  // sdk 발급 받으면 sdk component 갱신
  useEffect(() => {
    console.log(sdkKey);
  }, [sdkKey]);

  useEffect(() => {
    let vh = 0;
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [window.innerHeight]);

  const html = document.querySelector('html');
  const openCreateModal = () => {
    setIsModalOpened(true);
    html?.classList.add('scroll-locked');
  };

  const closeCreateModal = () => {
    const closeConfirm = window.confirm('진짜 닫을거야?');
    if (closeConfirm) {
      setIsModalOpened(false);
      html?.classList.remove('scroll-locked');
    }
  };

  const openDropdown = () => {
    setIsDropdownOpened(true);
    if (isDropdownOpened) {
      setIsDropdownOpened(false);
    }
  };
  const handleFlagSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlagKeyword(e.target.value);
  };

  const handleClickCreateSdkKeyButton = () => {
    console.log('sdk key 발급');
    console.log(auth.email);
    createSdkKey<SdkKeyResDto>(
      { email: auth.email },
      (data: SdkKeyResDto) => {
        console.log(data);
        setSdkKey(data.key ? data.key : '');
      },
      (err) => {
        console.error(err);
      },
    );
  };

  return (
    <S.MainLayout>
      {isModalOpened &&
        createPortal(
          <CreateModal
            closeCreateModal={closeCreateModal}
            mode={'create'}
            flagDetail={undefined}
          />,
          document.body,
        )}
      <S.ComponentContainer>
        <S.MainTitleComponent>
          <S.imageContainer>
            <S.imageLunitLogo path={LunitLogo} />
          </S.imageContainer>
          <S.LunitInfoContainer>
            {/* <S.LunitTitleContainer> */}
            <S.LunitTitle>Lunit</S.LunitTitle>
            {/* </S.LunitTitleContainer> */}
            {/* <S.DescriptionContainer> */}
            {/* <S.SummaryInfoContinaer>
              <S.InfoTextContiner>
                <S.InfoText>#Created Time : 2024.04.19</S.InfoText>
              </S.InfoTextContiner>
              <S.InfoTextContiner>
                <S.InfoText>#Total Member : 12</S.InfoText>
              </S.InfoTextContiner>
            </S.SummaryInfoContinaer> */}
            {/* <S.CatchPhraseContainer> */}
            {/* <S.InfoTextContiner> */}
            <S.InfoText>
              인공지능 기술로 암을 정복합니다. 기술과 사람을 연결하여 생명을 구합니다.
            </S.InfoText>
            {/* </S.InfoTextContiner> */}
            {/* </S.CatchPhraseContainer> */}
            {/* </S.DescriptionContainer> */}
          </S.LunitInfoContainer>
        </S.MainTitleComponent>

        <S.OverviewComponent>
          <S.SdkKeyComponent>
            <S.SdkKeyTitleContainer>
              <S.Title>SDK 키</S.Title>
              <CopyButton />
            </S.SdkKeyTitleContainer>
            <S.SdkkeyContentContainer>
              <S.SdkKeyIconContainer>
                <SdkKey />
              </S.SdkKeyIconContainer>
              <S.SdkKeyTextContainer>
                {sdkKey.length > 0 ? (
                  <S.SdkKeyText>{sdkKey}</S.SdkKeyText>
                ) : (
                  <S.NoExistSdkKeyText>
                    <S.SdkKeyText>SDK 키가 없습니다.</S.SdkKeyText>
                    <S.createSdkKeyButton onClick={handleClickCreateSdkKeyButton}>
                      <S.SdkKeyText>SDK 키 발급</S.SdkKeyText>
                    </S.createSdkKeyButton>
                  </S.NoExistSdkKeyText>
                )}
                {/* <S.SdkKeyText>{sdkKey}</S.SdkKeyText> */}
                {/* <S.SdkKeyText>asdfasdfasdfasdf-asdf-qwerqwer</S.SdkKeyText> */}
              </S.SdkKeyTextContainer>
            </S.SdkkeyContentContainer>
          </S.SdkKeyComponent>

          <S.FlagComponent>
            <S.FlagTitleContainer>
              <S.Title>관리 플래그</S.Title>
            </S.FlagTitleContainer>
            <S.FlagContentContainer>
              <S.FlagCountContainer>
                <S.FlagCountIconContainer>
                  <OutlinedFlag />
                </S.FlagCountIconContainer>
                <S.FlagCountTextContainer>
                  <S.FlagCountTextSmallContainer>
                    <S.FlagCountTextSmall>총</S.FlagCountTextSmall>
                  </S.FlagCountTextSmallContainer>
                  <S.FlagCountTextBox>
                    <S.FlagCountTextBigContainer>
                      <S.FlagCountTextBig>{totalFlags}</S.FlagCountTextBig>
                      {/* <S.FlagCountTextBig>13</S.FlagCountTextBig> */}
                    </S.FlagCountTextBigContainer>
                    <S.FlagCountTextSmallContainer>
                      <S.FlagCountTextSmall>개</S.FlagCountTextSmall>
                    </S.FlagCountTextSmallContainer>
                  </S.FlagCountTextBox>
                </S.FlagCountTextContainer>
              </S.FlagCountContainer>

              <S.FlagCountContainer>
                <S.FlagCountIconContainer>
                  <FilledFlag />
                </S.FlagCountIconContainer>
                <S.FlagCountTextContainer>
                  <S.FlagCountTextSmallContainer>
                    <S.FlagCountTextSmall>활성</S.FlagCountTextSmall>
                  </S.FlagCountTextSmallContainer>
                  <S.FlagCountTextBox>
                    <S.FlagCountTextBigContainer>
                      <S.FlagCountTextBig>{activeFlags}</S.FlagCountTextBig>
                      {/* <S.FlagCountTextBig>7</S.FlagCountTextBig> */}
                    </S.FlagCountTextBigContainer>
                    <S.FlagCountTextSmallContainer>
                      <S.FlagCountTextSmall>개</S.FlagCountTextSmall>
                    </S.FlagCountTextSmallContainer>
                  </S.FlagCountTextBox>
                </S.FlagCountTextContainer>
              </S.FlagCountContainer>
            </S.FlagContentContainer>
          </S.FlagComponent>

        <S.HistoryComponent>
          <S.HisotryTitleContainer>
            <S.Title>히스토리</S.Title>
          </S.HisotryTitleContainer>
          <S.HistoryListContainer>
            {/* HistoryIconListContainer의 len과 HistoryContentTextContainer의 len은 반드시 일치 */}
            <S.HistoryIconListContainer>
              <S.Line />
              {historySummaryList.map((history, index) => {
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
              {historySummaryList.map((history, index) => {
                return (
                  <S.HistoryContentTextContainer $len={2.5} key={index}>
                    <HistorySummary {...history} />
                  </S.HistoryContentTextContainer>
                );
              })}
            </S.HistoryContentContainer>
          </S.HistoryListContainer>
        </S.HistoryComponent>
      </S.OverviewComponent>

        <S.FlagTableComponent>
          <S.TableNavContainer>
            <S.FlagNavTitleContainer>
              <S.FlagNavTitleContainer>
                <S.Title>플래그</S.Title>
              </S.FlagNavTitleContainer>
              <S.FlagNavSearchComponent ref={dropdownContainerRef}>
                <S.FlagNavSearchBoxContainer>
                  <S.FlagNavSearchInput placeholder="검색" onChange={handleFlagSearch} />
                  <S.SearchIconContainer>
                    <SearchIcon />
                  </S.SearchIconContainer>
                </S.FlagNavSearchBoxContainer>

                <S.FlagNavFilteringContainer>
                  <S.FlagNavFilteringButton onClick={() => openDropdown()}>
                    <S.FlagNavFiltering>
                      <FilteringIcon />
                    </S.FlagNavFiltering>
                  </S.FlagNavFilteringButton>
                </S.FlagNavFilteringContainer>
                {isDropdownOpened &&
                  dropdownContainerRef.current &&
                  createPortal(
                    <TagsInputComponent
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                      allowCreation={false}
                    />,
                    dropdownContainerRef.current,
                  )}
              </S.FlagNavSearchComponent>
            </S.FlagNavTitleContainer>

            <S.FlagNavCreateButtonContainer>
              <S.FlagNavCreateButton>
                <S.ButtonText onClick={() => openCreateModal()}>
                  플래그 만들기
                </S.ButtonText>
              </S.FlagNavCreateButton>
            </S.FlagNavCreateButtonContainer>
          </S.TableNavContainer>

          <S.FlagTableContainer>
            <FlagTable
              flagKeyword={flagKeyword}
              tags={selectedTags}
              activeFlagChanged={(acvtiveFlags) => setActiveFlags(acvtiveFlags)}
            />
          </S.FlagTableContainer>
        </S.FlagTableComponent>
      </S.ComponentContainer>
    </S.MainLayout>
  );
};

export default index;
