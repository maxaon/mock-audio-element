import Audio from './index';

class NotAllowedError extends Error {
  constructor(message, id) {
    super(message, id);
    this.name = 'NotAllowedError';
  }
}

export function createAudioWithNotAllowedError() {
  let isByUserAction = true;
  const testkit = {
    setIsByUserAction(_isByUserAction = true) {
      isByUserAction = _isByUserAction;
    }
  };

  class MobileAudio extends Audio {
    play() {
      if (isByUserAction) {
        return new Promise(resolve => {
          this.once('playing', () => resolve());
          super.play();
        });
      }
      return Promise.reject(new NotAllowedError('play() can only be initiated by a user gesture.'));
    }
  }

  return {testkit, Audio: MobileAudio};
}
