import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignUp from '../pages/SignUp';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
