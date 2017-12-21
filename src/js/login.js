// 解決ie問題
import 'babel-polyfill';
import 'es6-promise';
import 'es6-object-assign';
/*-----------------------------------------------------------*/
import 'login.html';
import 'css/login.styl';
/*-----------------------------------------------------------*/
let filename = 'mike.jpg';
require('images/' + filename);    //打包圖片
/*-----------------------------------------------------------*/