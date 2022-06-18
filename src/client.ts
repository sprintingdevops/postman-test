import {Console} from 'console';
import * as dotenv from 'dotenv';
import fs from 'fs';
import request from 'supertest';
import util from 'util';
import Config from './config';

function removeNewLines(arr: unknown[]): unknown[] {
  return arr.filter((record) => record !== '\n');
}

function cleanUrl(url: string) {
  return url.split('/').reverse().splice(0, 2).reverse().join('_');
}
export class Stadius {
  private readonly myconsole;

  private readonly inspectConfig = {
    compact: false,
    depth: 10,
    maxArrayLength: 100,
  };

  private getUrl(url: string) {
    if (!url) {
      throw new Error('Url is required');
    }
    return `${this._baseUrl}${url}`;
  }

  constructor(private readonly _baseUrl = '', private readonly _commonHeaders: Record<string, string> = {}) {
    dotenv.config();
    this.myconsole = new Console({
      stdout: process.stdout,
      stderr: process.stderr,
      inspectOptions: this.inspectConfig,
    });
  }

  public async PATCH(url: string, headers: Record<string, string>, body: any): Promise<request.Response> {
    const req: request.Test = request(this.getUrl(url)).patch('');
    Object.assign(headers, this._commonHeaders);
    Stadius.addHeaders(req, headers);
    return this.send(req, headers, body);
  }

  public async PUT(url: string, headers: Record<string, string>, body: any): Promise<request.Response> {
    const req: request.Test = request(this.getUrl(url)).put('');
    Object.assign(headers, this._commonHeaders);
    Stadius.addHeaders(req, headers);
    return this.send(req, headers, body);
  }

  public async POST(
    url: string,
    headers: Record<string, string>,
    body: any,
    attachments?: Record<string, string>,
  ): Promise<request.Response> {
    const req: request.Test = request(this.getUrl(url)).post('');
    Object.assign(headers, this._commonHeaders);
    Stadius.addHeaders(req, headers);
    return this.send(req, headers, body, attachments);
  }

  public async GET(url: string, headers: Record<string, string> = {}): Promise<request.Response> {
    const req: request.Test = request(this.getUrl(url)).get('');
    Object.assign(headers, this._commonHeaders);
    Stadius.addHeaders(req, headers);
    return this.send(req, headers);
  }

  public async DELETE(url: string, headers: Record<string, string> = {}): Promise<request.Response> {
    const req: request.Test = request(this.getUrl(url)).delete('');
    Object.assign(headers, this._commonHeaders);
    Stadius.addHeaders(req, headers);
    return this.send(req, headers);
  }

  public async POST_FILE(url: string, headers: Record<string, string>, file: string, fieldName = 'file') {
    return this.POST(this.getUrl(url), headers, {}, {[fieldName]: file});
  }

  static addHeaders(req: request.Test, headers: Record<string, string>): request.Test {
    if (headers) {
      for (const key of Object.keys(headers)) {
        req.set(key, headers[key]);
      }
    }
    if (Config.AUTH && !req.get('Authorization')) {
      req.set('Authorization', Config.AUTH);
    }
    return req;
  }

  private print(req: request.Request, res: request.Response, headers: Record<string, string> = {}, body: unknown = {}) {
    const logMessages: unknown[] = [];
    const push = (obj: unknown) => {
      logMessages.push(obj);
      logMessages.push('\n');
    };
    push('++++++++++++++++++++++++++++++++++++++++++++++++++');
    push('REQUEST:');
    push({
      url: req.url,
      method: req.method,
      ...(headers && Config.VERBOSE ? {headers} : {}),
      ...(body ? {body} : {}),
    });
    push('RESPONSE:');
    push({
      status: res.status,
      ...(res.headers && Config.VERBOSE ? {headers: res.headers} : {}),
      ...(res.body ? {body: res.body} : {}),
      ...(res.body && !Array.isArray(res.body) && !Object.keys(res.body).length && res.text ? {text: res.text} : {}),
    });
    push('==================================================');
    if (!Config.SILENT) {
      this.myconsole.log(...logMessages);
    }
    if (Config.LOG_TO_FILES) {
      const logicalName = cleanUrl(req.url);
      const logFile = `./stadius-logs/${Stadius.getDateTime()}-${logicalName}-stadius.log`;
      fs.appendFileSync(logFile, `${util.inspect(removeNewLines(logMessages), this.inspectConfig)}\n`);
    }
  }

  private async send(
    req: request.Test,
    headers: Record<string, string>,
    body: Record<string, any> = {},
    attachments: Record<string, string> | undefined = undefined,
  ): Promise<request.Response> {
    if (attachments && Object.keys(attachments).length) {
      for (const field of Object.keys(body)) {
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

  private printToFile = process.env.STADIUS_LOG_TO_FILE;

  static getDateTime(): string {
    const padLeft = (val: number): string => {
      const len = String(10).length - String(val).length + 1;
      return len > 0 ? new Array(len).join('0') + val : val.toString();
    };
    const d = new Date();
    return `${[d.getFullYear(), padLeft(d.getMonth()) + 1, padLeft(d.getDate())].join('-')}T${[
      padLeft(d.getHours()),
      padLeft(d.getMinutes()),
      padLeft(d.getSeconds()),
    ].join('.')}`;
  }
}

export default new Stadius();
