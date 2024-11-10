// src/user/user.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './schema/movie.schema';
import { CreateMovie, UpdateMovie } from './movie.type';
import * as validator from '../../../../../../shared/src/index';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}

  async create(createMovie: CreateMovie): Promise<Movie> {
    createMovie.title=validator.delete_xss(createMovie.title);
    return new this.movieModel(createMovie).save();
  }

  async getMoviesByUserId(userId: string): Promise<Movie[]> {
    const movies = await this.movieModel.find({userId}).select("-userId").exec();
    if (!movies || movies.length === 0)
      throw new NotFoundException('No movie found');
    return movies;
  }

  async update(userId : string, updateMovie: UpdateMovie): Promise<Movie> {
    updateMovie.title=validator.delete_xss(updateMovie.title);
    const { id, ...updateData } = updateMovie;
    const movie = this.movieModel.findOne({userId,id}).exec();
    if (!movie)
      throw new NotFoundException('No such movie to update');
    return this.movieModel.findByIdAndUpdate(id, updateData, {new: true}).select("-userId");
  }

  async delete(userId: string, movieId: string): Promise<Movie>{
    const movie = await this.movieModel.findOne({userId,_id:movieId}).exec();
    if(!movie)
      throw new NotFoundException('No such movie to delete');
    return await this.movieModel.findByIdAndDelete(movieId).select("-userId");
  }
}
