export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Cenceled = 'Cenceled',
}

export interface IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  roleId?: string;
}

export interface IUserCourses {
  courseId: string;
  purchaseState: PurchaseState;
}
