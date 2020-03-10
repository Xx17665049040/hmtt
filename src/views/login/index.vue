<template>
  <div class="login">
    <van-nav-bar title="登录" />
      <!-- 使用阿里图标:1.官网找并复制好css样式 导入全局 2.要用 插槽自定义列  -->
    <van-field placeholder="请输入手机号" v-model="form.mobile"  :error-message="valid.mobile">
      <template slot="left-icon">
        <span class="iconfont icon-shouji1"></span>
      </template>
    </van-field>

    <van-field placeholder="请输入验证码" v-model="form.code"  :error-message="valid.code">
      <template slot="left-icon">
        <span class="iconfont icon-iconset0114"></span>
      </template>
      <van-button slot="button"  size="small" round>发送验证码</van-button>
    </van-field>
    <van-button class="login-button" type="primary" 
    @click="doLogin" :loading="isLoading" loading-type="spinner"  loading-text="登录中...">登录</van-button>
  </div>
  <!--  加了loading 不仅仅是显示登录的动画 还能阻止他点击多次, 发送多余请求 -->
</template>
    
<script>

import {login} from '@/api/login.js'

export default {
  data() {
    return {
      // 错误提示
      valid:{
        mobile:"",
        code:""
      },
      //绑定表单
      form:{
        mobile:"18511111111",
        code:"246810"
      },
      isLoading:false
    };
  },
  /* 知识点 await  要使用await 需要在函数外部加一个async修饰 1.await后面要跟promise对象(比如axios)  2.await会得到一个结果 就是.then的里res  
                                                          3.async修饰过的函数,能直接得到这个函数的promise对象 (函数内部不需要return)  没什么用 一般只是用来配合await

      axiso({ 参数 }).then( res=>{} )  axios后面能用.then 是因为aixos返回了一个promise对象 .then里面的res才是响应体
    
    let p = await axios({url:""}).then(res=.{})    因为await能拿到 axios.then里面的res   所以 这个p 就是res 的值
    console.log(111)  会等待,先打印上面的111  才打印await修饰的方法 这样就解决了异步要先走下面的特性  
    console.log(p)      用了await 从上往下依次执行 能很好地提高代码阅读性 
  */
  methods: {
    // 用await async  try catch finally 来简洁代码    try {会报错的代码} catch{}  我们把可能会报错的代码(比如请求的错误)放在try{}  然后执行catch{}
                                                    // 不报错 就不会进到 catch   finally 不管代码会不会报错 都会执行finally
    //现在最外面加async 来修饰函数
    // async doLogin(){
        //根据校验结果 进行登录验证
        // if(this.checkLogin()){
          //发请求登录  注意:这个项目接口 如果报错 不会返回错误code 而是直接报错   所以我们需要用到catch 如果进到catch了就代表账号密码有问题

          //最基础的写法
          // axios({
          //   url:"http://ttapi.research.itcast.cn/app/v1_0/authorizations",
          //   method:"post",
          //   data:{
          //     mobile:this.form.mobile,
          //     code:this.form.code
          //   }
          // })
          // .then(res=>{
          //   console.log(res)
          // })
          // .catch(error=>{
          //   console.log(error)
          // })

          //await写法 因为await能直接得到.then里面的响应体res  所以就可以省略.then .catch这些  但是 错误返回 需要用到 try catch来捕捉错误 好让代码继续执行
          //把发请求放在try里面 (因为请求可能会错) 然后报错返回放在catch   try一般是一块用  后面再跟一个finally 放不管请求有没有错 都会执行的内容
          
          // try {
            // 已经封装了请求接口
            // let res = await axios({
            // url:"http://ttapi.research.itcast.cn/app/v1_0/authorizations",
            // method:"post",
            // data:{
            //   mobile:this.form.mobile,
            //   code:this.form.code
            // }
            // })
          
          // }

          // catch{
          //     console.log('手机或者验证码错误')
          // }
         
          
  
    //用来做登录校验,全部成功返回true
    
    //优化版本
    async doLogin(){
      //登录验证 如果手机号验证码都没错 才发请求
      if( this.checkLogin() ){
        //将请求内容 放在try里面  
          //调用封装好的登录请求 this.form就是 它里面的所有内容 mobile code    let res= await login(this.form) 直接拿到.then的参数res
         try {
          this.isLoading=true   //发请求之前显示出加载动画

          let res= await login(this.form)   //发送登录请求 并得到res
          console.log('登录成功',res)
          this.$toast.success('登录成功')  //弹出提示框
          
          //登录成功就把 token 存到vuex   
          this.$store.commit("changeToken",res.data.token)
          this.$store.commit("changeRefToken",res.data.refresh_token)
          //但是vuex的token 刷新后就没了 所以还需要保存到localStorage 记得转为 字符串  但是还没有解决vuex刷新就没有 所以还要去store设置
          window.localStorage.setItem('tokenInfo',JSON.stringify(res.data) )

          //跳转到首页
          this.$router.push('/home')
          
         }
         catch{
          //  console.log('手机号或验证码错误')  this.$toast 移动端的 轻提示  如果是按需导入的(import {toast}) 就Toast('文案');
                                                // 我们这里是已经全部导入  可以直接this.$toast   后面能接success fail loading这些
          this.$toast.fail('手机号或验证码错误')
         }
         finally{
          this.isLoading=false  //不管成功还是失败 都要停止转圈动画
         }
      }
    },
    
    checkLogin(){
      let flag= true;
      //只要有一个不成功 就将flag改成false
      //手机码验证
      if(/0?(13|14|15|18)[0-9]{9}/.test(this.form.mobile)){
          //匹配成功 需要清空错误信息
          this.valid.mobile=""
      }else{
        //不成功弹出提示信息 
        this.valid.mobile="请输入正确手机号"
        flag=false
      }

      //验证码
      if(this.form.code.length==6){
        //匹配成功 需要清空错误信息
        this.valid.code=""
      }else{
        this.valid.code="请输入正确验证码"
        flag=false
      }
      //两个都验证完 才返回flag的值 到上面 进行下一步的请求
      return flag
    }
  },
};
</script>

<style lang="less">
.login {
  height: 100%;
  background-color: #f5f7f9;
  .van-nav-bar.van-hairline--bottom {
    background-color: #3d9bf6;
  }
  .van-nav-bar__title.van-ellipsis {
    color: white;
  }
  .van-button.van-button--default.van-button--small {
    background-color: #ededed;

  }
  .login-button.van-button.van-button--primary.van-button--normal {
    width: 90%;
    margin:30px auto;
    display:block;
    border-radius:3px;
    background-color: #3d9bf6;
}
}
</style>
