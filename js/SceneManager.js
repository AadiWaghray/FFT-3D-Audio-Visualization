import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CircularVisualizer } from './sceneSubjects/visualizer'

export function SceneManager ( canvas ) {

    const clock = new THREE.Clock()    

    // const screenDimensions = {
    //     width: canvas.width,
    //     height: canvas.height
    // }

    const scene = buildScene()
    const camera = buildCamera() //screenDimensions )
    const renderer = buildRenderer() //screenDimensions )
    const sceneSubjects = createSceneSubjects( scene )
    const controls = new OrbitControls( camera, renderer.domElement )

    function buildScene () {
        const scene = new THREE.Scene() 
        
        scene.background = new THREE.Color( 254, 1, 154 ) 
        
        return scene
    }

    function buildCamera () {//{width, height}
        const camera = new THREE.PerspectiveCamera(75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000)

        camera.position.set( 0, 0, 5 )
        

        //Check for other arguments I need

        return camera
    }

    function buildRenderer () {//{width, height}
        const renderer = new THREE.WebGLRenderer()

        //Check for other arguments I need
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(renderer.domElement)

        return renderer
    }

    function createSceneSubjects () {
        const sceneSubjects = [
            //Lights
            new CircularVisualizer( scene )
        ]

        return sceneSubjects
    }

    this.update = () => {
        const elapsedTime = clock.getElapsedTime()

        for ( let a=0; a<sceneSubjects.length; a++ ) {
            sceneSubjects[a].update( elapsedTime )
        }

        controls.update()
        renderer.render( scene, camera )
    }

    this.onWindowResize = () => {

    }

}