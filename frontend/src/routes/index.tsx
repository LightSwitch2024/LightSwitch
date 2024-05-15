import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { Route, Routes, useLocation } from 'react-router-dom';

import FlagDetail from '@/pages/flag/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import FillOrg from '@/pages/organization/index';
import LogIn from '@/pages/user/login';

import ProtectedRoute from './protectedRoute';

const Router = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isOrgPage = location.pathname === '/fillorg';

  return (
    <div>
      {!isLoginPage && !isOrgPage && <Tab />}
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
          <Route path="/fillorg" element={<FillOrg />} />
        </Routes>
      </S.Content>
    </div>
  );
};
export default Router;
