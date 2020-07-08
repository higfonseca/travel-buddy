const NODE_ENV = process.env.NODE_ENV || 'production'
const HOSTNAME = '127.0.0.1'
const PORT = process.env.PORT as any as number || 3000

export { NODE_ENV, HOSTNAME, PORT }
