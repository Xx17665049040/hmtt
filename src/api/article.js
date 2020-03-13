import request from '@/utils/request'

//获取推荐新闻列表   请求参数中的请求头 我们已经写在了请求拦截里面 会自动加请求头
export function articleList(params){

   return request({
        url:"http://ttapi.research.itcast.cn/app/v1_1/articles",  //因为版本与基地址不一样 所以这里要写完整的地址覆盖
        method:'get',  //get请求的参数 是params   post请求才是data
        params 
    })
}