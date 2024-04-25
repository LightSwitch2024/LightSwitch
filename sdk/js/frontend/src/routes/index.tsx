import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  add,
  divide,
  multiply,
  subtract,
  LSClient,
  types,
  utils,
} from 'lightswitch-js-sdk';

console.log(add(1, 2));
import SignUp from '@/pages/signup/index';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
