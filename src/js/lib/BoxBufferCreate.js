import * as THREE from 'three';
import mike from "lib/mike";
function BoxCreate(scene, textureArr) {
    let boxPos = [];
    let setPos = [];
    // --------------------------------------------------------------------------------
    let shadowTexture = new THREE.TextureLoader().load("images/shadow3.png");
    let boxshadow = new THREE.PlaneBufferGeometry(51.2, 25.6, 2);
    let mtl = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        side: THREE.BackSide
    });
    mtl.opacity = 0.2;
    // --------------------------------------------------------------------------------
    let boxObject = new THREE.Object3D;
    switch (textureArr.length) {
        case 3: 
            setPos = [5, 0, 5];
            boxPos = [[-30,5,20],[20,5,20],[20,5,-30]];
            break;
        case 4: 
            setPos = [0, 0, 0];
            boxPos = [[-25,5,40],[15,5,40],[40,5,15],[40,5,-25]];
            break;
        case 5: 
            setPos = [-20, 0, -10];
            boxPos = [[-30,5,40],[5,5,40],[40,5,40],[40,5,5],[40,5,-30]];
            break;
    }

    let posArr = []
    for (let i = 0; i < textureArr.length; i++) {
        let box_size = 10;
        let texture = new THREE.TextureLoader().load(textureArr[i]);
        let geometry = new THREE.BoxBufferGeometry( box_size, box_size, box_size );
        let material = new THREE.MeshBasicMaterial( { map: texture } );
        let cubeBox = new THREE.Mesh(geometry, material);
        cubeBox.position.set(boxPos[i][0], boxPos[i][1], boxPos[i][2] );
        cubeBox.scale.set(1, 0.01, 1);
        cubeBox.name = "cb";
        
        let sd = new THREE.Mesh(boxshadow, mtl);
        sd.name = "sd";
        sd.position.set(boxPos[i][0] - 9.5, 0.2, boxPos[i][2] - 0.5);
        sd.rotation.set(Math.PI / 2, 0, 16);
        // sd.scale.set(0.6, 0.8, 1);
        sd.scale.set(0.01, 0.01, 1);

        boxObject.add(cubeBox);
        boxObject.add(sd);
        
        scene.add(boxObject);
    }
    boxObject.position.set(setPos[0], setPos[1], setPos[2]);
    boxObject.rotation.set(0, Math.PI / 12, 0);
    // boxObject.scale.set(1, 0.01, 1);

    return boxObject;
}
export default BoxCreate;