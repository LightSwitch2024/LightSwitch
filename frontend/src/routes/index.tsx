import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loading from '@/components/loading/index';
import { useLoadingStore } from '@/global/LoadingAtom';
import FlagDetail from '@/pages/flag/index';
import List from '@/pages/list/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import FillOrg from '@/pages/organization/index';
import LogIn from '@/pages/user/login';

import ProtectedRoute from './protectedRoute';

const Router = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isOrgPage = location.pathname === '/fillorg';
  const { loading, contentLoading, contentLoaded } = useLoadingStore();
  return (
    <div>
      {loading ? <Loading /> : <div />}
      {!isLoginPage && !isOrgPage && <Tab />}
      <S.Content>
        <Routes>
          <Route path="/login" element={<LogIn />} />

          {/* 메인화면 가기 전에 로그인 거치게끔하는 코드 */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Main />} />
          </Route>

          <Route path="/create" element={<CreateFlag />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/list" element={<List />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/flag/:flagId" element={<FlagDetail />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/mypage" element={<UserDetail />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/passwordfind" element={<UserDetail />} />
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/fillorg" element={<FillOrg />} />
          </Route>
        </Routes>
      </S.Content>
    </div>
  );
};
export default Router;
