import * as THREE from 'three';
import mike from "lib/mike";
function BoxCreate(scene, textureArr) {
    let posArr = []
    for (let i = 0; i < textureArr.length; i++) {
        // let box_size = mike.getRandom(8, 13);
        let box_size = 10;
        let texture = new THREE.TextureLoader().load(textureArr[i]);
        let geometry = new THREE.BoxBufferGeometry( box_size, box_size, box_size );
        let material = new THREE.MeshBasicMaterial( { map: texture } );
        let cubeBox = new THREE.Mesh(geometry, material);
        cubeBox.position.set(mike.getRandom(0, 50), 5, mike.getRandom(-20, 50));
        scene.add(cubeBox);
    }
}
export default BoxCreate;