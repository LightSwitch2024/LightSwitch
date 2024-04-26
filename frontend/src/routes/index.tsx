import CreateFlag from '@pages/create/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FlagDetail from '@/pages/flag/index';
import Main from '@/pages/main/index';
import SignUp from '@/pages/signup/index';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/" element={<Main />} />
      <Route path="/create" element={<CreateFlag />} />
      <Route path="/flag/:flagId" element={<FlagDetail />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
