// 解決ie問題
import 'babel-polyfill';
import 'es6-promise';
import 'es6-object-assign';
import Vue from 'vue'
/*-----------------------------------------------------------*/
import 'index.html';
import 'css/index.styl';
import 'user.json'; //搬 json


import 'model/whiteTree.obj';
import 'model/whiteTree.mtl';

import 'model/cloud.obj';
import 'model/cloud.mtl';
// import 'file/physi.js';
// import 'file/physijs_worker.js';
// import 'file/ammo.js';


let filename = 'mike.jpg';
require('images/' + filename);    //打包圖片
/*-----------------------------------------------------------*/
// import App from 'App';
import Tree from 'Tree';
new Vue({
    el: '#app',
    render: h=>h(Tree),
});