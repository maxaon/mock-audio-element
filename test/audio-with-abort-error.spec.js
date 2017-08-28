import {expect} from 'chai';
import {createWithAbortError} from '../src/audio-with-abort-error';
import {FIXTURE_URL, installFixture} from './fixture/fixture';

// Environment
process.env.MOCK_AUDIO_ELEMENT_TEST = true;

// Specs
describe('Audio with AbortError', function () {
  this.timeout(10000);
  let Audio;

  beforeEach(() => {
    installFixture();
    const aT = createWithAbortError();
    Audio = aT.Audio;
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

  it('should play reject when pause is called before content is loaded', async () => {
    const audio = new Audio(FIXTURE_URL);
    const playResult = audio.play();
    console.log('pause');
    audio.pause();

    await expect(playResult).to.eventually
      .be.rejectedWith('The play() request was interrupted by a call to pause().')
      .have.property('name', 'AbortError');
  });

  it('should play reject when pause is delayed is called before content is loaded', async () => {
    const audio = new Audio(FIXTURE_URL);
    const playResult = audio.play();
    setTimeout(() => audio.pause(), 0);

    await expect(playResult).to.eventually
      .be.rejectedWith('The play() request was interrupted by a call to pause().')
      .have.property('name', 'AbortError');
  });
});
