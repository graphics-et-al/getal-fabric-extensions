import { fabric } from 'fabric'
import { extendMethod, extension } from './utils'

export default extension('object.export-events', (fabric) => {
  /**
   * ist of available events.
   */
  fabric.events = {}

  /**
   * Register a new event.
   *
   * @param name
   * @param callback
   */
  fabric.util.registerEvent = function (name, callback) {
    fabric.events[name] = callback
  }

  /**
   * Extend object.
   */
  fabric.util.object.extend(fabric.Object.prototype, {
    /**
     * List of stored events.
     */
    events: [],

    /**
     * Extend the initialize function to register events on initialization.
     *
     * @return {fabric.Object}
     */
    initialize: extendMethod(fabric.Object, 'initialize', function () {
      this.on('added', this.__setEventsProxy.bind(this))
    }),

    /**
     * Set the events array as a proxy  to automatically register
     * and unregister events on array  changes.
     */
    __setEventsProxy(this: fabric.Object) {
      const callbacks: ((...args: any) => void)[] = []
      const events: fabric.CustomEvent[] = [...this.events]

      this.events = new Proxy(events, {
        set: this.__eventsProxySetHandler.bind(this, callbacks),
        deleteProperty: this.__eventsProxyDeleteHandler.bind(this, callbacks),
      })

      this.events.splice(0, events.length, ...events)
    },

    /**
     * Set handler for events proxy.
     *
     * @param callbacks
     * @param events
     * @param index
     * @param event
     * @param receiver
     */
    __eventsProxySetHandler(
      callbacks: any[],
      events: fabric.CustomEvent[],
      index: number,
      event: fabric.CustomEvent,
      receiver: any
    ) {
      if (!isNaN(index)) {
        if (event.name && fabric.events[event.name]) {
          callbacks[index] = fabric.events[event.name].bind(this, this, event)
          this.on(event.trigger, callbacks[index])
          this.canvas?.fire('object:modified', { target: this })
        } else {
          throw new Error('This event does not exist.')
        }
      }

      return Reflect.set(events, index, event, receiver)
    },

    /**
     * Delete handler for events proxy.
     *
     * @param callbacks
     * @param events
     * @param index
     */
    __eventsProxyDeleteHandler(callbacks: any[], events: fabric.CustomEvent[], index: number) {
      if (!isNaN(index)) {
        this.off(events[index].trigger, callbacks[index])
        this.canvas?.fire('object:modified', { target: this })
      }

      return Reflect.deleteProperty(events, index)
    },

    /**
     * Extend the toObject function to include the events propeprty.
     *
     * @return {any}
     */
    toObject: extendMethod(fabric.Object, 'toObject', function (object: any) {
      object.events = this.events
      return object
    }),
  })
})
