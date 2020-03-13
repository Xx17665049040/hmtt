<template>
    <div class="home">
        <!-- 头部 -->
        <div class="top-nav">
            <!-- 左边按钮 -->
            <van-icon name="wap-nav" class="top-icon" @click="$refs.channel.show=true"/>
            <!-- 搜索框 -->
            <van-search class="top-search"
            placeholder="请输入搜索关键词" 
            shape="round" 
            background="#2a8fff"/>
            <!-- 右边搜索按钮 -->
            <van-icon name="search" class="top-icon" />    
        </div>
        <!-- 频道 用v-for来生成有多少个 不能自己写死-->
        <van-tabs  class="channel" v-model="active">   
              <van-tab v-for="(item,index) in channelList" :key="index" :title="item.name" :name="item.id">   <!--  这里添加的name可以改变 上面v-model的内容 让他不是active下标 而是name里面的值 -->
                  <!-- List列表 van-cell里面的title就是内容  
                    van-list: v-model 不是取值用的而是控制加载状态的 如果是false就会调用下面的加载方法 为true就不会调用下面的方法,   
                              finished 用来标记是否已经加载完所有数据,true显示加载完毕 结束数据加载,false显示加载中  
                              load 是用来加载数据的事件 如果上面v-model绑定的loading为false 他就触发 -->
                    <!-- 用van-pull-refresh包住list 就用下拉刷新 -->
                    <!-- 在每个属性前 都加item. 是给每个频道都添加 自己的数据 而不是公用 -->
                <van-pull-refresh v-model="item.pullLoading" @refresh="onRefresh(item)">   
                <van-list
                      v-model="item.loading"
                      :finished="item.finished"
                      finished-text="没有更多了"
                      @load="onLoad(item)">
                      <van-cell v-for="(it,idx) in item.list" :key="idx" :title="it.title" />
                </van-list>
                </van-pull-refresh>
              </van-tab>   
        </van-tabs> 
        <!-- 弹出层 已经封装 需要穿 频道数据到channel组件 -->
        <channel ref="channel" :mylList="channelList"></channel>
    </div>
</template>
// $set的 知识点补充  前提: 如果有个变量 没有在data里面定义过,那么你在后面的 方法里 想要改变这个变量的时候,他不会有 响应式的特点 (虽然能赋值上,但是不会在页面刷新)
                     需求: 虽然之前没有在data定义 但我就是希望他依然具备 响应式特点  用$set来添加修改属性   
                     用法: $set(要添加属性的对象,'添加什么属性',属性值)  某个对象被$set定义了 那他虽然之前没在data定义过 但还是能具备响应式特点
