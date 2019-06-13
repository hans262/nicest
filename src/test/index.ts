import { ClientRequest, IncomingMessage, request, RequestOptions } from 'http';
const url = '/api/getuser'
const proxy = 'http://www.baidu.com'

const postData: string = 'hello world'

const options: RequestOptions = {
  protocol: 'http:',
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/post',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 5000
}

const req: ClientRequest = request(options, (res: IncomingMessage) => {
  const { statusCode, headers } = res
  console.log(statusCode)
  console.log(headers)
  const chunks: Array<Buffer> = []
  res.on('data', (chunk: Buffer) => {
    chunks.push(chunk)
  })
  res.on('end', () => {
    const buffer: Buffer = Buffer.concat(chunks)
    console.log(buffer.toString())
  })
  
})

req.on('error', (err: Error) => {
  console.error(err)
})

//发送数据
req.write(postData)
req.end()