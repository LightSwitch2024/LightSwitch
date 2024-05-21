import { AuthAtom } from '@global/AuthAtom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { UserData } from '@/types/User';
import { deleteUser, getUserDetail, updateUser } from '@/api/userDetail/userAxios';
import DelIcon from '@/assets/delete_forever.svg?react';
import DeleteModal from '@/components/deleteModal/deleteModal';
import PasswordModal from '@/components/passwordModal/passwordModal';
import * as M from '@/pages/mypage/indexStyle';
import { MyPageHeader } from '@/pages/mypage/indexStyle';

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState<UserData>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [editedFirstName, setEditedFristName] = useState<string>('');
  const [firstNameCheck, setFirstNameCheck] = useState<boolean>(true);
  const [editedLastName, setEditedLastName] = useState<string>('');
  const [lastNameCheck, setLastNameCheck] = useState<boolean>(true);
  const [editedTelNumber, setEditedTelNumber] = useState<string>('');
  const [telNumberCheck, settelNumberCheck] = useState<boolean>(true);

  // const { email } = useParams<{ email: string }>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const auth = useRecoilValue(AuthAtom);
  const navigate = useNavigate();

  /**
   * userEmail를 통해 마운트 시 해당 user의 상세 정보를 가져옴
   */
  useEffect(() => {
    if (!auth.email) return navigate('/login');

    getUserDetail<UserData>(
      auth.email,
      (data: UserData) => {
        setUserDetail(data);
        setEditedFristName(data.firstName);
        setEditedLastName(data.lastName);
        setEditedTelNumber(data.telNumber);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [auth.email]);

  /**
   * User 삭제 버튼 클릭 이벤트 핸들러
   */
  const onPressDeleteButton = (): void => {
    // const deleteConfirm: boolean = confirm('삭제하기');
    setIsDeleteModal(true);
    setDeleteModalOpen(true);
    // if (deleteConfirm) {
    // }
  };

  /**
   * User정보 수정 버튼 클릭 이벤트 핸들러
   */
  const onPressEditButton = (): void => {
    setIsEditMode(true);
  };

  const validateHangle = (hangle: string): boolean => {
    const hangle_regex = /^[가-힣]+$/g;
    if (!hangle_regex.test(hangle)) {
      return false;
    } else {
      return true;
    }
  };

  const validatetelNumber = (telNumber: string): boolean => {
    const phone_regex = /^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}$/;
    if (!phone_regex.test(telNumber)) {
      return false;
    } else {
      return true;
    }
  };

  const handleEditedFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedFristName(e.target.value);
    setFirstNameCheck(validateHangle(e.target.value));
  };

  const handleEditedLastName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedLastName(e.target.value);
    setLastNameCheck(validateHangle(e.target.value));
  };

  const handleEditedTelNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedTelNumber(e.target.value);
    settelNumberCheck(validatetelNumber(e.target.value));
  };

  // /**
  //  * 취소하기 버튼 클릭 이벤트 핸들러
  //  */
  const onPressCancelButton = () => {
    setIsEditMode(false);
  };

  // /**
  //  * 저장하기 버튼 클릭 이벤트 핸들러
  //  */
  const onPressSaveButton = () => {
    updateUser<UserData>(
      auth.memberId,
      {
        memberId: auth.memberId,
        email: auth.email,
        firstName: editedFirstName,
        lastName: editedLastName,
        telNumber: editedTelNumber,
      },
      (data: UserData) => {
        setIsEditMode(false);
        setUserDetail(data);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <M.MyPageLayout>
      <M.MyPageContainer>
        <M.MyPageTitleContainer>
          <M.TitleText>사용자 계정 관리</M.TitleText>
        </M.MyPageTitleContainer>
        <M.MyPageMemberDataContainer>
          <M.MyPageHeader>
            <M.MyPageText>Email 주소</M.MyPageText>
            {isEditMode ? (
              <M.CloseButton onClick={onPressCancelButton}>×</M.CloseButton>
            ) : (
              <></>
            )}
          </M.MyPageHeader>
          <M.EmailText>{userDetail?.email}</M.EmailText>
          <M.NameWrapper>
            <M.NameBoxWrapper>
              <M.Wrapper>
                <M.NameBox>
                  <M.MyPageText>이름</M.MyPageText>
                  {!isEditMode ? (
                    <M.EmailText>{userDetail?.firstName}</M.EmailText>
                  ) : (
                    <M.TelInputBox
                      type="text"
                      placeholder={userDetail?.firstName}
                      value={editedFirstName}
                      onChange={handleEditedFirstName}
                    />
                  )}
                </M.NameBox>
                <M.NameBox>
                  <M.MyPageText>성</M.MyPageText>
                  {!isEditMode ? (
                    <M.EmailText>{userDetail?.lastName}</M.EmailText>
                  ) : (
                    <M.TelInputBox
                      type="text"
                      placeholder={userDetail?.lastName}
                      value={editedLastName}
                      onChange={handleEditedLastName}
                    />
                  )}
                </M.NameBox>
              </M.Wrapper>
              <M.NWrapper>
                {isEditMode &&
                  editedFirstName &&
                  editedLastName &&
                  (!firstNameCheck || !lastNameCheck) && (
                    <M.WarnText>유효하지 않은 형식입니다.</M.WarnText>
                  )}
              </M.NWrapper>
            </M.NameBoxWrapper>
          </M.NameWrapper>
          <M.TelWrapper>
            <M.TelBox>
              <M.MyPageText>전화번호</M.MyPageText>
              {!isEditMode ? (
                <M.EmailText>{userDetail?.telNumber}</M.EmailText>
              ) : (
                <M.TelInputBox
                  type="text"
                  placeholder={userDetail?.telNumber}
                  value={editedTelNumber}
                  onChange={handleEditedTelNumber}
                />
              )}
              {isEditMode && editedTelNumber && !telNumberCheck && (
                <M.WarnText>유효하지 않은 형식입니다.</M.WarnText>
              )}
            </M.TelBox>
          </M.TelWrapper>
        </M.MyPageMemberDataContainer>
        <M.ButtonWrapper>
          {!isEditMode ? (
            <M.Button onClick={onPressEditButton}>회원정보 수정</M.Button>
          ) : (
            <M.Button onClick={onPressSaveButton}>회원정보 저장</M.Button>
          )}

          <M.Button onClick={() => setModalOpen(true)}>비밀번호 수정</M.Button>
          <PasswordModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          <M.DelButton onClick={onPressDeleteButton}>
            <DelIcon />
            <span>계정 삭제하기</span>
          </M.DelButton>
        </M.ButtonWrapper>
        <DeleteModal
          isDeleteModal={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
        />
      </M.MyPageContainer>
    </M.MyPageLayout>
  );
};

export default UserDetail;
