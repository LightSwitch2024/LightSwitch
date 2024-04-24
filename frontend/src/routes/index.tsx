import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignUp from '@/pages/signup/index';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
