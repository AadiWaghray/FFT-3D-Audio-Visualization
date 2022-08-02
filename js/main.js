import '../css/style.css'
import { SceneManager } from './SceneManager'

//const canvas = put html element here that will hold the canvas

//TEMP
const initInstrucionPage = () => {
    document.querySelector('#app').innerHTML = 
    `<div id="container">
    <div>
        Drag and Drop File to Visualize
    <div>
    </div>`
}

let sceneManager

window.onload = () => {
    //TEMP
    initInstrucionPage()

    initWebAudioApi()
    attachListeners()
    attatchInstructionListeners()
}

const initWebAudioApi = () => {
    window.audioCtx = new AudioContext()
    window.analyser = audioCtx.createAnalyser()
}

const attachListeners = () => {
    window.onresize = resizeCanvas
}

const attatchInstructionListeners = () => {
    let dropArea = document.getElementById('container')
    
    dropArea.addEventListener('dragover', (event) => {
      event.stopPropagation()
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    })
    
    dropArea.addEventListener('drop', (event) => {
      event.stopPropagation()
      event.preventDefault()
      document.getElementById( "container" ).remove()
      readFile(event.dataTransfer.files[0])
    })
    //TODO: Need button for audio listener to initialize
}

const resizeCanvas = () => {
    
}

const update = () => {
    requestAnimationFrame( update )
    sceneManager.update()
}

const readFile = (file) => {
    let fileReader = new FileReader()
    fileReader.onload = (event) => {
      //TODO: Check Documentation for source.noteOff
      // if( window.source ) source.noteOff(0)
      let arrayBuffer = event.target.result //TODO: Make sure website doesn't crash when bad audio file is given
      window.audioCtx.decodeAudioData(arrayBuffer).then(( buffer ) => {
        window.source = audioCtx.createBufferSource()   
        source.buffer = buffer
        source.connect(analyser)
        analyser.connect(audioCtx.destination)
        sceneManager = new SceneManager()//canvas
        source.start(0)//TODO: Add loading animation so that there isn't an awkward wait (make loading screen match scene bg) between file load and render`
        update()
      })    
    }
    fileReader.readAsArrayBuffer(file)
}