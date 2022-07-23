import request from '@/utils/request'

/* 按条件查询角色 */
export const getRoles = data =>{
    return request({
        method: 'POST',
        url: '/boss/role/getRolePages',
        data
    })
}

/* 删除角色 */
export const DeleteRole = id =>{
    return request({
        method: 'DELETE',
        url: '/boss/role/${id}'
    })
}

/* 添加或者编辑角色 */
export const createOrupdate = data =>{
    return request({
        method:'POST',
        url:'/boss/role/saveOrUpdate',
        data
    })
}

/* 获取角色 */
export const getRoleById = id =>{
    return request({
        method: 'GET',
        url: `/boss/role/${id}`
    })
}

 // 获取所有⻆⾊ - ⽤户管理
 export const getAllRoles = () => {
    return request({
    method: 'GET',
    url: '/boss/role/all'
 })
 }

 /* 给⽤户分配⻆⾊ */
export const allocateUserRoles = data =>{
    return request({
        method:'POST',
        url: '/boss/role/allocateUserRoles',
        data
    })
}

/* 查询⽤户⻆⾊ */
export const getUserRoles = userId => {
      return request({
      method: 'GET',
      url: `/boss/role/user/${userId}`
      })
}