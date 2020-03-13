<template>
  <div>
    <router-view></router-view>

    <van-tabbar v-model="active">
        <!-- 给每个tablebar设置to属性 就能跳转页面 -->
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="question-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o"  to="/video" >视频</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
    data(){
        return{
            active:0
        }
    }
};
</script>

<style lang=""></style>
