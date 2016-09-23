import { actionCreator, startReduxClient } from 'redux-sockjs'

const channel = startReduxClient({
  port: 3010,
  sockjsPrefix: '/sockjs-redux',
  reconnectInterval: 3000,
  reconnectMax: 30,
})

const createAction = actionCreator(channel)

export { channel, createAction }
