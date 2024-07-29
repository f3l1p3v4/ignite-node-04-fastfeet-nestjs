import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { z } from "zod"

import { EnvService } from "../env/env.service"

const userPayload = z.object({
  sub: z.string().uuid(),
  role: z.enum(["ADMIN", "DELIVERYMAN"]),
})

export type UserPayload = z.infer<typeof userPayload>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
      ignoreExpiration: false,
    })
  }

  async validate(payload: UserPayload) {
    return userPayload.parse(payload)
  }
}
