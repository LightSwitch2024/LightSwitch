import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { Route, Routes, useLocation } from 'react-router-dom';

import SignUp from '@/components/signup/index';
import FlagDetail from '@/pages/flag/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import CreateOrg from '@/pages/organization/index';
import LogIn from '@/pages/user/login';

import ProtectedRoute from './protectedRoute';

const Router = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Tab />}
      <S.Content>
        <Routes>
          {/* 메인화면 가기 전에 로그인 거치게끔하는 코드 */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Main />} />
          </Route>
          <Route path="/login" element={<LogIn />} />
          <Route path="/create" element={<CreateFlag />} />
          <Route path="/flag/:flagId" element={<FlagDetail />} />
          <Route path="/mypage" element={<UserDetail />} />
          <Route path="/passwordfind" element={<UserDetail />} />
          <Route path="/createorg" element={<CreateOrg />} />
        </Routes>
      </S.Content>
    </div>
  );
};
export default Router;
