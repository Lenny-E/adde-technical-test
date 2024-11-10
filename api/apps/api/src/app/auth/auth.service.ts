import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { CreateUser } from '../user/user.type';
import { User } from '../user/schema/user.schema';
import * as validator from '../../../../../shared/src/index';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async login(mail: string, password: string) {

    const user = await this.userService.getUserByMail(mail);
    if (!user)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.validate_password(user.id, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id , role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUser : CreateUser) : Promise<User>{
    if(!this.validate_input(createUser))
      throw new BadRequestException("Invalid input data");
    return this.userService.create(createUser);
  }

  async validate_password(userId: string, password: string): Promise<boolean> {
    const user = await this.userService.getUserById(userId)
    if (!user)
      return false
    return argon2.verify(user.username, password);
  }

  async validate_input(createUser : CreateUser) : Promise<boolean>{
    return validator.verify_email(createUser.email) && validator.verify_password(createUser.password) && validator.verify_name(createUser.name);
  }
}