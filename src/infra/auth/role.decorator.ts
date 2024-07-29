import { SetMetadata } from "@nestjs/common"

export const ROLE = "ROLE"
export const RoleDecorator = (...roles: string[]) => SetMetadata(ROLE, roles)
