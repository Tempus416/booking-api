import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class MeController {
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: any) {
    return {
      ok: true,
      user: req.user, // from JwtStrategy.validate()
      note: "Token validated by NestJS via Azure JWKs",
    };
  }
}
