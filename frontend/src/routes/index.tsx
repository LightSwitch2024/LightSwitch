import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FlagDetail from '@/pages/flag/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import SignUp from '@/pages/signup/index';
import LogIn from '@/pages/user/login';

// import ProtectedRoute from './protectedRoute';

const Router = () => (
  <div>
    <Tab />
    <S.Content>
      <BrowserRouter>
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
      </BrowserRouter>
    </S.Content>
  </div>
);

export default Router;
