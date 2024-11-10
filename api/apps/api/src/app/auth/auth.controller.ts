import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from '../user/user.type';

@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        return this.authService.login(email,password);
    }

    @Post('register')
    async register(@Body() createUser : CreateUser) {
        return this.authService.register(createUser);
    }
}
