import {expect} from 'chai';
// Dependencies
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

  it('#1 should emit pause after play', done => {
    let audio = new Audio();
    audio.src = fixtureURL;
    audio.play();

    audio.addEventListener('timeupdate', () => {
      audio = null;
      done(new Error('detect leaks'));
    });

    audio.addEventListener('canplaythrough', () => {
      if (audio === null) {
        return;
      }

      expect(audio._eventHistory).to.deep.equal([
        'play',
        'loadstart',
        'pause',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'canplaythrough'
      ]);

      expect(audio.paused).to.equal(true);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(0);

      done();
    });

    setTimeout(() => {
      audio.pause();
    });
  });

  it('#2 should ', done => {
    let audio = new Audio();
    audio.src = fixtureURL;

    audio.addEventListener('canplaythrough', () => {
      audio.play();
    });

    audio.addEventListener('play', () => {
      expect(audio._eventHistory).to.deep.equal([
        'loadstart',
        'durationchange',
        'loadedmetadata',
        'canplay',
        'canplaythrough',
        'play'
      ]);

      expect(audio.paused).to.equal(false);
      expect(audio.duration).to.equal(AUDIO_DURATION);
      expect(audio.currentTime).to.equal(0);

      audio.pause();
      done();
    });
  });
});
