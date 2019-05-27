import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { INDEX_PAGE } from '../conf'
import ResRedirect from './ResRedirect'
import { LOG } from '../modules/log'
import { Req } from '../Interface/Req';
import { ServerResponse } from 'http';

export default function ResDir(req: Req, res: ServerResponse): void {
  const { absolutePath, relativePath } = req
  const INDEX_PATH: string = join(absolutePath, INDEX_PAGE)//index路径

  if (existsSync(INDEX_PATH)) {
    //重定向一下
    const location: string = join(relativePath, INDEX_PAGE)
    ResRedirect({ res, location, code: 302, reasonPhrase: 'index exists' })
  } else {
    const files: Array<string> = readdirSync(absolutePath)
    let content: string = `<h1>Index of ${relativePath}</h1>`
    files.forEach(file => {
      let href: string = join(relativePath, file)
      let small: string = ''
      try {
        const stats = statSync(join(absolutePath, file))
        if (stats.isDirectory()) {
          href += '/'
          file += '/'
        }
      } catch (err) {
        LOG({ type: 'ERROR', msg: err.message })
        small += `<small style="color:red">无权系统路径</small>`
      }
      content += `<p><a href="${href}">${file}</a>${small}</p>`
    })
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.writeHead(200, 'Access Directory')
    res.end(content)
    LOG({ type: 'RES_DIR', msg: absolutePath })
  }
}