import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface TagItem {
  content: string;
  colorHex: string;
}

interface Variation {
  value: string;
  portion: number | '';
  description: string;
}

interface FlagItem {
  title: string;
  tags: Array<TagItem>;
  description: string;
  type: string;
  keywords: string[];
  defaultValueForKeyword: string;
  defaultPortionForKeyword: number;
  defaultDescriptionForKeyword: string;
  variationsForKeyword: Array<Variation>;
  defaultValue: string;
  defaultPortion: number;
  defaultDescription: string;
  variations: Array<Variation>;

  memberId: number;
}

export async function createFlag<T>(
  data: FlagItem,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/api/v1/flag', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
