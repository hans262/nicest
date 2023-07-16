import { Controller, Context } from '../../src/index.js';

export class ShutDown implements Controller {
	readonly pathname = '/api/shutdown'
	GET(ctx: Context) {
		ctx.res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
		ctx.res.end(`服务器将在10s后关闭！`)
		ctx.app.close(0)
	}
}