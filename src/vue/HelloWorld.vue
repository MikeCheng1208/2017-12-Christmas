<script>
export default {
    el: '#app',
    data () {
        return {
            msg: 'Hello world!'
        }
    }
}
</script>
<template>
    <div>
        <h1>{{msg}}</h1>
        <img src="images/mike.jpg" alt="">
        <div class="bgImg"></div>
    </div>
</template>

<style>
    .bgImg{
        width:360px;
        height:360px;
        background-image:url("~/images/mike.jpg"); 
    }
</style>