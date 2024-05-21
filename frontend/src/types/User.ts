export interface MemberAtom {
  isAuthenticated: boolean;
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
}

export interface MemberInfo {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
  orgName: string | '';
}

export interface UserData {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  telNumber: string;
}

export type SignUpData = {
  firstName: string;
  lastName: string;
  telNumber: string;
  email: string;
  password: string;
  authCode: string;
};

export type DeleteUserData = {
  firstName: string;
  lastName: string;
  telNumber: string;
  email: string;
  password: string;
};

export type SendAuthCodeData = {
  email: string;
};

export type ConfirmAuthCodeData = {
  email: string;
  authCode: string;
};

export type PWData = {
  email: string;
  newPassword: string;
};

export type FindPWData = {
  email: string;
  authCode: string;
};

export interface LogInData {
  email: string;
  password: string;
}

export interface ForDelete {
  memberId: number;
  password: string;
}

export interface OrgData {
  name: string;
  ownerId: number;
}
