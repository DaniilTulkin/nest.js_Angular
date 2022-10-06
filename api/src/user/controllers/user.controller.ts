import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.schema';

import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':_id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params._id);
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':_id')
    deleteOne(@Param('_id') _id: string): Observable<User> {
        return this.userService.deleteOne(_id);
    }

    @Put(':_id')
    updateOne(@Param('_id') _id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(_id, user);
    }
}
