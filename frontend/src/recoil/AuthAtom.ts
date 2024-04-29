import { atom, selector } from 'recoil';

export const AuthAtom = atom({
  key: 'AuthAtom',
  default: undefined,
});

export const isLogInSelector = selector({
  key: 'isLogInSelector',
  get: ({ get }) => !!get(AuthAtom),
});
