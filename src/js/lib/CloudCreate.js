import * as THREE from 'three'
import SetModel from "lib/SetModel";
function cloudCreate(result, objScale, objPosition, objRotation) {
    
    let cloud = SetModel(result);
    
    let mtl = new THREE.MeshPhongMaterial()

    // let cloudMod = new THREE.Mesh(cloud.geometry, cloud.threeMaterialsArray);
    let cloudMod = new THREE.Mesh(cloud.geometry, mtl);
    // cloud.threeMaterialsArray[0].color = new THREE.Color(0xffffff);
    
    cloudMod.scale.set(objScale, objScale, objScale);
    cloudMod.position.set(objPosition.x, objPosition.y, objPosition.z);
    cloudMod.rotation.set(objRotation.x, objRotation.y, objRotation.z);
    
    return cloudMod;
}
export default cloudCreate;