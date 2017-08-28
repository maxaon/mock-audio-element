import Audio from './index';

class AbortError extends Error {
  constructor(message, id) {
    super(message, id);
    this.name = 'AbortError';
  }
}

export function createWithAbortError() {
  class MobileAudio extends Audio {
    play() {
      return new Promise((resolve, reject) => {
        let mocks = 4;
        this.once('play', () => mocks--);
        this.once('loadstart', () => mocks--);
        this.once('durationchange', () => mocks--);
        this.once('loadedmetadata', () => mocks--);
        this.once('pause', () => {
          console.log('pause()', mocks);
          if (mocks) {
            reject(new AbortError('The play() request was interrupted by a call to pause().'));
          }
        });
        this.once('playing', () => resolve());
        super.play();
      });
    }
  }

  return {Audio: MobileAudio};
}
