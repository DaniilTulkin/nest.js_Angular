import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './models/user.schema';
import { UserService } from './services/user.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: User.name, 
        schema: UserSchema
      }
    ])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
