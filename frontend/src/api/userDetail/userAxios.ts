import axios from '@api/axios';
import { Axios, AxiosError, AxiosResponse } from 'axios';

interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface LogInData {
  email: string;
  password: string;
}

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  telNumber: string;
  email: string;
  password: string;
  authCode: string;
}

interface sendAuthCodeData {
  email: string;
}

interface confirmAuthCodeData {
  email: string;
  authCode: string;
}

export async function sendAuthCode<T>(
  data: sendAuthCodeData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/api/v1/mail/send', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function confirmAuthCode<T>(
  data: sendAuthCodeData,
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

export async function logIn<T>(
  data: LogInData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>('/v1/member/login', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getUserDetail<T>(
  email: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/v1/member/${email}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function deleteUser<T>(
  email: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .delete<BaseResponse<T>>(`/v1/member/${email}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updateUser<T, G>(
  email: string,
  userData: G,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .put<BaseResponse<T>>(`/v1/member/${email}`, userData)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updatePassword<T, G>(
  email: string,
  newPassword: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .put<BaseResponse<T>>(`/v1/member/${email}/password`, newPassword)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
