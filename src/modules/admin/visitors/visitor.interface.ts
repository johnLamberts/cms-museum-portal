
export interface IVisitor {
  visitor_id?: string;
  user_uid?: string;
  
  firstName: string;
  middleName?: string;
  lastName: string;

  visitorImg?: string;

  email: string;
  password?: string;
  confirmPassword?: string;
  
  isVerified?: boolean;
  status?: string;

  created_at?: string;
  updated_at?: string;

  userRole?: "visitor"
  
  address?: string;
}
