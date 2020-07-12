import * as THREE from '../../vendor/three.module.js';
import { OrbitControls } from '../../vendor/OrbitControls.js';

const config = {
  background: '#000000',
  hexColors: {
    hexPurple: 0x7300ff,
    hexLightPurple: 0x8119ff,
    hexGray: 0x454545,
    hexWhite: 0xffffff,

  },
};

const lights = async (color, intensity, distance, position) => {
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(position.x, position.y, position.z);
  return light;
};

const init = async (width, height) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const canvas = document.querySelector('#renderCanvas');

  const render = new THREE.WebGLRenderer({ canvas, antialias: true });
  const controls = new OrbitControls(camera, render.domElement);

  render.setClearColor(config.background);
  render.setSize(width, height);
  render.autoClear = true;
  document.body.appendChild(render.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 5;

  const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
  const material = new THREE.MeshLambertMaterial({ color: config.hexColors.hexPurple });

  const cubes = [];

  for (let i = 0; i < 200; i += 1) {
    const c = new THREE.Mesh(geometry, material);
    c.position.x = (Math.random() - 0.5) * 10;
    c.position.y = (Math.random() - 0.5) * 10;
    c.position.z = (Math.random() - 0.5) * 10;

    const factor = (Math.random() >= 0.5) ? 1 : -1;
    cubes.push({ el: c, factor });

    scene.add(c);
  }

  geometry.dispose();
  material.dispose();

  scene.add(await lights(config.hexColors.hexWhite, 1, 1000, { x: 0, y: 0, z: 0 }));
  scene.add(await lights(config.hexColors.hexGray, 2, 1000, { x: 0, y: 0, z: 25 }));

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();

    cubes.map((e) => {
      e.el.rotation.x += (Math.random() / 100) * e.factor;
      e.el.rotation.z += (Math.random() / 100) * e.factor;
      return null;
    });

    render.render(scene, camera);
  };

  animate();

  document.addEventListener('mousemove', _.debounce((e) => {
    const vector = camera.position.clone();

    if (e.screenX > width / 2) {
      vector.x += 0.01;
    } else {
      vector.x -= 0.01;
    }

    if (e.screenY > height / 2) {
      vector.y += 0.01;
    } else {
      vector.y -= 0.01;
    }

    camera.position.set(vector.x, vector.y, vector.z);
  }, 5));

  setInterval(() => {
    if (material.color.getHex() === config.hexColors.hexPurple) {
      material.color.setHex(config.hexColors.hexLightPurple);
    } else {
      material.color.setHex(config.hexColors.hexPurple);
    }
  }, 1000);
};

window.addEventListener('load', _.debounce(() => {
  init(window.innerWidth, window.innerHeight);
}, 500));

window.addEventListener('resize', _.debounce(async () => {
  init(window.innerWidth, window.innerHeight);
}, 500));
