import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './models/user.schema';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    MongooseModule.forFeatureAsync([
      {
        name: User.name, 
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongoosePaginate)
          return schema;
        }
      }
    ]),
    AuthModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
