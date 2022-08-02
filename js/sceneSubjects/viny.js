import { GLTFLoader } from 'THREE/examples/jsm/loaders/GLTFLoader.js'

export function Vinyl ( scene ) {
    const loader = new GLTFLoader()
    loader.load( './public/scene.gltf', ( gltf ) => {
        const vinylMesh = gltf.scene.children[0]
        vinylMesh.scale.set( 36, 36, 36 )
        vinylMesh.rotation.x = 0
        scene.add( gltf.scene )
    }, undefined, function ( error ) {

        console.error( error );
    
    } )

    this.update = () => {}
}