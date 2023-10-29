import {Model, ObjectID, Unique} from "@tsed/mongoose";
import {Email, Groups, MaxLength, MinLength, Pattern, Property, Required} from "@tsed/schema";
import * as bcrypt from "bcrypt";
import {InvalidCredentialsException} from "../exceptions/UserException";

@Model({collection: "users"})
export class User {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  @ObjectID("id")
  _id: string;

  @Property()
  @MinLength(6)
  @MaxLength(40)
  name: string;

  @Unique()
  @Property()
  @Required()
  @MinLength(6)
  @MaxLength(40)
  @Email()
  username: string;

  @Property()
  @Required()
  @MinLength(6)
  @Pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}:<>?/.,;[\]-]{8,}$/) // Password must be alphanumeric and contain at least one number and one letter
  password: string;

  @Groups("token", "!credentials")
  token: string;

  @Property()
  isValidate: boolean = false;

  async verifyPassword(candidatePassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }
}
