import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'

import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from '../enums/roles.enum';
import { User } from '../models/user.schema';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    create(@Body() user: User): Observable<Partial<User> | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        );
    }

    @Get(':_id')
    findOne(@Param() params): Observable<Partial<User>> {
        return this.userService.findOne(params._id);
    }

    @Get()
    findAll(): Observable<Partial<User>[]> {
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

    @Roles(RolesEnum.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':_id/role')
    updateRoleOfUser(@Param('_id') _id: string, @Body() user: User): Observable<any> {
        return this.userService.updateRoleOfUser(_id, user);
    }
}
