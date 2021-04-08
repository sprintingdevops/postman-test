// IMPORTANT: do not include not npm modules here
import request from 'supertest';
import {Readable} from 'stream';
import {Console} from 'console';

class Postman {
  private readonly console;
  public verbose = true; 

  constructor() {
    this.console = new Console(process.stdout);
  }

  public async POST(
    url: string,
    body: any,
    headers?: Record<string, string>,
    attachments?: Record<string, string>,
  ): Promise<request.Response> {
    const req: request.Test = request(url).post('');
    this.addHeaders(req, headers);
    return this.send(req, headers, body, attachments);
  }

  public async POST_FILE(url: string, headers: Record<string, string>, file: string, fieldName: string = 'file') {
    return this.POST(url, headers, undefined, {[fieldName]: file});
  }

  public async POST_STREAM(
    url: string,
    headers: Record<string, string>,
    fileStream: Readable,
  ): Promise<request.Response> {
    const req: request.Test = request(url).post('');
    this.addHeaders(req, headers);
    const res = await new Promise<request.Response>((resolve, reject) => {
      fileStream.on('end', () => {
        req.end((err, response) => {
          if (err) {
            return reject(err);
          }
          return resolve(response);
        });
      });
      fileStream.on('pause', () => {
        // TODO: this is dirty hack to continue to read stream. For some reason it stops when gets 2nd portion.
        fileStream.resume();
      });
      // TODO: check type of req
      fileStream.pipe(req as any, {end: false});
    });

    this.print(req, res, headers, undefined);

    return res;
  }

  public async PUT(url: string, body: any, headers?: Record<string, string>): Promise<request.Response> {
    const req: request.Test = request(url).put('');
    this.addHeaders(req, headers);
    return this.send(req, headers, body);
  }

  public async PATCH(url: string, body: any, headers?: Record<string, string>): Promise<request.Response> {
    const req: request.Test = request(url).patch('');
    this.addHeaders(req, headers);
    return this.send(req, body);
  }

  public async GET(url: string, headers?: Record<string, string>): Promise<request.Response> {
    const req: request.Test = request(url).get('');
    this.addHeaders(req, headers);
    return this.send(req, headers);
  }

  public async DELETE(url: string, headers?: Record<string, string>): Promise<request.Response> {
    const req: request.Test = request(url).delete('');
    this.addHeaders(req, headers);
    return this.send(req, headers);
  }

  private addHeaders(req: request.Test, headers?: Record<string, string>): request.Test {
    if (headers) {
      for (const key in headers) {
        req.set(key, headers[key]);
      }
    }
    return req;
  }

  private async send(
    req: request.Test,
    headers?: Record<string, string>,
    body?: any,
    attachments?: Record<string, string>,
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

  private print(req: any, res: any, headers: any, body: any) {
    if (['true', '1'].includes(process.env.POSTMAN__IGNORE_REQUEST_RESPONSE_PRINT as string)) {
      return;
    }
    const colorFgYellow = ''; //'\x1b[33m';
    const colorFgMagenta = ''; //'\x1b[35m';
    const colorFgReset = ''; //'\x1b[0m';
    this.console.log(colorFgYellow);
    this.console.log("-------------------- REQUEST START --------------------")
    this.console.log(req.method + " " + req.url);
    if (this.verbose) {
      if (headers) this.console.log("Headers: " + headers);
    }
    if (body) {
      this.console.log("Request body: ", body);
    }      
  this.console.log(colorFgMagenta);
    this.console.log("Http status code: " + res.status, colorFgReset);
    this.console.log("Response body: ", res.body.data);
    if (res.headers) this.console.log("Response headers: ", res.headers);
    //this.console.log(colorFgReset);
    this.console.log("-------------------- REQUEST END ----------------------");
    this.console.log();

  }
}

export default new Postman();
