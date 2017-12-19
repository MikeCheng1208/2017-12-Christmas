import * as THREE from 'three';
import mike from "lib/mike";
function MakeTexture(int) {
    let makeTextureObject = new THREE.Object3D;
    let texture = new THREE.TextureLoader().load("images/spark.png");
    let ballMaterial = new THREE.SpriteMaterial( { map: texture} );
    let startMin = -30;
    let startMax = 30;
    for (let i = 0; i < int; i++) {
        let size = 0.01;
        let sizeMax = mike.getRandom(5, 7);
        let sprite = new THREE.Sprite(ballMaterial);
        sprite.scale.set(size, size, size);
        sprite.position.set(mike.getRandom(startMin, startMax), mike.getRandom(10, 100), mike.getRandom(startMin, startMax));
        makeTextureObject.add(sprite);
    }
    return makeTextureObject;
}
export default MakeTexture;