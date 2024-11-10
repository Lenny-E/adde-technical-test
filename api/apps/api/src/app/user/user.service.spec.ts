// src/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { CreateUser } from './user.type';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue({}),
            }),
            findById: jest.fn().mockResolvedValue({
              _id: 'userId',
              email: 'test@example.com',
              password: 'hashedPassword',
              username: 'testUser',
            }),
            findOne: jest.fn().mockResolvedValue({
              _id: 'userId',
              email: 'test@example.com',
              password: 'hashedPassword',
              username: 'testUser',
            }),
            find: jest.fn().mockResolvedValue([{
              _id: 'userId1',
              email: 'user1@example.com',
              username: 'user1',
            }, {
              _id: 'userId2',
              email: 'user2@example.com',
              username: 'user2',
            }]),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
})