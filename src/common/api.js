import axios from 'axios'

const baseUrl = 'http://120.79.179.182:8083'

// 登录接口
export function loginApi (data) {
  const url = baseUrl + '/user/login2manager'
  return axios.post(url, data)
}

// 获取用户列表
export function getUserList (data) {
  const url = baseUrl + '/user/getList'
  return axios.post(url, data)
}

// 获取课程列表
export function getContentList (data) {
  const url = baseUrl + '/teach/getContentList'
  return axios.post(url, data)
}

// 添加课程
export function addContentApi (data) {
  const url = baseUrl + '/teach/addContent'
  return axios.post(url, data)
}

// 更新课程
export function updateContentApi (data) {
  const url = baseUrl + '/teach/updateContent'
  return axios.post(url, data)
}
// 删除课程
export function deleteContentApi (data) {
  const url = baseUrl + '/teach/delContent'
  return axios.post(url, data)
}

// 获取商品列表
export function getGoodsList (data) {
  const url = baseUrl + '/order/getGoodsList'
  return axios.post(url, data)
}

// 更新用户积分
export function userUpdateScore (data) {
  const url = baseUrl + '/user/updatePoint'
  return axios.post(url, data)
}

// 新增 or 编辑商品
export function editGoodsApi (data) {
  const url = baseUrl + '/order/editGoods'
  return axios.post(url, data)
}

// 删除商品
export function delGoodsApi (data) {
  const url = baseUrl + '/order/delGoods'
  return axios.post(url, data)
}

// 获取兑换列表数据
export function getOrderCourseList (data) {
  const url = baseUrl + '/order/getCourseList'
  return axios.post(url, data)
}

// 兑换商品审核
export function auditOrderApi (data) {
  const url = baseUrl + '/order/auditOrder'
  return axios.post(url, data)
}

// 兑换商品审核
export function getUserListByContent (data) {
  const url = baseUrl + '/teach/getUserListByContent'
  return axios.post(url, data)
}

// 赚取积分，新增 or 编辑任务
export function editTask (data) {
  const url = baseUrl + '/task/editTask'
  return axios.post(url, data)
}

// 获取任务列表
export function getTaskList (data) {
  const url = baseUrl + '/task/getTaskList'
  return axios.post(url, data)
}

// 删除任务
export function delTask (data) {
  const url = baseUrl + '/task/delTask'
  return axios.post(url, data)
}

// 首页
export function editIndex (data) {
  const url = baseUrl + '/index/editIndex'
  return axios.post(url, data)
}

// 获取首页文章信息
export function getIndexList (data) {
  const url = baseUrl + '/index/getIndexList'
  return axios.get(url, {
    params: data
  })
}

// 获取首页文章信息
export function delIndex (data) {
  const url = baseUrl + '/index/delIndex'
  return axios.post(url, data)
}
