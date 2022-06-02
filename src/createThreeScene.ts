import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

export const createThreeScene = (width = 1000, height = 1000) => {
  //renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  //シーン
  const scene = new THREE.Scene();
  //カメラ
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 200;

  //アンビエントライト
  const amLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(amLight);
  //ポイントライト
  const pLight = new THREE.PointLight(0xffcc91, 1, 400);
  const spherical = new THREE.Spherical(180, 0.8, 2);
  pLight.position.setFromSpherical(spherical);
  pLight.castShadow = true;
  const pHelper = new THREE.PointLightHelper(pLight);
  scene.add(pLight, pHelper);

  //数値、色の定義
  const SCALE = 30;
  const NUM = 2;
  const COLORS = {
    WHITE: "#fffafa",
    PINK: "#ffc0cb",
    GREEN: "#98fb98",
    BROWN: "#deb887",
    GRAY: "#565656",
  };
  const SKEWER_X = 180;
  const SKEWER_Y = 5;
  const SKEWER_Z = 5;

  //床
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({
      color: COLORS.GRAY,
      side: THREE.DoubleSide,
    })
  );

  floor.rotation.x = THREE.MathUtils.degToRad(90);
  floor.position.y = -100;
  floor.receiveShadow = true;
  scene.add(floor);

  //メッシュ
  const dangoGeo = new THREE.SphereGeometry(SCALE, SCALE, SCALE);
  const dangoMaterials = [
    new THREE.MeshPhysicalMaterial({ color: COLORS.WHITE }),
    new THREE.MeshPhysicalMaterial({ color: COLORS.PINK }),
    new THREE.MeshPhysicalMaterial({ color: COLORS.GREEN }),
  ];

  const boxes = [];
  for (let i = 0; i <= NUM; i++) {
    const dangoMaterial = dangoMaterials[i];
    const box = new THREE.Mesh(dangoGeo, dangoMaterial);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.x = i * -SCALE * 0.85;
    box.position.y = i * 45;
    boxes.push(box);
  }
  scene.add(...boxes);

  const skewerGeo = new THREE.BoxGeometry(SKEWER_X, SKEWER_Z, SKEWER_Y);
  const skewerMate = new THREE.MeshLambertMaterial({ color: COLORS.BROWN });
  const skewerMesh = new THREE.Mesh(skewerGeo, skewerMate);
  skewerMesh.rotation.z = -45;
  scene.add(skewerMesh);

  const control = new OrbitControls(camera, renderer.domElement);
  const axesHelper = new THREE.AxesHelper(500);
  // scene.add(axesHelper);

  //lil GUI
  const gui = new GUI();
  const folder1 = gui.addFolder("Skwer");
  folder1.open();

  const animate = (): void => {
    requestAnimationFrame(animate);
    control.update();
    // spherical.phi += 0.01;
    spherical.theta += 0.01;
    pLight.position.setFromSpherical(spherical);
    renderer.render(scene, camera);
  };
  animate();
  return renderer.domElement;
};

export default createThreeScene;
