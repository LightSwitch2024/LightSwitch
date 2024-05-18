import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const contentLoadCompleteState = atom({
  key: 'contentLoadCompleteState',
  default: true,
});

export const loadingState = selector({
  key: 'loadingState',
  get: ({ get }) => {
    const contentLoadComplete = get(contentLoadCompleteState);
    console.log('loading called');
    console.log(contentLoadComplete);
    return !contentLoadComplete;
  },
});

export const useLoadingStore = () => {
  const [contentLoadComplete, setContentLoadComplete] = useRecoilState(
    contentLoadCompleteState,
  );
  const loading = useRecoilValue(loadingState);

  const contentLoading = () => {
    console.log('contentLoading called');
    setContentLoadComplete(false);
  };

  const contentLoaded = () => {
    console.log('contentLoaded called');
    setContentLoadComplete(true);
  };

  return {
    loading,
    contentLoadComplete,
    contentLoading,
    contentLoaded,
  };
};
