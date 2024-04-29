import { Navigate, Outlet, useLocation } from 'react-router';
import { useRecoilValue } from 'recoil';

import { isLogInSelector } from '@/recoil/AuthAtom';

const ProtectedRoute = () => {
  const isLogin = useRecoilValue(isLogInSelector);
  const currentLocation = useLocation();

  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate to={'/login'} replace state={{ redirecredFrom: currentLocation }} />
  );
};

export default ProtectedRoute;
