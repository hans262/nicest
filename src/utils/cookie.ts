import { ServerResponse } from "http";
import { Req } from "../Interface/Req";

export interface Cookie {
  res: ServerResponse
  key: string
  value: string
  maxAge?: string
  domain?: string
  path?: string
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
}

/**
 * 获取cookie
 * @param req 
 * @param key 键
 */
export function getCookie(req: Req, key: string): string {
  const { cookie } = req.headers
  if (!cookie) return null
  const reg: RegExp = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
  const arr: RegExpMatchArray = cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

/**
 * 设置cookie 不能设置中文
 * @param cookie Cookie
 */
export function setCookie(cookie: Cookie): void {
  const { res, key, value, maxAge, domain, path, expires, httpOnly, secure } = cookie
  let pairs: Array<string> = [key + '=' + value]
  if (maxAge) pairs.push('Max-Age=' + maxAge)
  if (domain) pairs.push('Domain=' + domain)
  if (path) pairs.push('Path=' + path)
  if (expires) pairs.push('Expires=' + expires.toUTCString())
  if (httpOnly) pairs.push('HttpOnly')
  if (secure) pairs.push('Secure')
  const cur: string = pairs.join('; ')
  const pre: string | number | string[] = res.getHeader('set-cookie')
  if (!pre) {
    return res.setHeader('Set-Cookie', cur)
  }
  if (typeof pre === 'string') {
    return res.setHeader('Set-Cookie', [pre, cur])
  }
  if (Array.isArray(pre)) {
    return res.setHeader('Set-Cookie', [...pre, cur])
  }
}
