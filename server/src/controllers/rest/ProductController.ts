import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put, QueryParams, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {ProductService} from "../../services/ProductService";
import {Returns, Security} from "@tsed/schema";
import {Product} from "../../models/Product";
import {Page} from "../../utils/Page";


@Controller("/product")
export class ProductController {

  @Inject()
  private productService: ProductService;

  @Post("/")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, Product).Groups("info")
  async create(@Req() req: Req, @BodyParams() productDto: Product) {
    return await this.productService.create(req, productDto);
  }

  @Get("/")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, Product).Groups("info")
  async findAllPaginated(@Req() req: Req,
                         @QueryParams("page") page: number = 1,
                         @QueryParams("limit") limit: number = 10): Promise<Page<Product>> {
    return await this.productService.findAllPaginated(req, page, limit);
  }

  @Get("/:id")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, Product).Groups("info")
  async findById(@PathParams("id") id: string): Promise<Product | null> {
    return await this.productService.findById(id);
  }

  @Put("/:id")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, Product).Groups("info")
  async update(@PathParams("id") id: string, @BodyParams() product: Product): Promise<void> {
    await this.productService.update(id, product);
  }

  @Delete("/:id")
  @Returns(204, Product).Groups("info")
  async deleteById(@Req() req: Req, @PathParams("id") id: string): Promise<void> {
    await this.productService.delete(req, id);
  }

}
