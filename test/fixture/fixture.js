import nock from 'nock';
import path from 'path';

export const AUDIO_DURATION = 120;
export const FIXTURE_URL = 'http://static.edgy.black/fixture.mp3';
export function installFixture() {
  nock('http://static.edgy.black')
    .get('/fixture.mp3')
    .times(2)
    .replyWithFile(200, path.join(__dirname, 'fixture.mp3'));
}
