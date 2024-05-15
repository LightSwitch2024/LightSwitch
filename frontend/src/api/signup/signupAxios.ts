import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface SendAuthCodeData {
  email: string;
}

interface ConfirmAuthCodeData {
  email: string;
  authCode: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  orgName: string;
  telNumber: string;
  email: string;
  password: string;
  authCode: string;
}

export async function sendAuthCode<T>(
  data: SendAuthCodeData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/api/v1/mail/send', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function confirmAuthCode<T>(
  data: ConfirmAuthCodeData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/api/v1/mail/confirm', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function signUp<T>(
  data: SignUpData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/api/v1/member', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
