import { WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight, Color } from './node_modules/three/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';

const viewerElement = document.getElementById('viewer');
const camera = new PerspectiveCamera(60, 1, 1, 150);
const scene = new Scene();
const cameraControls = new OrbitControls(camera, viewerElement);
cameraControls.addEventListener('change', renderScenes);

camera.position.set(5, 1, 2);
scene.add(camera);
scene.add(new HemisphereLight(0xffffff, 0xffffff, 0.55));
scene.background = new Color(0xdddddd);


const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const canvas = renderer.domElement;
let shouldRender = false;

renderer.autoClear = false;
canvas.style.position = 'absolute';
canvas.style.width = '100%';
canvas.style.height = '100%';
document.body.insertBefore(canvas, document.body.firstChild);

renderScenes();

function forceRenderScenes() {
    shouldRender = false;
    renderer.render(scene, camera);
    cameraControls.update();
}

function renderScenes() {
    if(!shouldRender) {
        shouldRender = true;
        requestAnimationFrame(forceRenderScenes);
    }
}