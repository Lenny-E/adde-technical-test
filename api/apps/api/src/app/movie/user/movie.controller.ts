import { Controller, Post, Body, Get, Param, BadRequestException, Put, Delete, UseGuards, Req, UnauthorizedException, Request } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovie, UpdateMovie } from './movie.type';
import { Movie } from './schema/movie.schema';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMovie(@Request() req, @Body() createMovie: CreateMovie): Promise<CreateMovie> {
    createMovie.userId=req.user.userId;
    return this.movieService.create(createMovie);
  }
  

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMovie(@Request() req, @Body() updateMovie: UpdateMovie){
    return this.movieService.update(req.user.userId,updateMovie);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMovies(@Request() req): Promise<Movie[]>{
    return this.movieService.getMoviesByUserId(req.user.userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async deleteMovie(@Request() req, @Param('id') id:string): Promise<Movie>{
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id : '+id);
    return this.movieService.delete(req.user.userId,id);
  }
}