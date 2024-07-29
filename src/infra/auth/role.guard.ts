import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"

import { ROLE } from "./role.decorator"

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLE, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles) return true

    const { user } = context.switchToHttp().getRequest()

    return roles.some(role => user?.role?.includes(role))
  }
}
