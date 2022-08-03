import * as THREE from 'three'
import { GLTFLoader } from 'THREE/examples/jsm/loaders/GLTFLoader.js'
export function Vinyl ( scene ) {
    const light = new THREE.PointLight(
        0xffffff,
        1, 
        100
    )
    light.position.set( 0, 0, 20)
    scene.add( light )
    const gltfloader = new GLTFLoader()

    gltfloader.load( './public/record/scene.gltf', ( gltf ) => {
        const vinylMesh = gltf.scene.children[0]
        vinylMesh.scale.set( 50, 50, 50  )
        vinylMesh.rotation.x = 0
        scene.add( gltf.scene )//TODO: Work on texture calls after response on fixing npm issues
    }, undefined, function ( error ) {
        console.error( error );
    } )

    this.update = () => {}
}