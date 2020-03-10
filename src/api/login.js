import request from '@/utils/request'

//登录接口请求
export function login(data){

   return request({
        url:"authorizations",
        method:'post',
        data
    })
}