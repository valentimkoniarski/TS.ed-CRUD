import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import {config} from "./config";
import * as rest from "./controllers/rest";
import "./protols";
import * as bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";
import methodOverride from "method-override";
import passport from "passport";
import * as process from "process";
require('dotenv').config();

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false,
  disableComponentsScan: true,
  mount: {
    "/rest": [
      ...Object.values(rest)
    ]
  },
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    'json-parser',
    {use: 'urlencoded-parser', options: {extended: true}},
  ],
  mongoose: [
    {
      id: "default",
      url: `mongodb+srv://${process.env.USER_MONGOOSE}:${process.env.PASSWORD_MONGOOSE}@cluster0.opco1it.mongodb.net/?retryWrites=true&w=majority`,
      connectionOptions: {}
    }
  ],

})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit() {
    this.app
      .use(passport.initialize())
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      // @ts-ignore
      .use(session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: true,
        // maxAge: 36000,
        cookie: {
          path: "/",
          httpOnly: true,
          secure: false
        }
      }));
  }

}
