import { NestMiddleware } from '@nestjs/common';

export class AppMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    // res.writeHead(200, { 'content-type': 'application/json' })
    // res.write(JSON.stringify({ test: "test" }))
    // res.end()
    next();
  }
}
