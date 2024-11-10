import { Controller, Post, Body, Get, Param, BadRequestException, UseGuards, Req, UnauthorizedException, Request, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './user.type';
import { User } from './schema/user.schema';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Request() req,@Body() createUser: CreateUser): Promise<User> {
    if(req.user.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.create(createUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req, @Param('id') id:string): Promise<User>{
    if(req.user.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.getUserById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Request() req): Promise<User[]>{
    if(req.user.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.getAllUsers();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUserByEmail(@Request() req, @Body() body: { email: string }): Promise<any> {
    if(req.user.role!=='admin')
      throw new UnauthorizedException("Unauthorized");
    return this.userService.deleteUserByMail(body.email);
  } 

}