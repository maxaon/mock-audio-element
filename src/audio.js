import musicMetaData from 'musicmetadata';
import request from 'request';
// Dependencies
import EventTarget from './event-target';

const nexTick = fn => setTimeout(fn, 0);

// Public
export class Audio extends EventTarget {
  constructor(url) {
    super();

    // Similar loadstart OSX Google Chrome 46
    // see also http://www.w3schools.com/tags/ref_av_dom.asp
    // ... and test/index.html
    this.src = url || '';
    this.loop = false;
    this.autoplay = false;

    this.paused = true;
    this.ended = false;
    this.error = null;

    this.currentTime = 0;
    this.duration = NaN;

    nexTick(() => {
      if (this.src) {
        this.load();
      }
    });

    this._timeupdate = this._timeupdate.bind(this);
    this._timeupdateBase = 'steps';
  }

  get autoplay() {
    return this.__autoplay;
  }

  set autoplay(value) {
    this.__autoplay = value;
    if (this.__src && this.__autoplay) {
      nexTick(() => this.play(), 0);
    }
  }

  get src() {
    return this.__src;
  }

  set src(value) {
    this.__src = value;
    if (this.__src && this.__autoplay) {
      nexTick(() => this.play(), 0);
    }
  }

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

    request(this.src, {encoding: null}, (error, response, buffer) => {
      if (error) {
        this.error = error;
        return this.emit('error', error);
      }

      musicMetaData(request(this.src), {duration: true, fileSize: buffer.length}, (error, meta) => {
        if (error) {
          this.error = error;
          return this.emit('error', error);
        }

        this.duration = meta.duration;
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

  play() {
    this.paused = false;
    this.emit('play');

    nexTick(() => {
      if (isNaN(this.duration)) {
        this.__autoplay = true;
        return this.load();
      }

      this._play();
    });
  }

  _play() {
    this.paused = false;
    this._previous = Date.now();
    this._lastChunk = 0;
    this._pause();
    this._timeupdateId = setInterval(this._timeupdate, 50);

    this.emit('playing');
  }

  pause() {
    this.paused = true;
    this.autoplay = false;
    this._pause();

    this.emit('pause');
  }

  _pause() {
    clearInterval(this._timeupdateId);
  }

  _timeupdate() {
    if (this._timeupdateBase === 'steps') {
      this._updateTimeByStep();
    } else {
      this._updateTimeByTime();
    }
    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
    }

    this.emit('timeupdate');

    if (this.currentTime >= this.duration) {
      this.currentTime = this.duration;
      if (this.loop) {
        this.currentTime = 0;
        return;
      }
      this.pause();
      this.emit('ended');
    }
  }

  _updateTimeByTime() {
    let diff = Date.now() - this._previous;
    this._previous = Date.now();
    this.currentTime += diff / 1000;
  }

  _updateTimeByStep() {
    const numberOfTimeupdateEvents = 5;
    this._lastChunk++;
    this.currentTime += this.duration / numberOfTimeupdateEvents;
  }
}

