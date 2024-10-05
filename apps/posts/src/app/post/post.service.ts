import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  createPost() {
    // try {
    //   const oldUser = await this.userRepository.findUser(email);
    //   if (oldUser) {
    //     throw new BadRequestException('This user has already been registered');
    //   }
    //   const newUser = await this.userRepository.createUser(newUserEntity);
    //   return { email: newUser.email };
    // } catch (error) {
    //   if (error instanceof BadRequestException) {
    //     return {
    //       statusCode: error.getStatus(),
    //       message: error.message,
    //     };
    //   }
    // }
  }
}
