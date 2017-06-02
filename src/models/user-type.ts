export interface UserInfo {
  secret_code: string;
  user_name: string;
}

export interface User extends UserInfo {
  id?: string
}

export interface User_DATABASE extends UserInfo {
  _id?:string;
  password: string;
}
