/*
 * @Author: chenhuang
 * @Date: 2024-06-26 14:36:06
 * @Description: 
 */
/**
 * 几何体 BufferGeometry
 * 1.缓存几何体：new THREE.BufferGeometry
 * 2.顶点数据：geometry.attributes.position
 * 3.顶点法线：.geometry.attributes.normal
 * 4.材质类型：点材质（模型）、线材质（模型）、网格材质（模型）
 * **/
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入渲染帧率插件
import Stats from 'three/addons/libs/stats.module.js';

console.log(Stats)
// 1.创建场景
const scene = new THREE.Scene({
//   background: 0x000000
});

// 1.1 创建物体
const geometry1 = new THREE.CylinderGeometry(2, 2, 20);
// 线材质
const material1 = new THREE.LineDashedMaterial({
    side: THREE.DoubleSide,
    color: 0x00BFFF,
    transparent: true, // 3. 开启透明材质
    opacity: 0.2, // 透明度
}); 
// 线模型
// const mesh1 = new THREE.LineLoop(geometry1, material1);
// // 网格材质
// const material1 = new THREE.MeshLambertMaterial({
//     side: THREE.DoubleSide,
//     color: 0x2486b9,
//     transparent: true, // 3. 开启透明材质
//     opacity: 0.4, // 透明度
// }); 
// 网格模型
const mesh1 = new THREE.Mesh(geometry1, material1);
// 添加到场景
mesh1.position.set(0, 1, 0);
mesh1.rotateX(THREE.MathUtils.degToRad( 90 ))
mesh1.rotateZ(THREE.MathUtils.degToRad( 90 ))
scene.add(mesh1);


//-------------------------------------//
// 创建球体
const model = new THREE.Group();
const group = new THREE.Group();
group.name = `一组小球`
const list = [
    {
        y: 0,
        z: 0
    },
    {
        y: 1,
        z: 1
    },
    {
        y: 1,
        z: -1
    },
    {
        y: -1,
        z: 1
    },
    {
        y: -1,
        z: 0
    },
    {
        y: 1,
        z: 2
    },
    {
        y: 0,
        z: 2
    },
    {
        y: 1,
        z: 1.5
    },
    {
        y: 0.5,
        z: -1.3
    },
]
for(let i=0; i<list.length; i++){
    const geometry2 = new THREE.SphereGeometry(0.3);
    // 网格材质
    var material2 = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xed2f6a,
    }); 
    // 网格模型
    var mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-4.8, list[i].y+0.5, list[i].z-0.5);
    mesh2.name=`${i}`
    group.add(mesh2)
}
model.add(group)
scene.add(model);
//-------------------------------------//

// 2.创建相机(透视相机)
let camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 6000);
camera.position.set(0, 20, 20);
camera.lookAt(5, 0.5, 0)

// 4.创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000, 0.2);

// 5.创建光源
// // 环境光
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1 );
scene.add( ambientLight );

// 其它1.创建辅助观察坐标系
const axesHelper = new THREE.AxesHelper(80);
scene.add(axesHelper);

// 其它2.添加轨道控制器
new OrbitControls(camera, renderer.domElement);

// 其它4.添加帧率插件
const stats = new Stats();
document.body.appendChild( stats.domElement );

// 其它5.添加辅助网格地面
const gridHelper = new THREE.GridHelper(30, 30, 0x004444, 0x004444);
scene.add(gridHelper)


// 校验小球在指定区域滚动
const checkBall = () => {
    // 小球起点位置
    const startPoint = -10;
     // 小球终点位置
    const endPoint  = 10;
    // 小球位置递减的值
    const loopPoint = 0.1;


    // 递归遍历model包含所有的模型节点
    let i = 0
    model.traverse(function(obj) {
        i++;
        // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
        if (obj.isMesh) {//判断条件也可以是obj.type === 'Mesh'

            // 动态迁移小球位置
            if(obj.position.x > endPoint){
                obj.position.x = startPoint;
            }else {
                obj.position.x += loopPoint;
            }
            obj.position.set(obj.position.x, obj.position.y, obj.position.z);

            if(obj.position.x<=(startPoint+endPoint)/2){
                obj.material.color.set(0xe2d849);
            }else if(obj.name%2==0){
                obj.material.color.set(0xed2f6a);
            }
        }
    });
}

// 动画渲染
const animateRender = ()=>{
    stats.update();
    renderer.render(scene, camera)
    mesh2.rotateY(0.001)
    checkBall();
    requestAnimationFrame(animateRender)
}

// 监听窗口变化
const resize = ()=>{
  window.addEventListener("resize", ()=>{
    // 渲染器：动态适应可视区域的大小
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 相机：视锥体长宽比
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  })
}

// 启动函数
const startFunc = ()=>{
    resize();
    animateRender();
    document.getElementById("webgl").appendChild(renderer.domElement);
}
startFunc();