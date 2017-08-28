# MockAudioElement [![NPM version][npm-image]][npm] [![Build Status][travis-image]][travis] [![Coverage Status][cover-image]][cover] [![Climate Status][climate-image]][climate]

> minimum implementation of HTML5 Audio events

## Installation

```bash
$ npm install mock-audio-element-adv --save
```

# class Audio

(WIP) an unreal audio elements. dispatch few events and change the limited properties.

```js
import {Audio} from 'mock-audio-element-adv';

let audio= new Audio();
console.log(audio)
// {
//   src: '',
//   loop: false,
//   autoplay: false,
//   paused: true,
//   ended: false,
//   error: null,
//   currentTime: 0,
//   duration: NaN
// }
```

If `audio.src` is true, to fetch the `src.duration` via http.

```js
let audio= new Audio('http://static.edgy.black/fixture.mp3')
// or ...
let audio= new Audio
audio.src= 'http://static.edgy.black/fixture.mp3'
audio.addEventListener('canplaythrough',()=>{
  console.log(audio.duration) // 120.63985
})
```

If `audio.autoplay` is true(or `.play()`), to playback(simulation) until `src.duration`.

```js
let audio= new Audio
audio.src= 'http://static.edgy.black/fixture.mp3'
audio.autoplay= true
audio.currentTime= 120

audio.addEventListener('timeupdate',()=>{
  console.log(audio.currentTime,audio.paused)
})
audio.addEventListener('ended',()=>{
  console.log(audio.currentTime,audio.paused)
})
// 120.104 false
// 120.205 false
// 120.308 false
// 120.412 false
// 120.514 false
// 120.616 false
// 120.63985 false
// 120.63985 true
```

But, if the `src.loop` is true, do repeat the playback.

```js

let audio= new Audio
audio.src= fixtureURL
audio.autoplay= true
audio.currentTime= 120
audio.loop= true

audio.addEventListener('timeupdate',()=>{
  console.log(audio.currentTime,audio.paused)
})
// 120.1 false
// 120.203 false
// 120.304 false
// 120.404 false
// 120.507 false
// 120.611 false
// 120.64 false
// 0.104 false
// 0.209 false
// ...
```

There is a possibility to dispatch an __following events only__.

* play
* loadstart
* durationchange
* loadedmetadata
* canplay
* playing
* canplaythrough
* timeupdate
* pause
* ended

In addition, only dispatch the event. nothing sends data.

```js
audio.addEventListener('timeupdate',(data)=>{
  console.log(data)// undefined
})
```

## Additional methods 

### createWithAbortError

Create Audio class that has play method that return promise and rejects it when content is not downloaded or called pause

```js
import {createWithAbortError} from 'mock-audio-element-adv';

const {Audio} = createWithAbortError();
const audio = new Audio('file.mp3');
audio.play()
  .catch(reason => console.error(reason)); // Will log error with name 'AbortError'
audio.pause();
``` 

### createWithNotAllowed

Create Audio class that has play method that return promise and rejects when action was not made by user.
```js
import {createAudioWithNotAllowedError} from 'mock-audio-element-adv';

const {Audio, testkit} = createAudioWithNotAllowedError();
const audioByUser = new Audio('file.mp3');
audio.play().then(() => console.log('ok'));
testkit.setIsByUserAction(false);
const audioByProgram = new Audio('file.mp3');
audio.play().catch(reason => console.error(reason)); // Will log error with name 'NotAllowedError'

``` 

License
---
[MIT][License]

[License]: http://59naga.mit-license.org/

[sauce-image]: http://soysauce.berabou.me/u/59798/mock-audio-element.svg
[sauce]: https://saucelabs.com/u/59798
[npm-image]:https://img.shields.io/npm/v/mock-audio-element.svg?style=flat-square
[npm]: https://npmjs.org/package/mock-audio-element
[travis-image]: http://img.shields.io/travis/59naga/mock-audio-element.svg?style=flat-square
[travis]: https://travis-ci.org/59naga/mock-audio-element
[cover-image]: https://img.shields.io/codeclimate/github/59naga/mock-audio-element.svg?style=flat-square
[cover]: https://codeclimate.com/github/59naga/mock-audio-element/coverage
[climate-image]: https://img.shields.io/codeclimate/coverage/github/59naga/mock-audio-element.svg?style=flat-square
[climate]: https://codeclimate.com/github/59naga/mock-audio-element
