import { Context } from '../interface/Context.js';
import { DEBUG } from '../modules/logger.js';

export function ResCache(ctx: Context) {
  const { staticPath, startTime, res } = ctx
  res.writeHead(304, 'Not Modified')
  res.end()
  DEBUG({
    type: 'RES_CACHE',
    msg: staticPath + ' +' + (Date.now() - startTime) + 'ms'
  })
}