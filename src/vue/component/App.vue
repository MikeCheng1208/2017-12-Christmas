<script>
import * as THREE from 'three'
import assert from "assert";
// import fonts from "fonts/droid/droid_sans_bold.typeface.json";
import fonts from "fonts/DFLiShuW7-B5_Regular.json";
export default {
    data(){
        return {
            scene: null,
            camera: null,
            renderer: null,
            planeGeometry: null,
            material: null,
            mesh: null,
            fontLoader: null,
            fontModel: null,
        };
    },
    watch:{

    },
    methods:{
        textSet(){
            this.fontLoader = new THREE.FontLoader();
            this.fontLoader.load('fonts/DFLiShuW7-B5_Regular.json', font=> {
                let materialText =  new THREE.MeshNormalMaterial({
                    color: 0xff0000,
                    side: THREE.DoubleSide,
                })
                let textGeometry = new THREE.TextGeometry( '爸爸去哪兒？爸爸去哪兒？', {
                    font: font,
                    size: 30,
                    weight: 'normal',
                    height: 3,
                    curveSegments: 10,
                    bevelEnabled: true,
                    bevelThickness: 2,
                    bevelSize: 1,
                    bevelSegments: 2,
                })
                textGeometry.computeBoundingBox();
                textGeometry.computeVertexNormals();

                this.fontModel = new THREE.Mesh(textGeometry, materialText);  
                this.fontModel.position.set(-150, 10, -100);
                this.fontModel.rotation.set(0.3, 0, 0);

                this.scene.add(this.fontModel);

            });
        },
        lightSet(){
            let light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 0, 1, 1 ).normalize();
            this.scene.add(light);
        },
        cameraSet(){
            this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.set(0, 0, 0);
            this.camera.lookAt(this.scene.position);
        },
        rendererSet(){
            this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
            this.renderer.setClearColor( 0xFFF8DC);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },
        planeCreate(){
            let color = new THREE.Color( 0xFAF0E6 );

            this.planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 32);
            this.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
            this.material.color = color;

            this.mesh = new THREE.Mesh(this.planeGeometry, this.material);
            this.mesh.position.set(0, 0, -100);
            this.mesh.rotation.set(90, 0, 0);

            this.scene.add(this.mesh);
        },
        resize(){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        },
        renderAnim(){
            // this.fontModel.rotation.y += 0.1
            // this.fontModel.rotation.x += 0.1
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.renderAnim);
        }
    },
    created(){
    },
    mounted(){
        THREE.Cache.enabled = true;
        this.scene = new THREE.Scene();
        this.cameraSet();
        this.textSet();
        this.lightSet();
        this.planeCreate();
        this.rendererSet();
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

</style>
