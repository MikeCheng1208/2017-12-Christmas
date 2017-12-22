<script>
// import OrbitControls from "lib/OrbitControls.js";
// import OBJLoader from "three-obj-loader";
// import OBJMTLLoader from "three-objmtll-loader";
// var ObjMtlLoader = require("obj-mtl-loader");
// OBJLoader(THREE);
// OBJMTLLoader(THREE);
import * as THREE from 'three'
import axios from "axios";
import {TweenMax, Power2, TimelineLite} from "gsap";
import assert from "assert";
import ObjMtlLoader from "obj-mtl-loader";
import OrbitControls from'three-orbitcontrols';
import SetModel from "lib/SetModel";
import BoxBufferCreate from "lib/BoxBufferCreate";
import PointLightCreate from "lib/PointLightCreate";
import Text2d from "lib/Text2d";
import CloudCreate from "lib/CloudCreate";
import Snowfor from "lib/Snowfor";
import MakeTexture from "lib/MakeTexture";
import mike from "lib/mike";
import fonts from "fonts/DFLiShuW7-B5_Regular.json";
import MicrosoftYaHei from "fonts/MicrosoftYaHei_Bold.json"; //微軟雅黑體

const fontLoad = "fonts/MicrosoftYaHei_Bold.json";
const treeObjurl = "model/whiteTree.obj";
const treeMtlurl = "model/whiteTree.mtl";
const cloudObjurl = "model/cloud.obj";
const cloudMtlurl = "model/cloud.mtl";
const NoLightObjurl = 'model/lowpolytreeNotextureNoLight.obj';
const NoLightMtlurl = 'model/lowpolytreeNotextureNoLight.mtl';
export default {
    data(){
        return {
            isDebug: false,
            isLoadIng: true,
            userNow: true,
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
            urlSearch: mike.urlSearch()["user_id"],
            reSizeWW: 0.95,
            reSizeHH: 0.92,
            uiData: {
                keyWord: "",
                userTexture: [],
                tag: [""],
                viewers: 0,
                addPixnetDay: 0,
                avatar: "",
                blogName: "",
            }
        };
    },
    watch:{
    },
    methods:{
        loadObjModel(){
            //樹模型載入
            let OBJMTLLoader = new ObjMtlLoader();
            OBJMTLLoader.load(NoLightObjurl, NoLightMtlurl,(err, res)=> {
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
        pointLightSet(){
            let light = PointLightCreate(100, 200, 0, 1000);
            this.scene.add(light);
        },
        planeSet(){
            //地板
            this.planeGeometry = new THREE.CircleBufferGeometry(2500, 8);
            this.material = new THREE.MeshBasicMaterial({side: THREE.BackSide, color:0x006AC6});
            this.mesh = new THREE.Mesh(this.planeGeometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.mesh.rotation.set(Math.PI / 2, 0, 0);
            this.scene.add(this.mesh);
        },
        cameraSet(){
            //攝影機
            this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.set(90, 70, 60);
            this.camera.lookAt(0, 60, 0);
        },
        text2dSet(font){
            let text = Text2d(font, this.uiData.keyWord);
            this.scene.add(text);
            text.scale.set(0.01, 0.01, 0.01);
            this.keyWord = text; 
        },
        textLoaderXhr(xhr){
            // console.log((xhr.loaded/xhr.total * 100)+'%');
            console.log('載入中...');
        },
        cloudSet(){
            //雲模型載入
            let OBJMTLLoader = new ObjMtlLoader();
            OBJMTLLoader.load(cloudObjurl, NoLightMtlurl,(err, res)=> {
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
            let texture = this.uiData.userTexture;
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
                        TweenMax.to(this.boxBuffer.children[s].position, 1, {y:8, ease: Elastic.easeOut.config(1, 0.3)});
                        TweenMax.to(this.boxBuffer.children[s].scale,    1, {x:1.5, y:1.5, z:1.5, ease: Elastic.easeOut.config(1, 0.3)});
                    }, time * s);
                }else if(this.boxBuffer.children[s].name =="sd"){
                    setTimeout(() => {
                        TweenMax.to(this.boxBuffer.children[s].scale,    1, {x:0.6, y:0.8, z:1, ease: Elastic.easeOut.config(1, 0.3)});
                    }, time * s);
                }
            }
        },
        onDocumentMouseMove(e){
            // this.mouseX = e.clientX - this.windowHalfX;
            // this.mouseY = e.clientY - this.windowHalfY;
            this.mouseX2 = e.clientX * 0.1 + this.windowHalfX * 0.1;
            this.mouseY2 = (e.clientY + this.windowHalfY) * 0.1;
        },
        onDocumentTouchStart(e){
            if (e.touches.length === 1 ) {
                this.mouseX2 = e.touches[0].pageX - this.windowHalfX;
                this.mouseY2 = e.touches[0].pageY -+ this.windowHalfY;
            }
        },
        onDocumentTouchMove(e){
            if ( e.touches.length === 1 ) {
                this.mouseX2 = e.touches[0].pageX - this.windowHalfX;
                this.mouseY2 = e.touches[0].pageY - this.windowHalfY;
            }
        },
        fontLoadFn(){
            this.fontLoader.load(fontLoad, font=> {
                this.isLoadIng = false;
                if(this.isLoadIng) return;
                this.text2dSet(font);
                this.boxBufferSet();
                this.objAmimate();
                this.sparkSet();
            },this.textLoaderXhr);
        },
        fbShareBtnFn(){
            let shareUrl = location.host + location.search;
            let urlSearch = mike.urlSearch()["user_id"];
            if(user_id != "0" && urlSearch === undefined || urlSearch === "") shareUrl = `${location.host}?user_id=${user_id}`;
            console.log(shareUrl);
            mike.fbShare(shareUrl);
        },
        webglAvailable() {
            try {
                var canvas = document.createElement( 'canvas' );
                return !!( window.WebGLRenderingContext && (
                    canvas.getContext( 'webgl' ) ||
                    canvas.getContext( 'experimental-webgl' ) )
                );
            } catch ( e ) {
                return false;
            }
        },
        resize(){
            this.OrbitControlsFn();
            this.reSizeWW = window.innerWidth <= 640 ? 1 : 0.95;
            this.reSizeHH = window.innerWidth <= 640 ? 1 : 0.92;
            this.camera.aspect = window.innerWidth*this.reSizeWW / window.innerHeight*this.reSizeHH;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth*this.reSizeWW, window.innerHeight*this.reSizeHH);
        },
        rendererSet(){
            this.reSizeWW = window.innerWidth <= 640 ? 1 : 0.95;
            this.reSizeHH = window.innerWidth <= 640 ? 1 : 0.92;

            if (this.webglAvailable()) {
                console.log('WebGL');
                this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
            } else {
                console.log('Canvas');
                this.renderer = new THREE.CanvasRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
            }
            this.renderer.setClearColor( 0x006AC6);
            this.renderer.setSize(window.innerWidth * this.reSizeWW, window.innerHeight * this.reSizeHH);
            if(this.isDebug){
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.target.set(0, 60, 0);
                this.controls.update();
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
        stageSet(){
            THREE.Cache.enabled = true;
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0005 );
            this.fontLoader = new THREE.FontLoader();
            this.snowSet();
            this.cloudSet();
            this.loadObjModel();
            this.pointLightSet();
            this.ambientlightSet();
            this.planeSet();
            this.cameraSet();
            this.rendererSet();
            requestAnimationFrame(this.renderAnim);
            window.addEventListener('resize', this.resize);
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enabled = false;
            this.OrbitControlsFn()
            if(!this.isDebug) {
                document.addEventListener('mousemove', this.onDocumentMouseMove);
                // document.addEventListener('touchstart', this.onDocumentTouchStart);
                // document.addEventListener('touchmove', this.onDocumentTouchMove);
                return;
            }
            // 座標軸表示
            // let axes = new THREE.AxesHelper(95);
            // this.scene.add(axes);
        },
        OrbitControlsFn(){
            this.camera.position.set(90, 70, 60);
            this.camera.lookAt(0, 60, 0);
            if(window.innerWidth <= 640) {
                this.isDebug =  true;
                this.controls.target.set(0, 60, 0);
                this.controls.update();
                this.controls.enabled = true;
                console.log(this.controls.enabled);
            }else{
                this.isDebug =  false;
                this.controls.enabled = false;
                this.camera.position.set(90, 70, 60);
                this.camera.lookAt(0, 60, 0);
                console.log(this.controls.enabled);
            }
        }
    },
    mounted(){
        let userid = null;
        let urlSearch = mike.urlSearch()["user_id"];

        this.stageSet();
        if(user_id==="") user_id = "0";
        if(user_id != "0" && urlSearch === undefined || urlSearch === "") userid = user_id; //透過login進來的
        if(urlSearch != undefined && urlSearch != "") userid = urlSearch; //透過FaceBook進來的
        // if(user_id == "0" && urlSearch === undefined || urlSearch === "") {
            // console.error("無使用者，請轉跳至登入畫面");    
            // location.href = "/login.php?res=nouser";
            // return
        // }
        axios.get(``).then(res => {
            this.userNow = urlSearch != user_id;
            this.uiData = res.data.data;
            this.fontLoadFn();
        }).catch(err => {
            // location.href = "/login.php?err=getdata";
            console.log('err.response:',err.response);
            console.error("資料抓取錯誤");
        })
    }
};

</script>

<template>
    <div id="word">
        <a class="logo"></a>
        <div v-if="isLoadIng" class="loading">
            <h3>部落客年度代表字計算中</h3>
            <img src="images/378.gif" alt="">
            <p>loading...</p>
        </div>
        <header :class="{end: isLoadIng}">
            <div class="userBlogData">
                <img :src="uiData.avatar" alt="">
                <div class="text">
                    <h1>{{uiData.blogName}}</h1>
                    <p>已加入痞客邦<span>{{uiData.addPixnetDay}}</span>天</p>
                </div>
            </div>
            <a v-if="userNow" id="fbShare" @click="fbShareBtnFn">Share</a>
            <a v-if="!userNow" id="createTree" href="/login.php">製作你的聖誕樹</a>
        </header>
        <canvas id="myCanvas"></canvas>
        <footer :class="{end: isLoadIng}">
            <div class="tagBox">
                <h3 v-for="(obj, idx) in uiData.tag" :key="idx">{{obj}}</h3>
                <p>MY BLOG SEARCH FROM</p>
            </div>
            <div class="kmBox">
                <div>
                    <h1>{{uiData.viewers}}</h1>
                    <p>VIEWERS</p>
                </div>
            </div>
        </footer>
        <p class="Copyright">Copyright © 2003 - 2017 優像數位媒體科技(股)公司</p>
    </div>
</template>
<style lang='stylus' src='css/_indexContent.styl' scoped></style>