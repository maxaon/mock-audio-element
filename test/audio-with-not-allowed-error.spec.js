import {expect} from 'chai';
import {createAudioWithNotAllowedError} from '../src/audio-with-not-allowed-error';
import {FIXTURE_URL, installFixture} from './fixture/fixture';

// Environment
process.env.MOCK_AUDIO_ELEMENT_TEST = true;

// Specs
describe('Audio with NotAllowedError', function () {
  this.timeout(10000);
  let Audio;
  let testkit;

  beforeEach(() => {
    installFixture();
    const aT = createAudioWithNotAllowedError();
    Audio = aT.Audio;
    testkit = aT.testkit;
  });

  it('should play song', async () => {
    const audio = new Audio(FIXTURE_URL);
    const playResult = audio.play();
    expect(playResult).to.have.property('then');
    const endPromise = new Promise(resolve => audio.addEventListener('ended', resolve));
    await expect(playResult).to.eventually.be.fulfilled;
    await expect(endPromise).to.eventually.be.fulfilled;
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
  });

  it('should play throw exception when autoplay is not supported', async () => {
    testkit.setIsByUserAction(false);
    const audio = new Audio(FIXTURE_URL);
    const playResult = audio.play();

    await expect(playResult).to.eventually.be.rejectedWith('play() can only be initiated by a user gesture.')
      .and.have.property('name', 'NotAllowedError');
  });
});
