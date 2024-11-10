// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUser } from './user.type';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUser: CreateUser): Promise<User> {
    createUser.password = await argon2.hash(createUser.password);
    return new this.userModel(createUser).save();
  }

  async getUserById(id: string): Promise<User>{
    return this.userModel.findById(id).exec();
  }

  async getUserByMail(email: string): Promise<User>{
    return this.userModel.findOne({email}).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteUserByMail(email: string): Promise<any> {
    const user = await this.userModel.findOne({email}).exec();
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return this.userModel.findByIdAndDelete(user._id);
  }
}