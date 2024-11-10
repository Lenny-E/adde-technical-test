import { Controller, Post, Body, Get, Param, BadRequestException, Put, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovie, UpdateMovie } from './movie.type';
import { Movie } from './schema/movie.schema';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async createMovie(@Body() createMovie: CreateMovie): Promise<Movie> {
    return this.movieService.create(createMovie);
  }

  @Put()
  async updateMovie(@Body() updateMovie: UpdateMovie){
    return this.movieService.update(updateMovie);
  }

  @Get()
  async getMovies(): Promise<Movie[]>{
    return this.movieService.getMoviesByUserId("test");
  }

  @Delete()
  async deleteMovie(): Promise<Movie>{
    return this.movieService.delete("test","test");
  }
}