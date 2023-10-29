import {readFileSync} from "fs";
import {envs} from "./envs/index";
import loggerConfig from "./logger/index";
import {User} from "../models/User";
const pkg = JSON.parse(readFileSync("./package.json", {encoding: "utf8"}));

export const config: Partial<TsED.Configuration> = {
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1",
      spec: {
        components: {
          securitySchemes: {
            jwt: {
              type: "http",
              scheme: "bearer"
            }
          }
        }
      }
    }
  ],
  passport: {
    disableSession: true,
    userInfoModel: User
  },
  version: pkg.version,
  envs,
  logger: loggerConfig,
  // additional shared configuration
};