<script>
import { channelList } from "@/api/channel.js"
import { articleList } from '@/api/article.js'
//导入左侧频道组件
import channel from './components/channel'
export default {
    name:"home",
    components:{
        channel
    },
    data(){
        return{
            //因为这些刷新文章数据的 四个属性已经在created里 添加了 所以这里需要删掉 删掉后 因为data里面没有定义了 所以下面调用这些属性需要用到this.$set
            // loading:false,   //控制列表的刷新状态 false调用onload方法  true不调用
            // list:[],
            // finished:false,  //是否刷到底了 false没到底继续刷新 true到底了停止刷新
            // pullLoading:false, //控制下拉刷新的状态 false代表不刷新了 会去掉加载文字 true刷新中 显示加载中
            channelList:[],   //存放频道
            active:'',  //频道列表的 id  因为用了name赋值

          
        }
    },
    methods: {
        //加载数据的方法 然后调用接口也要放在这里
        async onLoad(item) {
            // 发请求获取频道的新闻 
          let res =  await articleList({
                channel_id:item.id,  //频道id

                // timestamp:Date.now(),    //时间戳 这个时间戳每次都是加载 随机的数据  不能写死date.now 否则永远加载不完 一直会有随机数据 要用上一页的时间戳加载
                timestamp:item.pre_time,    //1.因为第一次就是要随机十条 所以先在created给每个频道添加pre_time属性 并且给个date.now 2.得到返回数据后 将上一个时间戳 传给pre_time
                                             // 3.在这里请求数据的时候 使用 除了第一次是随机 剩下的都是 上一页 循环 直到刷新页面 又从随机-上一页-上上一页--
                with_top:0  //是否有指定文章 0没有 1有
            })
           console.log('新闻请求',res)
            //拿到数据 
           let arr = res.data.results  //将res内容赋值给arr 并且放到 每个对应的 频道 在上面onload方法里 传item参数即可  然后item.list 就是每个频道自己的list    
                                        //返回的数据中 有一个 pre_timestamp: 前一个时间戳  传入这个 就是加载上一页的数据

           if(arr.length == 0){   //数据列表没有了 就要停止 并且要拿到数据 立刻判断是否加载完了
              item.finished =true  //真的加载完毕 应该用finshed 而不是loading

           }else{   //如果有数据 就开始调用van-list自带的 上拉刷新的方法
            item.pre_time =  res.data.pre_timestamp       //记录 上一个时间戳  然后将他传给上面的 时间戳 这样每次刷新出来的 就是上一页 而不是随机数据                   
            
            item.list.push(...arr)        //results是数组对象 所以list也是个对象
            
            item.loading=false 
           }
           
        },
        //下拉刷新事件 只要往下滑 就会自动触发 并且把下拉状态pullLoading改为true
        onRefresh(item){
            //每次上拉 新的随都要请求最机数据 意味着 1.要把这个频道记录的 上一页时间戳 清空为date.now() 2. 把loading状态改为false 才能重新加载数据
            //                                   3.把finished改为false 因为有可能你 下拉的时候 老早就结束了上拉的状态  4.list重置为 空数组
            item.pre_time = Date.now();
            item.loading=false;
            item.finished=false;
            item.list=[]
            //重置好后 再加载数据 (调用上面的onload就行)
            this.onLoad(item)

            //设置计时器关闭加载动画
            setTimeout(() => {     //设置计时器 不然马上就关掉了 显示不出动画
                item.pullLoading=false  //结束加载状态
            }, 500);
        }
    },
    async created(){
        let res = await channelList()
        console.log(res)   //登录了的原本有几个就是几个  没登录的只有7个默认的 
        this.channelList=res.data.channels
                    //一:拿到 频道数据后,要给每个频道 都添加上那四个刷新文章的属性(finished,loading,pullLoading,list) 而不是公用

        this.channelList.forEach( item =>{   //给每个item添加属性  item就是每个频道
            //item.loading=false   //控制列表的刷新状态 false调用onload方法  true不调用
            this.$set(item,'loading',false)
            // item.list=[]
            this.$set(item,'list',[])
            // item.finished=false  //是否刷到底了 false没到底继续刷新 true到底了停止刷新
            this.$set(item,'finished',false)
            // item.pullLoading=false //控制下拉刷新的状态 false代表不刷新了 会去掉加载文字 true刷新中 显示加载中
            this.$set(item,'pullLoading',false)

            //给每个频道 添加一个pre_time属性 因为不用在频道显示 所以 不用$set
            item.pre_time = Date.now()
        })
    }
}
</script>

<style lang="less" scoped> // 这里如果加scoped 会出问题 因为: 1.加scoped除了自己用 自己的子组件也可能能用(如果子组件就是跟标签,可以用到)
                    //                               2.如果子组件加scoped,父组件写了样式 子组件也可能用上(如果父组件写的样式是子组件没写的,那么子组件就会用到父组件的样式 如果是自己有的,就用自己的)
                    //                               3.如果子组件加了scoped,父组件没加,父组件写的样式,是子组件没有的,就用父组件的, 但是如果父组件也加了scoped,子组件能否使用参考特点1
                    //此处总结:这里加scoped 其实相对导入的vant来说是父组件了 这里加的scoped,写的fix固定定位,作用不到vant组件.因为 他不是跟标签
                    //解决办法 /deep/: vue的官方的 深度选择器 在需要父子组件都需要的类名上添加  就两个都能使用了
                    //使用场景: 既想用scoped,又希望把某个样式作用到封装好的子组件里,那么在该样式前面加 /deep/
    .home{
         margin-top: 98px;
         margin-bottom: 50px;   //不让底部也被遮挡
        .top-nav{
            display: flex;
            align-items: center;
            background-color:#2a8fff;
            padding-left:10px;
            padding-right: 10px;
            //固定定位 不占位置 还需要加 层级 宽度   固定定位如果没有设置left top值 那默认就是0  
            position: fixed;
            top: 0px;    //距离顶部为0
            z-index: 999;
            width: 100%;
            box-sizing:border-box; //改盒子模型

            .top-icon{
                font-size: 25px;
                color:white;
            }
            .top-search{
                // 主轴方向剩多少,都给他
                flex:1;
            }
        }
        .channel{
           
           /deep/ .van-tabs__wrap{    //导航栏的类
                 position: fixed;
                 top: 54px;   //要设置高度才不会挤在一起 离顶部的距离
                 z-index: 999;
                 width: 100%;
            }

          
           
        }
       
    }
</style>