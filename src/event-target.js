// Dependencies
import {EventEmitter} from 'events';

// Public
class EventTarget extends EventEmitter {
  constructor() {
    super();

    if (process.env.MOCK_AUDIO_ELEMENT_TEST) {
      this._eventHistory = [];
    }
  }

  emit(...args) {
    if (this._eventHistory) {
      console.log('event', args[0]);
      this._eventHistory.push(args[0]);
    }
    setTimeout(() => super.emit(...args), 0);
  }

  addEventListener(...args) {
    return super.addListener(...args);
  }

  removeEventListener(...args) {
    return super.removeListener(...args);
  }
}

export default EventTarget;
