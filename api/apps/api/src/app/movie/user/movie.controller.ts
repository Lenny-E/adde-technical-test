import { Controller, Post, Body, Get, Param, BadRequestException, Put, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovie, UpdateMovie } from './movie.type';
import { Movie } from './schema/movie.schema';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { Types } from 'mongoose';

@Controller('movies')
export class UserController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMovie(@Req() req, @Body() createMovie: CreateMovie): Promise<Movie> {
    createMovie.user_id=req.userId;
    return this.movieService.create(createMovie);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMovie(@Req() req, @Body() updateMovie: UpdateMovie){
    return this.movieService.update(req.userId,updateMovie);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMovies(@Req() req): Promise<Movie[]>{
    return this.movieService.getMoviesByUserId(req.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteMovie(@Req() req, @Body() movieId:string ): Promise<Movie>{
    return this.movieService.delete(req.userId,movieId);
  }
}