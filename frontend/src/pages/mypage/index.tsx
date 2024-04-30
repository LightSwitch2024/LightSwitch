import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { deleteUser, getUserDetail, updateUser } from '@/api/userDetail/userAxios';
import { AuthAtom } from '@/AuthAtom';

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [editedUserEmail, setEditedUserEmail] = useState<string>('');
  const [editedFirstName, setEditedFristName] = useState<string>('');
  const [editedLastName, setEditedLastName] = useState<string>('');
  const [editedTelNumber, setEditedTelNumber] = useState<string>();

  const { email } = useParams<{ email: string }>();

  const auth = useRecoilValue(AuthAtom);

  /**
   * userEmail를 통해 마운트 시 해당 user의 상세 정보를 가져옴
   */
  useEffect(() => {
    getUserDetail<UserData>(
      String(auth.email),
      (data: UserData) => {
        setUserDetail(data);
        setupEditedUser(data);
      },
      (err) => {
        console.log(err);
      },
    );
  }, [auth.email]);

  /**
   * 수정에 사용할 User 정보를 셋업하는 함수
   * @param data UserData
   */
  const setupEditedUser = (data: UserData): void => {
    setEditedUserEmail(data.email);
    setEditedFristName(data.firstName);
    setEditedLastName(data.lastName);
    setEditedTelNumber(data.telNumber);
  };

  /**
   * User 삭제 버튼 클릭 이벤트 핸들러
   */
  const onPressDeleteButton = () => {
    const deleteConfirm: boolean = confirm('삭제하기');

    if (deleteConfirm) {
      deleteUser<UserData>(
        String(email),
        (data: UserData) => {
          console.log(`${data} user 삭제 완료`);
        },
        (err) => {
          console.log(err);
        },
      );
    }
  };

  /**
   * User정보 수정 버튼 클릭 이벤트 핸들러
   */
  const onPressEditButton = () => {
    setIsEditMode(true);
  };

  const handleEditedFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedFristName(e.target.value);
  };

  const handleEditedLastName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedLastName(e.target.value);
  };

  const handleEditedTelNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditedTelNumber(e.target.value);
  };

  /**
   * 취소하기 버튼 클릭 이벤트 핸들러
   */
  const onPressCancelButton = () => {
    setIsEditMode(false);
    if (userDetail) {
      setupEditedUser(userDetail);
    }
  };

  /**
   * 저장하기 버튼 클릭 이벤트 핸들러
   */
  const onPressSaveButton = () => {
    updateUser<UserData, UserUpdateRuquest>(
      email || '',
      {
        email: email || '',
        firstName: editedFirstName,
        lastName: editedLastName,
        telNumber: editedTelNumber || '',
      },
      (data: UserData) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      },
    );
    console.log('저장하기');
  };

  return (
    <div>
      {userDetail && !isEditMode && (
        <div>
          <div>
            <span>{userDetail.email}</span>
          </div>
          <div>
            <span>{userDetail.firstName}</span>
          </div>
          <div>
            <span>{userDetail.lastName}</span>
          </div>
          <div>
            <span>{userDetail.telNumber}</span>
          </div>

          <button onClick={onPressDeleteButton}>삭제하기</button>
          <button onClick={onPressEditButton}>수정하기</button>
        </div>
      )}

      {editedUserEmail && isEditMode && (
        <div>
          <div>
            <label htmlFor="email">이메일 : </label>
            <p>{email}</p>
          </div>
          <div>
            <label htmlFor="firstName">이름</label>
            <input
              placeholder={editedFirstName}
              value={editedFirstName}
              onChange={handleEditedFirstName}
            />
          </div>
          <div>
            <label htmlFor="lastName">성</label>
            <input
              placeholder={editedLastName}
              value={editedLastName}
              onChange={handleEditedLastName}
            />
          </div>

          <div>
            <label htmlFor="telNumber">전화번호</label>
            <input
              placeholder={editedTelNumber}
              value={editedTelNumber}
              onChange={handleEditedTelNumber}
            />
          </div>

          <button onClick={onPressCancelButton}>취소하기</button>
          <button onClick={onPressSaveButton}>저장하기</button>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
