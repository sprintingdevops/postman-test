import { Console } from "console";
import fs from "fs";
import request from "supertest";
import util from "util";
import Config from "./config";

class Postman {
  private readonly myconsole;
  private readonly inspectConfig = {
    compact: false,
    depth: 10,
    maxArrayLength: 100,
  };

  constructor() {
    this.myconsole = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
      inspectOptions: this.inspectConfig,
    });
  }

  public async PATCH(
    url: string,
    headers: Record<string, string>,
    body: any
  ): Promise<request.Response> {
    const req: request.Test = request(url).patch("");
    this.addHeaders(req, headers);
    return this.send(req, headers, body);
  }

  public async PUT(
    url: string,
    headers: Record<string, string>,
    body: any
  ): Promise<request.Response> {
    const req: request.Test = request(url).put("");
    this.addHeaders(req, headers);
    return this.send(req, headers, body);
  }

  public async POST(
    url: string,
    headers: Record<string, string>,
    body: any,
    attachments?: Record<string, string>
  ): Promise<request.Response> {
    const req: request.Test = request(url).post("");
    this.addHeaders(req, headers);
    return this.send(req, headers, body, attachments);
  }
  public async GET(
    url: string,
    headers: Record<string, string> = {}
  ): Promise<request.Response> {
    const req: request.Test = request(url).get("");
    this.addHeaders(req, headers);
    return this.send(req, headers);
  }

  public async DELETE(
    url: string,
    headers: Record<string, string> = {}
  ): Promise<request.Response> {
    const req: request.Test = request(url).delete("");
    this.addHeaders(req, headers);
    return this.send(req, headers);
  }

  public async POST_FILE(
    url: string,
    headers: Record<string, string>,
    file: string,
    fieldName: string = "file"
  ) {
    return this.POST(url, headers, undefined, { [fieldName]: file });
  }

  private addHeaders(
    req: request.Test,
    headers: Record<string, string>
  ): request.Test {
    if (headers) {
      for (const key in headers) {
        req.set(key, headers[key]);
      }
    }
    if (Config.AUTH && !req.get("Authorization")) {
      req.set("Authorization", Config.AUTH);
    }
    return req;
  }

  private print(
    req: request.Request,
    res: request.Response,
    headers: Record<string, string> = {},
    body: any
  ) {
    /*const colorFgYellow = '\x1b[33m';
    const colorFgMagenta = '\x1b[35m';
    const colorFgReset = '\x1b[0m';*/
    const logMessages: any[] = [];
    const push = (obj: any) => {
      logMessages.push(obj);
      logMessages.push("\n");
    };
    push("++++++++++++++++++++++++++++++++++++++++++++++++++");
    push("REQUEST:");
    push({
      url: req.url,
      method: req.method,
      ...(headers && Config.VERBOSE ? { headers } : {}),
      ...(body ? { body } : {}),
    });
    push("RESPONSE:");
    push({
      status: res.status,
      ...(res.headers && Config.VERBOSE ? { headers: res.headers } : {}),
      //body: JSON.stringify(res.body),
      ...(res.body ? { body: res.body } : {}),
      ...(res.body &&
      !Array.isArray(res.body) &&
      !Object.keys(res.body).length &&
      res.text
        ? { text: res.text }
        : {}),
    });
    push("==================================================");
    if (Config.LOG_TO_CONSOLE) {
      this.myconsole.log(...logMessages);
    }
    if (Config.LOG_TO_FILES) {
      const logicalName = cleanUrl(req.url);
      const logFile =
        "./postman-logs/" +
        this.getDateTime() +
        "-" +
        logicalName +
        "-postman.log";
      fs.appendFileSync(
        logFile,
        util.inspect(removeNewLines(logMessages), this.inspectConfig) + "\n"
      );
    }
  }

  private async send(
    req: request.Test,
    headers: Record<string, string>,
    body?: any,
    attachments?: Record<string, string>
  ): Promise<request.Response> {
    if (attachments && Object.keys(attachments).length) {
      for (const field of Object.keys(body || {})) {
        req.field(field, body[field]);
      }
      for (const field of Object.keys(attachments)) {
        req.attach(field, attachments[field]);
      }
    } else {
      req.send(body);
    }
    const res = await req;

    this.print(req, res, headers, body);

    return res;
  }
  private printToFile = process.env.POSTMAN_LOG_TO_FILE;
  private getDateTime(): string {
    const padLeft = function (val: number): string {
      var len = String(10).length - String(val).length + 1;
      return len > 0 ? new Array(len).join("0") + val : val.toString();
    };
    const d = new Date();
    const dformat =
      [d.getFullYear(), padLeft(d.getMonth()) + 1, padLeft(d.getDate())].join(
        "-"
      ) +
      "T" +
      [
        padLeft(d.getHours()),
        padLeft(d.getMinutes()),
        padLeft(d.getSeconds()),
      ].join(".");
    return dformat;
  }
}

export default new Postman();

function removeNewLines(arr: any[]): any {
  return arr.filter((record) => record !== "\n");
}

function cleanUrl(url: string) {
  return url.split("/").reverse().splice(0, 2).reverse().join("_");
}
