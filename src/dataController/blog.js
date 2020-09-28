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
  const sql = `select * from blogs where id='${id}';`
  return exec(sql).then(res => {
    return res[0]
  })
}

const createBlog = (params = {}) => {
  const { title, content, author } = params
  const sql = `
    insert into blogs(title, content, createtime, author) 
    values('${title}','${content}','${Date.now()}','${author}')`

  return exec(sql).then(res => {
    return {
      id: res.insertId
    }
  })
}

const editBlog = (id, params = {}) => {
  const { title, content } = params
  const sql = `
    update blogs set title='${title}', content='${content}' where id='${id}';
  `
  return exec(sql).then(res => {
    return res.affectedRows >= 1
  })
}

const deleteBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}';`

  return exec(sql).then(res => {
    return res.affectedRows >= 1
  })
}

module.exports = {
  getList,
  getDetail,
  createBlog,
  editBlog,
  deleteBlog
}