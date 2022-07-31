import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VideoTexture } from 'three'

document.querySelector('#app').innerHTML = `<div id="container"></div>`

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


function readFile(file) {
  let fileReader = new FileReader()
  fileReader.onload = (event) => {
    if( window.source ) source.noteOff(0)
    let arrayBuffer = event.target.result
    window.audioCtx = new AudioContext()
    window.analyser = audioCtx.createAnalyser()
    
    window.audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
      window.source = audioCtx.createBufferSource()   
      source.buffer = buffer
      source.connect(analyser)
      analyser.connect(audioCtx.destination)
      source.start(0)
      
      let viz = new visualization(analyser)
      viz.createNewWave()
      viz.animate()  
    })    
  }
  fileReader.readAsArrayBuffer(file)
}


function visualization(analyser) {
    let self = this
    this.planeWave = new Array()
    this.analyser = analyser
    this.byteFreq = new Uint8Array(analyser.frequencyBinCount)
    this.objectsMargin = 0.02
    this.numberOfRows = 1000
    this.geometry = new THREE.SphereBufferGeometry(0.01, 2, 2)
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.sphere = new THREE.InstancedMesh( this.geometry, this.material, this.numberOfRows*this.byteFreq.length )
    this.sphere.instanceMatrix.setUsage( THREE.DynamicDrawUsage )

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    scene.add( this.sphere )

    this.createNewWave = () => {
      let matrix4 = new THREE.Matrix4
      let vector3 = new THREE.Vector3()
      let i = 0

      for (let a = 0; a < this.numberOfRows; a++) {  
        vector3.setComponent( 0, a * this.objectsMargin )
        //TOTEST: maybe try Math.round on this conidition
        for (let b = 0; b < Math.round(this.byteFreq.length / 4); b++) {
          vector3.setComponent( 1, b * this.objectsMargin)
          matrix4.setPosition( vector3 )
          this.sphere.setMatrixAt( i, matrix4 )
          i++
        }
      }

      camera.position.set(0, 0, 5)
      // controls.autoRotate = true
      // controls.autoRotateSpeed = 4.0
      controls.update()

      renderer.render(scene, camera)
    }

    this.updatePosition = () => {
      analyser.getByteFrequencyData(this.byteFreq)
      const matrix4 = new THREE.Matrix4
      const color = new THREE.Color()
      const vector3 = new THREE.Vector3()
      const ignore = new THREE.Vector3()
      const ignore2 = new THREE.Quaternion()
      let intermediary = 0;

      for ( let a=this.numberOfRows * Math.round(this.byteFreq.length / 4) - 1; a > Math.round(this.byteFreq.length / 4) - 1; a--) {
        this.sphere.getMatrixAt ( a - Math.round(this.byteFreq.length / 4), matrix4 )
        matrix4.decompose( vector3, ignore2, ignore )
        intermediary = vector3.getComponent(2)
        this.sphere.getMatrixAt( a, matrix4 )
        matrix4.decompose( vector3, ignore2, ignore )
        vector3.setComponent(2, intermediary)
        matrix4.setPosition( vector3 )
        this.sphere.setMatrixAt( a, matrix4 )

        // this.sphere.getColorAt( a - Math.round(this.byteFreq.length / 4), color )
        // this.sphere.setColorAt( a, color )
      }
      // for (let a = 500; a > 0; a--) {
      //   for (let b = 0; b < this.byteFreq.length / 4; b++) {
      //     this.planeWave[a][b].position.z = this.planeWave[a - 1][b].position.z
      //     this.planeWave[a][b].material = this.planeWave[a - 1][b].material
      //   }
      // }
      let average = 0
      for (let a = 1; a < this.byteFreq.length + 1; a++) {
        if (a % 4 === 0) {
          average = average / 4

          this.sphere.getMatrixAt( a/4 - 1, matrix4 )
          matrix4.decompose( vector3, ignore2, ignore )
          vector3.setComponent( 2, average/ 40 )
          matrix4.setPosition( vector3 )
          this.sphere.setMatrixAt( a/4 - 1, matrix4)

          color.setRGB( ((Math.round(average)) % 255), ((Math.round(average)) % 255), ((Math.round(average)) % 255))
          this.sphere.setColorAt( a/4 - 1, color )
          average = 0
        }
        average += this.byteFreq[a]
      }
      this.sphere.instanceColor.needsUpdate = true
      this.sphere.instanceMatrix.needsUpdate = true
    }
    
    this.animate = () => {
      this.updatePosition()
      controls.update()
      renderer.render( scene, camera )
      requestAnimationFrame( this.animate )
    }
}

//TOOD: Use dummy object isntead of the tricks and hoops I am dealing with when doing matrix4 things