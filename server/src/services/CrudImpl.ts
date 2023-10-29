import {Req} from "@tsed/common";

export interface CrudImpl {
  findById: (id: string) => Promise<any>;
  create: (req: Req, object: any) => Promise<any>;
  update: (id: string, object: any) => Promise<any>;
  delete: (req: Req, id: string) => Promise<any>;
  findAllPaginated: (req: Req, page: number, limit: number) => Promise<any>;
}
