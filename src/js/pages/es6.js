export default class es6{
    
    mike = 'mike';
    xuan = "xuan";
    
    constructor(){
        console.log("es6.js:",this.mike);
        console.log("es6.js:",this.xuan);
        // document.querySelector("h1").addEventListener("click",this.functionName)

    }
    functionName = (e)=>{
        console.log("es6.js:",e);
    }
}