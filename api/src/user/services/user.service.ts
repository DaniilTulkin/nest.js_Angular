import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';

import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    create(user: User): Observable<User> {
        const newUser = new this.userModel(user);
        return from(newUser.save());
    }

    findOne(_id: string): Observable<User> {
        return from(this.userModel.findById(_id));
    }

    findAll(): Observable<User[]> {
        return from(this.userModel.find().exec())
    }

    deleteOne(_id: string): Observable<any> {
        return from(this.userModel.deleteOne({_id}).exec())
    }

    updateOne(_id: string, user: User): Observable<any> {
        return from(this.userModel.updateOne({_id}, user).exec())
    }
}
