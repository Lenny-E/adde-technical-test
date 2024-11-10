// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUser, UpdateUser } from './user.type';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUser: CreateUser): Promise<User> {
    createUser.password = await argon2.hash(createUser.password);
    return new this.userModel(createUser).save();
  }

  async getUserById(id: String): Promise<User>{
    return this.userModel.findById(id).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
