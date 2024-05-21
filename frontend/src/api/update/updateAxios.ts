import axios from '@api/axios';
import { Axios, AxiosError, AxiosResponse } from 'axios';
import { BaseResponse } from '@/types/Api';
import { FlagInfo, VariationInfo, KeywordInfo } from '@/types/Flag';

export async function updateFlag<T>(
  flagId: number,
  data: FlagInfo,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  return axios
    .patch<BaseResponse<T>>(`/api/v1/flag/flaginfo/${flagId}`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updateVariations<T>(
  flagId: number,
  data: VariationInfo,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  return axios
    .patch<BaseResponse<T>>(`/api/v1/flag/variationinfo/${flagId}`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updateKeywords<T>(
  flagId: number,
  data: KeywordInfo,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  return axios
    .patch<BaseResponse<T>>(`/api/v1/flag/keywordinfo/${flagId}`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
