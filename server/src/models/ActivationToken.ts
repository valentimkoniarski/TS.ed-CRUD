import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {Property} from "@tsed/schema";
import {User} from "./User";
import {v4 as uuidv4} from "uuid";

@Model({collection: "activation_token"})
export class ActivationToken {
  constructor() {
    this.token = uuidv4();
  }

  @ObjectID("id")
  _id: string;

  @Property()
  token: string;

  @Ref(User)
  User: Ref<User>;
}
