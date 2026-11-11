import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true, minlength: 3 })
  name!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    return {
      id: ret._id?.toString(),
      email: ret.email,
      name: ret.name,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});
