// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

var sphere;

// let object;

let avg;

let sum;

let parrotPosition;

//define renderaudio globally
var renderaudio;

//define audioMesh globally
var audioMesh;

let group = new THREE.Group();

const mixers = [];
const clock = new THREE.Clock();

function audiovis() {

//brought into gltf_visualizer_clean in the load models function
          var fftSize = 128;
          var listener = new THREE.AudioListener();
          var audio = new THREE.Audio( listener );
          var mediaElement = new Audio( 'audio/ItCouldHappenToYou.mp3' );
          mediaElement.loop = true;

          mediaElement.play();
          audio.setMediaElementSource( mediaElement );
          analyser = new THREE.AudioAnalyser( audio, fftSize );
          //var sum = analyser.data.reduce(function(a,b){return a+b;});
          sum = analyser

          // console.log("here");
          //
          // console.log(sum);




          var avg = sum/analyser.data.length;
          // console.log(avg);

//
           renderaudio = function (anyMesh) {

              requestAnimationFrame( render );



              //
              // anyMesh.geometry.vertices.forEach(function(i){
              //     var noisy = noise.simplex3(i.x,i.y,i.z)*0.001;
              //     i.x+=noisy*avg;
              //     i.y+=noisy*avg;
              //     i.z+=noisy*avg;
              // });


              // anyMesh.rotation.y += 0.0005*avg;


              analyser.getFrequencyData();
              // var sum = analyser.data.reduce(function(a,b){return a+b;});
              var avg = sum/analyser.data.length;

              // anyMesh.geometry.verticesNeedUpdate = true;


              scene.add(anyMesh);


          };



// renderaudio();



}

function init() {

  container = document.querySelector( '#scene-container' );
//
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );
//   // var geometry = new THREE.SphereGeometry( 5, avg, 32 );
//  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  // sphere = new THREE.Mesh( geometry, material );



  createCamera();
  createControls();
  createLights();
  audiovis();
  createRenderer();
  loadModels();




  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 5, 5, 0);

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

function loadModels() {




  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

    //make sure only grabs meshObject
    let object = gltf.scene;    //stand in material for now

    audioMesh = gltf.scene;

    var material = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // audioMesh = child;
      }});

      group.add( model );

    // console.log(audioMesh);
    scene.add( model, group );

    // group.add( model );

    // scene.add(audioMesh);

  };
  const onProgress = () => {};
  const onError = ( errorMessage ) => { console.log( errorMessage ); };
  let parrotPosition = new THREE.Vector3( 0, 0, 0 );
  loader.load( 'models/genie.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );

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


}

function render() {

  noise.seed(Math.random());
  var sum = analyser.data.reduce(function(a,b){return a+b;});
  var avg = sum/analyser.data.length;

  // console.log(analyser.data.entries());



  let minnie = Math.min(analyser.data[0]);


  //
  // console.log("here");
  // console.log(minnie);
  // console.log(avg);

  camera.positionNeedUpdate = true

  // console.log(camera.position);

  analyser.getFrequencyData();

  // analyser.getFloatFrequencyData();

  // console.log(analyser)

  // function rotate(model) {
  //
  //   model.rotation.y += .03*avg
  // }
  //
  // rotate();
  //

  function changeCamera(inputvalue) {

    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
    camera.position.set( 0, 0, inputvalue*.03);

    group.rotation.y +=.04*avg;

  }

  function changePosition(inputvalue) {


  }

  // setTimeout(changeCamera(avg), 5000);
  changeCamera(setTimeout (avg), 100);

  renderer.render( scene, camera );

  // loadModels();


  // renderaudio(sphere.geometry);


}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;


  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );
}

window.addEventListener( 'resize', onWindowResize );

init();
