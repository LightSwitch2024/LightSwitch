import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Main from '@/pages/main/index';
import { isLoginSelector } from '@/recoil/AuthAtom';

const navigate = useNavigate();

const ProtectedRoute = () => {
  const isLogin = useRecoilValue(isLoginSelector);
  isLogin ? <Main /> : navigate('/login');
};
