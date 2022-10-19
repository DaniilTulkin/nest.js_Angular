import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, Request, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginateResult } from 'mongoose';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path, { join } from 'path';

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
    findAll(@Query('page') page: number = 1, 
            @Query('limit') limit: number = 10,
            @Query('username') username: string): Observable<PaginateResult<User>> {
        return this.userService.findAll(Number(page), Number(limit), username);
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

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profileimages',
            filename: (req, file, cd) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cd(null, `${filename}${extension}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        const user: User = req.user.user;

        return this.userService.updateOne(user['_id'], {profileimage: file.filename} as User).pipe(
            map((user: User) => ({profileimage: user.profileimage}))
        );
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages' + imagename)));
    }
}
