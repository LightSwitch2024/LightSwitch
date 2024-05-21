import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { MemberAtom } from '@/types/User';

const { persistAtom } = recoilPersist();

export const AuthAtom = atom<MemberAtom>({
  key: 'AuthAtom',
  default: {
    isAuthenticated: false,
    memberId: 0,
    email: '',
    firstName: '',
    lastName: '',
    orgName: '',
  },
  effects_UNSTABLE: [persistAtom],
});

export const isLoggedInState = selector({
  key: 'isLoggedInState',
  get: ({ get }) => {
    const auth = get(AuthAtom);
    return auth.isAuthenticated;
  },
});
