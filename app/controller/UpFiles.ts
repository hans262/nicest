import { ServerResponse } from 'node:http';
import { writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { Controller, Context, parseFormData, createHashSecret, getBodyData } from '../../src/index.js';
import { PUBLIC_PATH } from '../constant.js';

/**
 * 文件上传
 * 支持格式：FormData | ArrayBuffer
 */
export class UpFiles implements Controller {
  readonly pathname: string = '/api/upfiles'
  /**限制最大上传10MB*/
  maxSize = 100

  handleFailed(res: ServerResponse, reason: string) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ success: false, result: reason }))
  }

  handleSuccess(res: ServerResponse, msg: string) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ success: true, result: msg }))
  }

  /**
   * 创建新的文件名
   * @param name 
   */
  createFileName(name: string) {
    const ext = extname(name)
    const base = name.split(ext)[0]
    return base + '.' + createHashSecret(base) + ext
  }

  async POST(ctx: Context) {
    const { req, res } = ctx
    // console.log(req.headers)

    const [contentLength, contentType] = [
      parseInt(req.headers['content-length'] ?? ''),
      req.headers['content-type']
    ]

    const boundary = contentType?.match(/boundary=([^;]+)/)?.[1]
    const filename = contentType?.match(/filename=([^;]+)/)?.[1]

    //NaN | 0 排除
    if (!contentLength) {
      return this.handleFailed(res, `content-length错误，contentLength：${contentLength}`)
    }

    //超尺寸限制限制
    if (contentLength > this.maxSize * 1024 * 1024) {
      return this.handleFailed(res, `超出最大上传尺寸${this.maxSize}mb`)
    }

    // 解析数据
    if (contentType?.includes('multipart/form-data') && boundary) {
      //'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryuA6k9Vw0kI6GjOjd'
      //前端不要设置content-type，会自动识别，
      //接收数据
      const buf = await getBodyData(ctx.req)
      const ret = parseFormData(buf, boundary, contentLength)
      ret.forEach(d => {
        if (d.filename) {
          const newFileName = this.createFileName(d.filename)
          writeFileSync(join(PUBLIC_PATH, newFileName), d.data)
        }
      })
      return this.handleSuccess(ctx.res, '上传成功')
    } else if (contentType?.includes('arraybuffer') && filename) {
      //'content-type': 'arraybuffer; filename=a.txt'
      //前端需要设置content-type
      //接收数据
      const file = await getBodyData(ctx.req)
      const newFileName = this.createFileName(filename)
      writeFileSync(join(PUBLIC_PATH, newFileName), file)
      return this.handleSuccess(ctx.res, '上传成功')
    }

    this.handleFailed(res, `不支持的content-type: ${contentType}`)
  }
}