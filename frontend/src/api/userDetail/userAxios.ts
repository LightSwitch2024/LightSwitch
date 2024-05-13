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

interface PWData {
  email: string;
  newPassword: string;
}

interface ForDelete {
  memberId: number;
  password: string;
}

interface UserData {
  memberId: number;
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

interface OrgData {
  email: string;
  orgName: string;
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
    .post<BaseResponse<T>>('/api/v1/member/login', data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function getUserDetail<T>(
  email: string,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .get<BaseResponse<T>>(`/api/v1/member/${email}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function deleteUser<T>(
  memberId: number,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .delete<BaseResponse<T>>(`/api/v1/member/${memberId}`)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updateUser<T>(
  memberId: number,
  userData: UserData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .put<BaseResponse<T>>(`/api/v1/member/${memberId}`, userData)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function updatePassword<T>(
  memberId: number,
  data: PWData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .put<BaseResponse<T>>(`/api/v1/member/${memberId}/password`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function checkPassword<T>(
  memberId: number,
  data: ForDelete,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  await axios
    .post<BaseResponse<T>>(`/api/v1/member/${memberId}`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}

export async function fillOrg<T>(
  memberId: number,
  data: OrgData,
  onSuccess: (data: T) => void,
  onFail: (err: AxiosError) => void,
): Promise<void> {
  axios
    .post<BaseResponse<T>>(`/api/v1/member/${memberId}/fillOrg`, data)
    .then((res: AxiosResponse<BaseResponse<T>>) => onSuccess(res.data.data))
    .catch((err: AxiosError) => onFail(err));
}
