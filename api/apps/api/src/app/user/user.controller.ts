import { Controller, Post, Body, Get, Param, BadRequestException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './user.type';
import { User } from './schema/user.schema';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Req() req,@Body() createUser: CreateUser): Promise<User> {
    if(req.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.create(createUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req, @Param('id') id:string): Promise<User>{
    if(req.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id : '+id);
    return this.userService.getUserById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() req): Promise<User[]>{
    if(req.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.getAllUsers();
  }
}