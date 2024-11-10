import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieService } from './movie.service';
import { UserController } from './movie.controller';
import { Movie, MovieSchema } from './schema/movie.schema';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    AuthModule,
  ],
  providers: [MovieService],
  controllers: [UserController],
  exports: [MovieService],
})
export class MovieModule {}
