import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ErrorException } from '../utils/errorException';
import { InternalServerErrorException } from '@nestjs/common';
import * as Bcrypt from 'bcrypt';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const exist = await this.findOne({ username });
    if (exist) throw new ErrorException('this user already registered');
    const user = new UserEntity();
    user.username = username;
    user.password = await Bcrypt.hash(password, 12);
    try {
      await user.save();
    } catch (e) {
      //23505 is duplicate
      if (e.code === '23505') throw new ErrorException(e.detail);
      else throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.isCorrectPassword(password))) return user.username;
    else return null;
  }
}
