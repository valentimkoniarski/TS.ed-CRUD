import {Inject, Req} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "../services/UserService";

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "thisismysupersecretprivatekey1",
    issuer: "localhost",
    audience: "localhost"
  }
})
export class JwtProtocol implements OnVerify {

  @Inject()
  usersService: UserService;

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.usersService.findOneById(jwtPayload.sub);
    if (!user) {
      throw new Unauthorized("Wrong token");
    }

    const isUserWithoutValidation = !req.path.includes("/rest/auth") && !user.isValidate;
    if (isUserWithoutValidation) {
      throw new Unauthorized("User not validated");
    }

    req.user = user;

    return user;
  }
}
