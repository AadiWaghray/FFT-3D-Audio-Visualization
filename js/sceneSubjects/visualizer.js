import * as THREE from 'three'

export function CircularVisualizer ( scene ) {
    let byteFreq = new Uint8Array(window.analyser.frequencyBinCount)

    const objectsMargin = 0.02
    const numberOfRows = 1000

    const numberOfInstanceMesh = numberOfRows * Math.round(byteFreq.length / 4)

    const geometry = new THREE.SphereBufferGeometry(0.01, 2, 2)
    const material = new THREE.MeshBasicMaterial({ color: 0x999999 })
    const sphere = new THREE.InstancedMesh( geometry, material, numberOfRows*byteFreq.length )
  
    scene.add( sphere )

    sphere.instanceMatrix.setUsage( THREE.DynamicDrawUsage ) 
  
    initCircularVisualizer()


    function initCircularVisualizer () {
        const dummyObject = new THREE.Object3D()
        const color = new THREE.Color( 0xffffff )
        let radius
        let x
        let y
        let i = 0

        for (let a = 0; a < numberOfRows; a++) {  
            for (let b = 0; b < Math.round(byteFreq.length / 4); b++) {
                radius = ( b + 10 ) * objectsMargin
                x = radius * Math.cos( 2 * Math.PI * ( ( a + 1)  / numberOfRows ) )
                y = radius * Math.sin( 2 * Math.PI * ( ( a + 1)  / numberOfRows ) )
                
                dummyObject.position.set( x, y, 0 )
                dummyObject.updateMatrix()
                console.log( dummyObject.position.x, 
                    dummyObject.position.y,
                    dummyObject.position.z)
                
                sphere.setMatrixAt( i, dummyObject.matrix )
                sphere.setColorAt( i, color )

                i++
            }
        }
    }
  
    const progressRotation = () => {
        const matrix4 = new THREE.Matrix4
        const vector3 = new THREE.Vector3()
        const color = new THREE.Color()
        
        for ( let a= numberOfInstanceMesh; a > Math.round(byteFreq.length / 4) - 1; a--) {
            sphere.getMatrixAt ( a - Math.round(byteFreq.length / 4), matrix4 ) 
            vector3.setFromMatrixPosition( matrix4 )
            let z = vector3.getComponent( 2 )
            
            sphere.getMatrixAt ( a, matrix4 )
            vector3.setFromMatrixPosition( matrix4 )
            vector3.setComponent( 2, z )
            matrix4.setPosition( vector3 )

            sphere.setMatrixAt( a, matrix4 )
            
            sphere.getColorAt( a - Math.round(byteFreq.length / 4), color )
            sphere.setColorAt( a, color )
        }
    }
    
    const setFirstRadialSection = () => {
        window.analyser.getByteFrequencyData(byteFreq)
        
        const matrix4 = new THREE.Matrix4
        const vector3 = new THREE.Vector3()
        const color = new THREE.Color()
        let average = 0
        for (let a = 1; a < byteFreq.length + 1; a++) {
            if (a % 4 === 0) {
                average = average / 4
                
                sphere.getMatrixAt( a/4 -1, matrix4 )
                vector3.setFromMatrixPosition( matrix4 )
                vector3.setComponent( 2, average/40 )
                matrix4.setPosition( vector3 )
                sphere.setMatrixAt( a/4 -1, matrix4 )
                
                color.setRGB( average / 255, average / 255, average / 255, "srgb")
                sphere.setColorAt( a/4 - 1, color )
                
                average = 0
            }
            
            average += byteFreq[a]
        }
    }
    
    this.update = () => {
        progressRotation()

        setFirstRadialSection()//Better Name
      
        //TODO: Find out exactly what these do
        sphere.instanceColor.needsUpdate = true
        sphere.instanceMatrix.needsUpdate = true
    }
}
