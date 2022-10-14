import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators'

import { User, UserDocument } from '../models/user.schema';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: PaginateModel<UserDocument>,
                private authService: AuthService) {}

    create(user: User): Observable<Partial<User>> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                user.password = passwordHash;
                const newUser = new this.userModel(user);

                return from(newUser.save()).pipe(
                    map((user: User) => {
                        user.password = undefined;
                        return user;
                    }),
                    catchError(err => throwError(() => new Error(err)))
                )
            })
        )
    } 

    findOne(_id: string): Observable<Partial<User>> {
        return from(this.userModel.findById(_id)).pipe(
            map((user: User) => {
                user.password = undefined;
                return user;
            })
        );
    }

    findAll(page: number, limit: number, username: string): Observable<PaginateResult<User>> {
        const query = username ? {username: new RegExp(username)} : {};
        const options = {page, limit};
        return from(this.userModel.paginate(query, options)).pipe(
            map((paginateResult: PaginateResult<User>) => {
                paginateResult.docs.forEach(user => {user.password = undefined;});
                return paginateResult;
            })
        );
    }

    deleteOne(_id: string): Observable<any> {
        return from(this.userModel.deleteOne({_id}).exec())
    }

    updateOne(_id: string, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userModel.updateOne({_id}, user).exec());
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
          switchMap((user: User) => {
            if(user) {
                return this.authService.generateJWT(user).pipe(
                    map((jwt: string) => jwt)
                );
            }
            else return 'Wrong Credentials';
          })
        );
    }

    validateUser(email: string, password: string): Observable<Partial<User>> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        user.password = undefined;;
                        return user;
                    }
                    else throw Error;
                })
            ))
        );
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userModel.findOne({email}));
    }

    updateRoleOfUser(_id: string, user: User): Observable<any> {
        return from(this.userModel.updateOne({_id}, user).exec());
    }
}
