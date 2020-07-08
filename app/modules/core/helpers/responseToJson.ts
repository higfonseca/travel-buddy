import http from 'http'

export const responseToJson = (res: http.ServerResponse, output: object) => {
  // @ts-ignore
  res.statusCode = output.statusCode || 200
  res.setHeader('content-Type', 'Application/json')
  res.end(JSON.stringify(output))
}
