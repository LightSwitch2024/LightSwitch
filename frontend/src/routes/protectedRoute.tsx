import { Navigate, Outlet, useLocation } from 'react-router';
import { useRecoilValue } from 'recoil';

import { isLoggedInState } from '@/global/AuthAtom'; // AuthAtom 파일 경로에 맞게 수정

const ProtectedRoute = () => {
  const isAuthenticated = useRecoilValue(isLoggedInState);
  const currentLocation = useLocation();

  return isAuthenticated ? ( // Recoil 선택기를 통해 인증 상태 확인
    <Outlet /> // 인증되어 있으면 Outlet을 반환하여 자식 라우트를 렌더링
  ) : (
    // 인증되어 있지 않으면 로그인 페이지로 이동, 이동하고나서 로그인페이지로 넘어오기 전 페이지로 넘어감
    <Navigate to={'/login'} replace state={{ redirecredFrom: currentLocation }} />
  );
};

export default ProtectedRoute;
