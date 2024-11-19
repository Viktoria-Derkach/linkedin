import {
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@linkedin/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class UserCourses extends Document implements IUserCourses {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState: PurchaseState;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);

@Schema()
export class User extends Document<string> implements IUser {
  @Prop()
  displayName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.Student,
  })
  role: UserRole;

  @Prop({ required: false, type: SchemaTypes.ObjectId })
  roleId: Types.ObjectId;

  @Prop({ type: [UserCoursesSchema], _id: false })
  courses: Types.Array<UserCourses>;
}

export const UserSchema = SchemaFactory.createForClass(User);
