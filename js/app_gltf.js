// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

//define renderaudio globally
var renderaudio;

//define audioMesh globally
var audioMesh;

const mixers = [];
const clock = new THREE.Clock();

function audiovis() {

          // var gui = new dat.GUI();
          // // // var scene = new THREE.Scene();
          // // var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
          // camera.position.z = 30;

          // var renderer = new THREE.WebGLRenderer( { antialias: true } );
          // renderer.setPixelRatio( window.devicePixelRatio );
          // renderer.setSize( window.innerWidth, window.innerHeight );
          // renderer.setClearColor( 0x000000, 1 );
          // document.body.appendChild( renderer.domElement );

          // var orbit = new THREE.OrbitControls( camera, renderer.domElement );
          // orbit.enableZoom = false;
          //
          // var lights = [];
          // lights[ 0 ] = new THREE.PointLight( 0x660000, 1, 0 );
          // lights[ 1 ] = new THREE.PointLight( 0x660000, 1, 0 );
          // lights[ 2 ] = new THREE.PointLight( 0x660000, 1, 0 );
          //
          // lights[ 0 ].position.set( 0, 200, 0 );
          // lights[ 1 ].position.set( 100, 200, 100 );
          // lights[ 2 ].position.set( - 100, - 200, - 100 );
          //
          // scene.add( lights[ 0 ] );
          // scene.add( lights[ 1 ] );
          // scene.add( lights[ 2 ] );
          //
          //
          // var ambientLight  = new THREE.AmbientLight( '#00FFFF' ),
          //     hemiLight     = new THREE.HemisphereLight('#00FFFF', '#00FFFF', 0 ),
          //     light         = new THREE.PointLight( '#00FFFF', 1, 100 );
          //
          // hemiLight.position.set( 0, 0, 0 );
          // light.position.set( 0, 0, 10 );
          //
          // // scene.add( ambientLight );
          // scene.add( hemiLight );
          // // scene.add( light );

          // var group = new THREE.Group();
          //
          // var geometry = new THREE.SphereGeometry( 15, 25, 25 );
          // var material = new THREE.MeshLambertMaterial( { color: 0x00ff00, opacity:0.5, transparent:true, wireframe:true, emissive: 0x00ff00,emissiveIntensity:0.6} );
          //
          // var sphere_one = new THREE.Mesh( geometry, material );
          // sphere_one.position.x = 0;
          // sphere_one.position.y = 0;
          // sphere_one.position.z = 0;
          // group.add( sphere_one );
          //
          // scene.add( group );
          //
          // var prevFog = true;

//brought into gltf_visualizer_clean in the load models function
          var fftSize = 128;
          var listener = new THREE.AudioListener();
          var audio = new THREE.Audio( listener );
          var mediaElement = new Audio( 'audio/ItCouldHappenToYou.mp3' );
          mediaElement.loop = true;

          mediaElement.play();
          audio.setMediaElementSource( mediaElement );
          analyser = new THREE.AudioAnalyser( audio, fftSize );

//
          var renderaudio = function (sphere_one) {

              requestAnimationFrame( render );
              noise.seed(Math.random());
              var sum = analyser.data.reduce(function(a,b){return a+b;});
              var avg = sum/analyser.data.length;

              sphere_one.geometry.vertices.forEach(function(i){
                  var noisy = noise.simplex3(i.x,i.y,i.z)*0.001;
                  i.x+=noisy*avg;
                  i.y+=noisy*avg;
                  i.z+=noisy*avg;
              });
              // console.log(avg);
              // group.rotation.x += 0.0005*avg;
              group.rotation.y += 0.0005*avg;
              // group.rotation.z += 0.0005*avg;

              analyser.getFrequencyData();
              // var sum = analyser.data.reduce(function(a,b){return a+b;});
              // var avg = sum/analyser.data.length;
              // console.log(avg);
              orbit.update();
              sphere_one.geometry.verticesNeedUpdate = true;
              // renderer.render( scene, camera );

              console.log(analyser.data)

          };






          // window.addEventListener( 'resize', function () {
          //     camera.aspect = window.innerWidth / window.innerHeight;
          //     camera.updateProjectionMatrix();
          //
          //
          //     renderer.setSize( window.innerWidth, window.innerHeight );
          //
          // }, false );


          // render();



}

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 10000 );
  camera.position.set( 15, 44, 65);

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
    var material = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
    object.traverse((child) => {
      if (child.isMesh) {
        audioMesh = new THREE.Mesh(child, material);
        // a material created above
      }                 });


    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( 0, 0, 0 );
  loader.load( 'models/Amythest_export3_movedorigin.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );

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

  renderaudio(audioMesh);

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
