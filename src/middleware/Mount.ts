import { ServerResponse } from 'http';
import { parse } from 'url'
import { join } from 'path'
import { ROOT } from '../conf'
import setHeader from '../utils/setHeader'
import { LOG } from '../modules/log'
import { Req } from '../Interface/Req';

export default function Mount(req: Req, res: ServerResponse, next: Function): void {
  const { pathname, query } = parse(req.url, true)
  //相对路径
  req.relativePath = decodeURI(pathname)
  //绝对路径
  req.absolutePath = decodeURI(join(ROOT, req.relativePath))
  //查询字符串
  req.query = query
  //常用header
  setHeader(res)

  LOG({ type: 'REQUEST', msg: req.absolutePath })

  next()
}