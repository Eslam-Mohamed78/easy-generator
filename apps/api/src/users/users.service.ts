import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export interface SafeUser {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByEmailWithHash(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.toSafe(user) : null;
  }

  async create(email: string, name: string, passwordHash: string): Promise<SafeUser> {
    const created = await this.userModel.create({ email: email.toLowerCase(), name, passwordHash });
    return this.toSafe(created);
  }

  private toSafe(user: UserDocument): SafeUser {
    return { id: user._id.toString(), email: user.email, name: user.name };
  }
}
