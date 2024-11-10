import { Controller, Post, Body, Get, Param, BadRequestException, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovie, UpdateMovie } from './movie.type';
import { Movie } from './schema/movie.schema';
import { JwtAuthGuard } from '../../auth/auth.guard';

@Controller('movies')
export class UserController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMovie(@Body() createMovie: CreateMovie): Promise<Movie> {
    return this.movieService.create(createMovie);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMovie(@Body() updateMovie: UpdateMovie){
    return this.movieService.update(updateMovie);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMovies(@Req() req): Promise<Movie[]>{
    return this.movieService.getMoviesByUserId(req.userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteMovie(): Promise<Movie>{
    return this.movieService.delete("test","test");
  }
}