<script>
// import OrbitControls from "lib/OrbitControls.js";
// import OBJLoader from "three-obj-loader";
// import OBJMTLLoader from "three-objmtll-loader";
// var ObjMtlLoader = require("obj-mtl-loader");
// OBJLoader(THREE);
// OBJMTLLoader(THREE);
import * as THREE from 'three'
import {TweenMax, Power2, TimelineLite} from "gsap";
import assert from "assert";
import ObjMtlLoader from "obj-mtl-loader";
import OrbitControls from'three-orbitcontrols';
import SetModel from "lib/SetModel";
import BoxBufferCreate from "lib/BoxBufferCreate";
import Text2d from "lib/Text2d";
import CloudCreate from "lib/CloudCreate";
import Snowfor from "lib/Snowfor";
import MakeTexture from "lib/MakeTexture";
import mike from "lib/mike";
import fonts from "fonts/DFLiShuW7-B5_Regular.json";
import MicrosoftYaHei from "fonts/MicrosoftYaHei_Bold.json"; //微軟雅黑體
const treeObjurl = "model/whiteTree.obj"
const treeMtlurl = "model/whiteTree.mtl"
const cloudObjurl = "model/cloud.obj"
const cloudMtlurl = "model/cloud.mtl"
export default {
    data(){
        return {
            isDebug: false,
            isLoadIng: true,
            scene: null,
            camera: null,
            renderer: null,
            planeGeometry: null,
            material: null,
            mesh: null,
            keyWord: null, 
            makeTexture: null, 
            cloud1: null, 
            cloud2: null, 
            cloudShadow1: null,
            cloudShadow2: null,
            tree: null, 
            treeModel: null, 
            treeShadow: null, 
            boxBuffer: null, 
            ambientLightSet: null,
            controls: null,
            cubeBox: null,
            Snow: null,
            mouseX: 0, 
            mouseY: 0,
            mouseX2: 100, 
            mouseY2: 100,
            windowHalfX: window.innerWidth / 2,
            windowHalfY: window.innerHeight / 2,
            t1: new TimelineLite(),
        };
    },
    watch:{
    },
    methods:{
        loadObjModel(){
            //樹模型載入
            let OBJMTLLoader = new ObjMtlLoader();
            OBJMTLLoader.load(treeObjurl, treeMtlurl,(err, res)=> {
                if(err) return console.log('err:',err);
                this.modelSet(res);
            });
        },
        modelSet(result){
            let treeObject = new THREE.Object3D;
            //樹 模型呈現
            let om = SetModel(result);
            this.tree = new THREE.Mesh(om.geometry, om.threeMaterialsArray);

            this.tree.scale.set(20, 20, 20);
            // this.tree.position.set(0, 38, 0);
            this.tree.position.set(0, 0, 0);

            treeObject.add(this.tree);
            this.scene.add(treeObject);
            treeObject.position.set(0, 0, 0);
            treeObject.scale.set(0.01, 0.01, 0.01);

            this.treeModel = treeObject;
            this.shadowSet();
        },
        shadowSet(){
            //樹 的影子
            let shadowTexture = new THREE.TextureLoader().load("images/shadow2.png");
            let geometry = new THREE.PlaneBufferGeometry(25.6, 51.2, 1);
            let mtl = new THREE.MeshBasicMaterial({
                map: shadowTexture,
                transparent: true,
                side: THREE.BackSide
            });
            mtl.opacity = 0.3;
            let shadow = new THREE.Mesh( geometry, mtl);
            shadow.position.set(-26, 0.2, 16);
            shadow.rotation.set(Math.PI / 2, 0, Math.PI / 3);
            // shadow.scale.set(1.3,1.6,1);
            shadow.scale.set(0.01, 0.01, 0.01);
            this.treeShadow = shadow;
            this.scene.add(this.treeShadow);
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
            if(this.isDebug){
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.target.set(0, 60, 0);
                this.controls.update();
            }
        },
        text2dSet(font){
            let text = Text2d(font, "痞");
            this.scene.add(text);
            text.scale.set(0.01, 0.01, 0.01);
            this.keyWord = text; 
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
            this.cloud1 = CloudCreate(result, 0.7, 
                { x:20, y:150, z:-200},
                { x:0, y:10, z:0}
            );
            this.cloud2 = CloudCreate(result, 0.7, 
                { x:-280, y:150, z:80},
                { x:0, y:180, z:0}
            );
            this.cloud1.scale.set(0.01,0.01,0.01);
            this.cloud2.scale.set(0.01,0.01,0.01);
            this.scene.add(this.cloud1);
            this.scene.add(this.cloud2);
            this.cloudShadowSet();
        }, 
        cloudShadowSet(){
            //雲 的影子
            let shadowTexture = new THREE.TextureLoader().load("images/shadow1.png");
            let geometry = new THREE.PlaneBufferGeometry(25.6, 51.2, 1);
            let mtl = new THREE.MeshBasicMaterial({
                map: shadowTexture,
                transparent: true,
                side: THREE.BackSide
            });
            mtl.opacity =0.1;
            let cloudShadow = new THREE.Mesh( geometry, mtl);
            let cloudShadow2 = new THREE.Mesh( geometry, mtl);
            cloudShadow.position.set(20, 0.2, -200);
            cloudShadow2.position.set(-280, 0.2, 80);
            cloudShadow.rotation.set(Math.PI / 2, 0, Math.PI / 3);
            cloudShadow2.rotation.set(Math.PI / 2, 0, Math.PI / 3);
            cloudShadow.scale.set(0.01, 0.01, 0.01);
            cloudShadow2.scale.set(0.01, 0.01, 0.01);
            this.cloudShadow1 = cloudShadow;
            this.cloudShadow2 = cloudShadow2;
            this.scene.add(this.cloudShadow1);
            this.scene.add(this.cloudShadow2);
        },
        snowSet(){
            this.Snow = new Snowfor(this.scene, 300);
        },
        boxBufferSet(){
            //方塊
            let texture = [
                'images/user.png',
                'images/user.png',
                'images/user.png',
                'images/user.png',
                'images/user.png'
            ];
            this.boxBuffer = BoxBufferCreate(this.scene, texture);
            for (let s = 0; s < this.boxBuffer.children.length; s++) {
                if(this.boxBuffer.children[s].name =="cb"){
                    this.boxBuffer.children[s].position.y = -2;
                }
            }
        },
        sparkSet(){
            //閃光星星
            this.makeTexture = MakeTexture(20);
            this.makeTexture.position.set(0, 0, 0);
            this.scene.add(this.makeTexture);
            setInterval(()=>{
                let o = [
                    mike.getRandom(0, this.makeTexture.children.length-1),
                    mike.getRandom(0, this.makeTexture.children.length-1),
                    mike.getRandom(0, this.makeTexture.children.length-1),
                    mike.getRandom(0, this.makeTexture.children.length-1),
                    mike.getRandom(0, this.makeTexture.children.length-1),
                    mike.getRandom(0, this.makeTexture.children.length-1),
                ]
                this.sparkAminateOpen(o[0]);
                this.sparkAminateOpen(o[1]);
                this.sparkAminateOpen(o[2]);
                this.sparkAminateOpen(o[3]);
                this.sparkAminateOpen(o[4]);
                this.sparkAminateOpen(o[5]);
            },500);
        },
        sparkAminateOpen(s){
            let size = mike.getRandom(3, 8);
            this.makeTexture.children[s].scale.set(size, size, size);
            setTimeout(() => {
                this.makeTexture.children[s].scale.set(0.01, 0.01, 0.01);
            }, 400);
        },
        objAmimate(){
            let time = 160;
            TweenMax.to(this.treeModel.scale,                1, {x:1, y:1, z:1, ease: Elastic.easeOut.config(0.8, 0.3)});
            TweenMax.to(this.treeModel.children[0].position, 1, {y:38, ease: Elastic.easeOut.config(0.8, 0.3), onComplete:()=>{
                TweenMax.to(this.keyWord.scale, 1, {x:1, y:1, z:1, ease: Elastic.easeOut.config(0.8, 0.3)});
            }});
            TweenMax.to(this.treeShadow.scale,               1, {x:1.3, y:1.6, z:1, ease: Elastic.easeOut.config(0.8, 0.3)});
            TweenMax.to(this.cloud1.scale,                   1, {x:1, y:1, z:1, ease: Elastic.easeOut.config(0.8, 0.3)});
            TweenMax.to(this.cloud2.scale,                   1, {x:1, y:1, z:1, ease: Elastic.easeOut.config(0.8, 0.3)});
            TweenMax.to(this.cloudShadow1.scale,             1, {x:4, y:2, z:2, ease: Elastic.easeOut.config(0.8, 0.3)});
            TweenMax.to(this.cloudShadow2.scale,             1, {x:4, y:2, z:2, ease: Elastic.easeOut.config(0.8, 0.3)});
            for (let s = 0; s < this.boxBuffer.children.length; s++) {
                if(this.boxBuffer.children[s].name =="cb"){
                    setTimeout(() => {
                        TweenMax.to(this.boxBuffer.children[s].position, 1, {y:5, ease: Elastic.easeOut.config(1, 0.3)});
                        TweenMax.to(this.boxBuffer.children[s].scale,    1, {x:1, y:1, z:1, ease: Elastic.easeOut.config(1, 0.3)});
                    }, time * s);
                }else if(this.boxBuffer.children[s].name =="sd"){
                    setTimeout(() => {
                        TweenMax.to(this.boxBuffer.children[s].scale,    1, {x:0.6, y:0.8, z:1, ease: Elastic.easeOut.config(1, 0.3)});
                    }, time * s);
                }
            }
        },
        renderAnim(){
            if(!this.isDebug){
                this.camera.position.x += ( this.mouseX2 - this.camera.position.x ) * 0.01;
                this.camera.position.y += ( this.mouseY2 - this.camera.position.y ) * 0.01;
                this.camera.rotation.y -= ( this.mouseY2 - this.camera.position.y ) * 0.000008;
            }
            this.Snow.SnowDownAmin(this.scene);
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.renderAnim);
        },
        onDocumentMouseMove(e){
            // this.mouseX = e.clientX - this.windowHalfX;
            // this.mouseY = e.clientY - this.windowHalfY;
            this.mouseX2 = e.clientX * 0.1 + this.windowHalfX * 0.1;
            this.mouseY2 = (e.clientY + this.windowHalfY) * 0.1;
        }
    },
    mounted(){
        THREE.Cache.enabled = true;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0005 );
        this.fontLoader = new THREE.FontLoader();
        this.fontLoader.load('fonts/DFLiShuW7-B5_Regular.json', font=> {
            this.isLoadIng = false;
            if(this.isLoadIng) return;
            this.text2dSet(font);
            this.objAmimate();
            this.sparkSet();
        },this.textLoaderXhr);
        
        this.snowSet();
        this.cloudSet();
        this.loadObjModel();
        this.ambientlightSet();
        this.boxBufferSet();
        this.planeSet();

        this.cameraSet();
        this.rendererSet();


        requestAnimationFrame(this.renderAnim);
        window.addEventListener('resize', this.resize);
        
        if(!this.isDebug) return document.addEventListener('mousemove', this.onDocumentMouseMove);
        // 座標軸表示
        let axes = new THREE.AxesHelper(95);
        this.scene.add(axes);
        
    }
};

</script>

<template>
    <div id="word">
        <div v-if="isLoadIng" class="loading">
            <h3>部落客年度代表字計算中</h3>
            <img src="images/378.gif" alt="">
            <p>loading...</p>
        </div>
        <header :class="{end: isLoadIng}">
            <div class="userBlogData">
                <img src="images/mike.jpg" alt="">
                <div class="text">
                    <h1>小林&郭郭的小夫妻生活</h1>
                    <p>已加入痞客邦<span>2365</span>天</p>
                </div>
            </div>
            <a id="fbShare">Share</a>
            <a v-if="false" id="createTree">製作你的聖誕樹</a>
        </header>
        <canvas id="myCanvas"></canvas>
        <footer :class="{end: isLoadIng}">
            <div class="tagBox">
                <h3>台北</h3>
                <h3>設計</h3>
                <h3>潮流</h3>
                <p>MY BLOG SEARCH FROM</p>
            </div>
            <div class="kmBox">
                <div>
                    <h1>99K</h1>
                    <p>viewers</p>
                </div>
            </div>
        </footer>
    </div>
</template>
<style lang='stylus' src='css/_indexContent.styl' scoped></style>