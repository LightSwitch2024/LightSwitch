import Tab from '@components/tab/index';
import CreateFlag from '@pages/create/index';
import * as S from '@routes/indexStyle';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FlagDetail from '@/pages/flag/index';
import LogIn from '@/pages/login/index';
import Main from '@/pages/main/index';
import UserDetail from '@/pages/mypage/index';
import SignUp from '@/pages/signup/index';

const Router = () => (
  <div>
    <Tab />
    <S.Content>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Main />} />
          <Route path="/create" element={<CreateFlag />} />
          <Route path="/flag/:flagId" element={<FlagDetail />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/mypage" element={<UserDetail />} />
        </Routes>
      </BrowserRouter>
    </S.Content>
  </div>
);

export default Router;
