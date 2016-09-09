import EventEmitter from 'events'
import { makeEmitter } from './eventEmitter'

// multiple channel for single connection
class Channel extends EventEmitter {
  /*
   * @param Object instance of server/eventEmitter
   * @param String identity, channel name
   * */
  constructor(server, identity) {
    super()
    this.server = server
    this.identity = identity
    this.onconnection = this.onconnection.bind(this)
    server.on('connection', this.onconnection)
  }

  onconnection(connection) {
    const emitter = makeEmitter(connection)
    this.emitter = emitter
    this.ondata = this.ondata.bind(this)
    this.onclose = this.onclose.bind(this)
    emitter.on('data', this.ondata)
    emitter.on('close', this.onclose)
  }

  ondata(data) {
    if (data && data.type === 'channel' && data.channel === this.identity) {
      super.emit('data', data)
    }
    return null
  }

  _emit(...args) {
    return super.emit(...args)
  }

  onclose() {
    return this.destroy()
  }

 /* emit with channel by this.emitter to browser
  */
  emit(data) {
    return this.emitter.emit({ type: 'channel', channel: this.identity, data })
  }

  // clear all listeners, free memory
  destroy() {
    this.removeAllListeners()
    this.server.removeListener('connection', this.onconnection)
    if (this.emitter) {
      this.emitter.removeListener('data', this.ondata)
      this.emitter.removeListener('close', this.onclose)
    }
    return null
  }
}

export default Channel
