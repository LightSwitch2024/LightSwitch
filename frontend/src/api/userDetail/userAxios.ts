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
    .post<BaseResponse<T>>('/api/v1/user/login', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getUserDetail<T>(
  email: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/user/${email}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function deleteUser<T>(
  email: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .delete<BaseResponse<T>>(`/api/v1/user/${email}`)
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
    .put<BaseResponse<T>>(`/api/v1/flag/${email}`, userData)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
