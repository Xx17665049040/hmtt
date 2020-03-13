import request from '@/utils/request'

//获取用户频道
export function channelList(params){
    return request({
        url:"user/channels",
        method:'get',
    
    })
}