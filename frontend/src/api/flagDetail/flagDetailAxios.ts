import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';

// import axios from '@/api/mockAxios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export async function getFlagDetail<T>(
  flagId: number,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/flag/${flagId}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function deleteFlag<T>(
  flagId: number,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .delete<BaseResponse<T>>(`/api/v1/flag/${flagId}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
