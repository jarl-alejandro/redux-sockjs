import SockJS from 'sockjs-client'
import ReduxChannel from './reduxChannel'


export default ({
  port = 3000,
  domain = '127.0.0.1',
  sockjsPrefix = '/sockjs-redux',
  protocal = 'http',
} = {}) => {
  const socket = new SockJS(`${protocal}://${domain}:${port}${sockjsPrefix}`)
  const reduxChannel = new ReduxChannel(socket)
  return reduxChannel
}