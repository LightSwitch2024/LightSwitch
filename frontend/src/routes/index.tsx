import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FlagTable from '@/pages/main/index';
import SignUp from '@/pages/signup/index';
import CreateFlag from '@pages/create/index';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/table" element={<FlagTable />} />
      <Route path="/create" element={<CreateFlag />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
