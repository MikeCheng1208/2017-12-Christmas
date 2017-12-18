<script>
import * as THREE from 'three'
import assert from "assert";
import ObjMtlLoader from "obj-mtl-loader";
import OrbitControls from'three-orbitcontrols';
import SetModel from "lib/SetModel";
import BoxBufferCreate from "lib/BoxBufferCreate";
import Text2d from "lib/Text2d";
import CloudCreate from "lib/CloudCreate";
import Snowfor from "lib/Snowfor";
import mike from "lib/mike";
import fonts from "fonts/DFLiShuW7-B5_Regular.json";
// Physijs(THREE);
// import OrbitControls from "lib/OrbitControls.js";
// import OBJLoader from "three-obj-loader";
// import OBJMTLLoader from "three-objmtll-loader";
// var ObjMtlLoader = require("obj-mtl-loader");
// OBJLoader(THREE);
// OBJMTLLoader(THREE);
const treeObjurl = "model/whiteTree.obj"
const treeMtlurl = "model/whiteTree.mtl"
const cloudObjurl = "model/cloud.obj"
const cloudMtlurl = "model/cloud.mtl"
export default {
    data(){
        return {
            scene: null,
            camera: null,
            renderer: null,
            planeGeometry: null,
            material: null,
            mesh: null,
            tree: null, 
            ambientLightSet: null,
            controls: null,
            cubeBox: null,
            Snow: null,
        };
    },
    methods:{
        boxBufferSet(){
            //方塊
            let texture = [
                'images/user.png',
                'images/user.png',
                'images/user.png',
                'images/user.png',
                'images/user.png'
            ];
            BoxBufferCreate(this.scene, texture);
        },
        loadObjModel(){
            //樹模型載入
            let OBJMTLLoader = new ObjMtlLoader();
            OBJMTLLoader.load(treeObjurl, treeMtlurl,(err, res)=> {
                if(err) return console.log('err:',err);
                this.modelSet(res);
            });
        },
        modelSet(result){
            //模型呈現
            let om = SetModel(result);
            this.tree = new THREE.Mesh(om.geometry, om.threeMaterialsArray);
            this.tree.scale.set(20, 20, 20);
            this.tree.position.set(0, 38, 0);
            this.scene.add(this.tree);

        },
        ambientlightSet(){
            // 環境光
            this.ambientLightSet = new THREE.AmbientLight(0xffffff, 1);
            this.scene.add(this.ambientLightSet);
        },
        planeSet(){
            //地板
            this.planeGeometry = new THREE.CircleBufferGeometry(2500, 8);
            this.material = new THREE.MeshLambertMaterial({side: THREE.BackSide, color:0x006AC6});
            this.mesh = new THREE.Mesh(this.planeGeometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.mesh.rotation.set(Math.PI / 2, 0, 0);
            this.scene.add(this.mesh);
        },
        resize(){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        },
        cameraSet(){
            //攝影機
            this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.set(90, 70, 60);
            this.camera.lookAt(0, 60, 0);
        },
        rendererSet(){
            this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
            this.renderer.setClearColor( 0x006AC6);
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.target.set(0, 60, 0);
            this.controls.update();
        },
        text2dSet(font){
            let text = Text2d(font);
            this.scene.add(text);
        },
        textLoaderXhr(xhr){
            console.log((xhr.loaded/xhr.total * 100)+'%');
        },
        cloudSet(){
            //雲模型載入
            let OBJMTLLoader = new ObjMtlLoader();
            OBJMTLLoader.load(cloudObjurl, cloudMtlurl,(err, res)=> {
                if(err) return console.log('err2:',err);
                this.modelCloudSet(res);
            });
        },
        modelCloudSet(result){
            //模型呈現
            const cloud1 = CloudCreate(result, 0.7, 
                { x:20, y:150, z:-200},
                { x:0, y:10, z:0}
            );
            const cloud2 = CloudCreate(result, 0.7, 
                { x:-280, y:150, z:80},
                { x:0, y:180, z:0}
            );
            const cloud3 = CloudCreate(result, 0.7, 
                { x:280, y:150, z:80},
                { x:0, y:180, z:0}
            );
            this.scene.add(cloud1);
            this.scene.add(cloud2);
            this.scene.add(cloud3);
        },
        snowSet(){
            this.Snow = new Snowfor(this.scene, 300);
        },
        renderAnim(){
            this.Snow.SnowDownAmin(this.scene);
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.renderAnim);
        }
    },
    mounted(){
        THREE.Cache.enabled = true;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0005 );
        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load('fonts/DFLiShuW7-B5_Regular.json', font=> {
            this.text2dSet(font);
        },this.textLoaderXhr);
        this.snowSet();
        this.cloudSet();
        this.loadObjModel();
        this.ambientlightSet();
        this.boxBufferSet();
        this.planeSet();
        this.cameraSet();
        this.rendererSet();

        // 座標軸表示
        let axes = new THREE.AxesHelper(95);
        this.scene.add(axes);

        requestAnimationFrame(this.renderAnim);
        window.addEventListener( 'resize', this.resize);
    }
};

</script>

<template>
    <div id="word">
        <canvas id="myCanvas"></canvas>
    </div>
</template>
<style lang='stylus' scoped>
    #word{
        width 100%
        height 100%
        canvas{
            display block
            width 100%
            height auto
        }
    }
</style>
