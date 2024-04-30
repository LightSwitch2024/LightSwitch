import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import * as L from '@/pages/user/logoutStyle';
import { AuthAtom } from '@/AuthAtom';

const LogOut = () => {
  const setAuthState = useSetRecoilState(AuthAtom);
  const navigate = useNavigate();

  const handleLogOut = () => {
    setAuthState({ isAuthenticated: false });
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
