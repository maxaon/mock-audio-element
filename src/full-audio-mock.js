import Audio from './index';

export function createFullAudioMock() {
  const options = {
    duration: 60,
    error: false
  };

  const testkit = {
    setDuration: value => {
      options.duration = value;
    },
    setError: error => {
      options.error = error;
    }
  };

  function get(audio, what) {
    if (typeof what === 'function') {
      return what(audio);
    }
    return what;
  }

  class AudioMock extends Audio {
    load() {
      if (this._loadstart) {
        return;
      }
      if (this.duration > 0) {
        return;
      }
      if (!this.src.length) {
        return;
      }

      this._loadstart = true;
      this.emit('loadstart');

      setTimeout(() => {
        const error = get(this, options.error);
        if (error) {
          this.error = error;
          return this.emit('error', error);
        }
        setTimeout(() => {
          this.duration = get(this, options.duration);
          this.emit('durationchange');
          this.emit('loadedmetadata');
          this.emit('canplay');

          if (this.autoplay) {
            this._play();
          }

          this.emit('canplaythrough');
        });
      });
    }
  }

  return {Audio: AudioMock, testkit};
}
