// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

//audio variables brought in from visualizer.html
let fftSize = 128;
let listener = new THREE.AudioListener();
let audio = new THREE.Audio( listener );
let mediaElement1 = new Audio( 'audio/Modular1Rhodes_1.mp3' );
let mediaElement2 = new Audio( 'audio/Modular2Synth_1.mp3' );
let mediaElement3 = new Audio( 'audio/Modular3RhodesChorus_1.mp3' );
let mediaElement4 = new Audio( 'audio/Modular1Rhodes_1.mp3' );
let mediaElement5 = new Audio( 'audio/Modular2Synth_1.mp3' );
let mediaElement6 = new Audio( 'audio/Modular3RhodesChorus_1.mp3' );


let analyser = new THREE.AudioAnalyser( audio, fftSize );

//sphere_one
var geometry = new THREE.SphereGeometry( 5, 5, 25 );
var material = new THREE.MeshLambertMaterial( { color: "0000FF", opacity:0.5, transparent:true, wireframe:true, emissive: 0x0000FF,emissiveIntensity:0.6} );
var sphere_one = new THREE.Mesh( geometry, material );
var group = new THREE.Group();

//text
var load2 = new THREE.FontLoader();

let newMaterial, Standard, newStandard;

const mixers = [];
const clock = new THREE.Clock();


function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  createCamera();
  createControls();
  createLights();
  createMaterials();
  //loadModels();
  createSkybox();
  createRenderer();

  // play_audio(); 

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}
  function createSkybox(){
    scene.background = new THREE.CubeTextureLoader()					
    .setPath( 'js/THREE.js-master/src/examples/textures/cube/rock/' )					
    .load( [ 'px1.png', 'nx1.png', 'py1.png', 'ny1.png', 'pz1.png', 'nz1.png' ] );
  }



function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 20, -1, -46);

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

}

function createMaterials(){

     let diffuseColor = "#9E4300";
     newMaterial = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
     Standard = new THREE.MeshStandardMaterial( { color: "#9E4300", skinning: true} );

     var imgTexture = new THREE.TextureLoader().load( "textures/water.JPG" );
     				imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
     				imgTexture.anisotropy = 16;


      

//from Reddit

load2.load( 'js/THREE.js-master/src/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	var textGeo = new THREE.TextGeometry( "Take Time", {
        font: font,
        size: 2,
        height: 2,
        curveSegments: 21,
        bevelEnabled: false
    } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xdddddd } );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set(-0.5, -1, 2.3);
    scene.add( mesh );
} );
//

     newStandard = new THREE.MeshStandardMaterial( {
										map: imgTexture,
										bumpMap: imgTexture,
                                        bumpScale: 1,
                                        envMap: scene.background,
										//color: diffuseColor,
										metalness: 0.5,
										roughness: 0.1,
										//envMap: imgTexture,
                    displacementmap: imgTexture,
                    displacementscale: 0.1,
                    skinning: true
                  } );
                  


                  // console.log(sphere_one);
                  sphere_one.position.x = 0;
                  sphere_one.position.y = 0;
                  sphere_one.position.z = 0;
                  group.add( sphere_one  );
  
                  scene.add( group );
  
                  var prevFog = true;

      
        



}

function play_audio1() {

  mediaElement1.play();
  audio.setMediaElementSource( mediaElement1 );
}
function play_audio2() {

  mediaElement2.play();
  audio.setMediaElementSource( mediaElement2 );
}
function play_audio3() {

  mediaElement3.play();
  audio.setMediaElementSource( mediaElement3 );
}
function play_audio4() {

  mediaElement4.play();
  audio.setMediaElementSource( mediaElement4 );
}
function play_audio5() {

  mediaElement5.play();
  audio.setMediaElementSource( mediaElement5 );
}
function play_audio6() {

  mediaElement6.play();
  audio.setMediaElementSource( mediaElement6 );
}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

  /* const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    const action = mixer.clipAction( animation );
    action.play();
    */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;

    object.traverse((child) => {
                       if (child.isMesh) {
                       child.material = material; // a material created above
                  }
                 });
                   scene.add(object);

    //scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( 0, 0, 0 );
  loader.load( 'models/genie.glb', gltf => onLoad( gltf, parrotPosition, newStandard), onProgress, onError );

  //const flamingoPosition = new THREE.Vector3( 7.5, 0, -10 );
  //loader.load( 'models/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), onProgress, onError );

  //const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
  //loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;



  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  // /*for ( const mixer of mixers ) {
  //
  //   mixer.update( delta );
  // }
  // */

}

function render() {

  //console.log(camera.position);


  analyser.getFrequencyData();

  // console.log(analyser);

  // requestAnimationFrame( render );
  //                   noise.seed(Math.random());
                    var sum = analyser.data.reduce(function(a,b){return a+b;});
                    var avg = sum/analyser.data.length;

                    // console.log(camera.position);

                    // group.rotation.y += avg/900;

                     sphere_one.geometry.vertices.forEach(function(i){
                         var noisy = noise.simplex3(i.x,i.y,i.z)*0.00003;
                         i.x+=noisy*avg;
                         i.y+=noisy*avg;
                         i.z+=noisy*avg;

                     })

                        sphere_one.geometry.verticesNeedUpdate = true;

                        // camera.position += avg;



                  //    textGeo.geometry.vertices.forEach(function(i){
                  //     var noisy = noise.simplex3(i.x,i.y,i.z)*0.00005;
                  //     i.x+=noisy*avg;
                  //     i.y+=noisy*avg;
                  //     i.z+=noisy*avg;

                  // })

                  //    textGeo.geometry.verticesNeedUpdate = true;


                        renderer.render( scene, camera );


}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
