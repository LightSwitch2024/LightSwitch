import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const contentLoadCompleteState = atom({
  key: 'contentLoadCompleteState',
  default: true,
});

export const loadingState = selector({
  key: 'loadingState',
  get: ({ get }) => {
    const contentLoadComplete = get(contentLoadCompleteState);
    return !contentLoadComplete;
  },
});

export const useLoadingStore = () => {
  const [contentLoadComplete, setContentLoadComplete] = useRecoilState(
    contentLoadCompleteState,
  );
  const loading = useRecoilValue(loadingState);

  const contentLoading = (): void => {
    setContentLoadComplete(false);
  };

  const contentLoaded = (): void => {
    setContentLoadComplete(true);
  };

  return {
    loading,
    contentLoadComplete,
    contentLoading,
    contentLoaded,
  };
};
