import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const ob = document.querySelector(".web-gl5");
const canvasLength = document.querySelector(".canvaselement5");
const renderer = new THREE.WebGL1Renderer({
  canvas: ob,
  antialias: true,
//   alpha: true,
});
const path = new URL("../Models/the_moon.glb", import.meta.url);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

renderer.shadowMap.enabled = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
    camera.position.set(0,-0.40,0.80);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enablePan=false;
    orbit.update();


const spotlight = new THREE.SpotLight(0x6be1ff);
spotlight.angle= 8 * Math.PI/180;
spotlight.position.set(5,-4,0);
spotlight.target.position.set(-0.50,0,0);
scene.add(spotlight);

const spotlight2 = new THREE.SpotLight(0xfb74ce);
spotlight2.angle= 8 * Math.PI/180;
spotlight2.position.set(4,6,0);
spotlight2.target.position.set(-0.50,0,0);
scene.add(spotlight2);


const particlesGeo = new THREE.BufferGeometry();
const particleCount = 10000;
const particleMat = new THREE.PointsMaterial(
    {size:0.005}
);
const posArr = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
posArr[i]= (Math.random() - 0.5) * 10 ;
}

particlesGeo.setAttribute('position',new THREE.BufferAttribute(posArr,3));
const particleMesh = new THREE.Points(particlesGeo,particleMat);
scene.add(particleMesh);


const pointsLight = new THREE.PointLight(0xffffff , 0.1)
pointsLight.position.x=2
pointsLight.position.y=3
pointsLight.position.z=4
scene.add(pointsLight);


window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const loader = new GLTFLoader();
let model
loader.load(
  path.href,
  function (gltfScene) {
    model = gltfScene;
    scene.add(model.scene);
    model.scene.position.set(-0.5,0,0);
    model.scene.rotateY(0.03);
    model.scene.rotateX(0.03);
    model.scene.scale.set(0.4, 0.4, 0.4);

  },
  undefined,
  (error) => {
    console.log(error);
  }
);

document.addEventListener("mousemove",particleAnimate);

let mouseX = 0;
let mouseY = 0;

function particleAnimate(event){
    mouseX=event.clientY;
    mouseY=event.clientX;
}
const clock = new THREE.Clock();
    
    const tick = ()=>
    {
        const ElapsedTime = clock.getElapsedTime();
        particleMesh.rotation.x=mouseY * (ElapsedTime * 0.0005);
        particleMesh.rotation.y=mouseX * (ElapsedTime * 0.0005);
        
        if(model)model.scene.rotation.x+=0.004;
        renderer.render(scene , camera);
        window.requestAnimationFrame(tick);
}

tick();


