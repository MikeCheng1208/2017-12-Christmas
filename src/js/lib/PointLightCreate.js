import * as THREE from 'three'
function PointLightCreate(x,y,z,sclse) {
    let light = new THREE.PointLight(0xffffff, 1, sclse, 2);
    light.position.set(x, y, z);
    return light;
}
export default PointLightCreate;