import {expect} from 'chai';
import sinon from 'sinon';
import Audio from '../src';
import {AUDIO_DURATION, installFixture} from './fixture/fixture';
// Environment
process.env.MOCK_AUDIO_ELEMENT_TEST = true;
const fixtureURL = 'http://static.edgy.black/fixture.mp3';
// Specs
describe('method', function () {
  this.timeout(10000);
  beforeEach(() => {
    installFixture();
  });

  it('.load()', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.load();

    audio.addEventListener('canplaythrough', () => {
      expect(audio._eventHistory).to.deep.equal([
        'loadstart',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'canplaythrough'
      ]);

      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(0);

      audio.pause();
      done();
    });
  });

  it('.play()', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.play();
    audio.addEventListener('timeupdate', () => {
      expect(audio.currentTime).is.not.equal(0);
    });
    audio.addEventListener('ended', () => {
      expect(audio._eventHistory).to.deep.equal([
        'play',
        'loadstart',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'playing',
        'canplaythrough',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'pause',
        'ended'
      ]);

      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(AUDIO_DURATION);

      audio.pause();
      done();
    });
  });

  it('.play() should emit 5 timeupdate events', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.play();
    const timeupdateCalls = [24, 48, 72, 96, 120];
    let i = 0;
    const spy = sinon.stub().callsFake(function () {
      expect(audio.currentTime).to.equal(timeupdateCalls[i]);
      i++;
    });

    audio.addEventListener('timeupdate', spy);
    audio.addEventListener('ended', () => {
      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(AUDIO_DURATION);
      expect(spy.callCount).to.equal(5);
      audio.pause();
      done();
    });
  });
  it('.play() should emit 1 timeupdate when next event fired after seek', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.play();
    const spy = sinon.stub().callsFake(function () {
      expect(audio.currentTime).to.equal(120);
    });

    audio.addEventListener('timeupdate', spy);
    audio.addEventListener('canplaythrough', () => {
      audio.currentTime = 100;
    });
    audio.addEventListener('ended', () => {
      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(AUDIO_DURATION);
      expect(spy.callCount).to.equal(1);
      audio.pause();
      done();
    });
  });

  it('.autoplay', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.autoplay = true;
    console.log('addEvents', 'addEvents');
    audio.addEventListener('play', () => {
      expect(audio.paused).to.equal(false);
      audio.currentTime = 119.6;
    });

    audio.addEventListener('ended', () => {
      expect(audio._eventHistory).to.deep.equal([
        'loadstart',
        'play',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'playing',
        'canplaythrough',
        'timeupdate',
        'pause',
        'ended'
      ]);

      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(AUDIO_DURATION);

      audio.pause();
      done();
    });
  });

  it('.pause()', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.play();
    audio.once('playing', () => {
      audio.pause();
    });
    audio.once('pause', () => {
      audio.play();
      audio.currentTime = 120.6;
    });

    audio.addEventListener('ended', () => {
      expect(audio._eventHistory).to.deep.equal([
        'play',
        'loadstart',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'playing',
        'canplaythrough',
        'pause',
        'play',
        'playing',
        'timeupdate',
        'pause',
        'ended'
      ]);

      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(AUDIO_DURATION);

      audio.pause();
      done();
    });
  });

  it('.loop', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.loop = true;
    audio.play();

    let count = 1;
    audio.addEventListener('timeupdate', () => {
      if (count++ < 5) {
        return;
      }

      expect(audio._eventHistory).to.deep.equal([
        'play',
        'loadstart',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'playing',
        'canplaythrough',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate'
      ]);

      expect(audio.paused).to.equal(false);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(Math.floor(audio.currentTime)).to.equal(0);

      audio.pause();
      done();
    });
  });
});
