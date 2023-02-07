require('dotenv').config();
import next from "next";
import express, { Response } from "express";
import Router from './Routes'
import Database from '@core/Databases'

let bodyParser = require('body-parser');
const cors = require('cors');
const nextI18NextMiddleware = require('next-i18next/middleware').default
const nextI18next = require('@libs/I18n').default

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
let handle: Function = nextApp.getRequestHandler();

class Server {
  express = express()
  host;
  port;
  options: any;
  server;
  static nextApp: any

  constructor({ host, port, options = {} }: { host?: string, port?: string | number, options?: any } = {}) {
    const defaultPORT = process.env.MODE == "dev-client" ? process.env.DEV_FRONTEND_PORT : process.env.PORT
    this.host = host || process.env.HOST || '0.0.0.0'
    this.port = Number(port) || Number(defaultPORT) || 3333
    this.options = options
  }

  async connectDatabase() {
    if (process.env.MODE != "dev-client") {
      return await Database.connect()
    }
  }

  async nextStart() {
    if (process.env.MODE !== "dev-server") {
      await nextApp.prepare();
      Server.nextApp = nextApp
    }
    else {
      handle = (request: Request, response: Response) => {
        response.status(404).send("MODE is dev server only, Route not exist.")
      }
      Server.nextApp = { render: handle }
    }
  }

  async start() {
    await this.nextStart();
    await this.connectDatabase();

    await nextI18next.initPromise
    this.express.use(nextI18NextMiddleware(nextI18next))

    this.express.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
    this.express.use(bodyParser.json({
      limit: '500mb'
    }));
    this.express.use(cors({
      origin: dev ? "*" : process.env.CORS_ORIGIN
    }));

    this.express.use(Router.build())

    this.express.all('*', (req, res) => {
      res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );

      return handle(req, res)
    });

    await new Promise<void>(r => {
      this.server = this.express.listen(this.port, this.host, () => {
      console.log(`server stated: ${this.host}:${this.port}`);
      r();
    })})

    return {
      express: this.express,
      next: Server.nextApp,
      server: this.server
    }
  }
}

export default Server
