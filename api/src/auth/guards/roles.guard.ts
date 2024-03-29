import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { User } from "src/user/models/user.schema";

import { UserService } from "src/user/services/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userSerivce: UserService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string>('roles', context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const user: User = request.user.user;

        return this.userSerivce.findOne(user['_id']).pipe(
            map((user: User) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission = false;

                if (hasRole()) hasPermission = true;
                return user && hasPermission;
            })
        );
    }
}