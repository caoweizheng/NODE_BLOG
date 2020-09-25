const { exec } = require('../db/mysql')
const getList = (author, keyWord) => {
  let sql = 'select * from blogs where 0<>1 '
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyWord) {
    sql += `and title like '%${keyWord}%' `
  }
  sql += `order by createtime desc;`
  // 返回的是promise
  return exec(sql)
}

const getDetail = (id) => {
  return {
    id: 1,
    title: '博客标题A',
    content: '博客内容A',
    createTime: 1600865592695,
    author: 'lucy'
  }
}

const createBlog = (params = {}) => {
  console.log(params)
  return {
    id: 3,
    ...params
  }
}

const editBlog = (id, params = {}) => {
  return {
    id,
    ...params
  }
}

module.exports = {
  getList,
  getDetail,
  createBlog,
  editBlog
}