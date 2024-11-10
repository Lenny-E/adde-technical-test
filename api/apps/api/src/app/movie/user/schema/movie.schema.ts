import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, min: 1, max: 5 })
  rating?: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);