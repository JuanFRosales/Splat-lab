import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from 'babylonjs';
import 'babylonjs-loaders';

import './style.css';

// Get canvas and video elements
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement | null;
const video = document.getElementById('proofVideo') as HTMLVideoElement | null;

if (!canvas) {
  console.error('Canvas element not found!');
  throw new Error('Canvas element not found!');
}

if (!video) {
  console.error('Video element not found!');
  throw new Error('Video element not found!');
}

// Babylon.js Engine
const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

const createScene = () => {
  const scene = new Scene(engine);
  const camera = new ArcRotateCamera(
    'camera1',
    Math.PI / 2,
    Math.PI / 4,
    10,
    new Vector3(0, 2, 0),
    scene,
  );
  camera.attachControl(canvas, false);

  new HemisphericLight('light1', new Vector3(1, 1, 1), scene);

  // Create Tabletop
  const tabletop = MeshBuilder.CreateBox('tabletop', { width: 3, height: 0.2, depth: 2 }, scene);
  tabletop.position = new Vector3(0, 1, 0); // Raised to table height

  // Create Table Legs
  const legHeight = 1;
  const legSize = 0.2;
  const legPositions = [
    new Vector3(-1.3, 0.5, -0.9), // Front Left
    new Vector3(1.3, 0.5, -0.9),  // Front Right
    new Vector3(-1.3, 0.5, 0.9),  // Back Left
    new Vector3(1.3, 0.5, 0.9),   // Back Right
  ];

  legPositions.forEach((position, index) => {
    const leg = MeshBuilder.CreateBox(`leg${index + 1}`, { width: legSize, height: legHeight, depth: legSize }, scene);
    leg.position = position;
  });


  SceneLoader.ImportMeshAsync('', './', 'macbook.splat', scene).then((result) => {
    const macbook = result.meshes[0];
    macbook.position = new Vector3(0.2, 0.4, 0); 
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});

// Autoplay the video when the page loads
video.play().catch(error => console.error('Autoplay blocked:', error));

