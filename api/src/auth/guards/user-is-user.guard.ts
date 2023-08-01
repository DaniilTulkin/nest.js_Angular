import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";

import { User } from "src/user/models/user.schema";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class UserIsUserGuard implements CanActivate {
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user: User = request.user.user;
        const id = '_id'

        return this.userService.findOne(user[id]).pipe(
            map((user: User) => {
                if(user[id].toString() === params[id]) return true;
                return user && false;
            })
        );
    }
}