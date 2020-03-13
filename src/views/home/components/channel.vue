<template>
    <!-- 弹出框  这里的v-model也不是拿数据 而是控制弹出层的显示隐藏 -->
        <van-popup v-model="show" position="left" class="channelWrap" 
        :style="{ width:'85%',height: '100%' }" 
        closeable close-icon-position="top-left"> 
            <!-- 我的频道部分 -->
            <div class="myChannel">
                <div class="title">
                    <span>我的频道</span>
                    <van-button color="#f97b7b" plain  round size="mini">编辑</van-button>
                </div>
                <!-- 这里要显示 我登录的账号拥有的频道  用父传子传过来 子组件写props 父组件的<channel>写 :myChannelList -->
                <div class="content">
                    <template v-for="(item,index) in mylList"> <!--  v-for和v-if不能一起出现 -->
                        <van-tag class="content-tag"  size="large"  :key="index" v-if="index != 0">{{item.name}}</van-tag>
                    </template>
                </div>   
            </div>
            <!-- 频道推荐部分 -->
            <div class="recommend">
               <div class="title">
                  <span>频道推荐</span>
                </div>
              <div class="content">
                  <van-tag class="content-tag" v-for="(item,index) in 60" :key="index" size="large">标签</van-tag>
              </div>
            </div>
        </van-popup>
</template>

<script>
export default {
    data(){
        return{
              show:false,
              
        }
    },
    props:{
       mylList:{
           type:Array,
           default:[]
       } 
    }
}
</script>

<style lang="less" scoped>
    .channelWrap{
        padding-left: 10px;
        padding-right: 5px;
        // X按钮
     /deep/ i.van-icon.van-icon-cross.van-popup__close-icon.van-popup__close-icon--top-left {
        color: black;
        font-size: 30px;
        }
        .myChannel{
            margin-top: 60px;
           
        }
        .recommend{
            margin-top:35px ;
        }
        // 共有的类可以放外面 两个部分都可以用
         .title{
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .content-tag{
                margin-right: 15px;
                margin-top: 15px;
            }
    }
    
</style>