import LunitLogo from '@assets/LunitLogo.png';
import { AuthAtom } from '@global/AuthAtom';
import { IconButton } from '@mui/material';
import { TagsInputComponent } from '@pages/main/tagInput';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { OverviewInfo, SdkKeyResDto } from '@/types/Flag';
import { Tag } from '@/types/Tag';

import { createSdkKey, getMainPageOverview } from '@/api/main/mainAxios';
import CopyCheck from '@/assets/check.svg?react';
import CopyButton from '@/assets/content-copy.svg?react';
import FilteringIcon from '@/assets/filtering.svg?react';
import FilledFlag from '@/assets/flag.svg?react';
import OutlinedFlag from '@/assets/outlined-flag.svg?react';
import SdkKey from '@/assets/sdk-key.svg?react';
import SearchIcon from '@/assets/search.svg?react';
import CreateModal from '@/components/createModal';
import { useLoadingStore } from '@/global/LoadingAtom';
import * as S from '@/pages/main/indexStyle';
import FlagTable from '@/pages/main/table';

const index = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [totalFlags, setTotalFlags] = useState<number>(0);
  const [activeFlags, setActiveFlags] = useState<number>(0);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [flagKeyword, setFlagKeyword] = useState<string>('');
  const [nullSDK, setNullSDK] = useState<boolean>(false);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const auth = useRecoilValue(AuthAtom);
  const dropdownContainerRef = useRef(null);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const navigate = useNavigate();
  const { loading, contentLoading, contentLoaded } = useLoadingStore();
  const MySwal = withReactContent(Swal);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sdkKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.log(err);
      navigate('/');
    }
  };

  useEffect(() => {
    if (sdkKey == '') {
      setNullSDK(true);
    } else {
      setNullSDK(false);
    }
  }, [auth, sdkKey]);

  useEffect(() => {
    let vh = 0;
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [window.innerHeight]);

  /**
   * 화면 마운트 시 필요한 정보 가져오기
   */
  useEffect(() => {
    contentLoading();
    getMainPageOverview(
      (data: OverviewInfo) => {
        setSdkKey(data.sdkKey ? data.sdkKey : '');
        setTotalFlags(data.totalFlags);
        setActiveFlags(data.activeFlags);
        contentLoaded();
      },
      (err) => {
        console.error(err);
        contentLoaded();
      },
    );
  }, [auth]);

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
    createSdkKey<SdkKeyResDto>(
      { email: auth.email },
      (data: SdkKeyResDto) => {
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
            <S.LunitTitle>Light Switch</S.LunitTitle>
            <S.InfoText>
              Light Switch는 플래그를 관리하고, 플래그를 통해 서비스의 기능을 제어할 수
              있는 플랫폼입니다.
            </S.InfoText>
          </S.LunitInfoContainer>
        </S.MainTitleComponent>

        <S.OverviewComponent>
          <S.SdkKeyComponent>
            <S.SdkKeyTitleContainer>
              <S.Title>SDK 키</S.Title>
              {!nullSDK && (
                <>
                  {!isCopied ? (
                    <IconButton
                      onClick={copyToClipboard}
                      style={{ cursor: 'pointer', width: '2.5rem', height: '2.5rem' }}
                    >
                      <CopyButton />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={copyToClipboard}
                      style={{ cursor: 'pointer', width: '2.5rem', height: '2.5rem' }}
                    >
                      <CopyCheck style={{ width: '100%', height: '100%' }} />
                    </IconButton>
                  )}
                </>
              )}
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
              <S.Title>변경 이력</S.Title>
            </S.HisotryTitleContainer>
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
