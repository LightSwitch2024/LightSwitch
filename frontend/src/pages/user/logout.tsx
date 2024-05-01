import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { AuthAtom } from '@/global/AuthAtom';
import * as L from '@/pages/user/logoutStyle';

const LogOut = () => {
  const setAuthState = useSetRecoilState(AuthAtom);
  const navigate = useNavigate();
  const auth = useRecoilValue(AuthAtom);

  const handleLogOut = () => {
    setAuthState({
      isAuthenticated: false,
      email: auth.email,
      memberId: auth.memberId,
      firstName: auth.firstName,
      lastName: auth.lastName,
    });
    navigate('/');
  };

  return (
    <L.LogOutLayout>
      <L.LogOutContainer>
        <L.ButtonWrapper>
          <L.OKButton onClick={handleLogOut}>로그아웃</L.OKButton>
        </L.ButtonWrapper>
      </L.LogOutContainer>
    </L.LogOutLayout>
  );
};
export default LogOut;
