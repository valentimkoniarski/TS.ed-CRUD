import {Req, Service} from "@tsed/common";
import {Model} from "mongoose";
import {Inject} from "@tsed/di";
import {Product} from "../models/Product";
import {User} from "../models/User";
import {MongooseModel} from "@tsed/mongoose";
import {UserService} from "./UserService";
import {Page} from "../utils/Page";
import {NotFound} from "@tsed/exceptions";
import {CrudImpl} from "./CrudImpl";

@Service()
export class ProductService implements CrudImpl {

  @Inject(User)
  private readonly userModel: MongooseModel<User>;

  @Inject(Product)
  private readonly productModel: Model<Product>;

  @Inject(UserService)
  private readonly userService: UserService;

  async findById(id: string): Promise<Product | null> {
    const product = this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFound("Product not found");
    }
    return this.productModel.findById(id).exec();
  }

  async create(@Req() req: Req, productData: Partial<Product>): Promise<Product | null> {
    const userLogged = await this.userService.getUserLogged(req);
    productData.User = userLogged;
    const product = new this.productModel(productData);
    return await product.save();
  }

  async update(id: string, product: Product): Promise<void> {
    await Promise.all([
      this.findById(id),
      this.productModel.updateOne({_id: id}, {$set: product})
    ]);
  }

  async delete(@Req() req: Req, id: string): Promise<void> {
    const userLogged = await this.userService.getUserLogged(req);

    await Promise.all([
      this.findById(id),
      this.productModel.deleteOne({_id: id, User: userLogged._id}).exec()
    ]);
  }

  async findAllPaginated(@Req() req: Req, page: number, limit: number): Promise<Page<Product>> {
    const userLogged = await this.userService.getUserLogged(req);
    const skip = (page - 1) * limit;

    const items = await this.productModel.find({User: userLogged._id})
      .skip(skip)
      .limit(limit)
      .exec();

    const totalItems = await this.productModel.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / limit);

    const pageResult: Page<Product> = new Page<Product>({
      total: totalItems,
      offset: skip,
      results: items,
      page,
      pageSize: limit,
      totalPages
    });

    return pageResult;
  }
}
