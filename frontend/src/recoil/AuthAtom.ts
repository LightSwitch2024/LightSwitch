import { atom, selector } from 'recoil';

export const AuthAtom = atom({
  key: 'AuthAtom',
  default: {
    isAuthenticated: false,
  },
});

export const isLogInSelector = selector({
  key: 'isLogInSelector',
  get: ({ get }) => {
    const auth = get(AuthAtom);
    return auth.isAuthenticated;
  },
});
