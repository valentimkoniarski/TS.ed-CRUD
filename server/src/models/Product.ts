import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {MaxLength, Minimum, MinLength, Property, Required} from "@tsed/schema";
import {User} from "./User";

@Model({collection: "products"})
export class Product {

  constructor() {}

  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @Property()
  @Required()
  @MinLength(6)
  @MaxLength(40)
  description: string;

  @Property()
  @Required()
  @Minimum(0)
  price: number;

  @Ref(User)
  User: Ref<User>;
}
