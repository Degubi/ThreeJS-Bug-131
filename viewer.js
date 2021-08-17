import { WebGLRenderer, Scene, PerspectiveCamera, PCFSoftShadowMap, HemisphereLight, Color } from './node_modules/three/build/three.module.js';
import { OrbitControls } from './OrbitControls.js';

const globalScenes = [];
const globalCameras = [];
const globalSceneElements = [];
const globalControls = [];
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
const canvas = renderer.domElement;
let shouldRender = false;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.autoClear = false;
canvas.style.position = 'absolute';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';

new ResizeObserver(onWindowResize).observe(document.body);
window.addEventListener('scroll', () => {
    canvas.style.transform = `translateY(${window.scrollY}px)`;
    renderScenes();
});

function forceRenderScenes() {
    shouldRender = false;

    renderer.setClearColor(0xffffff, 0);
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);

    const windowInnerHeight = window.innerHeight;
    for(let i = 0; i < globalScenes.length; ++i) {
        const sceneBounds = globalSceneElements[i].getBoundingClientRect();

        if(sceneBounds.top < windowInnerHeight && sceneBounds.bottom >= 0) {
            const width = sceneBounds.width;
            const height = sceneBounds.height;
            const left = sceneBounds.left;
            const bottom = canvas.clientHeight - sceneBounds.bottom;

            renderer.setViewport(left, bottom, width, height);
            renderer.setScissor(left, bottom, width, height);
            renderer.render(globalScenes[i], globalCameras[i]);

            const control = globalControls[i];
            if(control !== null) {
                control.update();
            }
        }
    }
}

function onWindowResize() {
    for(let i = 0; i < globalCameras.length; ++i) {
        const bounds = globalSceneElements[i].getBoundingClientRect();
        const camera = globalCameras[i];

        camera.aspect = (bounds.right - bounds.left) / (bounds.bottom - bounds.top);
        camera.updateProjectionMatrix();
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScenes();
}

function renderScenes() {
    if(!shouldRender) {
        shouldRender = true;
        requestAnimationFrame(forceRenderScenes);
    }
}

class ModelViewer extends HTMLElement {

    _viewerIndex = globalScenes.length;
    _mainCamera = new PerspectiveCamera(60, 1, 1, 150);
    _mainScene = new Scene();

    constructor() {
        super();
    }

    connectedCallback() {
        // Don't declare it above, leave this here, because OrbitControls modifies 'style.touchAction' in the constructor
        // We can't modify the .style of 'this' in the constructor
        // This was introduced in #21972, but I solved it like this...
        this._cameraControls = new OrbitControls(this._mainCamera, this);
        this._cameraControls.enableDamping = true;
        this._cameraControls.dampingFactor = 0.05;
        this._cameraControls.maxDistance = 55;
        this._cameraControls.enablePan = false;
        this._cameraControls.addEventListener('change', renderScenes);

        this._mainCamera.position.set(5, 1, 2);
        this._mainScene.add(this._mainCamera);
        this._mainScene.add(new HemisphereLight(0xffffff, 0xffffff, 0.55));
        this._mainScene.background = new Color(0xdddddd);;

        globalScenes.push(this._mainScene);
        globalCameras.push(this._mainCamera);
        globalSceneElements.push(this);
        globalControls.push(this._cameraControls);

        this.style.display = 'inline-block';
        this.style.position = 'absolute';

        const butt = document.createElement('button');
        butt.innerText = 'Click me';
        butt.style.position = 'absolute';
        butt.style.height = '256px';
        butt.style.width = '256px';
        butt.style.left = '300px';
        butt.style.top = `30px`;
        butt.addEventListener('click', () => alert('Cliick'));
        this.appendChild(butt);

        document.body.insertBefore(canvas, document.body.firstChild);
        renderScenes();
    }
}

window.customElements.define('model-viewer', ModelViewer);