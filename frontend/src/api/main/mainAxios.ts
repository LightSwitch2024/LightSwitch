import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';

// import axios from '@/api/mockAxios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export async function getMainPageOverview<T>(
  memberId: number,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/flag/overview?memberId=${memberId}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getFlagList<T>(
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>('/api/v1/flag')
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getTagList<T>(
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>('/api/v1/tag')
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getTagListByKeyword<T>(
  keyword: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/tag/${keyword}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function patchFlagActive<T>(
  flagId: number,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .patch<BaseResponse<T>>(`/api/v1/flag/${flagId}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getFlagListByKeyword<T>(
  keyword: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/flag/keyword/${keyword}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
