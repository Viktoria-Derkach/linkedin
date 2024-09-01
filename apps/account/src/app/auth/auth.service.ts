import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@linkedin/contracts';
import { UserRole } from '@linkedin/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async register({ email, password, displayName }: AccountRegister.Request) {
    try {
      const oldUser = await this.userRepository.findUser(email);
      if (oldUser) {
        throw new BadRequestException('This user has already been registered');
      }
      const newUserEntity = await new UserEntity({
        displayName,
        email,
        passwordHash: '',
        role: UserRole.Student,
      }).setPassword(password);
      const newUser = await this.userRepository.createUser(newUserEntity);
      return { email: newUser.email };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
        };
      }
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new UnauthorizedException('Wrong login or password');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Wrong login or password');
    }
    return { id: user._id };
  }

  async generateToken(id) {
    const access_token = await this.jwtService.signAsync(
      { id },
      { expiresIn: '1h' }
    );
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, id);

    return {
      access_token,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.userRepository.createRefreshToken(token, userId, expiryDate);
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.userRepository.findRefreshToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Refresh token is Invalid');
    }
    return this.generateToken(token.userId);
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Wrong login or password');
    }

    const userEntity = new UserEntity(user);

    const isCorrectPassword = await userEntity.validatePassword(oldPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Wrong login or password');
    }

    const userWithNewPass = await userEntity.setPassword(newPassword);

    user.passwordHash = userWithNewPass.passwordHash;

    await user.save();
    return {
      message: 'Success',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findUser(email);
    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);

      await this.userRepository.refreshToken(resetToken, user._id, expiryDate);

      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return {
      message: 'if this user exists, they will receive an email',
    };
  }

  async resetPassword(resetToken, newPassword) {
    const token = await this.userRepository.findResetToken(resetToken);

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.userRepository.findUserById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    const userEntity = new UserEntity(user);
    const userWithNewPass = await userEntity.setPassword(newPassword);

    user.passwordHash = userWithNewPass.passwordHash;

    await user.save();

    return {
      message: 'Password reset',
    };
  }
}
