import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RolesEnum } from '../enums/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({unique: true})
    username: string;

    @Prop({lowercase: true, unique: true})
    email: string;

    @Prop()
    password: string;

    @Prop({
        type: String, 
        enum: RolesEnum,
        default: RolesEnum.USER
    })
    role: RolesEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);