import axios from '@api/axios';
import { Axios, AxiosError, AxiosResponse } from 'axios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface FlagInfo {
  title: string;
  tags: Array<{ content: string; colorHex: string }>;
  description: string;
}

interface Variation {
  value: string;
  portion: number | '';
  description: string;
}

interface VariationInfo {
  type: string;
  defaultValue: string;
  defaultPortion: number | '';
  defaultDescription: string;
  variations: Array<Variation>;
}

interface Keyword {
  properties: Array<Property>;
  description: string;
  value: string;
}

interface Property {
  property: string;
  data: string;
}

interface KeywordInfo {
  keywords: Array<Keyword>;
}

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
