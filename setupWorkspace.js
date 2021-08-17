import { readFileSync, writeFileSync } from 'fs';

const orbitControlsContent = readFileSync('./node_modules/three/examples/jsm/controls/OrbitControls.js').toString();

writeFileSync('OrbitControls.js', orbitControlsContent.replace('three', './node_modules/three/build/three.module.js'));