import {Req, Service} from "@tsed/common";
import {Model} from "mongoose";
import {Inject} from "@tsed/di";
import {User} from "../models/User";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {InvalidTokenException} from "../exceptions/UserException";
import {NotFound} from "@tsed/exceptions";
import * as nodemailer from "nodemailer";
import {ActivationToken} from "../models/ActivationToken";
import {v4 as uuidv4} from "uuid";
import * as process from "process";
require("dotenv").config();

@Service()
export class UserService {

  @Inject(User)
  private readonly userModel: Model<User>;

  @Inject(ActivationToken)
  private readonly activationTokenModel: Model<ActivationToken>;

  async findOne(options: Partial<User>): Promise<User | null> {
    return this.userModel.findOne(options).exec();
  }

  async findOneById(id: string | undefined | (() => string)): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    const SALTROUNDS = 10;
    const salt = await bcrypt.genSalt(SALTROUNDS);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    return this.userModel.create(newUser);
  }

  async isValidToken(req: Req) {
    const userLogged = await this.getUserLogged(req);

    return !!userLogged;
  }

  async getUserLogged(req: Req) {
    const authorizationHeader: string | undefined = req.headers.authorization;
    const userLogged = await this.getUserByToken(authorizationHeader!);
    const userId = userLogged.user._id;
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFound("User not found");
    }

    return user;
  }

  async getUserByToken(authorizationHeader: string): Promise<{ user: User, token: string }> {
    const token = this.getJustToken(authorizationHeader);
    const decode = jwt.decode(token, {complete: true});

    if (!decode || !decode.payload.sub) {
      throw new InvalidTokenException();
    }

    const userId = decode.payload.sub;
    const user = await this.findOneById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    return {user, token};
  }

  getJustToken(authorizationHeader: string): string {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new InvalidTokenException();
    }

    return authorizationHeader.slice(7);
  }

  attachToken(user: User, token: string) {
    user.token = token;
  }

  async sendEmailValidateToken(req: Req) {
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER_ROOT,
        pass: process.env.EMAIL_PASSOWORD_ROOT,
      },
    });
    const userLogged = await this.getUserLogged(req);
    const activationToken = await this.activationTokenModel.create({User: userLogged, token: uuidv4()});

    const mailOptions = {
      from: "crud.ts.ed.valentim@outlook.com",
      to: userLogged.username,
      subject: "Ativação da conta TS.ed-CRUD",
      text: `Código de ativação da conta ${activationToken.token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("E-mail enviado: " + info.response);
      }
    });
  }

  async activateAccount(token: string) {
    try {
      const activationToken = await this.activationTokenModel.findOne({token}).exec();

      if (!activationToken) {
        throw new InvalidTokenException();
      }

      await this.userModel.findByIdAndUpdate(activationToken.User, {$set: {isValidate: true}}).exec();

    } catch (error) {
      console.error(error);
    }
  }
}
