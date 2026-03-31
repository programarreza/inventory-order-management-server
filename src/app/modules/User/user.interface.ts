export interface IUser {
  name: string;
  email: string;
  password: string;
  contactNo: string;
  address: string;
  status?: "active" | "disabled";
  image?: string;
  role: "user" | "admin" | "manager";
  isDeleted?: boolean;
}
