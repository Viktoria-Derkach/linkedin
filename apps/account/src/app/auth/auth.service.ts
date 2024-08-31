import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@linkedin/contracts';
import { UserRole } from '@linkedin/interfaces';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
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

  async login(id: string) {
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
}
