import * as THREE from 'three'

export const createNewWave = (byteFreqLength, scene) => {
    // let waveWidth = 200
    // let waveHeight = 100
    let objectsMargin = 20

    let waveObjects = new Array(byteFreqLength)
    for (let a=0; a<byteFreqLength; a++) {
        const geometry = new THREE.SphereGeometry( 15, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(0, 0, a * objectsMargin)
        scene.add( sphere )
        waveObjects.push( sphere )
    }
}

export const animate = (handleAudioFile, scene, camera, renderer, clock) => {
    // let delta = clock.getDelta()
    // let elapsed = clock.elapsedTime

    requestAnimationFrame( animate )
    let byteFreq = handleAudioFile()

    for( let a=0; a<byteFreq.length; a++ ) {
        waveObjects[a].position.y = byteFreq[a]
    }

    renderer.render( scene, camera)
 }
