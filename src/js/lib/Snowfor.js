import * as THREE from 'three'
export default class Snowfor{
    materials = [];
    textureLoader = new THREE.TextureLoader();
    sprite1 = this.textureLoader.load("images/f1.png");
    sprite2 = this.textureLoader.load("images/f2.png");
    parameters = [
        [ [0.85, 0, 0.5], this.sprite1, 8 ],
        [ [0.80, 0, 0.5], this.sprite2, 5 ]
    ];
    constructor(scene, num){
        // let materials = [];
        let particles = null;
        let geometry = new THREE.Geometry();
        for ( let i = 0; i < num; i ++ ) {
            let vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            geometry.vertices.push( vertex );
        }
        for (let i = 0; i < this.parameters.length; i ++ ) {
            let color  = this.parameters[i][0];
            let sprite = this.parameters[i][1];
            let size   = this.parameters[i][2];
            this.materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
            this.materials[i].color.setHSL( color[0], color[1], color[2] );
            particles = new THREE.Points( geometry, this.materials[i] );
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            scene.add( particles );
        }
    }

    SnowDownAmin = (scene)=>{
        let time = Date.now() * 0.00005;
        for (let i = 0; i <scene.children.length; i ++ ) {
            let object = scene.children[ i ];
            if ( object instanceof THREE.Points ) {
                object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
            }
        }
        for (let i = 0; i < this.materials.length; i ++ ) {
            let color = this.parameters[i][0];
            let h = ( 360 * ( color[0] + time ) % 360 ) / 360;
            this.materials[i].color.setHSL( h, color[1], color[2] );
        }
    }
}