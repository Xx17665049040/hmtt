import axios from 'axios'

//创建一个新的aixos对象
let request = axios.create({
    baseURL:"http://ttapi.research.itcast.cn/app/v1_0"
})

// 添加请求拦截器   
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器    就是从服务器返回数据响应式会被拦截下来  响应拦截 return出来的 response其实就是 axios请求时得到的res数据  所以在这里多加一个data  后面打印出来res就少一个data
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么  正常响应触发
    return response.data;
  }, function (error) {
    // 对响应错误做点什么  响应出错触发
    return Promise.reject(error);
  });

  export default request