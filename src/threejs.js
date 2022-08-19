import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import * as dat from 'lil-gui';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// const gui = new dat.GUI();

var parameters = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: 0,
    camera_init: camera_init,
    camera_goals: camera_goals,
    camera_fire: camera_fire,
    camera_book: camera_book,
};

// gui.add(parameters, 'camera_init');
// gui.add(parameters, 'camera_goals');
// gui.add(parameters, 'camera_fire');
// gui.add(parameters, 'camera_book');
var positions = {init : [-6.5, 2.5, -2.5, 0, 3, 0], goals : [-1.35, 2.4, 1.4, -1.35, 2.36, -0.68], fire : [-6.55, 1.2, -9, 2.07, 1.57, 0], book: [-4.85, 1.45, -8.3232, -3.9, -100, 0]}

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera_target = new THREE.Vector3(0, 0, 0);
const camera_group = new THREE.Group();
camera_group.add(camera);
scene.add(camera_group);
camera.lookAt(camera_target);

// ? Camera
function camera_init() {
    gsap.to(camera.position, { x: positions.init[0], y: positions.init[1], z: positions.init[2], duration: 1, ease: "power4.inOut"});
    gsap.to(camera_target, { x: positions.init[3], y: positions.init[4], z: positions.init[5], duration: 1, ease: "power4.inOut"});
};

function camera_goals() {
    gsap.to(camera.position, { x: positions.goals[0], y: positions.goals[1], z: positions.goals[2], duration: 1, ease: "power4.inOut"});
    gsap.to(camera_target, { x: positions.goals[3], y: positions.goals[4], z: positions.goals[5], duration: 1, ease: "power4.inOut"});
};

function camera_fire() {
    gsap.to(camera.position, { x: positions.fire[0], y: positions.fire[1], z: positions.fire[2], duration: 1, ease: "power4.inOut"});
    gsap.to(camera_target, { x: positions.fire[3], y: positions.fire[4], z: positions.fire[5], duration: 1, ease: "power4.inOut"});
};

function camera_book() {
    gsap.to(camera.position, { x: positions.book[0], y: positions.book[1], z: positions.book[2], duration: 1, ease: "power4.inOut"});
    gsap.to(camera_target, { x: positions.book[3], y: positions.book[4], z: positions.book[5], duration: 1, ease: "power4.inOut"});
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 0.4;
renderer.setClearAlpha(0);

// const controls = new OrbitControls(camera, canvas);

var composer = new EffectComposer(renderer);
var renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
var saoPass = new SAOPass(scene, camera, false, true);
saoPass.params.saoIntensity = 0.003;
// composer.addPass(saoPass);

const light = new THREE.AmbientLight(0xffffff, 10);
scene.add(light);

//? Resize
window.addEventListener('resize', () => {
    // Update parameters
    parameters.width = window.innerWidth;
    parameters.height = window.innerHeight;

    // Update camera
    camera.aspect = parameters.width / parameters.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(parameters.width, parameters.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//? Environment
const cube_loader = new THREE.CubeTextureLoader();
import env_url_0 from './assets/envMaps/px.png?url';
import env_url_1 from './assets/envMaps/nx.png?url';
import env_url_2 from './assets/envMaps/py.png?url';
import env_url_3 from './assets/envMaps/ny.png?url';
import env_url_4 from './assets/envMaps/pz.png?url';
import env_url_5 from './assets/envMaps/nz.png?url';

const env = cube_loader.load([
    env_url_0,
    env_url_1,
    env_url_2,
    env_url_3,
    env_url_4,
    env_url_5
]);

scene.environment = env;


//? Models
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
const loading_manager = new THREE.LoadingManager();
const model_loader = new GLTFLoader(loading_manager);
const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.3/');
model_loader.setDRACOLoader(draco_loader);

import sceneURL from './assets/scene.glb?url';
var mixer;
model_loader.load(sceneURL, (glb) => {
    mixer = new THREE.AnimationMixer(glb.scene);
    console.log(glb.animations);
    const animation = mixer.clipAction(glb.animations[0]);
    animation.play();
    scene.add(glb.scene);
});

// ? Fog
const fog = new THREE.Fog(0x25283D, 10, 50);
scene.fog = fog;

// ? Snow
const snow_geo = new THREE.BufferGeometry();
const snow_count = 10000;
var vertices = new Float32Array(snow_count * 3);
var color = new Float32Array(snow_count * 3);
var scale = new Float32Array(snow_count);
for (var i = 0; i < snow_count; i++) {
    vertices[i] = (Math.random() - 0.5) * 50;
    vertices[i + 1] = Math.random() * 50;
    vertices[i + 2] = (Math.random() - 0.5) * 50;
    color[i] = 1;
    color[i + 1] = 1;
    color[i + 2] = 1;
    scale[i] = Math.random() * 10;
};

snow_geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
snow_geo.setAttribute('color', new THREE.BufferAttribute(color, 3));
snow_geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
import snow_vertex from './assets/shaders/snow/vertex.glsl?raw';
import snow_fragment from './assets/shaders/snow/fragment.glsl?raw';
import snow_texture_url from './assets/snowflakes.png?url';
const snow_texture = new THREE.TextureLoader().load(snow_texture_url);
const snow_mat = new THREE.ShaderMaterial({
    vertexShader: snow_vertex,
    fragmentShader: snow_fragment,
    uniforms: {
        uTime: { value: 0 },
        uSize: { value: 10 * renderer.getPixelRatio() },
    },
    vertexColors: true,
    transparent: true,
    // depthWrite: false,
});

const snow = new THREE.Points(snow_geo, snow_mat);
scene.add(snow);

//? Parallax Movement
var cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / window.innerWidth * 2 - 1;
    cursor.y = e.clientY / window.innerHeight * 2 - 1;
});

// ? Camera transitions
var prev_ach = canvas.dataset.ach;
var prev_quest = canvas.dataset.quest;
var prev_book = canvas.dataset.book;
function animate_camera() {
    if (canvas.dataset.ach != prev_ach) {
        prev_ach = canvas.dataset.ach;
        if (prev_ach == 0) {
            camera_goals();
        } else {
            camera_init();
        }
    }

    if (canvas.dataset.quest != prev_quest) {
        prev_quest = canvas.dataset.quest;
        if (prev_quest == 0) {
            camera_fire();
        } else {
            camera_init();
        }
    }

    if (canvas.dataset.book != prev_book) {
        prev_book = canvas.dataset.book;
        if (prev_book == 0) {
            camera_book();
        } else {
            camera_init();
        }
    }
}

//? Animation
const clock = new THREE.Clock();
function loop() {
    const elapsedTime = clock.getElapsedTime();
    snow_mat.uniforms.uTime.value = elapsedTime;
    composer.render();
    requestAnimationFrame(loop);
    animate_camera();
    gsap.to(camera_group.position, { y: -cursor.y * 0.1, duration: 0.06, ease: "power4.inOut"});
    camera.lookAt(camera_target);
    mixer.update(0.001);
};

loading_manager.onLoad = () => {
    camera_init();
    loop();
};