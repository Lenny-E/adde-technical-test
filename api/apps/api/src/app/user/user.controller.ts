import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './user.type';
import { User } from './schema/user.schema';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUser: CreateUser): Promise<User> {
    return this.userService.create(createUser);
  }

  @Get(':id')
  async getUser(@Param('id') id:string): Promise<User>{
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id : '+id);
    return this.userService.getUserById(id);
  }

  @Get()
  async getUsers(): Promise<User[]>{
    return this.userService.getAllUsers();
  }
}