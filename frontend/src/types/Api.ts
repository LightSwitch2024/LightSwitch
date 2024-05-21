export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface SdkKeyReqDto {
  email: string;
}

export interface FlagActiveReqDto {
  active: boolean;
}
