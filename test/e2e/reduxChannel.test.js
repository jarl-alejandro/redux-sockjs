import { createStore, combineReducers } from 'redux'
import startServer from '../../server/startReduxChannel'
import startClient from '../../client/startReduxChannel'

describe('startReduxChannel for server and client', () => {
  it('emit redux', done => {
    const param = {
      ip: '127.0.0.1',
      port: 10000,
      sockjsPrefix: '/sockjs-redux',
    }
    const { channel: serverChannel, httpServer } = startServer(param)
    const clientChannel = startClient(param)

    const clientData = {type: 'abc', payload: 'xxxxx'}
    clientChannel.on('open', () => {
      clientChannel.send(clientData)
    })
    serverChannel.receive(data => {
      expect(data).toEqual(clientData)
      serverChannel.emitter.connection.close()
      httpServer.close()
      done()
    })
  })

  describe('use store in client and server', () => {
    const param = {
      ip: '127.0.0.1',
      port: 10000,
      sockjsPrefix: '/sockjs-redux',
    }


    it.only('client send action', done => {
      const userReducer = (state, action) => {
        if (!state) {
          state = []
        }
        if (action.type === 'ADD_USER') {
          return [...state, action.payload]
        }
        return state
      }

      const clientReducer = (state, action) => {
        if (!state) {
          state = []
        }
        if (action.type === 'ADD_CLIENT') {
          return [...state, action.payload]
        }
        return state
      }
      // const serverStore = createStore(reducer, initialState)
      const clientStore = createStore(combineReducers({
        user: userReducer,
        client: clientReducer,
      }))

      const { channel: serverChannel, httpServer } = startServer(param)
      const clientChannel = startClient(param)

      const clientData = {type: 'ADD_USER', payload: {user: 'tom'}}
      clientChannel.on('open', () => {
        clientChannel.send(clientData)
      })

      clientChannel.receive(action => {
        clientStore.dispatch(action)
        const state = clientStore.getState()
        // console.log(state)
        expect(state.user[0].id).toBe(123)
        serverChannel.emitter.connection.close()
        httpServer.close()
        done()
      })
      serverChannel.receive(action => {
        // serverStore.dispatch(action)
        // id is generated by server db
        serverChannel.send({ ...action, payload: { user: 'tom', id: 123 } })
      })
    })
  })
})