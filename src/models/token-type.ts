export interface Token {
  token: string;
  userId: string;
  time: number;
  admin: boolean;
}

export interface Token_DATABASE extends Token {
  _id?: string
}