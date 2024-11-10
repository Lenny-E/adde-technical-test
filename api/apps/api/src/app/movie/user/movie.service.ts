// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './schema/movie.schema';
import { CreateMovie, UpdateMovie } from './movie.type';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(createMovie: CreateMovie): Promise<Movie> {
    return new this.movieModel(createMovie).save();
  }

  async getMoviesByUserId(userId: string): Promise<Movie[]> {
    const movies = await this.movieModel.find({userId}).exec();
    if (!movies || movies.length === 0)
      throw new NotFoundException('No movie found');
    return movies;
  }

  async update(updateMovie: UpdateMovie): Promise<Movie> {
    const { id, ...updateData } = updateMovie;
    return this.movieModel.findByIdAndUpdate(id, updateData, {new: true});
  }

  async delete(userId: string, movieId: string): Promise<Movie>{
    const movie = await this.movieModel.findOne({userId,_id:movieId}).exec();
    if(!movie)
      throw new NotFoundException('No movie found');
    return await this.movieModel.findByIdAndDelete(movieId);
  }
}
