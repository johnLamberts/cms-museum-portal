
export interface IUser {
  user_id?: string;
  user_uid?: string;
  
  firstName: string;
  middleName?: string;
  lastName: string;

  userImg?: string;

  email: string;
  password?: string;
  confirmPassword?: string;
  
  isVerified?: boolean;
  status?: string;

  created_at?: string;
  updated_at?: string;

  userRole?: string
  municipal_id?:  number;
}
