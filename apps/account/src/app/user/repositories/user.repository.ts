import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '@linkedin/interfaces';
import { RefreshToken } from '../models/refresh-token.model';
import { ResetToken } from '../models/reset-token.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private readonly refreshModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private readonly resetModel: Model<ResetToken>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUser(email: string): Promise<IUser> {
    return this.userModel.findOne<IUser>({ email }).exec();
  }

  async findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async deleteUser(email: string) {
    this.userModel.deleteOne({ email }).exec();
  }

  async updateUser({ _id, ...rest }: UserEntity) {
    return this.userModel.updateOne({ _id }, { $set: { ...rest } }).exec();
  }

  async healthCheck() {
    return this.userModel.findOne({}).exec();
  }

  async createRefreshToken(token: string, userId, expiryDate) {
    await this.refreshModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true }
    );
  }

  async findRefreshToken(refreshToken: string) {
    return await this.refreshModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });
  }

  async refreshToken(resetToken: string, userId, expiryDate) {
    return await this.resetModel.create({
      token: resetToken,
      userId: userId,
      expiryDate,
    });
  }
}
