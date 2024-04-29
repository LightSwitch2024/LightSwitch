import LunitLogo from '@assets/LunitLogo.png';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { getMainPageOverview } from '@/api/main/mainAxios';
import CopyButton from '@/assets/content-copy.svg?react';
import FilteringIcon from '@/assets/filtering.svg?react';
import FilledFlag from '@/assets/flag.svg?react';
import OutlinedFlag from '@/assets/outlined-flag.svg?react';
import SdkKey from '@/assets/sdk-key.svg?react';
import SearchIcon from '@/assets/search.svg?react';
import CreateModal from '@/components/createModal';
import * as S from '@/pages/main/indexStyle';
import FlagTable from '@/pages/main/table';

interface OverviewInfo {
  sdkKey: string;
  totalFlags: number;
  activeFlags: number;
}

const index = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [totalFlags, setTotalFlags] = useState<number>(0);
  const [activeFlags, setActiveFlags] = useState<number>(0);
  const [isModalOpened, setIsModalOpened] = useState(false);

  /**
   * 화면 마운트 시 필요한 정보 가져오기
   */
  useEffect(() => {
    //TODO : memberId를 어떻게 가져올지 고민해보기
    const memberId = 1;
    getMainPageOverview(
      memberId,
      (data: OverviewInfo) => {
        setSdkKey(data.sdkKey);
        setTotalFlags(data.totalFlags);
        setActiveFlags(data.activeFlags);
      },
      (err) => {
        console.error(err);
      },
    );
  }, []);

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

  return (
    <>
      {isModalOpened &&
        createPortal(<CreateModal closeCreateModal={closeCreateModal} />, document.body)}
      <S.MainTitleComponent>
        <S.imageContainer>
          <S.imageLunitLogo path={LunitLogo} />
        </S.imageContainer>
        <S.LunitInfoContainer>
          <S.LunitTitleContainer>
            <S.LunitTitle>Lunit</S.LunitTitle>
          </S.LunitTitleContainer>
          <S.DescriptionContainer>
            {/* <S.SummaryInfoContinaer>
              <S.InfoTextContiner>
                <S.InfoText>#Created Time : 2024.04.19</S.InfoText>
              </S.InfoTextContiner>
              <S.InfoTextContiner>
                <S.InfoText>#Total Member : 12</S.InfoText>
              </S.InfoTextContiner>
            </S.SummaryInfoContinaer> */}
            <S.CatchPhraseContainer>
              <S.InfoTextContiner>
                <S.InfoText>
                  인공지능 기술로 암을 정복합니다. 기술과 사람을 연결하여 생명을 구합니다.
                </S.InfoText>
              </S.InfoTextContiner>
            </S.CatchPhraseContainer>
          </S.DescriptionContainer>
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
              {/* <S.SdkKeyText>{sdkKey}</S.SdkKeyText> */}
              <S.SdkKeyText>asdfasdfasdfasdf-asdf-qwerqwer</S.SdkKeyText>
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
                <S.FlagCountTextBigContainer>
                  {/* <S.FlagCountTextBig>{totalFlags}</S.FlagCountTextBig> */}
                  <S.FlagCountTextBig>13</S.FlagCountTextBig>
                </S.FlagCountTextBigContainer>
                <S.FlagCountTextSmallContainer>
                  <S.FlagCountTextSmall>개</S.FlagCountTextSmall>
                </S.FlagCountTextSmallContainer>
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
                <S.FlagCountTextBigContainer>
                  {/* <S.FlagCountTextBig>{totalFlags}</S.FlagCountTextBig> */}
                  <S.FlagCountTextBig>7</S.FlagCountTextBig>
                </S.FlagCountTextBigContainer>
                <S.FlagCountTextSmallContainer>
                  <S.FlagCountTextSmall>개</S.FlagCountTextSmall>
                </S.FlagCountTextSmallContainer>
              </S.FlagCountTextContainer>
            </S.FlagCountContainer>
          </S.FlagContentContainer>
        </S.FlagComponent>

        <S.HistoryComponent>
          <S.HisotryTitleContainer>
            <S.Title>히스토리</S.Title>
          </S.HisotryTitleContainer>
        </S.HistoryComponent>
      </S.OverviewComponent>

      <S.FlagTableComponent>
        <S.TableNavContainer>
          <S.FlagNavTitleContainer>
            <S.FlagNavTitleContainer>
              <S.Title>플래그</S.Title>
            </S.FlagNavTitleContainer>
            <S.FlagNavSearchComponent>
              <S.FlagNavSearchBoxContainer>
                <S.FlagNavSearchInput placeholder="검색" />
                <S.SearchIconContainer>
                  <SearchIcon />
                </S.SearchIconContainer>
              </S.FlagNavSearchBoxContainer>

              <S.FlagNavFilteringContainer>
                <S.FlagNavFilteringButton>
                  <S.FlagNavFiltering>
                    <FilteringIcon />
                  </S.FlagNavFiltering>
                </S.FlagNavFilteringButton>
                {/* <S.FlagNavFilteringMenu></S.FlagNavFilteringMenu> */}
              </S.FlagNavFilteringContainer>
            </S.FlagNavSearchComponent>
          </S.FlagNavTitleContainer>
          <S.FlagNavCreateButtonContainer>
            <S.FlagNavCreateButton>
              <S.ButtonText onClick={() => openCreateModal()}>플래그 만들기</S.ButtonText>
            </S.FlagNavCreateButton>
          </S.FlagNavCreateButtonContainer>
        </S.TableNavContainer>

        <S.FlagTableContainer>
          <FlagTable />
        </S.FlagTableContainer>
      </S.FlagTableComponent>
    </>
  );
};

export default index;
