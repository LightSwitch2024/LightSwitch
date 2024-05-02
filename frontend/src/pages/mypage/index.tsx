import { AuthAtom } from '@global/AuthAtom';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { deleteUser, getUserDetail, updateUser } from '@/api/userDetail/userAxios';
import DelIcon from '@/assets/delete_forever.svg?react';
import * as M from '@/pages/mypage/indexStyle';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
}

interface UserUpdateRuquest {
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
}

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState<UserData>();
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

  const [editedUserEmail, setEditedUserEmail] = useState<string>('');
  const [editedFirstName, setEditedFristName] = useState<string>('');
  const [editedLastName, setEditedLastName] = useState<string>('');
  const [editedTelNumber, setEditedTelNumber] = useState<string>('');

  const { email } = useParams<{ email: string }>();

  const auth = useRecoilValue(AuthAtom);
  const navigate = useNavigate();

  /**
   * userEmail를 통해 마운트 시 해당 user의 상세 정보를 가져옴
   */
  // useEffect(() => {
  //   if (!auth.email) return navigate('/login');

  //   getUserDetail<UserData>(
  //     auth.email,
  //     (data: UserData) => {
  //       setUserDetail(data);
  //       setEditedUserEmail(data.email);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  // }, [auth.email]);

  /**
   * 수정에 사용할 User 정보를 셋업하는 함수
   * @param data UserData
   */
  // const setupEditedUser = (data: UserData): void => {
  //   setEditedUserEmail(data.email);
  //   setEditedFristName(data.firstName);
  //   setEditedLastName(data.lastName);
  //   setEditedTelNumber(data.telNumber);
  // };

  /**
   * User 삭제 버튼 클릭 이벤트 핸들러
   */
  // const onPressDeleteButton = () => {
  //   const deleteConfirm: boolean = confirm('삭제하기');

  //   if (deleteConfirm) {
  //     deleteUser<UserData>(
  //       auth.email,
  //       (data: UserData) => {
  //         console.log(`${data} user 삭제 완료`);
  //       },
  //       (err) => {
  //         console.log(err);
  //       },
  //     );
  //   }
  // };

  /**
   * User정보 수정 버튼 클릭 이벤트 핸들러
   */
  // const onPressEditButton = () => {
  //   setIsEditMode(true);
  // };

  // const handleEditedFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setEditedFristName(e.target.value);
  // };

  // const handleEditedLastName = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setEditedLastName(e.target.value);
  // };

  // const handleEditedTelNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setEditedTelNumber(e.target.value);
  // };

  // /**
  //  * 취소하기 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressCancelButton = () => {
  //   setIsEditMode(false);
  //   if (userDetail) {
  //     setupEditedUser(userDetail);
  //   }
  // };

  // /**
  //  * 저장하기 버튼 클릭 이벤트 핸들러
  //  */
  // const onPressSaveButton = () => {
  //   updateUser<UserData, UserUpdateRuquest>(
  //     email || '',
  //     {
  //       email: email || '',
  //       firstName: editedFirstName,
  //       lastName: editedLastName,
  //       telNumber: editedTelNumber || '',
  //     },
  //     (data: UserData) => {
  //       console.log(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  //   console.log('저장하기');
  // };

  const onPressUpdateButton = () => {
    alert('비밀번호 수정');
  };

  const onPressMemberUpdateButton = () => {
    alert('비밀번호 수정');
  };

  return (
    <M.MyPageLayout>
      <M.MyPageContainer>
        <M.MyPageTitleContainer>
          <M.TitleText>사용자 계정 관리</M.TitleText>
        </M.MyPageTitleContainer>
        <M.MyPageMemberDataContainer>
          <M.MyPageText>Email 주소</M.MyPageText>
          <M.EmailText>ssafy1234@gmail.com</M.EmailText>
          <M.NameWrapper>
            <M.NameBox>
              <M.MyPageText>이름</M.MyPageText>
              <M.NameInputBox>ssafy</M.NameInputBox>
            </M.NameBox>
            <M.NameBox>
              <M.MyPageText>성</M.MyPageText>
              <M.NameInputBox>Kim</M.NameInputBox>
            </M.NameBox>
          </M.NameWrapper>
          <M.TelWrapper>
            <M.TelBox>
              <M.MyPageText>전화번호</M.MyPageText>
              <M.TelInputBox>ssafy1234@gmail.com</M.TelInputBox>
            </M.TelBox>
          </M.TelWrapper>
          <M.ButtonWrapper>
            <M.Button onClick={onPressMemberUpdateButton}>회원정보 수정</M.Button>
            <M.Button onClick={onPressUpdateButton}>비밀번호 수정</M.Button>
          </M.ButtonWrapper>
        </M.MyPageMemberDataContainer>
        <M.DelContainer>
          <M.DelText>계정 삭제</M.DelText>
          <M.DelWrapper>
            <M.Text>계정이 영구적으로 삭제됩니다.</M.Text>
            <M.DelButton>
              <DelIcon />
              <span>계정 삭제하기</span>
            </M.DelButton>
          </M.DelWrapper>
        </M.DelContainer>
      </M.MyPageContainer>
    </M.MyPageLayout>
    // <div>
    //   {editedUserEmail && isEditMode && (
    //     <div>
    //       <div>
    //         <label htmlFor="email">이메일 : </label>
    //         <p>{email}</p>
    //       </div>
    //       <div>
    //         <label htmlFor="firstName">이름</label>
    //         <input
    //           placeholder={editedFirstName}
    //           value={editedFirstName}
    //           onChange={handleEditedFirstName}
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="lastName">성</label>
    //         <input
    //           placeholder={editedLastName}
    //           value={editedLastName}
    //           onChange={handleEditedLastName}
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="telNumber">전화번호</label>
    //         <input
    //           placeholder={editedTelNumber}
    //           value={editedTelNumber}
    //           onChange={handleEditedTelNumber}
    //         />
    //       </div>

    //       <button onClick={onPressCancelButton}>취소하기</button>
    //       <button onClick={onPressSaveButton}>저장하기</button>
    //     </div>
    //   )}
    //   {auth.email && !isEditMode && (
    //     <div>
    //       <div>
    //         <span>{auth.email}</span>
    //       </div>
    //       <div>
    //         <p>받아온 정보</p>
    //         <p>{userDetail?.email}</p>
    //       </div>
    //       <div>
    //         <span>{userDetail?.firstName}</span>
    //       </div>
    //       <div>
    //         <span>{userDetail?.lastName}</span>
    //       </div>
    //       <div>
    //         <span>{userDetail?.telNumber}</span>
    //       </div>

    //       <button onClick={onPressDeleteButton}>삭제하기</button>
    //       <button onClick={onPressEditButton}>수정하기</button>
    //     </div>
    //   )}
    // </div>
  );
};

export default UserDetail;
