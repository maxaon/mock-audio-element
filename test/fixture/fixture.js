import nock from 'nock';
import path from 'path';

export const AUDIO_DURATION = 120;

export function installFixture() {
  nock('http://static.edgy.black')
    .get('/fixture.mp3')
    .times(2)
    .replyWithFile(200, path.join(__dirname, 'fixture.mp3'));
}
