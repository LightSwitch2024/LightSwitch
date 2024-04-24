import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FlagTable from '@/pages/main/index';
import SignUp from '@/pages/signup/index';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/table" element={<FlagTable />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
