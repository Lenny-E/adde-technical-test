import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { BadRequestException } from '@nestjs/common';

describe('UserService - getUserById', () => {
    let service: UserService;
    let userModel: Model<User>;

    const mockUser = {
        _id: '507f191e810c19729de860ea',
        username: 'testuser',
        email: 'testuser@example.com',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userModel = module.get<Model<User>>(getModelToken('User'));
    });

    it('should throw a BadRequestException if the ID is invalid', async () => {
        const invalidId = 'invalid';

        await expect(service.getUserById(invalidId)).rejects.toThrow(BadRequestException);
        await expect(service.getUserById(invalidId)).rejects.toThrow(`Invalid id : ${invalidId}`);
    });

    it('should return null if a valid ID is provided but no user is found', async () => {
        const validId = '507f191e810c19729de860ea';
        (userModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        const result = await service.getUserById(validId);
        expect(result).toBeNull();
        expect(userModel.findById).toHaveBeenCalledWith(validId);
    });

    it('should return the user if a valid ID is provided and the user is found', async () => {
        (userModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUser),
        });

        const result = await service.getUserById(mockUser._id);
        expect(result).toEqual(mockUser);
        expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
    });
});
