import axios from '@api/axios';
import { AxiosError, AxiosResponse } from 'axios';

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
