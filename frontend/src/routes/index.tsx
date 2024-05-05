import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import FlagDetail from '@/pages/flag/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import SignUp from '@/pages/signup/index';
import LogIn from '@/pages/user/login';

// import ProtectedRoute from './protectedRoute';
const LocationObserver = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Route changed to:', location.pathname);
  }, [location]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

const Router = () => (
  <div>
    <Tab />
    <LocationObserver />
    <S.Content>
      <Routes>
        {/* 메인화면 가기 전에 로그인 거치게끔하는 코드
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Main />} />
          </Route> */}
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<CreateFlag />} />
        <Route path="/flag/:flagId" element={<FlagDetail />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/mypage" element={<UserDetail />} />
        <Route path="/passwordfind" element={<UserDetail />} />
      </Routes>
    </S.Content>
  </div>
);

export default Router;
