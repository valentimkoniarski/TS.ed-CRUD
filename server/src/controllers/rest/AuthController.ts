import {BodyParams, Controller, Get, Inject, PathParams, Post, ProviderScope, Req, Scope} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {UserService} from "../../services/UserService";
import {User} from "../../models/User";
import {Returns, Security} from "@tsed/schema";
import {InvalidTokenException, UserAlreadyExistsException} from "../../exceptions/UserException";
import {BadRequest} from "@tsed/exceptions";
import { MongoError } from "mongodb";

@Controller("/auth")
@Scope(ProviderScope.SINGLETON)
export class AuthController {

  @Inject()
  private usersService: UserService;

  @Post("/login")
  @Authenticate("local")
  @Returns(200, User).Groups("token", "info")
  login(@Req() req: Req,
         @BodyParams("username") username: string,
         @BodyParams("password") password: string) {
    return req.user;
  }

  @Get("/user-info")
  @Authenticate("jwt")
  @Security("jwt")
  getUserInfo(@Req() req: Req) {
    return this.usersService.isValidToken(req);
  }

  @Post("/register")
  @Returns(200, User).Groups("info")
  async register(@BodyParams() user: User) {
    try {
      await this.usersService.create(user);
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new UserAlreadyExistsException();
      } else if (error instanceof MongoError) {
        throw new UserAlreadyExistsException();
      }

      throw new Error(error);
    }
  }

  @Get("/validator")
  @Authenticate("jwt")
  @Security("jwt")
  async validator(@Req() req: Req) {
    await this.usersService.sendEmailValidateToken(req);
  }

  @Post("/validator/:token")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, User).Groups("info")
  async activateAccount(@PathParams("token") token: string) {
    try {
      await this.usersService.activateAccount(token);
    } catch (Error) {
      if (Error instanceof InvalidTokenException) {
        throw new InvalidTokenException("Invalid token");
      }
      throw new Error(Error);
    }
  }

}
