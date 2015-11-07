// Dependencies
import Audio from '../src'
import assert,{deepEqual} from 'power-assert'

// Environment
process.env.MOCK_AUDIO_ELEMENT_TEST= true
const fixtureURL= 'http://static.edgy.black/fixture.mp3'

// Specs
describe('method',function(){
  this.timeout(10000)

  it('.load()',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.load()

    audio.addEventListener('canplaythrough',()=>{
      deepEqual(audio._eventHistory,[
        'canplaythrough',
      ])

      assert(audio.paused)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===0)

      audio.pause()
      done()
    })
  })

  it('.play()',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.play()
    audio.currentTime= 120.5

    audio.addEventListener('ended',()=>{
      deepEqual(audio._eventHistory,[
        'play',
        'canplaythrough',
        'timeupdate',
        'timeupdate',
        'pause',
        'ended',
      ])

      assert(audio.paused)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===120.63985)

      audio.pause()
      done()
    })
  })

  it('.autoplay',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.autoplay= true
    audio.addEventListener('play',()=>{
      audio.currentTime= 120.6
    })

    audio.addEventListener('ended',()=>{
      deepEqual(audio._eventHistory,[
        'play',
        'canplaythrough',
        'timeupdate',
        'pause',
        'ended',
      ])

      assert(audio.paused)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===120.63985)

      audio.pause()
      done()
    })
  })

  it('.pause()',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.play()
    audio.once('play',()=>{
      audio.pause()
    })
    audio.once('pause',()=>{
      audio.play()
      audio.currentTime= 120.6
    })

    audio.addEventListener('ended',()=>{
      deepEqual(audio._eventHistory,[
        'play',
        'pause',
        'play',
        'canplaythrough',
        'timeupdate',
        'pause',
        'ended',
      ])

      assert(audio.paused)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===120.63985)

      audio.pause()
      done()
    })
  })

  it('.loop',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.loop= true
    audio.currentTime= 120.6
    audio.play()

    let count= 1
    audio.addEventListener('timeupdate',()=>{
      if(count++ < 5){
        return
      }

      deepEqual(audio._eventHistory,[
        'play',
        'canplaythrough',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate',
        'timeupdate',
      ])

      assert(audio.paused===false)
      assert(audio.duration===120.63985)
      assert(Math.floor(audio.currentTime)===0)

      audio.pause()
      done()
    })
  })
})
