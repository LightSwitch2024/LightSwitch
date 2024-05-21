import { TagsInputComponent } from '@pages/main/tagInput';
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { Tag } from '@/types/Tag';

import FilteringIcon from '@/assets/filtering.svg?react';
import SearchIcon from '@/assets/search.svg?react';
import CreateModal from '@/components/createModal';
import * as S from '@/pages/list/indexStyle';
import FlagTable from '@/pages/list/table';

const index = () => {
  const [flagKeyword, setFlagKeyword] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const [activeFlags, setActiveFlags] = useState<number>(0);
  const dropdownContainerRef = useRef(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const MySwal = withReactContent(Swal);
  const openDropdown = () => {
    setIsDropdownOpened(true);
    if (isDropdownOpened) {
      setIsDropdownOpened(false);
    }
  };

  const handleFlagSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlagKeyword(e.target.value);
  };

  const openCreateModal = () => {
    const html = document.querySelector('html');
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

  return (
    <>
      {isModalOpened &&
        createPortal(
          <CreateModal
            closeCreateModal={closeCreateModal}
            mode={'create'}
            flagDetail={undefined}
          />,
          document.body,
        )}
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
              <S.ButtonText onClick={() => openCreateModal()}>플래그 만들기</S.ButtonText>
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
    </>
  );
};

export default index;
