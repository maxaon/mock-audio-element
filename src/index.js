// Dependencies
import EventTarget from './event-target'

import musicMetaData from 'musicmetadata'
import request from 'request'

// Public
class Audio extends EventTarget{
  constructor(url){
    super()

    // similar loadstart OSX Google Chrome 46
    // see also http://www.w3schools.com/tags/ref_av_dom.asp
    // ... and test/index.html
    this.src= url || ''
    this.loop= false
    this.autoplay= false

    this.paused= true
    this.ended= false
    this.error= null

    this.currentTime= 0
    this.duration= NaN

    setTimeout(()=>{
      if(this.src){
        this.load()
      }
    })
  }
  load(){
    if(this._loadstart){
      return
    }
    if(this.duration>0){
      return
    }
    if(!this.src.length){
      return
    }

    this._loadstart= true

    request(this.src,{encoding:null},(error,response,buffer)=>{
      if(error){
        this.error= error
        return this.emit('error',error)
      }

      musicMetaData(request(this.src),{duration:true,fileSize:buffer.length},(error,meta)=>{
        if(error){
          this.error= error
          return this.emit('error',error)
        }

        this.duration= meta.duration

        if(this.autoplay){
          this._play()
        }

        this.emit('canplaythrough')
      })
    })
  }
  play(){
    if(isNaN(this.duration)){
      this.autoplay= true
      return this.load()
    }

    this._play()
  }
  _play(){
    this.emit('play')

    this.paused= false
    this._previous= Date.now()

    this._pause()
    this._timeupdateId= setInterval(::this._timeupdate,100)
  }
  pause(){
    this.emit('pause')

    this.paused= true
    this.autoplay= false
    this._pause()
  }
  _pause(){
    clearInterval(this._timeupdateId)
  }

  _timeupdate(){
    let diff= Date.now() - this._previous
    this._previous= Date.now()
    this.currentTime+= diff/1000
    if(this.currentTime>=this.duration){
      this.currentTime= this.duration
    }
    this.emit('timeupdate')

    if(this.currentTime===this.duration){
      if(this.loop){
        this.currentTime= 0
        return
      }
      this.pause()
      this.emit('ended')
    }
  }
}

export default Audio
