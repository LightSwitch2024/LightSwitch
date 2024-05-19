import spinnerGif1 from '@/assets/loading1.gif';
import spinnerGif2 from '@/assets/loading2.gif';
import spinnerGif3 from '@/assets/loading3.gif';
import spinnerGif4 from '@/assets/loading4.gif';
import * as S from '@/components/loading/indexStyle';
const Loading = () => {
  return (
    <S.SpinnerWrapper>
      <S.Spinner src={spinnerGif2} alt="Loading" />
    </S.SpinnerWrapper>
  );
};

export default Loading;
