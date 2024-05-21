import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { BaseResponse } from '@/types/Api';
import { Tag } from '@/types/Tag';
import { FlagItem } from '@/types/Flag';

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

export async function confirmDuplicateFlag<T>(
  keyword: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/flag/confirm/${keyword}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
