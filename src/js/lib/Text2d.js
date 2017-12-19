import * as THREE from 'three'
function Text2d(font, txt) {
    let xMid, text;
    let textShape = new THREE.BufferGeometry();
    let matLite = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    let shapes = font.generateShapes(txt, 17, 1);
    let geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    geometry.translate( xMid, 0, 0 );
    textShape.fromGeometry( geometry );
    text = new THREE.Mesh( textShape, matLite );
    text.position.set(0,105, 1);
    text.rotation.set(0, Math.PI / 3, 0);
    return text;
}
export default Text2d;