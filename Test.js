const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const instancedSphere = new THREE.SphereBufferGeometry( 10, 16, 16 );

// Add the instanced color attribute
const tint = new THREE.InstancedBufferAttribute( new Uint8Array( 100 * 3 ), 3, true );
instancedSphere.attributes.tint = tint;

// Extend a standard material with the new feature
let instancedMaterial = THREE.ShaderMaterial.extend( THREE.MeshStandardMaterial, {
  
  header: 'varying vec3 vTint;',
  
  vertex: {
    '#include <common>' : 'attribute vec3 tint;',
    '#include <project_vertex>': 'vTint = tint;'
  },
  fragment: {
    '#include <fog_fragment>': 'gl_FragColor.rgb = gl_FragColor.rgb * vTint;'
  }
  
});

const instancedMesh = new THREE.InstancedMesh( instancedSphere, instancedMaterial, 100 );


const m = new THREE.Matrix4;
let i = 0;

for ( let x = 0; x < 10; x ++ )
for ( let y = 0; y < 10; y ++ ) {
  
  m.setPosition( x * 30, y * 30, 0 );
  instancedMesh.setMatrixAt( i, m );
  
  tint.setXYZ( i, Math.random() * 255, Math.random() * 255, Math.random() * 255 );
  
  i ++ ;
  
}

scene.add( instancedMesh );

const grid = new THREE.InfiniteGridHelper(10, 100);


scene.add(grid);
  function animate() {

      requestAnimationFrame( animate );

      renderer.render( scene, camera );

  }



animate();